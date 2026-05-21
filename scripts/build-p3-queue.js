#!/usr/bin/env node
// Build P3 queue: ALL remaining non-compliant images in 5 zero-Codex cities.
// (Items 13+ per city — after P0/P1/P2 covered items 1-12.)
//
// Usage: node scripts/build-p3-queue.js > codex-queue-p3.json

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const REPO = path.resolve(__dirname, '..');

function loadCity(filename, varname) {
  let src = fs.readFileSync(path.join(REPO, 'js', filename), 'utf8');
  src = src.replace(/if\s*\(typeof\s+window[\s\S]*$/m, '');
  src = src.replace(/if\s*\(typeof\s+module[\s\S]*$/m, '');
  src = `${src}\nmodule.exports = ${varname};`;
  const ctx = { window: {}, module: { exports: null } };
  vm.createContext(ctx);
  vm.runInContext(src, ctx);
  return ctx.module.exports || [];
}

function buildPrompt(d, cityName, enName) {
  const enHint = d.imageQuery || `${enName} ${d.name}`;
  const theme = (d.themes || d.tags || []).slice(0, 3).join(', ');
  return `Kawaii Ghibli-style landscape illustration of ${enHint}, ${d.subtitle || ''}, ${cityName} China. Soft pastel palette, warm lighting, hand-drawn anime style. Features: ${theme}. 16:9 widescreen horizontal travel poster format, no text, no watermark.`;
}

const cfgs = [
  { key: 'qd', city: 'qingdao',   file: 'data-qingdao.js',   varname: 'DESTINATIONS_QD', en: 'Qingdao seaside German architecture' },
  { key: 'tj', city: 'tianjin',   file: 'data-tianjin.js',   varname: 'DESTINATIONS_TJ', en: 'Tianjin Haihe river European-style' },
  { key: 'hz', city: 'hangzhou',  file: 'data-hangzhou.js',  varname: 'DESTINATIONS_HZ', en: 'Hangzhou West Lake Longjing' },
  { key: 'es', city: 'enshi',     file: 'data-enshi.js',     varname: 'DESTINATIONS_ES', en: 'Enshi Tujia canyon karst' },
  { key: 'cq', city: 'chongqing', file: 'data-chongqing.js', varname: 'DESTINATIONS_CQ', en: 'Chongqing mountain city hotpot' }
];

const queue = [];

for (const c of cfgs) {
  const dests = loadCity(c.file, c.varname);
  const sorted = dests.slice().sort((a, b) => {
    const tA = (typeof a.xhsHeat === 'object' ? a.xhsHeat.tier : a.xhsHeat) || '';
    const tB = (typeof b.xhsHeat === 'object' ? b.xhsHeat.tier : b.xhsHeat) || '';
    const rank = (t) => ({ 'S+': 0, 'S': 1, 'A+': 2, 'A': 3, 'high': 1, 'mid': 4 }[t] ?? 5);
    return rank(tA) - rank(tB);
  });
  // Items 12+ (skip first 12 done in P0+P2). Take ALL remaining.
  const remaining = sorted.slice(12);
  for (const d of remaining) {
    queue.push({
      id: `${c.key}-${d.id}`,
      name: d.name,
      city: c.city,
      prompt: buildPrompt(d, c.city, c.en),
      outPath: d.image || `assets/images/dest-${c.key}-${d.id}.webp`
    });
  }
}

console.log(JSON.stringify(queue, null, 2));
console.error(`[build-p3-queue] ${queue.length} items remaining (5 cities, after first 12)`);
