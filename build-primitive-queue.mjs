import fs from "fs";
import { readdirSync, readFileSync } from "fs";

const ROOT = "/Users/sherconan/weekend-go";
const primitives = readdirSync(`${ROOT}/assets/images-primitive-backup`).filter(f => f.endsWith(".webp"));

const imagesJs = readFileSync(`${ROOT}/js/images.js`, "utf-8");
const m = imagesJs.match(/const DEST_IMAGES = (\{[\s\S]*?\});/);
if (!m) throw new Error("DEST_IMAGES not found");
const DEST_IMAGES = eval(`(${m[1]})`);

const nameByFile = {};
for (const [name, path] of Object.entries(DEST_IMAGES)) {
  const file = path.split("/").pop();
  nameByFile[file] = name;
}

const dataFiles = readdirSync(`${ROOT}/js`).filter(f => f.startsWith("data") && f.endsWith(".js"));
const dataBlob = dataFiles.map(f => readFileSync(`${ROOT}/js/${f}`, "utf-8")).join("\n");

function findMeta(name) {
  const re = new RegExp(`name:\\s*["']${name.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}["'][\\s\\S]{0,600}?(?:vibe|category|tags|themes|type|description)[\\s\\S]{0,300}`, "m");
  const hit = dataBlob.match(re);
  return hit ? hit[0].replace(/\\s+/g, " ").slice(0, 300) : "";
}

const queue = [];
for (const file of primitives) {
  const name = nameByFile[file] || null;
  if (!name) {
    queue.push({ file, name: null, prompt: null, orphan: true });
    continue;
  }
  const meta = findMeta(name);
  const cityHint = file.startsWith("dest-sz-") ? "Shenzhen" : file.startsWith("dest-wh-") ? "Weihai" : file.startsWith("dest-bj-") ? "Beijing" : "China";
  const prompt = `Studio Ghibli-inspired kawaii travel poster of ${name} in ${cityHint}, China. Warm, inviting weekend-getaway scene: the landmark is the backdrop, with a few small cute chibi tourists enjoying the place (varied people — a couple, a family with kid, a solo backpacker, or locals — whichever fits the scene naturally; DO NOT default to pandas or dragon mascots, use human characters appropriate to this specific location). Soft pastel palette, hand-drawn anime aesthetic, gentle rounded shapes, warm atmospheric lighting (golden hour, soft daylight, or lantern glow depending on mood), rich environmental details that make the place recognizable and lived-in. Landscape 16:9 widescreen travel card format. No text, no logos, no watermark.`;
  queue.push({ file, name, prompt, city: cityHint });
}

const orphans = queue.filter(q => q.orphan);
const ready = queue.filter(q => !q.orphan);
console.log(`Queue: ${queue.length} total, ${ready.length} ready, ${orphans.length} orphans`);
if (orphans.length) console.log("Orphans:", orphans.map(q => q.file).join(", "));

fs.writeFileSync(`${ROOT}/primitive-regen-queue.json`, JSON.stringify(queue, null, 2));
console.log(`Wrote ${ROOT}/primitive-regen-queue.json`);
