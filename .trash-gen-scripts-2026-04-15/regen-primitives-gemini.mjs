#!/usr/bin/env node
// Regenerate primitive destination illustrations via Gemini Web (using main-Chrome cookies)
// Usage: node regen-primitives-gemini.mjs [--start N] [--limit N]

import fs from "fs";
import path from "path";
import { execSync, spawnSync } from "child_process";

const QUEUE = JSON.parse(fs.readFileSync("/tmp/pollinations-regen.json", "utf-8"));
const OUT = "/Users/sherconan/weekend-go/assets/images";
const BACKUP = "/Users/sherconan/weekend-go/assets/images-primitive-backup";
const SCRIPT = "/Users/sherconan/.claude/skills/baoyu-danger-gemini-web/scripts/main.ts";
fs.mkdirSync(BACKUP, { recursive: true });

const args = process.argv.slice(2);
const start = args.indexOf("--start") >= 0 ? +args[args.indexOf("--start") + 1] : 0;
const limitArg = args.indexOf("--limit") >= 0 ? +args[args.indexOf("--limit") + 1] : QUEUE.length;
const batch = QUEUE.slice(start, start + limitArg);

console.log(`Regen ${batch.length} images via Gemini Web (start=${start})`);

function refreshCookies() {
  // Re-decrypt cookies from main Chrome via pycookiecheat
  try {
    execSync(`python3 -c "
from pycookiecheat import chrome_cookies
import json, shutil
from datetime import datetime, timezone
ck = chrome_cookies('https://gemini.google.com/app', browser='Chrome')
path = '/Users/sherconan/Library/Application Support/baoyu-skills/gemini-web/cookies.json'
out = {'version':1,'updatedAt':datetime.now(timezone.utc).isoformat().replace('+00:00','Z'),'cookieMap':ck,'source':'main-chrome-decrypted'}
open(path,'w').write(json.dumps(out,indent=2))
print('refreshed', len(ck))
"`, { stdio: "pipe" });
    return true;
  } catch (e) {
    console.log("cookie refresh failed:", e.message.slice(0, 100));
    return false;
  }
}

async function genOne(entry, idx) {
  const { file, name, prompt } = entry;
  const outWebp = path.join(OUT, file);
  const tmpPng = `/tmp/gem-${file.replace(/\.webp$/, "")}.png`;

  // Backup
  const bak = path.join(BACKUP, file);
  if (fs.existsSync(outWebp) && !fs.existsSync(bak)) fs.copyFileSync(outWebp, bak);

  // Sharpen prompt — add explicit "draw" to trigger image gen
  const fullPrompt = `Draw this scene. ${prompt}`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      if (fs.existsSync(tmpPng)) fs.unlinkSync(tmpPng);
      const res = spawnSync("bun", [SCRIPT, "--prompt", fullPrompt, "--image", tmpPng, "--model", "gemini-3-pro"], {
        stdio: ["ignore", "pipe", "pipe"],
        timeout: 180000,
        cwd: path.dirname(SCRIPT),
      });
      if (res.status === 0 && fs.existsSync(tmpPng)) {
        const size = fs.statSync(tmpPng).size;
        if (size < 50000) throw new Error(`too small ${size}`);
        // Convert to webp
        execSync(`cwebp -quiet -q 85 "${tmpPng}" -o "${outWebp}"`, { stdio: "pipe" });
        fs.unlinkSync(tmpPng);
        const finalSize = fs.statSync(outWebp).size;
        console.log(`[${start+idx+1}] ✅ ${name} (${file}) ${(finalSize/1024).toFixed(0)}KB (attempt ${attempt})`);
        return true;
      }
      const err = res.stderr?.toString().slice(0, 120) || "unknown";
      console.log(`[${start+idx+1}] retry ${attempt} ${name}: ${err.trim()}`);
      // If auth failed, refresh cookies
      if (err.includes("Auth") || err.includes("cookie") || err.includes("No image")) {
        refreshCookies();
      }
      await new Promise(r => setTimeout(r, 5000));
    } catch (e) {
      console.log(`[${start+idx+1}] retry ${attempt} error: ${e.message.slice(0, 100)}`);
      await new Promise(r => setTimeout(r, 5000));
    }
  }
  console.log(`[${start+idx+1}] ❌ ${name} FAILED`);
  return false;
}

let ok = 0, fail = 0;
// Pre-refresh cookies
refreshCookies();

for (let i = 0; i < batch.length; i++) {
  const success = await genOne(batch[i], i);
  if (success) ok++; else fail++;
  // Refresh cookies every 20 generations to avoid session expiry
  if ((i + 1) % 20 === 0) refreshCookies();
  // Rate limit spacing
  await new Promise(r => setTimeout(r, 2000));
}
console.log(`\nDone. ok=${ok} fail=${fail}`);
