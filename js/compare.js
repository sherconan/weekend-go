// compare.js — 3 个 dest 并排对比
(function(){
  'use strict';

  function g(name) {
    try { return (0, eval)('typeof ' + name + ' !== "undefined" ? ' + name + ' : undefined'); }
    catch { return undefined; }
  }

  const SOURCE_VARS = [
    ['DESTINATIONS','beijing'],['DESTINATIONS_EXTRA','beijing'],['DESTINATIONS_EXTRA2','beijing'],
    ['DESTINATIONS_BJ500','beijing'],['DESTINATIONS_BJ_EXPAND','beijing'],['DESTINATIONS_BJ_HIDDEN','beijing'],
    ['DESTINATIONS_BJ_TALES','beijing'],['DESTINATIONS_BJ_2026','beijing'],
    ['DESTINATIONS_SZ','shenzhen'],['DESTINATIONS_WH','weihai'],['DESTINATIONS_SU','suzhou'],
    ['DESTINATIONS_TJ','tianjin'],['DESTINATIONS_QD','qingdao'],['DESTINATIONS_CD','chengdu'],['DESTINATIONS_HZ','hangzhou']
  ];

  function loadAll() {
    const seen = new Set();
    const out = [];
    for (const [v, city] of SOURCE_VARS) {
      const arr = g(v);
      if (!Array.isArray(arr)) continue;
      for (const d of arr) {
        if (!d || !d.name || seen.has(d.name)) continue;
        seen.add(d.name);
        out.push(Object.assign({}, d, { _city: city }));
      }
    }
    // shared
    const shared = g('SHARED_CROSS_CITY_DESTS') || [];
    for (const s of shared) {
      if (!s.cities || seen.has(s.name)) continue;
      const firstCity = Object.keys(s.cities)[0];
      const v = s.cities[firstCity];
      out.push(Object.assign({}, s, v, { _city: firstCity, _shared: true }));
      seen.add(s.name);
    }
    return out;
  }

  const ALL = loadAll();
  const selected = []; // max 3

  function findById(id) {
    return ALL.find(d => String(d.id) === String(id));
  }

  function parseIdsFromUrl() {
    const p = new URLSearchParams(location.search);
    const raw = p.get('ids');
    if (!raw) return [];
    return raw.split(',').filter(Boolean).map(s => s.trim());
  }

  function syncUrl() {
    const p = new URLSearchParams(location.search);
    p.set('ids', selected.map(d => d.id).join(','));
    history.replaceState(null, '', location.pathname + '?' + p.toString());
  }

  function updateCounter() {
    const el = document.getElementById('picker-counter');
    if (el) el.textContent = `(${selected.length}/3)`;
  }

  function renderSelected() {
    const box = document.getElementById('picker-selected');
    box.innerHTML = selected.map((d, i) => {
      const cities = g('CITIES') || [];
      const c = cities.find(x => x.key === d._city);
      const ce = c ? c.emoji : '📍';
      return `<span class="picker-chip">${ce} ${d.name}<span class="picker-chip-x" data-idx="${i}">✕</span></span>`;
    }).join('');
    box.querySelectorAll('.picker-chip-x').forEach(el => {
      el.addEventListener('click', () => {
        selected.splice(parseInt(el.dataset.idx, 10), 1);
        renderSelected();
        renderCompare();
        updateCounter();
        syncUrl();
      });
    });
    updateCounter();
  }

  function onSearchInput() {
    const input = document.getElementById('picker-input');
    const results = document.getElementById('picker-results');
    const q = input.value.trim().toLowerCase();
    if (!q) { results.classList.remove('open'); results.innerHTML = ''; return; }
    const hits = ALL.filter(d =>
      String(d.name).toLowerCase().includes(q) ||
      (d.subtitle || '').toLowerCase().includes(q)
    ).slice(0, 12);
    if (!hits.length) { results.innerHTML = '<div class="picker-result-item" style="color:#999;">没找到匹配</div>'; results.classList.add('open'); return; }
    const cities = g('CITIES') || [];
    results.innerHTML = hits.map(d => {
      const c = cities.find(x => x.key === d._city);
      const ce = c ? c.emoji : '📍';
      const already = selected.some(s => s.id === d.id);
      const disabled = already || selected.length >= 3;
      return `<div class="picker-result-item" data-id="${d.id}" style="${disabled?'opacity:0.45;cursor:not-allowed;':''}">${ce} <strong>${d.name}</strong> <span style="color:#999;margin-left:4px;">${d.subtitle || ''}</span>${already?' <span style="color:var(--brand);margin-left:auto;font-size:11px;">已加入</span>':''}</div>`;
    }).join('');
    results.classList.add('open');
    results.querySelectorAll('.picker-result-item').forEach(el => {
      el.addEventListener('click', () => {
        if (selected.length >= 3) { toast('最多 3 个'); return; }
        const id = el.dataset.id;
        if (!id) return;
        if (selected.some(s => String(s.id) === String(id))) { toast('已添加过了'); return; }
        const d = findById(id);
        if (!d) return;
        selected.push(d);
        input.value = '';
        results.classList.remove('open');
        renderSelected();
        renderCompare();
        syncUrl();
      });
    });
  }

  // ------ compare render ------
  function valOrDash(v) { return (v == null || v === '') ? '—' : v; }

  function renderCompare() {
    const box = document.getElementById('compare-container');
    if (!selected.length) {
      box.innerHTML = '<div class="empty"><h2>还没选目的地</h2><p>搜索添加 2-3 个目的地，立即看到横向对比</p></div>';
      return;
    }

    const cities = g('CITIES') || [];

    // Build comparison matrix
    const rows = [
      { label: '📍 距离', key: 'distance', format: (d) => d.distanceText || (d.distance != null ? d.distance + 'km' : '—'), compare: (a,b) => a.distance - b.distance, bestIsLow: true },
      { label: '⭐ 评分', key: 'rating', format: (d) => d.rating || '—', compare: (a,b) => b.rating - a.rating, bestIsLow: false },
      { label: '💰 预算', key: 'budget', format: (d) => d.budgetText || d.budget || '—' },
      { label: '⏱ 时长', key: 'duration', format: (d) => [].concat(d.duration || []).join(' / ') || '—' },
      { label: '🌤 最佳时节', key: 'bestSeason', format: (d) => d.bestSeason || '—' },
      { label: '🎯 主题', key: 'themes', format: (d) => (d.themes || []).map(t => `<span class="chip">${t}</span>`).join('') || '—' },
      { label: '🚆 交通', key: 'transport', format: (d) => [].concat(d.transport || []).join(' / ') || '—' },
      { label: '🍜 吃', key: 'whereToEat', format: (d) => (d.whereToEat || '—').slice(0, 80) + (d.whereToEat && d.whereToEat.length > 80 ? '...' : '') },
      { label: '🏨 住', key: 'whereToStay', format: (d) => (d.whereToStay || '—').slice(0, 80) + (d.whereToStay && d.whereToStay.length > 80 ? '...' : '') },
      { label: '✨ 看点', key: 'highlight', format: (d) => d.highlight || '—' },
      { label: '💡 xhsQuote', key: 'xhsQuote', format: (d) => d.xhsQuote || '—' },
    ];

    // Pre-compute winners for rows with compare fn
    const winners = {};
    for (const row of rows) {
      if (!row.compare) continue;
      const scored = selected.map(d => ({d, v: (typeof d[row.key] === 'number') ? d[row.key] : null})).filter(x => x.v != null);
      if (!scored.length) continue;
      scored.sort((a,b) => row.compare(a.d, b.d));
      winners[row.key] = scored[0].d.id;
    }

    const headers = selected.map(d => {
      const c = cities.find(x => x.key === d._city);
      const ce = c ? c.emoji : '📍';
      const cName = c ? c.name : d._city;
      return `<td class="dest-header">
        <div class="name">${ce} ${d.name}</div>
        <div class="sub">${cName}</div>
        <a href="dest.html?id=${d.id}&city=${d._city}" style="display:inline-block;margin-top:6px;color:white;opacity:.85;font-size:11px;text-decoration:underline;">查看详情 →</a>
      </td>`;
    }).join('');

    const rowsHtml = rows.map(row => {
      const cells = selected.map(d => {
        const isWinner = winners[row.key] === d.id;
        return `<td>${isWinner ? '<span class="best">🏆 </span>' : ''}${row.format(d)}</td>`;
      }).join('');
      return `<tr><th>${row.label}</th>${cells}</tr>`;
    }).join('');

    box.innerHTML = `
      <div class="compare-wrap">
        <table class="compare-table">
          <thead><tr><th></th>${headers}</tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
      <div style="margin-top:16px;display:flex;gap:10px;">
        <button onclick="location.href='planner.html'" style="background:var(--brand);color:white;border:none;padding:10px 20px;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;">📋 去做行程</button>
        <button id="copy-link-btn" style="background:var(--surface);color:var(--ink-700);border:1.5px solid var(--border);padding:10px 20px;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;">🔗 复制对比链接</button>
      </div>
    `;

    const copyBtn = document.getElementById('copy-link-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const url = location.href;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(() => toast('✓ 已复制对比链接'));
        } else {
          toast(url);
        }
      });
    }
  }

  let toastTimer;
  function toast(msg) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
  }

  function init() {
    // Pre-load from URL
    const ids = parseIdsFromUrl();
    for (const id of ids) {
      const d = findById(id);
      if (d && selected.length < 3) selected.push(d);
    }
    renderSelected();
    renderCompare();

    const input = document.getElementById('picker-input');
    input.addEventListener('input', onSearchInput);
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.picker')) {
        document.getElementById('picker-results').classList.remove('open');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
