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
  const badge = document.getElementById('hero-badge');
  if (badge) badge.innerHTML = cityInfo.badge;
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
  applyFilters(); // renders destinations and updates filter count accurately
  initScrollAnimations();
  updateCollectionProgress();
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
          <span class="dest-card-source">${dest.source}</span>
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
        <div class="dest-card-desc">${dest.description}</div>
        ${heatBar}
        <div class="dest-card-tags">
          ${dest.transport.slice(1).map(t => `<span class="dest-card-tag tag-transport">${transportIcons[t] || '\u{1F6A9}'} ${t}</span>`).join('')}
          ${dest.themes.map(t => `<span class="dest-card-tag tag-theme">${themeIcons[t] || '\u{1F3AF}'} ${t}</span>`).join('')}
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

  const xhsCityMap = { shenzhen: typeof XHS_HEAT_SZ !== 'undefined' ? XHS_HEAT_SZ : null, weihai: typeof XHS_HEAT_WH !== 'undefined' ? XHS_HEAT_WH : null };
  const xhs = (xhsCityMap[currentCity] && xhsCityMap[currentCity][dest.name]) || (typeof XHS_HEAT !== 'undefined' ? XHS_HEAT[dest.name] : null);
  const heatBar = xhs ? `
    <div class="modal-heat">
      <div class="modal-heat-label">&#x1F525; 小红书声量</div>
      <div class="modal-heat-bar"><div class="modal-heat-fill" style="width: ${xhs.heat}%"></div></div>
      <div class="modal-heat-info">${xhs.notes} 篇笔记 &middot; ${xhs.trending}</div>
    </div>` : '';

  // Format content with line breaks
  const fmt = (text) => text ? text.split('\n').map(line => {
    line = line.trim();
    if (!line) return '';
    if (/^\d+[\.\、]/.test(line)) {
      return `<div class="content-item">${line}</div>`;
    }
    return `<p>${line}</p>`;
  }).join('') : '';

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
        <p>${dest.overview}</p>
      </div>

      <div class="modal-cards-row">
        <div class="modal-info-card">
          <div class="modal-info-card-header" style="background: linear-gradient(135deg, #E8F5E9, #C8E6C9)">
            <span class="modal-info-card-icon">&#x1F3AF;</span>
            <h4>推荐怎么玩</h4>
          </div>
          <div class="modal-info-card-body">${fmt(dest.whatToDo)}</div>
        </div>

        <div class="modal-info-card">
          <div class="modal-info-card-header" style="background: linear-gradient(135deg, #FFF3E0, #FFE0B2)">
            <span class="modal-info-card-icon">&#x1F37D;</span>
            <h4>必吃美食</h4>
          </div>
          <div class="modal-info-card-body">${fmt(dest.whereToEat)}</div>
        </div>
      </div>

      <div class="modal-detail-sections">
        <details class="modal-details" open>
          <summary>&#x1F697; 交通攻略</summary>
          <div class="modal-details-body">${fmt(dest.howToGet)}</div>
        </details>

        <details class="modal-details">
          <summary>&#x1F3E8; 住宿推荐</summary>
          <div class="modal-details-body">${fmt(dest.whereToStay)}</div>
        </details>

        <details class="modal-details">
          <summary>&#x1F4A1; 出行贴士</summary>
          <div class="modal-details-body">${fmt(dest.tips)}</div>
        </details>
      </div>

      <div class="modal-highlight">
        <span class="modal-highlight-icon">&#x2728;</span>
        <div>
          <strong>${dest.highlight}</strong>
          <span class="modal-highlight-season">${dest.bestSeason}</span>
        </div>
      </div>

      ${(() => {
        const voices = typeof getXhsVoices === 'function' ? getXhsVoices(dest.name) : [];
        if (!voices.length) return '';
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

async function sendToAPI(text, typingEl) {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: chatHistory }),
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
            bubble.innerHTML = formatChat(fullText);
            scrollChatToBottom();
          } else if (event.type === 'error') {
            throw new Error(event.error);
          }
        } catch (e) {
          if (e.message && !e.message.includes('JSON')) throw e;
        }
      }
    }

    // Save assistant response to history
    if (fullText) {
      chatHistory.push({ role: 'assistant', content: fullText });
    }

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

// ========== PWA Service Worker ==========
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
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

function renderHotWords() {
  const hotEl = document.getElementById('search-hot');
  if (!hotEl) return;
  const words = SEARCH_HOT_WORDS[currentCity] || SEARCH_HOT_WORDS.beijing;
  hotEl.innerHTML = `
    <div class="search-hot-title">热门搜索 · ${CITY_DATA[currentCity]?.label || '全部'}</div>
    ${words.map(w => `<span class="search-hot-chip" onclick="document.getElementById('search-input').value='${w}'; performSearch('${w}');">${w}</span>`).join('')}
  `;
}

// Active theme facet filter (set by clicking facet chip)
let _searchActiveFacet = null;

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

    if (item.city === currentCity) baseScore += 10;
    if (item.type === 'legend' && !isOtherSide()) baseScore -= 2;
    if (item.rating) baseScore += item.rating;

    // Count themes for facet chips (only on unfiltered)
    for (const t of item.themes || []) {
      themeCounts[t] = (themeCounts[t] || 0) + 1;
    }

    scored.push({ ...item, score: baseScore });
  }
  scored.sort((a, b) => b.score - a.score);
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
    return `
      <div class="search-result-item" data-idx="${i}" onclick="jumpToResult(${i})">
        ${thumb}
        <div class="search-result-body">
          <div class="search-result-title">${cityTag}${_highlight(it.name, q)}</div>
          <div class="search-result-sub">${_highlight(it.subtitle, q)}</div>
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
  closeSearch();
  if (it.type === 'legend') {
    if (currentCity !== 'beijing') switchCity('beijing');
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
