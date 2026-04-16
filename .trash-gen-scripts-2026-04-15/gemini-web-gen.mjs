#!/usr/bin/env node
// Drive Gemini Web via Playwright using the isolated Chrome profile that's already logged in.
// Usage: node gemini-web-gen.mjs [--start N] [--limit N]

import { chromium } from "/Users/sherconan/.npm-global/lib/node_modules/playwright/index.mjs";
import fs from "fs";
import path from "path";

const PROFILE = "/Users/sherconan/Library/Application Support/baoyu-skills/gemini-web/chrome-profile";
const QUEUE = JSON.parse(fs.readFileSync("/tmp/pollinations-regen.json", "utf-8"));
const OUT = "/Users/sherconan/weekend-go/assets/images";
const BACKUP = "/Users/sherconan/weekend-go/assets/images-primitive-backup";

const args = process.argv.slice(2);
const start = args.indexOf("--start") >= 0 ? +args[args.indexOf("--start") + 1] : 0;
const limit = args.indexOf("--limit") >= 0 ? +args[args.indexOf("--limit") + 1] : QUEUE.length;
const testOnly = args.includes("--test");

console.log(`Launching browser with profile: ${PROFILE}`);
const ctx = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  channel: "chrome",
  viewport: { width: 1400, height: 900 },
});
const page = ctx.pages()[0] || await ctx.newPage();

await page.goto("https://gemini.google.com/app", { waitUntil: "networkidle", timeout: 60000 });
console.log("Loaded gemini.google.com");

// Wait for input box
await page.waitForSelector('div[contenteditable="true"]', { timeout: 30000 });
console.log("Input ready");

async function genOne(entry, idx) {
  const { file, name, prompt } = entry;
  const out = path.join(OUT, file);

  // Backup if not already
  const bak = path.join(BACKUP, file);
  if (fs.existsSync(out) && !fs.existsSync(bak)) fs.copyFileSync(out, bak);

  // Clear + type prompt
  const input = await page.$('div[contenteditable="true"]');
  await input.click();
  await page.keyboard.down("Meta");
  await page.keyboard.press("a");
  await page.keyboard.up("Meta");
  await page.keyboard.press("Delete");
  await input.type(prompt, { delay: 5 });

  // Submit
  await page.keyboard.press("Enter");

  // Wait for image. Gemini embeds generated image as <img> in the response.
  const imgSelector = 'img[src*="googleusercontent.com/gg-dl"], img[alt*="Generated"], img[data-test-id*="image"]';
  try {
    await page.waitForSelector(imgSelector, { timeout: 120000 });
  } catch (e) {
    console.log(`[${idx+1}] ❌ ${name}: no image rendered in 120s`);
    return false;
  }

  // Grab the last generated image src
  const imgs = await page.$$(imgSelector);
  const lastImg = imgs[imgs.length - 1];
  const src = await lastImg.getAttribute("src");
  if (!src) { console.log(`[${idx+1}] ❌ ${name}: empty src`); return false; }

  // Download
  const tmpJpg = `/tmp/gemweb-${file.replace(/\.webp$/, "")}.jpg`;
  const buffer = await page.evaluate(async (url) => {
    const r = await fetch(url);
    const ab = await r.arrayBuffer();
    return Array.from(new Uint8Array(ab));
  }, src);
  fs.writeFileSync(tmpJpg, Buffer.from(buffer));
  const size = fs.statSync(tmpJpg).size;
  if (size < 20000) { console.log(`[${idx+1}] ❌ ${name}: too small ${size}`); return false; }

  // Convert to webp
  const { execSync } = await import("child_process");
  execSync(`cwebp -quiet -q 85 "${tmpJpg}" -o "${out}"`, { stdio: "pipe" });
  fs.unlinkSync(tmpJpg);
  const finalSize = fs.statSync(out).size;
  console.log(`[${idx+1}] ✅ ${name} (${file}) ${(finalSize/1024).toFixed(0)}KB`);

  // New conversation for next (click 'New chat' or just refresh)
  await page.evaluate(() => {
    const btn = document.querySelector('[data-test-id="new-chat-button"], button[aria-label*="New"]');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  return true;
}

if (testOnly) {
  await genOne(QUEUE[0], 0);
  console.log("Test done. Keeping browser open 10s for inspection.");
  await new Promise(r => setTimeout(r, 10000));
  await ctx.close();
  process.exit(0);
}

const batch = QUEUE.slice(start, start + limit);
let ok = 0, fail = 0;
for (let i = 0; i < batch.length; i++) {
  const success = await genOne(batch[i], start + i);
  if (success) ok++; else fail++;
  await new Promise(r => setTimeout(r, 3000));
}
console.log(`\nDone. ok=${ok} fail=${fail}`);
await ctx.close();
