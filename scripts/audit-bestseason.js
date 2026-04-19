#!/usr/bin/env node
const fs = require('fs');
const { runInNewContext } = require('vm');

const files = fs.readdirSync('js').filter(f =>
  f.startsWith('data-') && f.endsWith('.js') &&
  !f.includes('legends') && !f.includes('shared')
);
let withBS = 0, total = 0;
const counts = {};
for (const f of files) {
  const src = fs.readFileSync('js/' + f, 'utf-8').replace(/\bconst\s+(\w+)\s*=/g, 'var $1 =');
  const sb = { window:{}, module:{exports:{}}, console:{} };
  try { runInNewContext(src, sb); } catch { continue; }
  const arr = Object.values(sb).find(v => Array.isArray(v));
  if (!arr) continue;
  for (const e of arr) {
    total++;
    if (e.bestSeason) {
      withBS++;
      counts[e.bestSeason] = (counts[e.bestSeason] || 0) + 1;
    }
  }
}
console.log('total:', total, 'with bestSeason:', withBS, 'coverage:', Math.round(withBS/total*100)+'%');
console.log('\ntop 15 bestSeason values:');
for (const [k, v] of Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0, 15)) {
  console.log(' ', JSON.stringify(k), v);
}
