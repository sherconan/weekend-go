#!/usr/bin/env node
// Build P0 codex-image2 regen queue for 5 zero-Codex cities + cd
// Picks top-N most prominent destinations per city (by id order = curated order in data file).
//
// Usage: node scripts/build-p0-queue.js > codex-queue-p0.json

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const REPO = path.resolve(__dirname, '..');

function loadCity(filename, varname) {
  // vm.runInContext: top-level const doesn't attach to context. Always append explicit export.
  let src = fs.readFileSync(path.join(REPO, 'js', filename), 'utf8');
  // Strip any existing tail-export to avoid double assignment, then add ours
  src = src.replace(/if\s*\(typeof\s+window[\s\S]*$/m, '');
  src = src.replace(/if\s*\(typeof\s+module[\s\S]*$/m, '');
  src = `${src}\nmodule.exports = ${varname};`;
  const ctx = { window: {}, module: { exports: null } };
  vm.createContext(ctx);
  vm.runInContext(src, ctx);
  return ctx.module.exports || [];
}

const CITIES = [
  { key: 'qd', cityName: 'qingdao', file: 'data-qingdao.js',  varname: 'DESTINATIONS_QD', themeHint: '海滨啤酒文化德式建筑', enName: 'Qingdao seaside German architecture beer culture' },
  { key: 'tj', cityName: 'tianjin', file: 'data-tianjin.js',  varname: 'DESTINATIONS_TJ', themeHint: '海河洋楼民国相声', enName: 'Tianjin Haihe river European-style buildings Republic era' },
  { key: 'hz', cityName: 'hangzhou',file: 'data-hangzhou.js', varname: 'DESTINATIONS_HZ', themeHint: '西湖龙井宋韵江南', enName: 'Hangzhou West Lake Longjing Song dynasty Jiangnan' },
  { key: 'es', cityName: 'enshi',   file: 'data-enshi.js',    varname: 'DESTINATIONS_ES', themeHint: '土家秘境峡谷喀斯特', enName: 'Enshi Tujia canyon karst landscape' },
  { key: 'cq', cityName: 'chongqing',file:'data-chongqing.js',varname: 'DESTINATIONS_CQ', themeHint: '山城火锅长江夜景', enName: 'Chongqing mountain city hotpot Yangtze night view' },
  { key: 'cd', cityName: 'chengdu', file: 'data-chengdu.js',  varname: 'DESTINATIONS_CD', themeHint: '熊猫盖碗茶巴蜀慢生活', enName: 'Chengdu panda teahouse Sichuan slow life' }
];

const PER_CITY = parseInt(process.argv[2] || '6', 10);

const queue = [];

for (const c of CITIES) {
  const dests = loadCity(c.file, c.varname);
  // Pick top-N: prefer entries with xhsHeat tier === 'S' or 'S+', else top-N in id order
  const sorted = dests.slice().sort((a, b) => {
    const tierA = (typeof a.xhsHeat === 'object' ? a.xhsHeat.tier : a.xhsHeat) || '';
    const tierB = (typeof b.xhsHeat === 'object' ? b.xhsHeat.tier : b.xhsHeat) || '';
    const rank = (t) => ({ 'S+': 0, 'S': 1, 'A+': 2, 'A': 3, 'high': 1, 'mid': 4 }[t] ?? 5);
    return rank(tierA) - rank(tierB);
  });
  const picked = sorted.slice(0, PER_CITY);
  for (const d of picked) {
    const imgPath = d.image || `assets/images/dest-${c.key}-${d.id}.webp`;
    const enHint = d.imageQuery || `${c.enName} ${d.name}`;
    const theme = (d.themes || d.tags || []).slice(0, 3).join(', ');
    const prompt = `Kawaii Ghibli-style landscape illustration of ${enHint}, ${d.subtitle || ''}, ${c.cityName} China. Soft pastel palette, warm lighting, hand-drawn anime style. Features: ${theme}. 16:9 widescreen horizontal travel poster format, no text, no watermark.`;
    queue.push({
      id: `${c.key}-${d.id}`,
      name: d.name,
      city: c.cityName,
      prompt,
      outPath: imgPath
    });
  }
}

console.log(JSON.stringify(queue, null, 2));
console.error(`[build-p0-queue] ${queue.length} items across ${CITIES.length} cities, ${PER_CITY} each`);
