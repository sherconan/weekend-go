#!/usr/bin/env node
// Build P1 codex regen queue:
//   1. Merge unfinished suzhou-retry-queue.json (17 items)
//   2. Add remaining cd (chengdu) destinations not in P0
//   3. Add NEXT 6 items per zero-Codex city (qd/tj/hz/es/cq) — for Round 3
//
// Usage: node scripts/build-p1-queue.js [round]
//   round=2 (default): cd remaining (24) + su retry (17) = ~41 items
//   round=3: next-6 for 5 cities = 30 items

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const REPO = path.resolve(__dirname, '..');
const ROUND = parseInt(process.argv[2] || '2', 10);

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

const queue = [];

if (ROUND === 2) {
  // (1) su retry queue (17 items already shaped)
  const suRetry = JSON.parse(fs.readFileSync(path.join(REPO, 'suzhou-retry-queue.json'), 'utf8'));
  for (const item of suRetry) {
    const outPath = item.outPath || `assets/images/${item.file}`;
    queue.push({
      id: `su-${item.file.match(/(\d+)/)?.[1] || ''}`,
      name: item.name,
      city: 'suzhou',
      prompt: item.prompt,
      outPath
    });
  }
  // (2) cd remaining (skip 6 already in P0: 1301/1303/1306/1310/1316/1325)
  const cdSkip = new Set([1301, 1303, 1306, 1310, 1316, 1325]);
  const cd = loadCity('data-chengdu.js', 'DESTINATIONS_CD');
  for (const d of cd) {
    if (cdSkip.has(d.id)) continue;
    queue.push({
      id: `cd-${d.id}`,
      name: d.name,
      city: 'chengdu',
      prompt: buildPrompt(d, 'chengdu', 'Chengdu panda teahouse Sichuan'),
      outPath: d.image || `assets/images/dest-cd-${d.id}.webp`
    });
  }
} else if (ROUND === 3) {
  // Next 6 per zero-Codex city
  const cfgs = [
    { key: 'qd', city: 'qingdao',   file: 'data-qingdao.js',   varname: 'DESTINATIONS_QD', en: 'Qingdao seaside German architecture' },
    { key: 'tj', city: 'tianjin',   file: 'data-tianjin.js',   varname: 'DESTINATIONS_TJ', en: 'Tianjin Haihe river European-style' },
    { key: 'hz', city: 'hangzhou',  file: 'data-hangzhou.js',  varname: 'DESTINATIONS_HZ', en: 'Hangzhou West Lake Longjing' },
    { key: 'es', city: 'enshi',     file: 'data-enshi.js',     varname: 'DESTINATIONS_ES', en: 'Enshi Tujia canyon karst' },
    { key: 'cq', city: 'chongqing', file: 'data-chongqing.js', varname: 'DESTINATIONS_CQ', en: 'Chongqing mountain city hotpot' }
  ];
  for (const c of cfgs) {
    const dests = loadCity(c.file, c.varname);
    const sorted = dests.slice().sort((a, b) => {
      const tA = (typeof a.xhsHeat === 'object' ? a.xhsHeat.tier : a.xhsHeat) || '';
      const tB = (typeof b.xhsHeat === 'object' ? b.xhsHeat.tier : b.xhsHeat) || '';
      const rank = (t) => ({ 'S+': 0, 'S': 1, 'A+': 2, 'A': 3, 'high': 1, 'mid': 4 }[t] ?? 5);
      return rank(tA) - rank(tB);
    });
    // Round 3 = items 6-12 (skip first 6 done in P0)
    const next6 = sorted.slice(6, 12);
    for (const d of next6) {
      queue.push({
        id: `${c.key}-${d.id}`,
        name: d.name,
        city: c.city,
        prompt: buildPrompt(d, c.city, c.en),
        outPath: d.image || `assets/images/dest-${c.key}-${d.id}.webp`
      });
    }
  }
}

console.log(JSON.stringify(queue, null, 2));
console.error(`[build-p1-queue] round=${ROUND} ${queue.length} items`);
