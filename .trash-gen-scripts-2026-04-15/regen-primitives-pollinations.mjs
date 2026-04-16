#!/usr/bin/env node
// Batch regenerate 106 primitive destination illustrations via Pollinations.ai (free, no key)
// Usage: node regen-primitives-pollinations.mjs [--start N] [--limit N]
import fs from "fs";
import { execSync } from "child_process";
import path from "path";

const queue = JSON.parse(fs.readFileSync("/tmp/pollinations-regen.json", "utf-8"));
const ASSETS = "/Users/sherconan/weekend-go/assets/images";
const BACKUP = "/Users/sherconan/weekend-go/assets/images-primitive-backup";
fs.mkdirSync(BACKUP, { recursive: true });

const args = process.argv.slice(2);
const startIdx = args.indexOf("--start") >= 0 ? parseInt(args[args.indexOf("--start") + 1]) : 0;
const limitArg = args.indexOf("--limit") >= 0 ? parseInt(args[args.indexOf("--limit") + 1]) : queue.length;
const batch = queue.slice(startIdx, startIdx + limitArg);

console.log(`Regenerating ${batch.length} images (idx ${startIdx} to ${startIdx + batch.length - 1})`);

function encode(s) {
  return encodeURIComponent(s).replace(/'/g, "%27");
}

async function genOne(entry, idx) {
  const { file, name, prompt } = entry;
  const outPath = path.join(ASSETS, file);
  const tmpJpg = `/tmp/poll-${file.replace(/\.webp$/, "")}.jpg`;

  // Backup existing
  const bak = path.join(BACKUP, file);
  if (fs.existsSync(outPath) && !fs.existsSync(bak)) {
    fs.copyFileSync(outPath, bak);
  }

  const seed = Math.floor(Math.random() * 1000000);
  const url = `https://image.pollinations.ai/prompt/${encode(prompt)}?width=1280&height=720&nologo=true&model=flux&seed=${seed}`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      execSync(`curl -sf --max-time 90 -o "${tmpJpg}" "${url}"`, { stdio: "pipe" });
      const size = fs.statSync(tmpJpg).size;
      if (size < 20000) throw new Error(`too small: ${size} bytes`);
      // Convert jpg -> webp (quality 85)
      execSync(`cwebp -quiet -q 85 "${tmpJpg}" -o "${outPath}"`, { stdio: "pipe" });
      fs.unlinkSync(tmpJpg);
      const finalSize = fs.statSync(outPath).size;
      console.log(`[${idx+1}/${batch.length}] ✅ ${name} (${file}) ${(finalSize/1024).toFixed(0)}KB`);
      return true;
    } catch (e) {
      console.log(`[${idx+1}/${batch.length}] retry ${attempt} ${name}: ${e.message.slice(0,80)}`);
      await new Promise(r => setTimeout(r, 5000 * attempt));
    }
  }
  console.log(`[${idx+1}/${batch.length}] ❌ ${name} FAILED after 3 retries`);
  return false;
}

let ok = 0, fail = 0;
for (let i = 0; i < batch.length; i++) {
  const success = await genOne(batch[i], i);
  if (success) ok++; else fail++;
  await new Promise(r => setTimeout(r, 1500)); // 1.5s spacing
}
console.log(`\nDone. ok=${ok} fail=${fail}`);
