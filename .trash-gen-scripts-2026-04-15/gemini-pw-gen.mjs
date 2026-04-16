#!/usr/bin/env node
// Drive Gemini Web via fresh Playwright Chromium, importing decrypted cookies from user's main Chrome.
import { chromium } from "/Users/sherconan/.npm-global/lib/node_modules/playwright/index.mjs";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const QUEUE = JSON.parse(fs.readFileSync("/tmp/pollinations-regen.json", "utf-8"));
const OUT = "/Users/sherconan/weekend-go/assets/images";
const BACKUP = "/Users/sherconan/weekend-go/assets/images-primitive-backup";
fs.mkdirSync(BACKUP, { recursive: true });

const args = process.argv.slice(2);
const start = args.indexOf("--start") >= 0 ? +args[args.indexOf("--start") + 1] : 0;
const limitArg = args.indexOf("--limit") >= 0 ? +args[args.indexOf("--limit") + 1] : QUEUE.length;
const testOnly = args.includes("--test");
const headless = args.includes("--headless");
const batch = QUEUE.slice(start, start + limitArg);

// Get fresh cookies from user's main Chrome
function getCookies() {
  const raw = execSync(`python3 -c "
from pycookiecheat import chrome_cookies
import json
merged = {}
for url in ['https://gemini.google.com/app','https://accounts.google.com/','https://www.google.com/']:
    merged.update(chrome_cookies(url, browser='Chrome'))
print(json.dumps(merged))
"`).toString().trim();
  const m = JSON.parse(raw);
  // Convert to Playwright cookie format
  const cookies = [];
  for (const [name, value] of Object.entries(m)) {
    const domain = name.startsWith("__Host-") ? "accounts.google.com" : ".google.com";
    cookies.push({
      name, value,
      domain,
      path: "/",
      expires: -1,
      httpOnly: false,
      secure: name.startsWith("__Secure-") || name.startsWith("__Host-"),
      sameSite: "None",
    });
  }
  return cookies;
}

console.log(`Launching Playwright Chromium (headless=${headless})`);
const browser = await chromium.launch({ headless });
const ctx = await browser.newContext({
  viewport: { width: 1400, height: 900 },
  userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
});
const cookies = getCookies();
await ctx.addCookies(cookies);
console.log(`Injected ${cookies.length} cookies`);

const page = await ctx.newPage();
await page.goto("https://gemini.google.com/app", { waitUntil: "domcontentloaded", timeout: 60000 });
console.log("Loaded gemini");

// Check logged in
await page.waitForTimeout(3000);
const signInVisible = await page.locator('text="Sign in"').count();
console.log(`Sign-in button visible: ${signInVisible > 0}`);
if (signInVisible > 0) {
  console.log("NOT logged in with these cookies. Keeping browser open 60s for manual login.");
  await page.waitForTimeout(60000);
}

// Find prompt input
await page.waitForSelector('div[contenteditable="true"], textarea', { timeout: 30000 });
console.log("Input ready");

async function genOne(entry, idx) {
  const { file, name, prompt } = entry;
  const outWebp = path.join(OUT, file);

  const bak = path.join(BACKUP, file);
  if (fs.existsSync(outWebp) && !fs.existsSync(bak)) fs.copyFileSync(outWebp, bak);

  // Type prompt
  const input = await page.$('div[contenteditable="true"], textarea');
  await input.click();
  await page.keyboard.down("Meta");
  await page.keyboard.press("a");
  await page.keyboard.up("Meta");
  await page.keyboard.press("Delete");
  await page.waitForTimeout(300);
  await input.type(`Draw this as an image. ${prompt}`, { delay: 3 });
  await page.keyboard.press("Enter");

  // Wait for image. Gemini returns images via <img src="https://lh3.googleusercontent.com/gg-dl/...">
  const imgSelector = 'img[src*="googleusercontent.com/gg-dl"]';
  try {
    await page.waitForSelector(imgSelector, { timeout: 180000 });
  } catch {
    console.log(`[${start+idx+1}] ❌ ${name}: no image in 180s`);
    return false;
  }
  await page.waitForTimeout(2000); // let it finish rendering

  const imgs = await page.$$(imgSelector);
  const last = imgs[imgs.length - 1];
  const src = await last.getAttribute("src");
  if (!src) return false;

  const tmpPng = `/tmp/gem-${file.replace(/\.webp$/, "")}.png`;
  const bufArr = await page.evaluate(async (url) => {
    const r = await fetch(url, { credentials: "include" });
    const ab = await r.arrayBuffer();
    return Array.from(new Uint8Array(ab));
  }, src);
  fs.writeFileSync(tmpPng, Buffer.from(bufArr));
  const size = fs.statSync(tmpPng).size;
  if (size < 50000) { console.log(`[${start+idx+1}] ❌ too small ${size}`); return false; }

  execSync(`cwebp -quiet -q 85 "${tmpPng}" -o "${outWebp}"`, { stdio: "pipe" });
  fs.unlinkSync(tmpPng);
  const finalSize = fs.statSync(outWebp).size;
  console.log(`[${start+idx+1}] ✅ ${name} (${file}) ${(finalSize/1024).toFixed(0)}KB`);

  // New chat for next
  try {
    const newChat = await page.$('button[aria-label*="New" i], [data-test-id*="new"]');
    if (newChat) await newChat.click();
  } catch {}
  await page.waitForTimeout(2500);
  return true;
}

if (testOnly) {
  const ok = await genOne(batch[0], 0);
  console.log(`Test result: ${ok ? "SUCCESS" : "FAIL"}`);
  if (!headless) await page.waitForTimeout(5000);
  await browser.close();
  process.exit(ok ? 0 : 1);
}

let ok = 0, fail = 0;
for (let i = 0; i < batch.length; i++) {
  const success = await genOne(batch[i], i);
  if (success) ok++; else fail++;
  await page.waitForTimeout(2000);
}
console.log(`\nDone. ok=${ok} fail=${fail}`);
await browser.close();
