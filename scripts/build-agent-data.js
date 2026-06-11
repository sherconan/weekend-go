// 构建 Agent 数据包：js/data-*.js（浏览器脚本）→ api/_lib/data.json
// 数据变更后重跑：node scripts/build-agent-data.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

// 与 index.html 实际加载一致的 城市→(文件,全局变量) 映射
const BEIJING_FILES = [
  ['js/data.js', 'DESTINATIONS'],
  ['js/data-extra.js', 'DESTINATIONS_EXTRA'],
  ['js/data-extra2.js', 'DESTINATIONS_EXTRA2'],
  ['js/data-beijing-500.js', 'DESTINATIONS_BJ500'],
  ['js/data-beijing-expand.js', 'DESTINATIONS_BJ_EXPAND'],
  ['js/data-beijing-hidden.js', 'DESTINATIONS_BJ_HIDDEN'],
  ['js/data-beijing-tales.js', 'DESTINATIONS_BJ_TALES'],
  ['js/data-beijing-new2026.js', 'DESTINATIONS_BJ_2026'],
];
const CITY_FILES = {
  shenzhen: [['js/data-shenzhen.js', 'DESTINATIONS_SZ']],
  weihai: [['js/data-weihai.js', 'DESTINATIONS_WH']],
  suzhou: [['js/data-suzhou.js', 'DESTINATIONS_SU']],
  tianjin: [['js/data-tianjin.js', 'DESTINATIONS_TJ']],
  qingdao: [['js/data-qingdao.js', 'DESTINATIONS_QD']],
  chengdu: [['js/data-chengdu.js', 'DESTINATIONS_CD']],
  hangzhou: [['js/data-hangzhou.js', 'DESTINATIONS_HZ']],
  chongqing: [['js/data-chongqing.js', 'DESTINATIONS_CQ']],
  enshi: [['js/data-enshi.js', 'DESTINATIONS_ES']],
};
const CITY_LABELS = {
  beijing: '北京', shenzhen: '深圳', weihai: '威海', suzhou: '苏州', tianjin: '天津',
  qingdao: '青岛', chengdu: '成都', hangzhou: '杭州', chongqing: '重庆', enshi: '恩施',
};
// 跨城共享 facet（web 端在主站由 build 合并；这里按 cities 字段展开到各城）
const SHARED_FILE = ['js/data-shared-cross-city.js', 'SHARED_CROSS_CITY_DESTS'];

function loadVars(files) {
  const sb = { console };
  vm.createContext(sb);
  for (const [rel] of files) {
    const p = path.join(ROOT, rel);
    if (!fs.existsSync(p)) continue;
    vm.runInContext(fs.readFileSync(p, 'utf8'), sb, { filename: rel });
  }
  const out = [];
  const seen = new Set();
  for (const [, varName] of files) {
    let arr;
    try { arr = vm.runInContext(varName, sb); } catch (e) { arr = null; }
    if (!Array.isArray(arr)) continue;
    for (const d of arr) {
      if (!d || d.id == null || seen.has(d.id)) continue;
      seen.add(d.id);
      out.push(d);
    }
  }
  return out;
}

const s = (v) => (v == null ? '' : String(v).trim());
const cut = (v, n) => { const t = s(v); return t.length > n ? t.slice(0, n) + '…' : t; };

// 与 web top3.js 同口径的「内容扎实」
function isSolid(d) {
  if (!d || s(d.whatToDo).length < 30) return false;
  return s(d.howToGet).length >= 10 || s(d.whereToEat).length >= 6;
}

function toEntry(d, fromShared) {
  return {
    id: d.id,
    name: s(d.name),
    subtitle: cut(d.subtitle, 40),
    distance: d.distance != null ? d.distance : null,
    distanceText: s(d.distanceText) || (d.distance != null ? d.distance + 'km' : ''),
    duration: Array.isArray(d.duration) ? d.duration : (d.duration ? [d.duration] : []),
    transport: Array.isArray(d.transport) ? d.transport : [],
    themes: Array.isArray(d.themes) ? d.themes : [],
    budget: s(d.budget),
    budgetText: cut(d.budgetText, 50),
    rating: d.rating || null,
    bestSeason: s(d.bestSeason),
    highlight: cut(d.highlight, 40),
    tags: Array.isArray(d.tags) ? d.tags.slice(0, 5) : [],
    heatTier: (d.xhsHeat && d.xhsHeat.tier) || '',
    solid: isSolid(d),
    shared: !!fromShared || !!d._sharedId || !!d.cities,
    detail: {
      overview: cut(d.overview || d.description, 600),
      whatToDo: cut(d.whatToDo, 700),
      whereToEat: cut(d.whereToEat, 400),
      whereToStay: cut(d.whereToStay, 400),
      howToGet: cut(d.howToGet, 400),
      tips: cut(d.tips, 500),
    },
  };
}

const cities = {};
cities.beijing = { label: CITY_LABELS.beijing, dests: loadVars(BEIJING_FILES).map((d) => toEntry(d, false)) };
for (const [city, files] of Object.entries(CITY_FILES)) {
  cities[city] = { label: CITY_LABELS[city], dests: loadVars(files).map((d) => toEntry(d, false)) };
}

// 跨城 facet：web 主站把它们并进各城列表；Agent 数据同样展开（标 shared，默认不进推荐）
const sharedArr = loadVars([SHARED_FILE]);
for (const d of sharedArr) {
  const facets = d.cities || {};
  for (const cityKey of Object.keys(facets)) {
    if (!cities[cityKey]) continue;
    if (cities[cityKey].dests.some((x) => x.id === d.id)) continue;
    const merged = { ...d, ...facets[cityKey] };
    cities[cityKey].dests.push(toEntry(merged, true));
  }
}

const out = { builtAt: new Date().toISOString(), cities };
const outPath = path.join(ROOT, 'api', '_lib', 'data.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(out));

const summary = Object.entries(cities).map(([k, v]) => {
  const solid = v.dests.filter((d) => d.solid && !d.shared).length;
  return `${k}:${v.dests.length}(solid ${solid})`;
}).join(' ');
console.log('api/_lib/data.json 写入完成');
console.log(summary);
console.log('大小:', (fs.statSync(outPath).size / 1024 / 1024).toFixed(2), 'MB');
