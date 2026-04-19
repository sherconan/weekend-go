/**
 * WeekendGo · CITIES 注册表 → 旧 API 桥接层
 *
 * 本文件把单一 CITIES 源派生为：
 *   - window.CITY_DATA（app.js 需要的 `{ build, label, badge, desc }` dict）
 *   - .city-selector 的按钮（动态渲染）
 *   - 搜索热门词（SEARCH_HOT_WORDS）
 *
 * 新增城市 → 改 config/cities.js + 此文件 sourceVars 映射（如果复用现有数据文件）
 */

// 每个城市的数据源（globals 名，按合并顺序）
const CITY_SOURCE_VARS = {
  beijing: [
    'DESTINATIONS',
    'DESTINATIONS_EXTRA',
    'DESTINATIONS_EXTRA2',
    'DESTINATIONS_BJ500',
    'DESTINATIONS_BJ_EXPAND',
    'DESTINATIONS_BJ_HIDDEN',
    'DESTINATIONS_BJ_TALES',
    'DESTINATIONS_BJ_2026'
  ],
  shenzhen: ['DESTINATIONS_SZ'],
  weihai:   ['DESTINATIONS_WH'],
  suzhou:   ['DESTINATIONS_SU'],
  tianjin:  ['DESTINATIONS_TJ']
};

function _mergeSources(varNames) {
  const seen = new Set();
  const out = [];
  for (const name of varNames) {
    const arr = (typeof window !== 'undefined' ? window[name] : undefined);
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

// 基于 CITIES 构建 CITY_DATA（旧接口兼容）
function buildCityData() {
  if (typeof CITIES === 'undefined') return {};
  const cd = {};
  for (const city of CITIES) {
    const sources = CITY_SOURCE_VARS[city.key] || [];
    cd[city.key] = {
      build: () => _mergeSources(sources),
      label: `${city.name}周边游`,
      badge: city.badge,
      desc: city.desc,
      // 透出给未来 Phase 2 用
      origin: city.origin,
      maxRange: city.maxRange,
      color: city.color,
      hotWords: city.hotWords || [],
      hasLegends: !!city.hasLegends
    };
  }
  return cd;
}

// 聚合所有城市的热门词（供搜索页用）
function buildSearchHotWords() {
  if (typeof CITIES === 'undefined') return {};
  const map = {};
  for (const city of CITIES) {
    map[city.key] = city.hotWords || [];
  }
  return map;
}

// 渲染 city-selector 按钮
function renderCitySelector(containerSel = '.city-selector') {
  if (typeof CITIES === 'undefined') return;
  const el = document.querySelector(containerSel);
  if (!el) return;
  el.innerHTML = CITIES.map((c, i) =>
    `<button class="city-btn${i === 0 ? ' active' : ''}" data-city="${c.key}" onclick="switchCity('${c.key}')">${c.emoji} ${c.name}</button>`
  ).join('');
}

// 覆盖 app.js 的 CITY_DATA 和 SEARCH_HOT_WORDS（如果存在）
(function installBridge() {
  if (typeof window === 'undefined') return;
  try {
    window.CITY_DATA = buildCityData();
    window.SEARCH_HOT_WORDS = buildSearchHotWords();
    // 在 DOM ready 时渲染 city-selector
    const run = () => renderCitySelector();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run);
    } else {
      run();
    }
  } catch (e) {
    console.error('[cities-dataset] bridge install failed:', e);
  }
})();
