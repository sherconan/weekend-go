#!/usr/bin/env node
/**
 * weekend-go-helper · 所有 weekend-go-* skill 复用的通用动作
 *
 * 用法：
 *   node scripts/weekend-go-helper.js bump-cache <file-glob> [suffix]
 *   node scripts/weekend-go-helper.js next-dest-id
 *   node scripts/weekend-go-helper.js next-legend-id <city_key>
 *   node scripts/weekend-go-helper.js scan-skeletons <city_key>
 *   node scripts/weekend-go-helper.js cross-city-check <name_list_json>
 *   node scripts/weekend-go-helper.js chrome-verify <city_key> [--legend]
 *
 * 目的：消除各 SKILL.md 里重复的 bash 代码段，DRY 原则，维护在一处。
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const JS_DIR = path.join(ROOT, 'js');

// ─── Commands ───

function bumpCache(filePattern, suffix) {
  // 把 index.html 里匹配 filePattern 的 ?v= 查询串替换为 ?v=<today>-<suffix>
  const day = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const newVer = `v=${day}${suffix ? '-' + suffix : ''}`;
  const indexPath = path.join(ROOT, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf-8');
  const before = html;
  const re = new RegExp(`(src="${filePattern}\\??[^"]*)v=[^"&]*`, 'g');
  html = html.replace(re, `$1${newVer}`);
  // 若脚本没查询串，追加
  const re2 = new RegExp(`(src="${filePattern})(")`, 'g');
  html = html.replace(re2, `$1?${newVer}$2`);
  if (html === before) {
    console.log('NO_CHANGE:', filePattern, '(already latest or not found)');
    return 0;
  }
  fs.writeFileSync(indexPath, html);
  console.log('BUMPED:', filePattern, '→', newVer);
  return 1;
}

function nextDestId() {
  // 扫所有 data-*.js（不含 legends）找 max numeric id
  const files = fs.readdirSync(JS_DIR).filter(f => f.startsWith('data-') && f.endsWith('.js') && !f.includes('legends'));
  let maxId = 0;
  for (const f of files) {
    const content = fs.readFileSync(path.join(JS_DIR, f), 'utf-8');
    const ids = [...content.matchAll(/id:\s*(\d+)/g)].map(m => +m[1]);
    if (ids.length) maxId = Math.max(maxId, ...ids);
  }
  console.log(maxId + 1);
  return maxId + 1;
}

// 城市 key → legend ID 2 字符前缀（命名约定：每个城市用 2 字符缩写）
const LEGEND_PREFIX = {
  beijing: 'bj',
  shenzhen: 'sz',
  weihai: 'wh',
  suzhou: 'su',
  tianjin: 'tj',
  qingdao: 'qd'
  // 新城市在这里加 2 字符缩写
};

function nextLegendId(cityKey) {
  const prefix = LEGEND_PREFIX[cityKey] || cityKey.slice(0, 2);
  const file = path.join(JS_DIR, `data-legends-${cityKey}.js`);
  if (!fs.existsSync(file)) {
    console.log(JSON.stringify({ nextId: 1, prefix, idFull: `l-${prefix}-001` }));
    return { nextId: 1, prefix };
  }
  const content = fs.readFileSync(file, 'utf-8');
  const re = new RegExp(`id:\\s*['"]l-${prefix}-(\\d+)['"]`, 'g');
  const nums = [...content.matchAll(re)].map(m => +m[1]);
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  const idFull = `l-${prefix}-${String(next).padStart(3, '0')}`;
  console.log(JSON.stringify({ nextId: next, prefix, idFull }));
  return { nextId: next, prefix };
}

function scanSkeletons(cityKey) {
  // 读 data-{cityKey}.js，列出 filled_field_ratio < 0.4 的 entry
  // 兼容两种导出：module.exports / 纯 window.X
  let arr;
  const filePath = path.join(JS_DIR, `data-${cityKey}.js`);
  const mod = require(filePath);
  arr = Array.isArray(mod) ? mod : Object.values(mod).find(Array.isArray);
  if (!arr) {
    // Fallback: vm eval raw content — scan for any DESTINATIONS_* variable
    const { runInNewContext } = require('vm');
    const content = fs.readFileSync(filePath, 'utf-8');
    // Find all `const DESTINATIONS_XX = [...]` declarations
    const matches = [...content.matchAll(/const\s+(DESTINATIONS_\w+)\s*=/g)].map(m => m[1]);
    const sandbox = { window: {}, module: { exports: {} }, console };
    try {
      const probeScript = content + '\n;globalThis._out = ' +
        matches.map(n => `(typeof ${n} !== 'undefined' ? ${n} : null)`).join(' || ') +
        ` || Object.values(window).find(v=>Array.isArray(v));`;
      runInNewContext(probeScript, sandbox, { timeout: 3000 });
      arr = sandbox._out;
    } catch (e) {
      console.error('scanSkeletons eval fail:', e.message);
      return { error: e.message };
    }
  }
  if (!Array.isArray(arr)) {
    console.error('scanSkeletons: no array found in', filePath);
    return { error: 'no-array' };
  }
  const FIELDS = ['subtitle', 'themes', 'whereToEat', 'whereToStay', 'budgetText',
                  'tips', 'howToGet', 'bestSeason', 'xhsHeat', 'xhsQuote', 'highlight',
                  'tags', 'imageQuery', 'gradient'];
  const skel = [];
  const partial = [];
  const full = [];
  for (const e of arr) {
    const filled = FIELDS.filter(f => {
      const v = e[f];
      if (!v) return false;
      if (Array.isArray(v)) return v.length > 0;
      return String(v).length >= 3;
    }).length;
    const ratio = filled / FIELDS.length;
    if (ratio < 0.4) skel.push({ id: e.id, name: e.name, missing: FIELDS.filter(f => !e[f]) });
    else if (ratio < 0.75) partial.push({ id: e.id, name: e.name, ratio: ratio.toFixed(2) });
    else full.push(e.id);
  }
  const result = { cityKey, total: arr.length, skeleton: skel.length, partial: partial.length, full: full.length, skelList: skel };
  console.log(JSON.stringify(result, null, 2));
  return result;
}

function crossCityCheck(namesJson) {
  const names = JSON.parse(namesJson);
  const files = fs.readdirSync(JS_DIR).filter(f => f.startsWith('data-') && f.endsWith('.js') && !f.includes('legends'));
  const collisions = [];
  for (const f of files) {
    const content = fs.readFileSync(path.join(JS_DIR, f), 'utf-8');
    for (const n of names) {
      if (content.includes(`name: "${n}"`) || content.includes(`name: '${n}'`)) {
        collisions.push({ name: n, file: f });
      }
    }
  }
  console.log(JSON.stringify(collisions, null, 2));
  return collisions;
}

function chromeVerify(cityKey, legendMode = false) {
  // 打开 GH Pages，切换到 city，统计 cards
  const url = `https://sherconan.github.io/weekend-go/?verify=${Date.now()}`;
  const jsCheck = legendMode ? `
    (function(){
      document.querySelector('[data-city="${cityKey}"]').click();
      var s = Date.now(); while (Date.now() - s < 800) {}
      var flipBtn = document.getElementById('world-flip-btn');
      if (!flipBtn || getComputedStyle(flipBtn).display === 'none') return JSON.stringify({flipHidden:true});
      flipBtn.click();
      s = Date.now(); while (Date.now() - s < 1500) {}
      var cards = document.querySelectorAll('#otherside-grid .legend-card, #otherside-grid [data-legend-id]');
      return JSON.stringify({ legendCount: cards.length, firstName: cards[0]?.querySelector('.legend-name, h3')?.textContent?.trim() });
    })()
  ` : `
    (function(){
      document.querySelector('[data-city="${cityKey}"]').click();
      var s = Date.now(); while (Date.now() - s < 1200) {}
      var cards = document.querySelectorAll('.dest-card');
      var badge = document.getElementById('hero-badge')?.textContent?.trim();
      return JSON.stringify({ cardCount: cards.length, activeCity: document.querySelector('.city-btn.active')?.dataset.city, badge: badge });
    })()
  `;
  const script = `
tell application "Google Chrome"
  set toClose to {}
  repeat with w in windows
    repeat with t in tabs of w
      if URL of t contains "sherconan.github.io/weekend-go" then copy t to end of toClose
    end repeat
  end repeat
  repeat with t in toClose
    close t
  end repeat
  tell window 1 to make new tab with properties {URL:"${url}"}
end tell
`;
  execSync(`osascript -e '${script.replace(/'/g, "'\\''")}'`);
  execSync('sleep 15');
  try {
    const out = execSync(`osascript -e 'tell application "Google Chrome"
  repeat with w in windows
    repeat with t in tabs of w
      if URL of t contains "sherconan.github.io/weekend-go" then
        return execute t javascript "${jsCheck.trim().replace(/"/g, '\\"').replace(/\n/g, ' ')}"
      end if
    end repeat
  end repeat
end tell'`).toString().trim();
    console.log(out);
    return out;
  } catch (e) {
    console.error('chrome-verify failed:', e.message);
    return null;
  }
}

// ─── Dispatch ───
const [, , cmd, ...args] = process.argv;

// ─── Phase 2: cross-city dedup analyzer ───
function loadCityDests(cityKey) {
  const filePath = path.join(JS_DIR, `data-${cityKey}.js`);
  if (!fs.existsSync(filePath)) return [];
  const { runInNewContext } = require('vm');
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(/\bconst\s+(DESTINATIONS_\w+)\s*=/g, 'var $1 =');
  const matches = [...content.matchAll(/var\s+(DESTINATIONS_\w+)\s*=/g)].map(m => m[1]);
  const sandbox = { window: {}, module: { exports: {} }, console: { log: () => {}, error: () => {} } };
  try {
    runInNewContext(content, sandbox, { timeout: 5000 });
    for (const n of matches) {
      if (Array.isArray(sandbox[n])) return sandbox[n];
    }
    return [];
  } catch { return []; }
}

function loadAllBeijingDests() {
  // Map file → expected variable name
  const fileToVar = {
    'data': 'DESTINATIONS',
    'data-extra': 'DESTINATIONS_EXTRA',
    'data-extra2': 'DESTINATIONS_EXTRA2',
    'data-beijing-500': 'DESTINATIONS_BJ500',
    'data-beijing-expand': 'DESTINATIONS_BJ_EXPAND',
    'data-beijing-hidden': 'DESTINATIONS_BJ_HIDDEN',
    'data-beijing-tales': 'DESTINATIONS_BJ_TALES',
    'data-beijing-new2026': 'DESTINATIONS_BJ_2026'
  };
  const { runInNewContext } = require('vm');
  const byFile = {};
  for (const [file, varName] of Object.entries(fileToVar)) {
    const p = path.join(JS_DIR, file + '.js');
    if (!fs.existsSync(p)) continue;
    // Fresh sandbox per file to avoid const redeclare errors
    const sandbox = { window: {}, module: { exports: {} }, console: { log: () => {}, error: () => {} } };
    try {
      // Convert `const DESTINATIONS_X =` to `var` so it attaches to sandbox
      let src = fs.readFileSync(p, 'utf-8').replace(/\bconst\s+(DESTINATIONS_\w+)\s*=/g, 'var $1 =');
      runInNewContext(src, sandbox, { timeout: 5000 });
      if (Array.isArray(sandbox[varName])) byFile[file] = sandbox[varName];
    } catch (e) {
      // silent
    }
  }
  return byFile;
}

function dedupReport() {
  // Build name → [{city, file, entry}] groups
  const groups = new Map();
  const addEntry = (name, city, file, entry) => {
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name).push({ city, file, entry });
  };

  // Beijing (multi-file)
  const bjFiles = loadAllBeijingDests();
  for (const [file, arr] of Object.entries(bjFiles)) {
    for (const e of arr) addEntry(e.name, 'beijing', file, e);
  }

  // Other cities (single file each)
  for (const city of ['shenzhen', 'weihai', 'suzhou', 'tianjin', 'qingdao']) {
    const arr = loadCityDests(city);
    for (const e of arr) addEntry(e.name, city, `data-${city}`, e);
  }

  // Filter to duplicates only
  const dupes = [...groups.entries()].filter(([_, entries]) => entries.length > 1);

  // Classify each duplicate group
  const report = {
    intraCity: [],     // same city, 2+ entries (must merge)
    crossCity: [],     // different cities (candidate for cities{} facet)
    stats: { totalDupes: dupes.length }
  };
  for (const [name, entries] of dupes) {
    const cities = [...new Set(entries.map(e => e.city))];
    if (cities.length === 1) {
      report.intraCity.push({
        name,
        city: cities[0],
        files: entries.map(e => e.file),
        ids: entries.map(e => e.entry.id),
        proposed: `keep ${entries[0].file}:${entries[0].entry.id}, remove others`
      });
    } else {
      // Pick canonical: the city where distance is smallest (likely the real home)
      const canonical = entries.reduce((min, cur) => (cur.entry.distance || 9999) < (min.entry.distance || 9999) ? cur : min, entries[0]);
      report.crossCity.push({
        name,
        cities: cities,
        canonical: `${canonical.city} (${canonical.entry.distance}km)`,
        allDistances: entries.map(e => ({ city: e.city, dist: e.entry.distance })),
        proposed: `Phase 2 merge into single entry with cities: { ${cities.map(c => `${c}: {distance}`).join(', ')} }`
      });
    }
  }
  report.stats.intraCityCount = report.intraCity.length;
  report.stats.crossCityCount = report.crossCity.length;
  console.log(JSON.stringify(report, null, 2));
  return report;
}

const commands = {
  'bump-cache': () => bumpCache(args[0], args[1]),
  'next-dest-id': () => nextDestId(),
  'next-legend-id': () => nextLegendId(args[0]),
  'scan-skeletons': () => scanSkeletons(args[0]),
  'cross-city-check': () => crossCityCheck(args[0]),
  'chrome-verify': () => chromeVerify(args[0], args.includes('--legend')),
  'dedup-report': () => dedupReport(),
  'full-city-smoke': () => fullCitySmoke()
};

function fullCitySmoke() {
  // 依次切换所有 CITIES 并统计 cardCount，任一为 0 视为回归
  const sb = { window:{}, module:{exports:{}}, console:{log:()=>{},error:()=>{}} };
  require('vm').runInNewContext(fs.readFileSync(path.join(ROOT,'config/cities.js'),'utf-8').replace(/\bconst\s+CITIES\s*=/,'var CITIES ='), sb, {timeout:3000});
  const keys = (sb.CITIES || []).map(c => c.key);
  const jsParts = keys.map(k =>
    `document.querySelector('[data-city=\\"${k}\\"]').click(); s=Date.now(); while(Date.now()-s<1500){} result.${k}=document.querySelectorAll('.dest-card').length;`
  ).join(' ');
  const js = `(function(){ var result={}; var s; ${jsParts} return JSON.stringify(result); })()`;

  // Write AppleScript to temp file to avoid shell escaping hell
  const tmpScript = `/tmp/wg-smoke-${Date.now()}.scpt`;
  const url = `https://sherconan.github.io/weekend-go/?smoke=${Date.now()}`;
  const applescript = `tell application "Google Chrome"
  set toClose to {}
  repeat with w in windows
    repeat with t in tabs of w
      if URL of t contains "sherconan.github.io/weekend-go" then copy t to end of toClose
    end repeat
  end repeat
  repeat with t in toClose
    close t
  end repeat
  tell window 1 to make new tab with properties {URL:"${url}"}
end tell
delay 15
tell application "Google Chrome"
  repeat with w in windows
    repeat with t in tabs of w
      if URL of t contains "sherconan.github.io/weekend-go" then
        return execute t javascript "${js}"
      end if
    end repeat
  end repeat
end tell`;
  fs.writeFileSync(tmpScript, applescript);
  try {
    const out = execSync(`osascript "${tmpScript}"`).toString().trim();
    console.log('Full city smoke result:', out);
    try {
      const parsed = JSON.parse(out);
      const zeros = Object.entries(parsed).filter(([k,v]) => !v).map(([k])=>k);
      if (zeros.length) {
        console.error('❌ REGRESSION: cities with 0 cards:', zeros.join(','));
        process.exit(1);
      }
      console.log('✅ All cities render > 0 cards');
    } catch (e) {
      console.error('parse failed:', e.message);
    }
  } finally {
    try { fs.unlinkSync(tmpScript); } catch {}
  }
}

if (!commands[cmd]) {
  console.error(`Unknown command: ${cmd}\nAvailable: ${Object.keys(commands).join(', ')}`);
  process.exit(1);
}
commands[cmd]();
