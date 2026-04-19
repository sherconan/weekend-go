#!/usr/bin/env node
/**
 * Phase 2 cleanup · 从 source data-*.js 移除已在 data-shared-cross-city.js 里的 dupes
 * bridge 会自动 dedup（shared 优先），但 source 副本是 dead code。清理。
 *
 * 用法：
 *   node scripts/clean-shared-source.js           # dry-run
 *   node scripts/clean-shared-source.js --apply
 */
const fs = require('fs');
const path = require('path');
const { runInNewContext } = require('vm');

const ROOT = path.join(__dirname, '..');
const JS = path.join(ROOT, 'js');
const APPLY = process.argv.includes('--apply');

function loadShared() {
  const src = fs.readFileSync(path.join(JS, 'data-shared-cross-city.js'), 'utf-8')
    .replace(/\bconst\s+SHARED_CROSS_CITY_DESTS\s*=/, 'var SHARED_CROSS_CITY_DESTS =');
  const sb = { window: {}, module: { exports: {} }, console: {} };
  runInNewContext(src, sb, { timeout: 3000 });
  return sb.SHARED_CROSS_CITY_DESTS || [];
}

function rewriteFile(filePath, arrVarName, filterFn) {
  const src = fs.readFileSync(filePath, 'utf-8');
  const srcConv = src.replace(new RegExp('\\bconst\\s+(' + arrVarName + ')\\s*='), 'var $1 =');
  const sb = { window: {}, module: { exports: {} }, console: {} };
  runInNewContext(srcConv, sb, { timeout: 5000 });
  const arr = sb[arrVarName];
  if (!Array.isArray(arr)) return { error: 'no array', removed: 0 };
  const before = arr.length;
  const kept = arr.filter(filterFn);
  const removed = before - kept.length;
  if (removed === 0) return { removed: 0, before, after: kept.length };

  const constIdx = src.indexOf('const ' + arrVarName);
  const header = src.slice(0, constIdx);
  const tailIdx = src.search(/\n(if \(typeof window|if \(typeof module)/);
  const tail = tailIdx > 0 ? src.slice(tailIdx) : '\n';
  const newContent = header + 'const ' + arrVarName + ' = ' + JSON.stringify(kept, null, 2) + ';' + tail;
  if (APPLY) fs.writeFileSync(filePath, newContent);
  return { removed, before, after: kept.length, names: arr.filter(e => !filterFn(e)).map(e => e.name) };
}

const shared = loadShared();
const sharedNames = new Set(shared.map(s => s.name));
const citiesInShared = new Set();
shared.forEach(s => Object.keys(s.cities || {}).forEach(c => citiesInShared.add(c)));

console.log('Shared has ' + shared.length + ' entries covering cities: ' + [...citiesInShared].join(', '));
console.log('Names: ' + [...sharedNames].join(' · '));
console.log('');

const targets = [
  { file: 'data-qingdao.js',       varName: 'DESTINATIONS_QD' },
  { file: 'data-weihai.js',        varName: 'DESTINATIONS_WH' },
  { file: 'data-tianjin.js',       varName: 'DESTINATIONS_TJ' },
  { file: 'data-shenzhen.js',      varName: 'DESTINATIONS_SZ' },
  { file: 'data-suzhou.js',        varName: 'DESTINATIONS_SU' },
  { file: 'data-beijing-500.js',   varName: 'DESTINATIONS_BJ500' },
  { file: 'data-beijing-expand.js',varName: 'DESTINATIONS_BJ_EXPAND' }
];

let totalRemoved = 0;
for (const t of targets) {
  const p = path.join(JS, t.file);
  if (!fs.existsSync(p)) continue;
  const r = rewriteFile(p, t.varName, e => !sharedNames.has(e.name));
  if (r.removed > 0) {
    console.log('  ' + t.file + ': removed ' + r.removed + ' (' + r.before + '→' + r.after + '): ' + r.names.join(', '));
    totalRemoved += r.removed;
  } else if (r.error) {
    console.log('  ' + t.file + ': ' + r.error);
  }
}
console.log('');
console.log('Total dead-code entries ' + (APPLY ? 'removed' : 'to remove') + ': ' + totalRemoved);
if (!APPLY) console.log('Run with --apply to actually remove.');
