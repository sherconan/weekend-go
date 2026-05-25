#!/usr/bin/env node
// Build codex regen queue for BJ legends (都市奇谈 100 张).
// data-beijing-tales.js 的 100 个 entry 对应 l-bj-001..100.webp,全部 ~41KB Pollinations,需重生为 Codex Ghibli 风。
//
// Usage: node scripts/build-bj-legends-queue.js > codex-queue-legends-bj.json

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const REPO = path.resolve(__dirname, '..');

function loadTales() {
  let src = fs.readFileSync(path.join(REPO, 'js', 'data-beijing-tales.js'), 'utf8');
  src = src.replace(/if\s*\(typeof\s+window[\s\S]*$/m, '');
  src = src.replace(/if\s*\(typeof\s+module[\s\S]*$/m, '');
  src += '\nmodule.exports = DESTINATIONS_BJ_TALES;';
  const ctx = { window: {}, module: { exports: null } };
  vm.createContext(ctx);
  vm.runInContext(src, ctx);
  return ctx.module.exports || [];
}

const tales = loadTales();
const queue = [];
tales.forEach((t, idx) => {
  // ID 530+ → image l-bj-XXX, 用 idx 推导 NNN (data 中 ids 530-629 → l-bj-001..100)
  const num = String(idx + 1).padStart(3, '0');
  const outPath = `assets/legends/l-bj-${num}.webp`;
  const themes = (t.themes || t.tags || []).slice(0, 3).join(', ');
  const subtitle = t.subtitle || '';
  const prompt = `Dark moody Ghibli-style illustration of Beijing urban legend / folklore: ${t.name}, ${subtitle}, Beijing China. Atmosphere: ${themes}. Misty, mysterious, dramatic lighting, painterly hand-drawn anime style. 16:9 widescreen horizontal poster format, no text, no watermark.`;
  queue.push({
    id: `l-bj-${num}`,
    name: t.name,
    city: 'beijing',
    prompt,
    outPath
  });
});

console.log(JSON.stringify(queue, null, 2));
console.error(`[build-bj-legends-queue] ${queue.length} items`);
