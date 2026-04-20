/**
 * Lightweight Pollinations HTTP image generator — fires straight against
 * https://image.pollinations.ai/prompt/{prompt}?width=1376&height=768
 * No auth, no per-session rate-limit, won't contend with Gemini/ChatGPT Web sessions.
 * Used for bulk backfill of new dest images (skip if exists).
 */
import { existsSync, writeFileSync, statSync } from "fs";
import { readFileSync } from "fs";
import { execSync } from "child_process";

const ROOT = "/Users/sherconan/weekend-go";
const QUEUE_FILE = process.argv.includes("--queue")
  ? process.argv[process.argv.indexOf("--queue") + 1]
  : `${ROOT}/new98-regen-queue.json`;

const queue: { id: number; file: string; name: string; prompt: string; city: string }[] = JSON.parse(
  readFileSync(QUEUE_FILE, "utf-8")
);

const delayMs = 1500;
const TARGET_W = 1376;
const TARGET_H = 768;

async function fetchImage(prompt: string, outPng: string): Promise<{ ok: boolean; size: number; err?: string }> {
  const enc = encodeURIComponent(prompt);
  const url = `https://image.pollinations.ai/prompt/${enc}?width=${TARGET_W}&height=${TARGET_H}&nologo=true&enhance=true`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
      // 90s per image (Pollinations queue can run long)
      signal: AbortSignal.timeout(90_000),
    });
    if (!res.ok) return { ok: false, size: 0, err: `http ${res.status}` };
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 10_000) return { ok: false, size: buf.length, err: "too small" };
    writeFileSync(outPng, buf);
    return { ok: true, size: buf.length };
  } catch (e: any) {
    return { ok: false, size: 0, err: e.message || String(e) };
  }
}

async function genOne(item: typeof queue[0], idx: number, total: number): Promise<boolean> {
  const webpOut = `${ROOT}/assets/images/${item.file}`;
  // Skip if already exists (>50KB = real)
  if (existsSync(webpOut) && statSync(webpOut).size > 50_000) {
    console.log(`[${idx + 1}/${total}] skip (exists) ${item.file}`);
    return true;
  }
  const pngTmp = `/tmp/pollin-${item.file.replace(/\.webp$/, "")}.png`;
  const MAX = 2;
  for (let attempt = 1; attempt <= MAX; attempt++) {
    const r = await fetchImage(item.prompt, pngTmp);
    if (!r.ok) {
      console.log(`[${idx + 1}/${total}] ⚠️ attempt ${attempt} fail ${item.file} ${r.err}`);
      if (attempt < MAX) await new Promise((res) => setTimeout(res, 3000));
      continue;
    }
    try {
      execSync(`cwebp -quiet -q 88 "${pngTmp}" -o "${webpOut}"`, { stdio: "pipe" });
      const finalSize = statSync(webpOut).size;
      console.log(`[${idx + 1}/${total}] ✅ ${item.name} → ${item.file} (${(finalSize / 1024).toFixed(0)}KB)`);
      try { execSync(`rm -f "${pngTmp}"`); } catch {}
      return true;
    } catch (e) {
      console.log(`[${idx + 1}/${total}] ❌ cwebp fail: ${e}`);
      return false;
    }
  }
  console.log(`[${idx + 1}/${total}] ❌ ${item.name} gave up after ${MAX} attempts`);
  return false;
}

async function main() {
  console.log(`Pollinations HTTP batch: ${queue.length} items, delay=${delayMs}ms`);
  let ok = 0, fail = 0;
  const failed: string[] = [];
  for (let i = 0; i < queue.length; i++) {
    const success = await genOne(queue[i], i, queue.length);
    if (success) ok++; else { fail++; failed.push(queue[i].file); }
    if (i < queue.length - 1) await new Promise((r) => setTimeout(r, delayMs));
  }
  console.log(`\n=== DONE === ok=${ok} fail=${fail}`);
  if (failed.length) console.log(`Failed: ${failed.join(", ")}`);
}

main();
