#!/usr/bin/env bun
// pollinations-with-limiter.ts
// Rate-limited, retry-aware wrapper around Pollinations image generation.
// Usage: bun scripts/pollinations-with-limiter.ts --queue path/to/queue.json
//
// queue.json format: [{ id: "xxx", prompt: "...", outPath: "assets/images/dest-xx.webp" }, ...]
//
// Features:
// - Max 2 concurrent requests (Pollinations rate-limits around 3-4/s)
// - Exponential backoff on 429/5xx (1s, 2s, 4s, 8s, 16s; max 5 retries)
// - Write a .failed.json file for items that exhaust retries
// - Skips items whose outPath already exists (idempotent)

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

interface QueueItem {
  id: string;
  prompt: string;
  outPath: string;
}

const CONCURRENCY = 2;
const MAX_RETRIES = 5;
const BASE_BACKOFF_MS = 1000;

const args = process.argv.slice(2);
const queueIdx = args.indexOf('--queue');
if (queueIdx < 0 || !args[queueIdx + 1]) {
  console.error('usage: bun scripts/pollinations-with-limiter.ts --queue path.json');
  process.exit(1);
}
const queuePath = args[queueIdx + 1];
const queue: QueueItem[] = JSON.parse(readFileSync(queuePath, 'utf-8'));
console.log(`loaded ${queue.length} items from ${queuePath}`);

async function fetchOne(item: QueueItem): Promise<boolean> {
  if (existsSync(item.outPath)) {
    console.log(`[skip] ${item.id} — already exists`);
    return true;
  }
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(item.prompt)}?width=1024&height=576&model=flux&nologo=true`;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url);
      if (res.status === 429 || res.status >= 500) {
        const wait = BASE_BACKOFF_MS * Math.pow(2, attempt);
        console.warn(`[retry ${attempt + 1}/${MAX_RETRIES}] ${item.id} → HTTP ${res.status}, wait ${wait}ms`);
        await new Promise(r => setTimeout(r, wait));
        continue;
      }
      if (!res.ok) {
        console.error(`[fail] ${item.id} → HTTP ${res.status}, not retrying`);
        return false;
      }
      const buf = new Uint8Array(await res.arrayBuffer());
      mkdirSync(dirname(item.outPath), { recursive: true });
      writeFileSync(item.outPath, buf);
      console.log(`[ok] ${item.id} (${buf.byteLength} bytes)`);
      return true;
    } catch (e) {
      console.error(`[err ${attempt + 1}/${MAX_RETRIES}] ${item.id} → ${e}`);
      await new Promise(r => setTimeout(r, BASE_BACKOFF_MS * Math.pow(2, attempt)));
    }
  }
  return false;
}

async function runBatch() {
  const failed: QueueItem[] = [];
  const total = queue.length;
  let done = 0;
  // simple concurrent pool
  const workers: Promise<void>[] = [];
  let idx = 0;
  for (let w = 0; w < CONCURRENCY; w++) {
    workers.push((async () => {
      while (idx < total) {
        const myIdx = idx++;
        const item = queue[myIdx];
        const ok = await fetchOne(item);
        if (!ok) failed.push(item);
        done++;
        if (done % 10 === 0 || done === total) {
          console.log(`progress: ${done}/${total} (failed: ${failed.length})`);
        }
      }
    })());
  }
  await Promise.all(workers);
  if (failed.length > 0) {
    const failPath = queuePath.replace(/\.json$/, '.failed.json');
    writeFileSync(failPath, JSON.stringify(failed, null, 2));
    console.log(`${failed.length} items failed → saved to ${failPath}`);
    process.exit(2);
  }
  console.log(`done: ${done}/${total} all ok`);
}

runBatch();
