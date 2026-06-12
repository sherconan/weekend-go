// ========== City Data Registry ==========
function buildBeijingDestinations() {
  const dests = [...DESTINATIONS];
  if (typeof DESTINATIONS_EXTRA !== 'undefined') dests.push(...DESTINATIONS_EXTRA);
  if (typeof DESTINATIONS_EXTRA2 !== 'undefined') {
    const names = new Set(dests.map(d => d.name));
    dests.push(...DESTINATIONS_EXTRA2.filter(d => !names.has(d.name)));
  }
  if (typeof DESTINATIONS_BJ500 !== 'undefined') {
    const names = new Set(dests.map(d => d.name));
    dests.push(...DESTINATIONS_BJ500.filter(d => !names.has(d.name)));
  }
  if (typeof DESTINATIONS_BJ_EXPAND !== 'undefined') {
    const names = new Set(dests.map(d => d.name));
    dests.push(...DESTINATIONS_BJ_EXPAND.filter(d => !names.has(d.name)));
  }
  if (typeof DESTINATIONS_BJ_HIDDEN !== 'undefined') {
    const names = new Set(dests.map(d => d.name));
    dests.push(...DESTINATIONS_BJ_HIDDEN.filter(d => !names.has(d.name)));
  }
  if (typeof DESTINATIONS_BJ_TALES !== 'undefined') {
    const names = new Set(dests.map(d => d.name));
    dests.push(...DESTINATIONS_BJ_TALES.filter(d => !names.has(d.name)));
  }
  if (typeof DESTINATIONS_BJ_2026 !== 'undefined') {
    const names = new Set(dests.map(d => d.name));
    dests.push(...DESTINATIONS_BJ_2026.filter(d => !names.has(d.name)));
  }
  return dests;
}

// CITY_DATA 由 cities-dataset.js 基于 config/cities.js 中的 CITIES 注册表派生。
// 新增城市 → 改 config/cities.js（+可能改 cities-dataset.js 的 CITY_SOURCE_VARS），而不是在这里加字典项。
// Fallback 保留硬编码以防加载顺序问题。
const CITY_DATA = (typeof window !== 'undefined' && window.CITY_DATA) ? window.CITY_DATA : {
  beijing: { build: buildBeijingDestinations, label: '北京周边游', badge: '\u{1F331} 北京周边游 \u00B7 2026 春季版', desc: '从北京出发，500公里范围内的精选目的地。' },
  shenzhen: { build: () => typeof DESTINATIONS_SZ !== 'undefined' ? [...DESTINATIONS_SZ] : [], label: '深圳周边游', badge: '\u{1F3D6} 深圳周边游 \u00B7 2026 春季版', desc: '从深圳出发，海滩、美食、古镇，应有尽有。' },
  weihai: { build: () => typeof DESTINATIONS_WH !== 'undefined' ? [...DESTINATIONS_WH] : [], label: '威海周边游', badge: '\u{1F30A} 威海周边游 \u00B7 2026 春季版', desc: '从威海出发，海鲜、海景、韩国风情。' },
  suzhou: { build: () => typeof DESTINATIONS_SU !== 'undefined' ? [...DESTINATIONS_SU] : [], label: '苏州周边游', badge: '\u{1F3EE} 苏州周边游 \u00B7 2026 春季版', desc: '从苏州出发，江南园林、水乡古镇、太湖烟雨。' },
};

let currentCity = (typeof CITIES !== 'undefined' && CITIES[0] ? CITIES[0].key : 'beijing');
let ACTIVE_DESTINATIONS = (CITY_DATA[currentCity] && CITY_DATA[currentCity].build()) || [];

function switchCity(city) {
  if (!CITY_DATA[city]) return;
  currentCity = city;
  const cityInfo = CITY_DATA[city];
  ACTIVE_DESTINATIONS = cityInfo.build();

  // Update UI
  document.querySelectorAll('.city-btn').forEach(b => b.classList.toggle('active', b.dataset.city === city));
  // B2 · sync new city dropdown + record for recent-city sorting
  if (typeof syncCityDropdownTrigger === 'function') syncCityDropdownTrigger(city);
  if (typeof recordRecentCity === 'function') recordRecentCity(city);
  const badge = document.getElementById('hero-badge');
  // 徽标里的「X季版」跟随当前月份（数据里写死了春季版）
  if (badge) badge.innerHTML = typeof seasonEditionBadge === 'function' ? seasonEditionBadge(cityInfo.badge) : cityInfo.badge;
  const desc = document.getElementById('hero-desc');
  if (desc) desc.textContent = cityInfo.desc;

  // Update stats
  const statCount = document.getElementById('stat-count');
  const statRange = document.getElementById('stat-range');
  if (statCount) statCount.textContent = ACTIVE_DESTINATIONS.length;
  if (statRange) {
    const dists = ACTIVE_DESTINATIONS.map(d => d.distance).sort((a,b) => a-b);
    statRange.textContent = dists.length > 0 ? `${dists[0]}-${dists[dists.length-1]}` : '0';
  }

  // Reset filters and re-render
  clearFilters();
  updateCollectionProgress();
  // 首屏「本周末 Top 3」跟随城市
  if (typeof renderTop3 === 'function') renderTop3();
}

// ========== State ==========
const state = {
  filters: {
    duration: [],
    transport: [],
    themes: [],
    budget: [],
    visited: []
  },
  compareList: [],
  chatOpen: false,
  detailOpen: null,
  sortBy: 'default'
};

// ========== DOM Refs ==========
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ========== Initialize ==========
document.addEventListener('DOMContentLoaded', () => {
  bindFilterEvents();
  bindChatEvents();
  bindCompareEvents();
  // 恢复上次浏览的城市（与城市下拉「最近使用」同源），
  // 修复：下拉显示天津、内容却是北京的状态不同步
  let initialCity = currentCity;
  try {
    const recent = JSON.parse(localStorage.getItem('weekend-go-recent-cities') || '[]');
    if (Array.isArray(recent) && recent[0] && CITY_DATA[recent[0]]) initialCity = recent[0];
  } catch (e) {}
  switchCity(initialCity); // 内部完成 applyFilters / 统计 / 徽标 / Top3 渲染
  initScrollAnimations();
});

// ========== Filtering ==========
function bindFilterEvents() {
  $$('.filter-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const category = tag.dataset.category;
      const value = tag.dataset.value;

      tag.classList.toggle('active');

      if (state.filters[category].includes(value)) {
        state.filters[category] = state.filters[category].filter(v => v !== value);
      } else {
        state.filters[category].push(value);
      }

      applyFilters();
    });
  });

  const clearBtn = $('.filter-clear');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearFilters);
  }
}

function clearFilters() {
  state.filters = { duration: [], transport: [], themes: [], budget: [], visited: [] };
  state.sortBy = 'default';
  $$('.filter-tag').forEach(tag => tag.classList.remove('active'));
  $$('.sort-btn').forEach(b => b.classList.toggle('active', b.dataset.sort === 'default'));
  applyFilters();
}

const BUDGET_ORDER = { "200以下": 100, "200-500": 350, "500-1000": 750, "1000以上": 1500 };

function sortDestinations(sortBy) {
  state.sortBy = sortBy;
  $$('.sort-btn').forEach(b => b.classList.toggle('active', b.dataset.sort === sortBy));
  applyFilters();
}

function getXhsHeat(dest) {
  // Check city-specific XHS data first, then fallback to global
  const cityHeatMap = {
    shenzhen: typeof XHS_HEAT_SZ !== 'undefined' ? XHS_HEAT_SZ : null,
    weihai: typeof XHS_HEAT_WH !== 'undefined' ? XHS_HEAT_WH : null,
    chengdu: typeof XHS_HEAT_CD !== 'undefined' ? XHS_HEAT_CD : null,
    chongqing: typeof XHS_HEAT_CQ !== 'undefined' ? XHS_HEAT_CQ : null,
    hangzhou: typeof XHS_HEAT_HZ !== 'undefined' ? XHS_HEAT_HZ : null,
    enshi: typeof XHS_HEAT_ES !== 'undefined' ? XHS_HEAT_ES : null,
    qingdao: typeof XHS_HEAT_QD !== 'undefined' ? XHS_HEAT_QD : null,
    tianjin: typeof XHS_HEAT_TJ !== 'undefined' ? XHS_HEAT_TJ : null,
  };
  const cityHeat = cityHeatMap[currentCity];
  if (cityHeat && cityHeat[dest.name]) return cityHeat[dest.name].heat;
  if (typeof XHS_HEAT !== 'undefined' && XHS_HEAT[dest.name]) return XHS_HEAT[dest.name].heat;
  return 30;
}

function applyFilters() {
  const filtered = ACTIVE_DESTINATIONS.filter(dest => {
    // Duration filter
    if (state.filters.duration.length > 0) {
      if (!dest.duration.some(d => state.filters.duration.includes(d))) return false;
    }

    // Transport filter
    if (state.filters.transport.length > 0) {
      if (!dest.transport.some(t => state.filters.transport.includes(t))) return false;
    }

    // Themes filter
    if (state.filters.themes.length > 0) {
      if (!dest.themes.some(t => state.filters.themes.includes(t))) return false;
    }

    // Budget filter
    if (state.filters.budget.length > 0) {
      if (!state.filters.budget.includes(dest.budget)) return false;
    }

    // Visited filter
    if (state.filters.visited.length > 0) {
      if (state.filters.visited.includes('还没玩过') && isVisited(dest.id)) return false;
      if (state.filters.visited.includes('已打卡') && !isVisited(dest.id)) return false;
    }

    return true;
  });

  // Sort
  const sortBy = state.sortBy || 'default';
  if (sortBy === 'distance') filtered.sort((a, b) => a.distance - b.distance);
  else if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);
  else if (sortBy === 'budget') filtered.sort((a, b) => (BUDGET_ORDER[a.budget] || 500) - (BUDGET_ORDER[b.budget] || 500));
  else if (sortBy === 'xhsHeat') filtered.sort((a, b) => getXhsHeat(b) - getXhsHeat(a));

  renderDestinations(filtered);
  updateFilterActiveTags();

  // Update count
  const countEl = $('.filter-count');
  if (countEl) {
    const total = Object.values(state.filters).flat().length;
    if (total === 0) {
      countEl.innerHTML = `共 <strong>${ACTIVE_DESTINATIONS.length}</strong> 个目的地`;
    } else {
      countEl.innerHTML = `筛选出 <strong>${filtered.length}</strong> 个目的地`;
    }
  }
}

// ========== Filter Toggle ==========
function toggleFilters() {
  const body = $('.filter-body');
  const icon = $('.filter-toggle-icon');
  if (!body) return;
  body.classList.toggle('collapsed');
  icon.textContent = body.classList.contains('collapsed') ? '\u25BC' : '\u25B2';
}

function updateFilterActiveTags() {
  const el = $('.filter-active-tags');
  if (!el) return;
  const active = Object.values(state.filters).flat();
  if (active.length === 0) {
    el.innerHTML = '';
  } else {
    el.innerHTML = active.map(v => `<span class="filter-active-pill">${v}</span>`).join('');
  }
}

// ========== Render Destinations ==========
function renderDestinations(destinations) {
  const grid = $('.destinations-grid');
  if (!grid) return;

  if (destinations.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">&#x1F50D;</div>
        <h3>没有找到匹配的目的地</h3>
        <p>试试调整筛选条件，或者问问 AI 顾问</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = destinations.map((dest, i) => {
    const imgPath = typeof getDestImage === 'function' ? getDestImage(dest) : null;
    const sceneURL = typeof getSceneDataURL === 'function' ? getSceneDataURL(dest) : '';
    const hasImage = imgPath || sceneURL;
    const fallbackStyle = !hasImage ? `background: ${dest.gradient};` : '';
    const imgSrc = imgPath || sceneURL || '';
    const xhsH = getXhsHeat(dest);

    const visited = typeof isVisited === 'function' && isVisited(dest.id);
    const visitedClass = visited ? ' visited' : '';
    const stampClass = visited ? ' stamped' : '';
    // Generate unique stamp overlay for visited destinations
    const stampOverlay = visited && typeof getStampDataURL === 'function'
      ? `<img class="dest-card-stamp-overlay" src="${getStampDataURL(dest)}" alt="已打卡">`
      : '';

    // Transport icon mapping
    const transportIcons = { '自驾': '\u{1F697}', '高铁': '\u{1F685}', '公交可达': '\u{1F68C}' };
    const mainTransport = dest.transport[0] || '';
    const transportIcon = transportIcons[mainTransport] || '\u{1F6A9}';

    // Theme icon mapping
    const themeIcons = {
      '露营': '\u{26FA}', '古镇': '\u{1F3EF}', '爬山': '\u{26F0}', '温泉': '\u{2668}',
      '亲子': '\u{1F476}', '美食': '\u{1F37D}', '赏花': '\u{1F338}', '历史': '\u{1F3DB}',
      '度假': '\u{1F334}', '红叶': '\u{1F341}', '海滩': '\u{1F3D6}', '文艺': '\u{1F3A8}',
      '徒步': '\u{1F6B6}', '拍照': '\u{1F4F7}', '滑雪': '\u{26F7}', '漂流': '\u{1F6F6}',
      '寺庙': '\u{1F6D5}', '博物馆': '\u{1F3DB}', '购物': '\u{1F6CD}', '夜景': '\u{1F303}',
      '宗教': '\u{1F54C}', '采摘': '\u{1F347}', '动物': '\u{1F43E}', '星空': '\u{1F320}',
    };

    // Rating stars
    const fullStars = Math.floor(dest.rating);
    const hasHalf = dest.rating - fullStars >= 0.3;
    const starsHtml = Array.from({length: 5}, (_, idx) => {
      if (idx < fullStars) return '<span class="dest-card-rating-star">\u2605</span>';
      if (idx === fullStars && hasHalf) return '<span class="dest-card-rating-star">\u2605</span>';
      return '<span class="dest-card-rating-star empty">\u2606</span>';
    }).join('');

    // XHS heat bar (shown if heat >= 40)
    const heatClass = xhsH >= 70 ? 'heat-high' : xhsH >= 50 ? 'heat-mid' : 'heat-low';
    const heatBar = xhsH >= 40 ? `
      <div class="dest-card-heat">
        <span class="dest-card-heat-label">\u{1F525} \u5C0F\u7EA2\u4E66</span>
        <div class="dest-card-heat-bar"><div class="dest-card-heat-fill ${heatClass}" style="width:${xhsH}%"></div></div>
        <span class="dest-card-heat-value">${xhsH}</span>
      </div>` : '';

    // Hot badge on cover (only for very hot)
    const hotBadge = xhsH >= 80 ? `<span class="dest-card-badge badge-hot">\u{1F525} \u5C0F\u7EA2\u4E66\u7206\u6B3E</span>` : '';

    return `
    <div class="dest-card fade-up${visitedClass}" data-id="${dest.id}" style="transition-delay: ${Math.min(i, 8) * 60}ms">
      <div class="dest-card-cover" style="${fallbackStyle}">
        ${hasImage ? `<img class="dest-card-img" src="${imgSrc}" alt="${dest.name}" loading="lazy" decoding="async" width="400" height="280" onerror="this.remove();this.parentElement.style.background='${dest.gradient}'">` : ''}
        ${stampOverlay}
        <div class="dest-card-cover-overlay"></div>
        <div class="dest-card-cover-content">
          <span class="dest-card-source">${dest.source || dest.highlight || '\u{1F31F} 精选'}</span>
          <h3 class="dest-card-name">${dest.name}</h3>
          <p class="dest-card-subtitle">${dest.subtitle}</p>
        </div>
        <div class="dest-card-badges">
          <span class="dest-card-badge">\u{1F4CD} ${dest.distanceText}</span>
          <span class="dest-card-badge badge-rating">${starsHtml} <span class="dest-card-rating-value">${dest.rating}</span></span>
          ${hotBadge}
        </div>
      </div>
      <div class="dest-card-body">
        <div class="dest-card-meta">
          <span class="dest-card-meta-item"><span class="dest-card-meta-icon">${transportIcon}</span> ${mainTransport}</span>
          <span class="dest-card-meta-item"><span class="dest-card-meta-icon">\u{23F1}</span> ${dest.duration[0]}</span>
          <span class="dest-card-meta-item"><span class="dest-card-meta-icon">\u{1F4B0}</span> ${dest.budgetText}</span>
        </div>
        <div class="dest-card-desc">${dest.description || dest.subtitle || dest.highlight || ''}</div>
        ${heatBar}
        <div class="dest-card-tags">
          ${dest.transport.slice(1, 2).map(t => `<span class="dest-card-tag tag-transport">${transportIcons[t] || '\u{1F6A9}'} ${t}</span>`).join('')}
          ${dest.themes.slice(0, 2).map(t => `<span class="dest-card-tag tag-theme">${themeIcons[t] || '\u{1F3AF}'} ${t}</span>`).join('')}
        </div>
        <div class="dest-card-footer">
          <div class="dest-card-footer-left">
            <span class="dest-card-budget">${dest.budgetText}</span>
          </div>
          <div class="dest-card-footer-actions">
            <button class="stamp-btn${stampClass}" data-id="${dest.id}" data-name="${dest.name}" onclick="event.stopPropagation(); handleStampClick(event, +this.dataset.id, this.dataset.name)">
              <span class="stamp-btn-icon">${visited ? '\u2714' : '\u{1F3AB}'}</span> ${visited ? '\u5DF2\u6253\u5361' : '\u73A9\u8FC7'}
            </button>
            <button class="dest-card-compare-btn" data-id="${dest.id}" title="\u52A0\u5165\u5BF9\u6BD4" onclick="event.stopPropagation(); toggleCompare(${dest.id})">
              <span class="compare-icon">&#x2B;</span> \u5BF9\u6BD4
            </button>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');

  // Fade-in images on load
  grid.querySelectorAll('.dest-card-img').forEach(img => {
    if (img.complete && img.naturalWidth > 0) {
      img.style.opacity = '1';
    } else {
      img.addEventListener('load', () => { img.style.opacity = '1'; }, { once: true });
    }
  });

  // Bind card click
  grid.querySelectorAll('.dest-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.dest-card-compare')) return;
      const id = parseInt(card.dataset.id);
      openDetail(id);
    });
  });

  // Update compare button states
  updateCompareButtons();

  // Trigger scroll animations
  requestAnimationFrame(() => {
    grid.querySelectorAll('.fade-up').forEach(el => {
      el.classList.add('visible');
    });
  });
}

// ========== Detail Modal ==========
function openDetail(id) {
  const dest = ACTIVE_DESTINATIONS.find(d => d.id === id);
  if (!dest) return;

  const overlay = $('.modal-overlay');
  const modal = overlay.querySelector('.modal');

  const imgPath = typeof getDestImage === 'function' ? getDestImage(dest) : null;
  const coverBg = imgPath
    ? `background-image: url('${imgPath}'); background-size: cover; background-position: center;`
    : `background: ${dest.gradient};`;

  const xhsCityMap = {
    shenzhen: typeof XHS_HEAT_SZ !== 'undefined' ? XHS_HEAT_SZ : null,
    weihai: typeof XHS_HEAT_WH !== 'undefined' ? XHS_HEAT_WH : null,
    chengdu: typeof XHS_HEAT_CD !== 'undefined' ? XHS_HEAT_CD : null,
    chongqing: typeof XHS_HEAT_CQ !== 'undefined' ? XHS_HEAT_CQ : null,
    hangzhou: typeof XHS_HEAT_HZ !== 'undefined' ? XHS_HEAT_HZ : null,
    enshi: typeof XHS_HEAT_ES !== 'undefined' ? XHS_HEAT_ES : null,
    qingdao: typeof XHS_HEAT_QD !== 'undefined' ? XHS_HEAT_QD : null,
    tianjin: typeof XHS_HEAT_TJ !== 'undefined' ? XHS_HEAT_TJ : null,
  };
  const xhs = (xhsCityMap[currentCity] && xhsCityMap[currentCity][dest.name]) || (typeof XHS_HEAT !== 'undefined' ? XHS_HEAT[dest.name] : null);
  const heatBar = xhs ? `
    <div class="modal-heat">
      <div class="modal-heat-label">&#x1F525; 小红书声量</div>
      <div class="modal-heat-bar"><div class="modal-heat-fill" style="width: ${xhs.heat}%"></div></div>
      <div class="modal-heat-info">${xhs.notes} 篇笔记 &middot; ${xhs.trending}</div>
    </div>` : '';

  // 排版：换行 / 编号分号串 / 顿号枚举 三种数据写法统一成卡片条目（js/format-content.js）
  const fmt = (text) => typeof formatDestContent === 'function'
    ? formatDestContent(text)
    : (text ? `<p>${text}</p>` : '');

  const modalVisited = typeof isVisited === 'function' && isVisited(dest.id);
  const modalStampImg = modalVisited && typeof getStampDataURL === 'function' ? getStampDataURL(dest) : null;
  const modalStampOverlay = modalStampImg
    ? `<img class="modal-stamp-overlay" src="${modalStampImg}" alt="已打卡">`
    : '';

  modal.innerHTML = `
    <div class="modal-hero" style="${coverBg}">
      <div class="modal-hero-overlay"></div>
      ${modalStampOverlay}
      <button class="modal-close" onclick="closeDetail()">&#x2715;</button>
      <div class="modal-hero-content">
        <div class="modal-hero-badges">
          ${dest.themes.map(t => `<span class="modal-hero-badge">${t}</span>`).join('')}
        </div>
        <h2 class="modal-hero-title">${dest.name}</h2>
        <p class="modal-hero-subtitle">${dest.subtitle}</p>
        <div class="modal-hero-stats">
          <span>&#x1F4CD; ${dest.distanceText}</span>
          <span>&#x23F1; ${dest.duration[0]}</span>
          <span>&#x2B50; ${dest.rating}</span>
          <span>&#x1F4B0; ${dest.budgetText}</span>
        </div>
      </div>
    </div>

    <div class="modal-body-new">
      ${heatBar}

      <div class="modal-intro">
        <p>${dest.overview || dest.description || dest.subtitle || ''}</p>
      </div>

      ${(dest.whatToDo || dest.whereToEat) ? `<div class="modal-cards-row">
        ${dest.whatToDo ? `<div class="modal-info-card">
          <div class="modal-info-card-header" style="background: linear-gradient(135deg, #E8F5E9, #C8E6C9)">
            <span class="modal-info-card-icon">&#x1F3AF;</span>
            <h4>推荐怎么玩</h4>
          </div>
          <div class="modal-info-card-body">${fmt(dest.whatToDo)}</div>
        </div>` : ''}

        ${dest.whereToEat ? `<div class="modal-info-card">
          <div class="modal-info-card-header" style="background: linear-gradient(135deg, #FFF3E0, #FFE0B2)">
            <span class="modal-info-card-icon">&#x1F37D;</span>
            <h4>必吃美食</h4>
          </div>
          <div class="modal-info-card-body">${fmt(dest.whereToEat)}</div>
        </div>` : ''}
      </div>` : ''}

      ${(dest.howToGet || dest.whereToStay || dest.tips) ? `<div class="modal-detail-sections">
        ${dest.howToGet ? `<details class="modal-details" open>
          <summary>&#x1F697; 交通攻略</summary>
          <div class="modal-details-body">${fmt(dest.howToGet)}</div>
        </details>` : ''}

        ${dest.whereToStay ? `<details class="modal-details">
          <summary>&#x1F3E8; 住宿推荐</summary>
          <div class="modal-details-body">${fmt(dest.whereToStay)}</div>
        </details>` : ''}

        ${dest.tips ? `<details class="modal-details">
          <summary>&#x1F4A1; 出行贴士</summary>
          <div class="modal-details-body">${fmt(dest.tips)}</div>
        </details>` : ''}
      </div>` : ''}

      ${dest.highlight ? `<div class="modal-highlight">
        <span class="modal-highlight-icon">&#x2728;</span>
        <div>
          <strong>${dest.highlight}</strong>
          ${dest.bestSeason ? `<span class="modal-highlight-season">${dest.bestSeason}</span>` : ''}
        </div>
      </div>` : ''}

      ${(() => {
        const voices = typeof getXhsVoices === 'function' ? getXhsVoices(dest.name) : [];
        if (!voices.length) {
          // 完整笔记数据目前只采集了北京；其他城市用卡片自带的真实小红书语录兜底
          const quote = String(dest.xhsQuote || '').trim();
          if (!quote) return '';
          return `
        <div class="modal-xhs-voices">
          <div class="modal-xhs-voices-header">
            <span class="modal-xhs-voices-icon">&#x1F4D6;</span>
            <h4>来自小红书的真实分享</h4>
            <span class="modal-xhs-voices-count">精选</span>
          </div>
          <div class="xhs-quote-single">${quote}<span class="xhs-quote-src">—— 小红书博主</span></div>
        </div>`;
        }
        return `
        <div class="modal-xhs-voices">
          <div class="modal-xhs-voices-header">
            <span class="modal-xhs-voices-icon">&#x1F4D6;</span>
            <h4>来自小红书的真实分享</h4>
            <span class="modal-xhs-voices-count">TOP ${voices.length}</span>
          </div>
          <div class="modal-xhs-voices-grid">
            ${voices.map(v => `
              <a class="xhs-voice-card${v.cover ? '' : ' xhs-voice-card--text'}" href="${v.url}" target="_blank" rel="noopener">
                ${v.cover ? `<div class="xhs-voice-cover" style="background-image: url('${v.cover}')"></div>` : ''}
                <div class="xhs-voice-body">
                  <div class="xhs-voice-title">${v.title}</div>
                  ${v.excerpt ? `<div class="xhs-voice-excerpt">${v.excerpt}</div>` : ''}
                  <div class="xhs-voice-meta">
                    <span class="xhs-voice-author">${v.author}</span>
                    <span class="xhs-voice-likes">&#x2764; ${(v.likes||0).toLocaleString()}</span>
                  </div>
                </div>
              </a>
            `).join('')}
          </div>
        </div>`;
      })()}
    </div>

    <div class="modal-cta-new">
      <button class="modal-stamp-btn${typeof isVisited === 'function' && isVisited(dest.id) ? ' stamped' : ''}" data-id="${dest.id}" data-name="${dest.name}" onclick="event.stopPropagation(); handleStampClick(event, +this.dataset.id, this.dataset.name)">
        ${typeof isVisited === 'function' && isVisited(dest.id) ? '&#x2714; 已打卡' : '&#x1F3AB; 玩过'}
      </button>
      <button class="btn btn--secondary" onclick="toggleCompare(${dest.id}); closeDetail();">
        &#x2B; 对比
      </button>
      <button class="btn btn--secondary" onclick="openChatWithDest('${dest.name}')">
        &#x1F4AC; 聊一聊
      </button>
      <button class="btn btn--secondary" onclick="shareDest(ACTIVE_DESTINATIONS.find(d=>d.id===${dest.id}))">
        &#x1F4E4; 分享
      </button>
      <a class="btn btn--secondary" href="dest.html?id=${dest.id}&city=${typeof currentCity !== 'undefined' ? currentCity : ''}" style="text-decoration:none;display:inline-flex;align-items:center;justify-content:center;">
        &#x1F5D7; 独立页
      </a>
    </div>
  `;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeDetail() {
  const overlay = $('.modal-overlay');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    closeDetail();
  }
  if (e.target.classList.contains('compare-modal')) {
    closeCompareModal();
  }
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDetail();
    closeCompareModal();
    closeChat();
  }
});

// ========== Compare ==========
function bindCompareEvents() {
  // Compare bar actions are handled inline
}

function toggleCompare(id) {
  const idx = state.compareList.indexOf(id);
  if (idx > -1) {
    state.compareList.splice(idx, 1);
  } else {
    if (state.compareList.length >= 3) {
      // Remove first, add new
      state.compareList.shift();
    }
    state.compareList.push(id);
  }
  updateCompareBar();
  updateCompareButtons();
}

function updateCompareButtons() {
  $$('.dest-card-compare-btn').forEach(btn => {
    const id = parseInt(btn.dataset.id);
    if (state.compareList.includes(id)) {
      btn.classList.add('active');
      btn.innerHTML = '<span class="compare-icon">&#x2713;</span> 已选';
    } else {
      btn.classList.remove('active');
      btn.innerHTML = '<span class="compare-icon">&#x2B;</span> 对比';
    }
  });
}

function updateCompareBar() {
  const bar = $('.compare-bar');
  const itemsEl = $('.compare-bar-items');

  if (state.compareList.length === 0) {
    bar.classList.remove('active');
    return;
  }

  bar.classList.add('active');

  itemsEl.innerHTML = state.compareList.map(id => {
    const dest = ACTIVE_DESTINATIONS.find(d => d.id === id);
    return `
      <div class="compare-bar-item">
        ${dest.name}
        <span class="remove" onclick="toggleCompare(${id})">&#x2715;</span>
      </div>
    `;
  }).join('');
}

function openCompareModal() {
  if (state.compareList.length < 2) return;

  const dests = state.compareList.map(id => ACTIVE_DESTINATIONS.find(d => d.id === id)).filter(Boolean);
  const modal = $('.compare-modal');

  const rows = [
    { label: '距离', key: d => d.distanceText },
    { label: '时长', key: d => d.duration.join(' / ') },
    { label: '交通', key: d => d.transport.join(' / ') },
    { label: '预算', key: d => d.budgetText },
    { label: '评分', key: d => `${d.rating} 分` },
    { label: '主题', key: d => d.themes.join('、') },
    { label: '最佳季节', key: d => d.bestSeason },
    { label: '亮点', key: d => d.highlight },
    { label: '简介', key: d => d.description },
  ];

  modal.querySelector('.compare-content').innerHTML = `
    <div class="compare-header">
      <h2>目的地对比</h2>
      <button class="compare-close" onclick="closeCompareModal()">&#x2715;</button>
    </div>
    <div style="overflow-x: auto;">
      <table class="compare-table">
        <thead>
          <tr>
            <th class="row-label"></th>
            ${dests.map(d => `<th class="dest-name">${d.name}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map(row => `
            <tr>
              <td class="row-label">${row.label}</td>
              ${dests.map(d => `<td>${row.key(d)}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCompareModal() {
  const modal = $('.compare-modal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function clearCompare() {
  state.compareList = [];
  updateCompareBar();
  updateCompareButtons();
}

// ========== Chat ==========
function bindChatEvents() {
  const fab = $('.chat-fab');
  const input = $('.chat-input');
  const sendBtn = $('.chat-send');

  fab.addEventListener('click', openChat);

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Suggestion clicks
  $$('.chat-suggestion').forEach(btn => {
    btn.addEventListener('click', () => {
      input.value = btn.textContent;
      sendMessage();
    });
  });
}

function openChat() {
  state.chatOpen = true;
  $('.chat-panel').classList.add('active');
  $('.chat-fab').classList.add('hidden');
  $('.chat-input').focus();
}

function closeChat() {
  state.chatOpen = false;
  $('.chat-panel').classList.remove('active');
  $('.chat-fab').classList.remove('hidden');
}

function openChatWithDest(name) {
  closeDetail();
  openChat();
  const input = $('.chat-input');
  input.value = `${name}怎么样？值得去吗？`;
  setTimeout(() => sendMessage(), 300);
}

// Chat history for multi-turn conversation
const chatHistory = [];

function sendMessage() {
  const input = $('.chat-input');
  const text = input.value.trim();
  if (!text) return;

  addChatMessage(text, 'user');
  input.value = '';

  chatHistory.push({ role: 'user', content: text });

  // Typing indicator
  const typing = addChatMessage('...', 'ai');
  typing.querySelector('.chat-bubble').classList.add('skeleton');
  typing.querySelector('.chat-bubble').style.width = '60px';
  typing.querySelector('.chat-bubble').style.height = '24px';

  sendToAPI(text, typing);
}

// Agent 后端：线上走 Vercel 公网函数；本机 3456（server.js）调试时走相对路径
const CHAT_API = location.port === '3456'
  ? '/api/chat'
  : 'https://weekend-go-ebon.vercel.app/api/chat';

async function sendToAPI(text, typingEl) {
  try {
    const res = await fetch(CHAT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: chatHistory.slice(-8),
        city: typeof currentCity !== 'undefined' ? currentCity : 'beijing',
      }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    // Remove typing indicator, create streaming message
    typingEl.remove();
    const msgEl = addChatMessage('', 'ai');
    const bubble = msgEl.querySelector('.chat-bubble');
    let fullText = '';

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep incomplete line in buffer

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const json = line.slice(6);
        try {
          const event = JSON.parse(json);
          if (event.type === 'text') {
            fullText += event.text;
            bubble.classList.remove('skeleton');
            bubble.innerHTML = formatChat(fullText);
            scrollChatToBottom();
          } else if (event.type === 'status' && !fullText) {
            // 等待期进度（查库/写推荐），有正文后忽略
            bubble.classList.remove('skeleton');
            bubble.style.width = '';
            bubble.style.height = '';
            bubble.innerHTML = '<em style="color:var(--text-muted);">' + formatChat(event.text) + '</em>';
            scrollChatToBottom();
          } else if (event.type === 'cards' && Array.isArray(event.items)) {
            renderChatCards(msgEl, event.items);
            scrollChatToBottom();
          } else if (event.type === 'error') {
            throw new Error(event.error);
          }
        } catch (e) {
          if (e.message && !e.message.includes('JSON')) throw e;
        }
      }
    }

    // 流结束但没有正文（如服务端超时被杀、只发了状态事件）→ 走兜底
    if (!fullText) {
      msgEl.remove();
      throw new Error('stream ended without content');
    }
    // Save assistant response to history
    chatHistory.push({ role: 'assistant', content: fullText });

  } catch (err) {
    console.warn('AI API failed, falling back to keyword matching:', err.message);
    typingEl.remove();
    const response = matchAIResponse(text);
    chatHistory.push({ role: 'assistant', content: response });
    addChatMessage(response, 'ai');
  }
}

function formatChat(text) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
}

// Agent 推荐的目的地 → 聊天气泡下的可点击小卡（点击直达详情）
function renderChatCards(msgEl, items) {
  const esc = (t) => String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  let wrap = msgEl.querySelector('.chat-dest-cards');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'chat-dest-cards';
    msgEl.appendChild(wrap);
  }
  wrap.innerHTML = items.slice(0, 4).map((it) => `
    <button type="button" class="chat-dest-card" data-id="${Number(it.id)}" data-city="${esc(it.city)}">
      <span class="chat-dest-card-name">${esc(it.name)}</span>
      <span class="chat-dest-card-meta">${esc(it.distanceText || '')}${it.rating ? ' · ⭐' + esc(it.rating) : ''}</span>
      <span class="chat-dest-card-go">看详情 ›</span>
    </button>`).join('');
  wrap.querySelectorAll('.chat-dest-card').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      const city = btn.dataset.city;
      if (typeof currentCity !== 'undefined' && city && city !== currentCity && typeof switchCity === 'function') switchCity(city);
      if (typeof openDetail === 'function') openDetail(id);
    });
  });
}

function scrollChatToBottom() {
  const messages = $('.chat-messages');
  messages.scrollTop = messages.scrollHeight;
}

function addChatMessage(text, type) {
  const messages = $('.chat-messages');
  const div = document.createElement('div');
  div.className = `chat-message chat-message--${type}`;

  // Convert markdown bold to HTML
  const html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');

  div.innerHTML = `<div class="chat-bubble">${html}</div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return div;
}

// ========== Scroll Animations ==========
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  $$('.fade-up').forEach(el => observer.observe(el));
}

// ========== Smooth scroll to section ==========
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ========== PWA Service Worker + Install Prompt ==========
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).then((reg) => {
      // Auto-reload when new SW takes over (v29+ posts SW_UPDATED message)
      navigator.serviceWorker.addEventListener('message', (e) => {
        if (e.data && e.data.type === 'SW_UPDATED') {
          if (!window.__sw_reloaded) { window.__sw_reloaded = true; location.reload(); }
        }
      });
      // Check for updates every 5 min
      setInterval(() => reg.update().catch(() => {}), 5 * 60 * 1000);
    }).catch(() => {});
  });
}

let _deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  _deferredInstallPrompt = e;
  if (localStorage.getItem('wg_install_dismissed')) return;
  showInstallBanner();
});

function showInstallBanner() {
  if (document.getElementById('wg-install-banner')) return;
  const banner = document.createElement('div');
  banner.id = 'wg-install-banner';
  banner.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#101828;color:white;padding:12px 16px;border-radius:14px;box-shadow:0 8px 24px rgba(0,0,0,.2);font-size:14px;display:flex;gap:10px;align-items:center;z-index:9999;max-width:90vw;';
  banner.innerHTML = `
    <span>📱 添加到主屏，离线也能用</span>
    <button id="wg-install-yes" style="background:#4CAF50;color:white;border:none;padding:6px 14px;border-radius:12px;font-size:13px;cursor:pointer;font-weight:700">添加</button>
    <button id="wg-install-no" style="background:transparent;color:#98A2B3;border:none;padding:6px;font-size:13px;cursor:pointer;">稍后</button>
  `;
  document.body.appendChild(banner);
  document.getElementById('wg-install-yes').onclick = async () => {
    banner.remove();
    if (_deferredInstallPrompt) {
      _deferredInstallPrompt.prompt();
      await _deferredInstallPrompt.userChoice;
      _deferredInstallPrompt = null;
    }
  };
  document.getElementById('wg-install-no').onclick = () => {
    localStorage.setItem('wg_install_dismissed', '1');
    banner.remove();
  };
}

// ========== Share ==========
function shareDest(dest) {
  const city = (typeof currentCity !== 'undefined' && currentCity) ? currentCity : '';
  const shareUrl = `${location.origin}${location.pathname.replace(/[^/]*$/,'')}dest.html?id=${dest.id}${city?`&city=${city}`:''}`;
  const durText = Array.isArray(dest.duration) ? dest.duration[0] : (dest.duration || '');
  const text = `${dest.name} - ${dest.subtitle}\n距离${dest.distanceText}，${durText}，人均${dest.budgetText || dest.budget || ''}\n⭐ ${dest.rating} | ${(dest.themes||[]).join('·')}\n\n${shareUrl}\n\n来自「周末去哪儿」`;

  if (navigator.share) {
    navigator.share({ title: `周末去哪儿 | ${dest.name}`, text, url: shareUrl }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text).then(() => {
      showToast('✓ 已复制（含详情页链接）');
    }).catch(() => {
      showToast('分享失败，请手动复制');
    });
  }
}

function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 2500);
}

// ========== Global Search (⌘K / 🔍) ==========
// 热门词由 cities-dataset.js 派生自 CITIES.hotWords。新增城市 → 改 config/cities.js
const SEARCH_HOT_WORDS = (typeof window !== 'undefined' && window.SEARCH_HOT_WORDS) ? window.SEARCH_HOT_WORDS : {
  beijing: ['故宫', '长城', '环球影城', '颐和园', '古北水镇', '798', '雍和宫', '锁龙井'],
  shenzhen: ['大梅沙', '世界之窗', '东部华侨城', '深圳湾', '甘坑', '大鹏所城', '红树林'],
  weihai: ['刘公岛', '那香海', '威海湾', '成山头', '国际海水浴场'],
  suzhou: ['拙政园', '平江路', '山塘街', '虎丘', '同里古镇', '金鸡湖']
};

let _searchAllIndex = null;
let _searchHighlighted = -1;

function buildSearchIndex() {
  if (_searchAllIndex) return _searchAllIndex;
  const all = [];
  Object.keys(CITY_DATA).forEach(cityKey => {
    let list = [];
    try { list = CITY_DATA[cityKey].build() || []; } catch (_) {}
    list.forEach(d => {
      const themes = Array.isArray(d.themes) ? d.themes : [];
      const tags = Array.isArray(d.tags) ? d.tags : [];
      all.push({
        type: 'dest',
        id: d.id,
        city: cityKey,
        cityLabel: CITY_DATA[cityKey].label,
        name: d.name || '',
        subtitle: d.subtitle || '',
        image: (typeof getImage === 'function' ? getImage(d) : '') || d.image || '',
        themes,
        tags,
        rating: typeof d.rating === 'number' ? d.rating / 5 : 0,
        distance: d.distance,
        budget: d.budget,
        searchText: [
          d.name, d.subtitle,
          themes.join(' '),
          tags.join(' '),
          d.distanceText,
          d.budgetText
        ].filter(Boolean).join(' ').toLowerCase()
      });
    });
  });
  if (typeof LEGENDS_DATA !== 'undefined' && Array.isArray(LEGENDS_DATA)) {
    LEGENDS_DATA.forEach(l => {
      all.push({
        type: 'legend',
        id: l.id,
        city: 'beijing',
        cityLabel: '另一面·北京',
        name: l.name || '',
        subtitle: l.subtitle || l.vibe || '',
        image: (typeof getLegendImage === 'function' ? getLegendImage(l.id) : '') || '',
        vibe: l.vibe || '',
        vibeIcon: l.vibeIcon || '🌙',
        searchText: [
          l.name, l.subtitle, l.vibe, l.storyBrief,
          Array.isArray(l.tags) ? l.tags.join(' ') : ''
        ].filter(Boolean).join(' ').toLowerCase()
      });
    });
  }
  _searchAllIndex = all;
  return all;
}

function _highlight(text, q) {
  if (!q) return text;
  const safe = String(text).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  const qLower = q.toLowerCase();
  const tLower = safe.toLowerCase();
  const idx = tLower.indexOf(qLower);
  if (idx < 0) return safe;
  return safe.slice(0, idx) + '<mark>' + safe.slice(idx, idx + q.length) + '</mark>' + safe.slice(idx + q.length);
}

function openSearch() {
  buildSearchIndex();
  const overlay = document.getElementById('search-overlay');
  if (!overlay) return;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  const input = document.getElementById('search-input');
  if (input) {
    input.value = '';
    setTimeout(() => input.focus(), 40);
  }
  renderHotWords();
  performSearch('');
}

function closeSearch() {
  const overlay = document.getElementById('search-overlay');
  if (!overlay) return;
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  _searchHighlighted = -1;
}

// Hero quick-filter chip — 直接 set duration 并跳转到结果区
function heroQuickFilter(cat, val) {
  if (!state || !state.filters || !state.filters[cat]) return;
  // 单选模式（覆盖既有）
  state.filters[cat] = [val];
  document.querySelectorAll('.filter-tag').forEach(tag => {
    if (tag.dataset.category === cat) {
      tag.classList.toggle('active', tag.dataset.value === val);
    }
  });
  document.querySelectorAll('.hero-qf-chip').forEach(c => {
    c.classList.toggle('active', c.textContent.trim() === val);
  });
  if (typeof applyFilters === 'function') applyFilters();
  // 自动展开 filter body 让用户能继续微调
  const body = document.querySelector('.filter-body');
  if (body && body.classList.contains('collapsed') && typeof toggleFilters === 'function') toggleFilters();
  if (typeof scrollToSection === 'function') scrollToSection('filters');
}

// "随便去哪儿" — 从当前城市的 ACTIVE_DESTINATIONS 随机选一个 + 打开 detail
function randomDestination() {
  if (typeof ACTIVE_DESTINATIONS === 'undefined' || !ACTIVE_DESTINATIONS.length) return;
  // 只从内容扎实的池子里抽（空壳详情不进随机），再偏向 rating ≥ 4.5
  const quality = typeof getQualityPool === 'function' ? getQualityPool() : [];
  const base = quality.length >= 5 ? quality : ACTIVE_DESTINATIONS;
  const pool = base.filter(d => (d.rating || 0) >= 4.5);
  const arr = pool.length >= 5 ? pool : base;
  const pick = arr[Math.floor(Math.random() * arr.length)];
  if (!pick) return;
  // 按钮 dice spin 动画
  const btn = document.querySelector('.btn--random');
  if (btn) {
    btn.classList.add('spinning');
    setTimeout(() => btn.classList.remove('spinning'), 450);
  }
  // 延迟 320ms 让用户看到动画再打开
  setTimeout(() => {
    if (typeof openDetail === 'function') openDetail(pick.id);
  }, 320);
}

// B1 · Hero 搜索框 → 打开 overlay 并把已输入字符带过去
let _heroSearchActivating = false;
function heroSearchActivate() {
  if (_heroSearchActivating) return;
  _heroSearchActivating = true;
  const heroInp = document.getElementById('hero-search-input');
  const seed = heroInp ? heroInp.value : '';
  hideHeroRecent(true);
  openSearch();
  // wait for overlay focus to settle, then prefill + perform
  setTimeout(() => {
    const overlayInp = document.getElementById('search-input');
    if (overlayInp) {
      overlayInp.value = seed;
      try {
        overlayInp.setSelectionRange(seed.length, seed.length);
      } catch(e){}
      if (typeof performSearch === 'function') performSearch(seed);
    }
    if (heroInp) heroInp.value = '';
    _heroSearchActivating = false;
  }, 60);
}

// B4+B1 联动 · Hero search focus 显示 Recent mini dropdown（不立即开 overlay）
function onHeroSearchFocus() {
  const inp = document.getElementById('hero-search-input');
  // 已有输入：直接打开 overlay 走主流程
  if (inp && inp.value) { heroSearchActivate(); return; }
  showHeroRecent();
}
function onHeroSearchBlur() {
  // 200ms 延迟让 onmousedown 先触发 applyHeroRecent
  setTimeout(() => hideHeroRecent(), 220);
}
function showHeroRecent() {
  const dd = document.getElementById('hero-recent-dd');
  if (!dd) return;
  const recent = (typeof readRecentSearches === 'function') ? readRecentSearches() : [];
  if (!recent.length) {
    // 空状态：提示用户搜索后会出现历史
    dd.innerHTML = `<div class="hero-recent-empty">暂无历史，输入关键词或按 ⌘K 打开高级搜索</div>`;
  } else {
    dd.innerHTML = `
      <div class="hero-recent-title">
        <span>最近搜过 · ${recent.length}</span>
        <button class="hero-recent-clear" type="button" onmousedown="event.preventDefault(); clearRecentSearches(); showHeroRecent();">清空</button>
      </div>` +
      recent.map(w => `<button class="hero-recent-item" type="button" onmousedown="event.preventDefault(); applyHeroRecent(${JSON.stringify(w)})">
        <span class="hero-recent-item-icon">&#x1F551;</span><span>${w}</span>
      </button>`).join('');
  }
  dd.classList.add('open');
  dd.setAttribute('aria-hidden', 'false');
}
function hideHeroRecent(immediate) {
  const dd = document.getElementById('hero-recent-dd');
  if (!dd) return;
  dd.classList.remove('open');
  dd.setAttribute('aria-hidden', 'true');
}
function applyHeroRecent(q) {
  const inp = document.getElementById('hero-search-input');
  if (inp) inp.value = q;
  hideHeroRecent(true);
  heroSearchActivate();
}

// B4 · Recent searches (localStorage, FIFO 5)
const RECENT_SEARCH_KEY = 'weekend-go-recent-searches';
const RECENT_SEARCH_MAX = 5;
function readRecentSearches() {
  try {
    const raw = localStorage.getItem(RECENT_SEARCH_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter(s => typeof s === 'string' && s.trim()) : [];
  } catch (e) { return []; }
}
function recordRecentSearch(q) {
  q = (q || '').trim();
  if (!q || q.length > 40) return;
  let arr = readRecentSearches();
  arr = arr.filter(x => x !== q);
  arr.unshift(q);
  arr = arr.slice(0, RECENT_SEARCH_MAX);
  try { localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(arr)); } catch(e){}
}
function clearRecentSearches() {
  try { localStorage.removeItem(RECENT_SEARCH_KEY); } catch(e){}
  renderHotWords();
}
function applyRecentSearch(q) {
  const inp = document.getElementById('search-input');
  if (inp) inp.value = q;
  if (typeof performSearch === 'function') performSearch(q);
}

function renderHotWords() {
  const hotEl = document.getElementById('search-hot');
  if (!hotEl) return;
  const words = SEARCH_HOT_WORDS[currentCity] || SEARCH_HOT_WORDS.beijing;
  const recent = readRecentSearches();
  const recentBlock = recent.length ? `
    <div class="search-recent-row">
      <div class="search-recent-title">最近搜过 <button class="search-recent-clear" onclick="clearRecentSearches()" type="button">清空</button></div>
      <div class="search-recent-chips">
        ${recent.map(w => `<span class="search-recent-chip" onclick="applyRecentSearch(${JSON.stringify(w)})">&#x1F551; ${w}</span>`).join('')}
      </div>
    </div>` : '';
  hotEl.innerHTML = `
    ${recentBlock}
    <div class="search-hot-title">热门搜索 · ${CITY_DATA[currentCity]?.label || '全部'}</div>
    ${words.map(w => `<span class="search-hot-chip" onclick="document.getElementById('search-input').value='${w}'; performSearch('${w}');">${w}</span>`).join('')}
  `;
}

// Active theme facet filter (set by clicking facet chip)
let _searchActiveFacet = null;
// Advanced filter state
const _searchAdv = {
  maxDist: 500,
  budgets: new Set(),    // empty = no filter
  cities: new Set(),     // empty = no filter
  sort: 'relevance'
};

function _searchReApply() {
  const inp = document.getElementById('search-input');
  if (inp) performSearch(inp.value);
}

function setSearchDistance(val) {
  _searchAdv.maxDist = parseInt(val, 10);
  const valEl = document.getElementById('search-dist-val');
  if (valEl) valEl.textContent = _searchAdv.maxDist + 'km';
  _searchReApply();
}
function toggleSearchBudget(budget) {
  if (_searchAdv.budgets.has(budget)) _searchAdv.budgets.delete(budget);
  else _searchAdv.budgets.add(budget);
  _searchRenderAdvChips();
  _searchReApply();
}
function toggleSearchCity(city) {
  if (_searchAdv.cities.has(city)) _searchAdv.cities.delete(city);
  else _searchAdv.cities.add(city);
  _searchRenderAdvChips();
  _searchReApply();
}
function setSearchSort(val) {
  _searchAdv.sort = val;
  _searchReApply();
}

function _searchGetCities() {
  try { return (0, eval)('typeof CITIES !== "undefined" ? CITIES : []'); }
  catch { return []; }
}

function _searchRenderAdvChips() {
  const bBox = document.getElementById('search-budget-chips');
  if (bBox) {
    const tiers = ['200以下', '200-500', '500-1000', '1000以上'];
    bBox.innerHTML = tiers.map(t => `<span class="search-adv-chip ${_searchAdv.budgets.has(t)?'active':''}" onclick="toggleSearchBudget('${t}')">¥${t}</span>`).join('');
  }
  const cBox = document.getElementById('search-city-chips');
  if (cBox) {
    const cs = _searchGetCities();
    cBox.innerHTML = cs.map(c => `<span class="search-adv-chip ${_searchAdv.cities.has(c.key)?'active':''}" onclick="toggleSearchCity('${c.key}')">${c.emoji} ${c.name}</span>`).join('');
  }
}

// Expose to window so inline onclick works across scripts
window.toggleSearchBudget = toggleSearchBudget;
window.toggleSearchCity = toggleSearchCity;
window.setSearchDistance = setSearchDistance;
window.setSearchSort = setSearchSort;

function initSearchAdvanced() {
  _searchRenderAdvChips();
  const distInp = document.getElementById('search-dist');
  if (distInp) distInp.addEventListener('input', () => setSearchDistance(distInp.value));
  const sortSel = document.getElementById('search-sort');
  if (sortSel) sortSel.addEventListener('change', () => setSearchSort(sortSel.value));
  const toggleBtn = document.getElementById('search-adv-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const panel = document.getElementById('search-advanced');
      const caret = document.getElementById('search-adv-caret');
      const show = panel.style.display === 'none';
      panel.style.display = show ? 'block' : 'none';
      if (caret) caret.textContent = show ? '▲' : '▼';
    });
  }
}
// Wait for CITIES to load + search DOM — try multiple triggers
function _searchAdvInitSafe() {
  try {
    initSearchAdvanced();
    window.__searchAdvInited = true;
  } catch (e) {
    window.__searchAdvErr = String(e && e.stack || e);
  }
}
if (document.readyState === 'complete') {
  _searchAdvInitSafe();
} else {
  window.addEventListener('DOMContentLoaded', _searchAdvInitSafe);
  window.addEventListener('load', _searchAdvInitSafe);
}
// Re-render chips whenever search overlay opens
document.addEventListener('click', (e) => {
  if (e.target.closest('.nav-btn--icon') || e.target.classList.contains('search-hot-chip')) {
    setTimeout(_searchAdvInitSafe, 10);
  }
});

function performSearch(q) {
  const resultsEl = document.getElementById('search-results');
  const metaEl = document.getElementById('search-meta');
  const hotEl = document.getElementById('search-hot');
  const facetEl = document.getElementById('search-facets');
  if (!resultsEl) return;
  const index = buildSearchIndex();
  const qTrim = (q || '').trim().toLowerCase();

  if (!qTrim && !_searchActiveFacet) {
    resultsEl.innerHTML = '';
    if (metaEl) metaEl.textContent = `在 ${CITY_DATA[currentCity]?.label || '全部城市'} · 输入关键词或点击主题筛选`;
    if (hotEl) hotEl.style.display = 'block';
    if (facetEl) facetEl.innerHTML = '';
    _searchHighlighted = -1;
    return;
  }

  if (hotEl) hotEl.style.display = 'none';

  // Multi-token AND search — split by whitespace, all tokens must hit somewhere
  const tokens = qTrim ? qTrim.split(/\s+/).filter(Boolean) : [];

  const scored = [];
  const themeCounts = {}; // facet distribution
  for (const item of index) {
    const name = (item.name || '').toLowerCase();
    const allText = item.searchText || '';

    // Token matching: every token must appear in name or searchText
    let tokenPass = true;
    let baseScore = 0;
    for (const tk of tokens) {
      if (name === tk) baseScore += 100;
      else if (name.startsWith(tk)) baseScore += 40;
      else if (name.includes(tk)) baseScore += 25;
      else if (allText.includes(tk)) baseScore += 10;
      else { tokenPass = false; break; }
    }
    if (!tokenPass) continue;
    // If no tokens but facet filter active, accept all
    if (tokens.length === 0) baseScore = 1;

    // Facet filter (theme)
    if (_searchActiveFacet) {
      const itemThemes = item.themes || [];
      if (!itemThemes.includes(_searchActiveFacet)) continue;
      baseScore += 5;
    }

    // Advanced: distance filter
    if (typeof item.distance === 'number' && item.distance > _searchAdv.maxDist) continue;

    // Advanced: budget multi-select (empty set = no filter)
    if (_searchAdv.budgets.size && item.type !== 'legend') {
      if (!_searchAdv.budgets.has(item.budget)) continue;
    }

    // Advanced: city multi-select (empty set = use currentCity bonus only)
    if (_searchAdv.cities.size) {
      if (!_searchAdv.cities.has(item.city)) continue;
    } else {
      if (item.city === currentCity) baseScore += 10;
    }

    if (item.type === 'legend' && !isOtherSide()) baseScore -= 2;
    if (item.rating) baseScore += item.rating;

    // Count themes for facet chips (only on unfiltered)
    for (const t of item.themes || []) {
      themeCounts[t] = (themeCounts[t] || 0) + 1;
    }

    scored.push({ ...item, score: baseScore });
  }
  // Sort by selected mode
  if (_searchAdv.sort === 'rating') {
    scored.sort((a,b) => (b.rating||0) - (a.rating||0) || b.score - a.score);
  } else if (_searchAdv.sort === 'distance') {
    scored.sort((a,b) => (a.distance||999) - (b.distance||999));
  } else if (_searchAdv.sort === 'budget') {
    const BUDGET_ORDER = ['200以下','200-500','500-1000','1000以上'];
    scored.sort((a,b) => BUDGET_ORDER.indexOf(a.budget||'200-500') - BUDGET_ORDER.indexOf(b.budget||'200-500'));
  } else {
    scored.sort((a, b) => b.score - a.score);
  }
  const top = scored.slice(0, 30);

  // Render facet chips (top 8 themes by count)
  if (facetEl) {
    const chips = Object.entries(themeCounts)
      .sort((a,b) => b[1] - a[1])
      .slice(0, 8);
    facetEl.innerHTML = chips.map(([t, n]) => `
      <span class="search-facet-chip ${_searchActiveFacet === t ? 'active' : ''}" onclick="toggleFacet('${t.replace(/'/g,'\\\'')}')">${t}<span class="search-facet-count">${n}</span></span>
    `).join('');
    if (_searchActiveFacet) {
      facetEl.insertAdjacentHTML('afterbegin', `<span class="search-facet-chip active" onclick="clearFacet()">清除 ✕</span>`);
    }
  }

  if (metaEl) metaEl.textContent = `共 ${scored.length} 个结果${scored.length > 30 ? '（显示前 30）' : ''}`;

  if (top.length === 0) {
    resultsEl.innerHTML = `
      <div class="search-empty">
        <div class="search-empty-title">没找到「${q}」相关的结果</div>
        <div style="font-size:12px">换个关键词试试，或看看下面的热门词</div>
      </div>`;
    if (hotEl) hotEl.style.display = 'block';
    return;
  }

  resultsEl.innerHTML = top.map((it, i) => {
    const cityTag = it.type === 'legend'
      ? `<span class="search-result-tag search-result-tag--legend">${it.vibeIcon} 另一面</span>`
      : `<span class="search-result-tag search-result-tag--city">${CITY_DATA[it.city]?.label.replace('周边游','') || it.city}</span>`;
    const thumb = it.image
      ? `<img class="search-result-thumb" src="${it.image}" loading="lazy" alt="${it.name}">`
      : `<div class="search-result-thumb" style="display:flex;align-items:center;justify-content:center;font-size:22px">${it.vibeIcon || '📍'}</div>`;
    // 信息密度提升：加 distance / rating / heat micro chip
    const metaChips = [];
    if (it.type !== 'legend') {
      if (it.distanceText) metaChips.push(`<span class="search-result-meta-chip">&#x1F4CD; ${it.distanceText}</span>`);
      if (it.rating) metaChips.push(`<span class="search-result-meta-chip">&#x2B50; ${it.rating}</span>`);
      const heat = (it.xhsHeat && typeof it.xhsHeat === 'object') ? it.xhsHeat.heat : it.xhsHeat;
      if (heat && heat >= 60) metaChips.push(`<span class="search-result-meta-chip search-result-meta-hot">&#x1F525; ${heat}</span>`);
    } else {
      if (it.heat) metaChips.push(`<span class="search-result-meta-chip">&#x1F319; ${it.heat}</span>`);
      if (it.vibe) metaChips.push(`<span class="search-result-meta-chip">${it.vibe}</span>`);
    }
    const metaRow = metaChips.length ? `<div class="search-result-meta">${metaChips.join('')}</div>` : '';
    return `
      <div class="search-result-item" data-idx="${i}" onclick="jumpToResult(${i})">
        ${thumb}
        <div class="search-result-body">
          <div class="search-result-title">${cityTag}${_highlight(it.name, q)}</div>
          <div class="search-result-sub">${_highlight(it.subtitle, q)}</div>
          ${metaRow}
        </div>
      </div>`;
  }).join('');
  _searchResultsCache = top;
  _searchHighlighted = -1;
}

function isOtherSide() {
  return document.body.classList.contains('world-flipped') || document.body.classList.contains('otherside-active');
}

function toggleFacet(theme) {
  _searchActiveFacet = _searchActiveFacet === theme ? null : theme;
  const inp = document.getElementById('search-input');
  performSearch(inp ? inp.value : '');
}
function clearFacet() {
  _searchActiveFacet = null;
  const inp = document.getElementById('search-input');
  performSearch(inp ? inp.value : '');
}

let _searchResultsCache = [];
function jumpToResult(idx) {
  const it = _searchResultsCache[idx];
  if (!it) return;
  // B4 · 命中即记录用户当前 query
  const _curInp = document.getElementById('search-input');
  if (_curInp && typeof recordRecentSearch === 'function') recordRecentSearch(_curInp.value);
  closeSearch();
  if (it.type === 'legend') {
    const targetCity = it.city || 'beijing';
    if (currentCity !== targetCity) switchCity(targetCity);
    if (!isOtherSide() && typeof flipWorld === 'function') flipWorld();
    setTimeout(() => {
      if (typeof openLegendDetail === 'function') openLegendDetail(it.id);
      else {
        const card = document.querySelector(`[data-legend-id="${it.id}"]`);
        if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, isOtherSide() ? 100 : 700);
    return;
  }
  if (it.city !== currentCity) switchCity(it.city);
  setTimeout(() => openDetail(it.id), 150);
}

function handleSearchKey(e) {
  const items = document.querySelectorAll('.search-result-item');
  if (e.key === 'Escape') { closeSearch(); return; }
  if (e.key === 'Enter') {
    const idx = _searchHighlighted >= 0 ? _searchHighlighted : 0;
    if (_searchResultsCache[idx]) jumpToResult(idx);
    return;
  }
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    if (items.length === 0) return;
    _searchHighlighted = e.key === 'ArrowDown'
      ? Math.min(items.length - 1, _searchHighlighted + 1)
      : Math.max(0, _searchHighlighted - 1);
    items.forEach((el, i) => el.classList.toggle('highlighted', i === _searchHighlighted));
    items[_searchHighlighted]?.scrollIntoView({ block: 'nearest' });
  }
}

document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    openSearch();
  } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
    e.preventDefault();
    openSearch();
  }
});
