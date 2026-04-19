#!/usr/bin/env node
const fs = require('fs');
const { runInNewContext } = require('vm');

const files = fs.readdirSync('js').filter(f =>
  f.startsWith('data-') && f.endsWith('.js') &&
  !f.includes('legends') && !f.includes('detail')
);

let totalAsym = 0, totalBoth = 0, totalNeither = 0;
const asymSamples = [];

for (const f of files) {
  const src = fs.readFileSync('js/' + f, 'utf-8').replace(/\bconst\s+(\w+)\s*=/g, 'var $1 =');
  const sb = { window:{}, module:{exports:{}}, console:{} };
  try { runInNewContext(src, sb, {timeout:5000}); } catch(e) { console.log('skip', f, e.message.slice(0,50)); continue; }
  const arr = Object.values(sb).find(v => Array.isArray(v));
  if (!arr) continue;
  for (const e of arr) {
    if (!e) continue;
    const h = e.xhsHeat, q = e.xhsQuote;
    if (h && q) totalBoth++;
    else if (h || q) {
      totalAsym++;
      if (asymSamples.length < 8) {
        asymSamples.push({ file:f, id:e.id, name:e.name, hasHeat:!!h, hasQuote:!!q });
      }
    } else totalNeither++;
  }
}
console.log(`\nfiles: ${files.length}`);
console.log(`asymmetric: ${totalAsym}`);
console.log(`both xhs present: ${totalBoth}`);
console.log(`neither (skipped): ${totalNeither}`);
if (asymSamples.length) {
  console.log('\nasym samples:');
  for (const s of asymSamples) console.log(' -', s.file, s.id, s.name, 'heat:', s.hasHeat, 'quote:', s.hasQuote);
}
