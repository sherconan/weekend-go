#!/usr/bin/env node
/**
 * Phase 2 intra-city merge · beijing data-beijing-expand vs data-beijing-500
 */
const fs = require('fs');
const path = require('path');
const { runInNewContext } = require('vm');

const ROOT = path.join(__dirname, '..');
const JS = path.join(ROOT, 'js');
const APPLY = process.argv.includes('--apply');

function load(file, varName) {
  const src = fs.readFileSync(path.join(JS, file), 'utf-8')
    .replace(/\bconst\s+(DESTINATIONS_\w+)\s*=/g, 'var $1 =');
  const sb = { window: {}, module: { exports: {} }, console: { log: () => {}, error: () => {} } };
  runInNewContext(src, sb, { timeout: 5000 });
  return sb[varName];
}

const main500 = load('data-beijing-500.js', 'DESTINATIONS_BJ500');
const expand  = load('data-beijing-expand.js', 'DESTINATIONS_BJ_EXPAND');

const FIELDS = ['subtitle','themes','whereToEat','whereToStay','budgetText',
                'tips','howToGet','bestSeason','xhsHeat','xhsQuote','highlight',
                'tags','imageQuery','gradient','description','overview',
                'whatToDo','rating','distance','duration','transport','budget'];
function completeness(e) {
  return FIELDS.filter(f => {
    const v = e[f];
    if (!v) return false;
    if (Array.isArray(v)) return v.length > 0;
    return String(v).length >= 3;
  }).length;
}

const m500 = new Map();
for (const e of main500) m500.set(e.name, e);

const proposals = [];
const unique_in_expand = [];
for (const e of expand) {
  const other = m500.get(e.name);
  if (!other) {
    unique_in_expand.push(e);
    continue;
  }
  const c500 = completeness(other);
  const cExp = completeness(e);
  const winner = c500 >= cExp ? '500' : 'expand';
  proposals.push({
    name: e.name,
    '500_id': other.id,
    'expand_id': e.id,
    '500_completeness': c500,
    'expand_completeness': cExp,
    winner
  });
}

console.log(`500 count: ${main500.length}`);
console.log(`expand count: ${expand.length}`);
console.log(`collisions: ${proposals.length}`);
console.log(`unique_in_expand: ${unique_in_expand.length}`);
console.log(`500 winners: ${proposals.filter(p => p.winner === '500').length}`);
console.log(`expand winners: ${proposals.filter(p => p.winner === 'expand').length}`);
console.log('');

fs.writeFileSync(path.join(ROOT, 'intra-city-bj-proposal.json'),
  JSON.stringify({ proposals, unique_in_expand: unique_in_expand.map(e => ({id: e.id, name: e.name})) }, null, 2));

if (!APPLY) {
  console.log('Run with --apply to actually modify files');
  process.exit(0);
}

const expandNamesToRemove = new Set(proposals.filter(p => p.winner === '500').map(p => p.name));
const expandNamesToKeep = new Set(proposals.filter(p => p.winner === 'expand').map(p => p.name));
const new_expand = expand.filter(e => !expandNamesToRemove.has(e.name) && !expandNamesToKeep.has(e.name));
const expand_winners = expand.filter(e => expandNamesToKeep.has(e.name));

const newExpandFile = `// 北京周边游目的地数据 — 补充扩展（Phase 2 去重后 ${new_expand.length} 条）
// Phase 2: 清理了 ${proposals.length} 组与 data-beijing-500.js 的重复
const DESTINATIONS_BJ_EXPAND = ${JSON.stringify(new_expand, null, 2)};
`;
fs.writeFileSync(path.join(JS, 'data-beijing-expand.js'), newExpandFile);
console.log(`✅ data-beijing-expand.js rewritten (${new_expand.length} entries)`);

if (expand_winners.length) {
  const map500 = new Map(main500.map(e => [e.name, e]));
  for (const ew of expand_winners) {
    const e500 = map500.get(ew.name);
    if (!e500) continue;
    for (const f of FIELDS) {
      const v500 = e500[f];
      const missing = !v500 || (Array.isArray(v500) && v500.length === 0) || String(v500 || '').length < 3;
      if (missing && ew[f]) e500[f] = ew[f];
    }
  }
  const new500File = `// 北京周边游数据（500 公里范围内，主源，Phase 2 合并后 ${main500.length} 条）
const DESTINATIONS_BJ500 = ${JSON.stringify(main500, null, 2)};
`;
  fs.writeFileSync(path.join(JS, 'data-beijing-500.js'), new500File);
  console.log(`✅ data-beijing-500.js rewritten (merged ${expand_winners.length} expand winners)`);
}

console.log('');
console.log(`Before: BJ total = ${main500.length + expand.length}`);
console.log(`After:  BJ total = ${main500.length + new_expand.length} (${expand.length - new_expand.length} dupes removed)`);
