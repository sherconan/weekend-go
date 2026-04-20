#!/usr/bin/env node
/**
 * Web → Miniapp 数据同步
 *
 * 把 Web 端（~/weekend-go/js/data-*.js 散点文件 + shared）聚合成 Mini 端期望的单一 JSON：
 *   ~/weekend-go-miniapp/utils/data.js        → const DESTINATIONS = {beijing:[...], shenzhen:[...], ...}
 *   ~/weekend-go-miniapp/utils/data-legends.js → const LEGENDS = {beijing:[...], shenzhen:[...], ...}
 *
 * 每个城市的目的地 = bridge `buildCityData()[city].build()`（含 shared cities{} facet 展平）。
 *
 * 用法：
 *   node scripts/sync-to-miniapp.js           # dry-run + 报告差异
 *   node scripts/sync-to-miniapp.js --apply
 */
const fs = require('fs');
const path = require('path');
const { runInNewContext } = require('vm');

const WEB = path.join(__dirname, '..');
const MINI = path.join(process.env.HOME, 'weekend-go-miniapp', 'utils');
const APPLY = process.argv.includes('--apply');

// Replicate bridge behavior in Node
function loadAllWebData() {
  const jsDir = path.join(WEB, 'js');
  const sb = { window: {}, module: { exports: {} }, console: { log: () => {}, error: () => {} } };

  // Load CITIES from config
  const citiesSrc = fs.readFileSync(path.join(WEB, 'config/cities.js'), 'utf-8')
    .replace(/\bconst\s+(CITIES|DISTANCE_TIERS)\s*=/g, 'var $1 =');
  runInNewContext(citiesSrc, sb, { timeout: 3000 });

  // Load all data-*.js (fresh sandbox per file to avoid const conflicts)
  const files = fs.readdirSync(jsDir).filter(f =>
    (f.startsWith('data') || f.startsWith('xhs')) && f.endsWith('.js') && !f.includes('legends-') && !f.includes('data-detail')
  );
  const perFile = {};
  for (const f of files) {
    const fresh = { window: {}, module: { exports: {} }, console: { log: () => {}, error: () => {} } };
    const src = fs.readFileSync(path.join(jsDir, f), 'utf-8').replace(/\bconst\s+(\w+)\s*=/g, 'var $1 =');
    try {
      runInNewContext(src, fresh, { timeout: 5000 });
      for (const k of Object.keys(fresh)) {
        if (['window','module','console'].includes(k)) continue;
        if (Array.isArray(fresh[k])) { sb[k] = fresh[k]; perFile[k] = f; }
      }
    } catch (e) { console.error('load fail', f, e.message); }
  }

  // Load legends per city
  const legends = {};
  const legendFiles = fs.readdirSync(jsDir).filter(f => f.startsWith('data-legends-') || f === 'legends.js');
  // Load the raw LEGENDS_DATA from legends.js + merge LEGENDS_* from data-legends-*.js
  // Simpler approach: load each city's LEGENDS_XX separately
  const legendCityFiles = {
    'data-legends-shenzhen.js': { var: 'LEGENDS_SZ', city: 'shenzhen' },
    'data-legends-weihai.js':   { var: 'LEGENDS_WH', city: 'weihai' },
    'data-legends-suzhou.js':   { var: 'LEGENDS_SU', city: 'suzhou' },
    'data-legends-qingdao.js':  { var: 'LEGENDS_QD', city: 'qingdao' },
    'data-legends-tianjin.js':  { var: 'LEGENDS_TJ', city: 'tianjin' },
    'data-legends-chengdu.js':  { var: 'LEGENDS_CD', city: 'chengdu' },
    'data-legends-hangzhou.js': { var: 'LEGENDS_HZ', city: 'hangzhou' },
    'data-legends-chongqing.js':{ var: 'LEGENDS_CQ', city: 'chongqing' },
    'data-legends-enshi.js':    { var: 'LEGENDS_ES', city: 'enshi' }
  };
  for (const [f, { var: vn, city }] of Object.entries(legendCityFiles)) {
    const p = path.join(jsDir, f);
    if (!fs.existsSync(p)) continue;
    const fresh = { window: {}, module: { exports: {} }, console: { log: () => {}, error: () => {} } };
    const src = fs.readFileSync(p, 'utf-8').replace(/\bconst\s+(\w+)\s*=/g, 'var $1 =');
    try {
      runInNewContext(src, fresh, { timeout: 5000 });
      if (Array.isArray(fresh[vn])) legends[city] = fresh[vn];
    } catch (e) { console.error('legends load fail', f, e.message); }
  }
  // Load BJ legends from legends.js (big file with 100 BJ entries)
  const legendsMainSrc = fs.readFileSync(path.join(jsDir, 'legends.js'), 'utf-8');
  // Extract just the LEGENDS_DATA array literal via regex (hacky but fast)
  const match = legendsMainSrc.match(/const\s+LEGENDS_DATA\s*=\s*\[([\s\S]*?)\n\];/);
  if (match) {
    const fresh = { window: {}, module: { exports: {} }, console: { log: () => {}, error: () => {} } };
    try {
      runInNewContext(`var LEGENDS_DATA = [${match[1]}\n];`, fresh, { timeout: 5000 });
      if (Array.isArray(fresh.LEGENDS_DATA)) {
        legends.beijing = fresh.LEGENDS_DATA.filter(l => !l.city || l.city === 'beijing');
      }
    } catch (e) { console.error('BJ legends extract fail:', e.message); }
  }

  return { sb, legends };
}

const CITY_SOURCE_VARS = {
  beijing: ['DESTINATIONS','DESTINATIONS_EXTRA','DESTINATIONS_EXTRA2','DESTINATIONS_BJ500',
            'DESTINATIONS_BJ_EXPAND','DESTINATIONS_BJ_HIDDEN','DESTINATIONS_BJ_TALES','DESTINATIONS_BJ_2026'],
  shenzhen: ['DESTINATIONS_SZ'],
  weihai:   ['DESTINATIONS_WH'],
  suzhou:   ['DESTINATIONS_SU'],
  tianjin:  ['DESTINATIONS_TJ'],
  qingdao:  ['DESTINATIONS_QD'],
  chengdu:  ['DESTINATIONS_CD'],
  hangzhou: ['DESTINATIONS_HZ'],
  chongqing: ['DESTINATIONS_CQ'],
  enshi:    ['DESTINATIONS_ES']
};

function buildCityDests(sb, cityKey) {
  const sources = CITY_SOURCE_VARS[cityKey] || [];
  const seen = new Set();
  const out = [];
  // Shared first (take precedence)
  const shared = sb.SHARED_CROSS_CITY_DESTS || [];
  for (const d of shared) {
    if (d && d.cities && d.cities[cityKey]) {
      const flattened = { ...d, ...d.cities[cityKey], _sharedId: d.id };
      seen.add(d.name);
      out.push(flattened);
    }
  }
  // Then source files
  for (const name of sources) {
    const arr = sb[name];
    if (!Array.isArray(arr)) continue;
    for (const d of arr) {
      if (d && d.name && !seen.has(d.name)) {
        seen.add(d.name);
        out.push(d);
      }
    }
  }
  return out;
}

const { sb, legends } = loadAllWebData();

// Build DESTINATIONS per city
// City key → 2-letter image filename prefix (与 web 侧 assets/images/dest-{PREFIX}-{id}.webp 对齐)
// 不能用 cityKey.slice(0,2) —— 'tianjin'→'ti'（应为'tj'）/ 'qingdao'→'qi'（应为'qd'）/ 'chengdu'→'ch'（应为'cd'）
// / 'hangzhou'→'ha'（应为'hz'）/ 'weihai'→'we'（应为'wh'）/ 'shenzhen'→'sh'（应为'sz'）全 6 城出错。
const IMG_PREFIX = {
  beijing: 'bj', shenzhen: 'sz', weihai: 'wh', suzhou: 'su',
  tianjin: 'tj', qingdao: 'qd', chengdu: 'cd', hangzhou: 'hz',
  chongqing: 'cq', enshi: 'es'
};
const DESTINATIONS = {};
for (const cityKey of Object.keys(CITY_SOURCE_VARS)) {
  const px = IMG_PREFIX[cityKey] || cityKey.slice(0,2);
  DESTINATIONS[cityKey] = buildCityDests(sb, cityKey).map(d => ({
    ...d,
    // Inject image URL (mini expects CDN prefix handled later)
    image: d.image || `https://sherconan.github.io/weekend-go/assets/images/dest-${px}-${d.id}.webp`
  }));
}

// Build LEGENDS per city
const LEGENDS = {};
const CDN_LEGENDS_BASE = 'https://sherconan.github.io/weekend-go/assets/legends/';
for (const [city, arr] of Object.entries(legends)) {
  LEGENDS[city] = arr.map(l => ({
    ...l,
    city: l.city || city,
    image: l.image || `${CDN_LEGENDS_BASE}${l.id}.webp`
  }));
}

console.log('=== Web Data Summary ===');
for (const [k, v] of Object.entries(DESTINATIONS)) {
  console.log(`  DESTINATIONS.${k}: ${v.length}`);
}
console.log('  Total dests:', Object.values(DESTINATIONS).reduce((a, v) => a + v.length, 0));
for (const [k, v] of Object.entries(LEGENDS)) {
  console.log(`  LEGENDS.${k}: ${v.length}`);
}

// Compare with current miniapp state
const miniDataPath = path.join(MINI, 'data.js');
const miniLegendsPath = path.join(MINI, 'data-legends.js');

function loadMini(filePath, varName) {
  const sb = { window: {}, module: { exports: {} }, console: {} };
  try {
    runInNewContext(fs.readFileSync(filePath, 'utf-8'), sb, { timeout: 5000 });
    return sb.module.exports[varName] || sb[varName];
  } catch { return null; }
}

const miniDestsObj = loadMini(miniDataPath, 'DESTINATIONS');
const miniLegendsObj = loadMini(miniLegendsPath, 'LEGENDS');

console.log('');
console.log('=== Diff with current Miniapp ===');
if (miniDestsObj) {
  for (const k of Object.keys(DESTINATIONS)) {
    const webCount = DESTINATIONS[k].length;
    const miniCount = (miniDestsObj[k] || []).length;
    const delta = webCount - miniCount;
    console.log(`  ${k}: web=${webCount}, mini=${miniCount}, delta=${delta > 0 ? '+' : ''}${delta}`);
  }
}

if (!APPLY) {
  console.log('\nRun with --apply to write miniapp files.');
  process.exit(0);
}

// Write Mini data.js
const currentData = fs.readFileSync(miniDataPath, 'utf-8');
const cdnBaseIdx = currentData.indexOf('\nconst CDN_BASE');
const tail = cdnBaseIdx > 0 ? currentData.slice(cdnBaseIdx) : '\n';
const newDataJs = `const DESTINATIONS = ${JSON.stringify(DESTINATIONS)};${tail}`;
fs.writeFileSync(miniDataPath, newDataJs);
console.log(`\n✅ ${miniDataPath} (${newDataJs.length} bytes)`);

// Write Mini data-legends.js
const curLegends = fs.readFileSync(miniLegendsPath, 'utf-8');
const anchorIdx = curLegends.search(/\n(const CDN_LEGENDS_BASE|module\.exports)/);
const legendsTail = anchorIdx > 0 ? curLegends.slice(anchorIdx) : '\n';
const newLegendsJs = `const LEGENDS = ${JSON.stringify(LEGENDS)};${legendsTail}`;
fs.writeFileSync(miniLegendsPath, newLegendsJs);
console.log(`✅ ${miniLegendsPath} (${newLegendsJs.length} bytes)`);

console.log('\nNext: cd ~/weekend-go-miniapp && git add utils/ && git commit && git push');
console.log('Then: node scripts/upload-trial.js (see UPLOAD-TRIAL.md)');
