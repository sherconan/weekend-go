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
  tianjin:  ['DESTINATIONS_TJ'],
  qingdao:  ['DESTINATIONS_QD'],
  chengdu:  ['DESTINATIONS_CD'],
  hangzhou: ['DESTINATIONS_HZ']
};

function _mergeSources(varNames) {
  const seen = new Set();
  const out = [];
  for (const name of varNames) {
    // Top-level `const` in non-module scripts doesn't attach to window.
    // Try window first (for data files that explicitly export), fall back to eval for const/let globals.
    let arr = (typeof window !== 'undefined' ? window[name] : undefined);
    if (!Array.isArray(arr)) {
      try {
        // eval in global scope to read const/let lexical globals
        arr = (0, eval)(`typeof ${name} !== 'undefined' ? ${name} : undefined`);
      } catch (_) {}
    }
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

// Phase 2 B: 从 SHARED_CROSS_CITY_DESTS 派生当前城市的视图
function _buildSharedForCity(cityKey) {
  let shared = [];
  try {
    shared = (typeof window !== 'undefined' && Array.isArray(window.SHARED_CROSS_CITY_DESTS))
      ? window.SHARED_CROSS_CITY_DESTS
      : (0, eval)(`typeof SHARED_CROSS_CITY_DESTS !== 'undefined' ? SHARED_CROSS_CITY_DESTS : []`);
  } catch (_) { shared = []; }
  const out = [];
  for (const d of shared) {
    if (d && d.cities && d.cities[cityKey]) {
      // 展平：把 cities[cityKey] 的字段摊到顶层，保留公共字段
      out.push({ ...d, ...d.cities[cityKey], _sharedId: d.id, originCity: cityKey });
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
      build: () => {
        const fromSources = _mergeSources(sources);
        const fromShared = _buildSharedForCity(city.key);
        // Dedup by name (if shared also exists in source file, prefer shared)
        const sharedNames = new Set(fromShared.map(d => d.name));
        const filteredSources = fromSources.filter(d => !sharedNames.has(d.name));
        return [...fromShared, ...filteredSources];
      },
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

// B2 · 渲染 city-selector 为下拉菜单（10+ 城用横排会爆）
function renderCitySelector(containerSel = '.city-selector') {
  if (typeof CITIES === 'undefined') return;
  const el = document.querySelector(containerSel);
  if (!el) return;
  const initial = CITIES[0];
  const itemsHTML = CITIES.map((c, i) =>
    `<button class="city-dropdown-item${i === 0 ? ' active' : ''}" data-city="${c.key}" onclick="switchCity('${c.key}'); toggleCityDropdown(false)" type="button">
       <span class="city-dropdown-emoji">${c.emoji}</span>
       <span class="city-dropdown-name">${c.name}</span>
       <span class="city-dropdown-check" aria-hidden="true">&#x2713;</span>
     </button>`
  ).join('');
  el.innerHTML = `
    <div class="city-dropdown" id="city-dropdown">
      <button class="city-dropdown-trigger" type="button"
              onclick="toggleCityDropdown()" aria-haspopup="listbox" aria-expanded="false"
              aria-label="切换城市">
        <span class="city-dropdown-emoji" id="city-dropdown-current-emoji">${initial.emoji}</span>
        <span class="city-dropdown-current" id="city-dropdown-current">${initial.name}</span>
        <span class="city-dropdown-arrow" aria-hidden="true">&#x25BE;</span>
      </button>
      <div class="city-dropdown-menu" id="city-dropdown-menu" role="listbox">
        ${itemsHTML}
      </div>
    </div>
  `;
}

// 切换 dropdown 展开/收起；force 为 boolean 时强制设定
function toggleCityDropdown(force) {
  const dd = document.getElementById('city-dropdown');
  if (!dd) return;
  const trigger = dd.querySelector('.city-dropdown-trigger');
  const isOpen = dd.classList.contains('open');
  const next = (typeof force === 'boolean') ? force : !isOpen;
  dd.classList.toggle('open', next);
  if (trigger) trigger.setAttribute('aria-expanded', String(next));
}

// 外部点击收起
document.addEventListener('click', (e) => {
  const dd = document.getElementById('city-dropdown');
  if (!dd) return;
  if (!dd.contains(e.target) && dd.classList.contains('open')) {
    toggleCityDropdown(false);
  }
});
// Esc 收起
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const dd = document.getElementById('city-dropdown');
    if (dd && dd.classList.contains('open')) toggleCityDropdown(false);
  }
});

// 同步 trigger 显示（switchCity 后调用）
function syncCityDropdownTrigger(cityKey) {
  if (typeof CITIES === 'undefined') return;
  const c = CITIES.find(c => c.key === cityKey);
  if (!c) return;
  const nm = document.getElementById('city-dropdown-current');
  const em = document.getElementById('city-dropdown-current-emoji');
  if (nm) nm.textContent = c.name;
  if (em) em.textContent = c.emoji;
  // toggle .active on items
  document.querySelectorAll('.city-dropdown-item').forEach(it => {
    it.classList.toggle('active', it.dataset.city === cityKey);
  });
}
// 暴露给 app.js
if (typeof window !== 'undefined') window.syncCityDropdownTrigger = syncCityDropdownTrigger;

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
