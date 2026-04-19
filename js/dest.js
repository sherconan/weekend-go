// dest.js — 目的地详情页
// URL: dest.html?id=330 or dest.html?name=故宫
(function(){
  'use strict';

  function g(name) {
    try { return (0, eval)('typeof ' + name + ' !== "undefined" ? ' + name + ' : undefined'); }
    catch { return undefined; }
  }

  const SOURCE_VARS = [
    'DESTINATIONS','DESTINATIONS_EXTRA','DESTINATIONS_EXTRA2',
    'DESTINATIONS_BJ500','DESTINATIONS_BJ_EXPAND','DESTINATIONS_BJ_HIDDEN','DESTINATIONS_BJ_TALES','DESTINATIONS_BJ_2026',
    'DESTINATIONS_SZ','DESTINATIONS_WH','DESTINATIONS_SU',
    'DESTINATIONS_TJ','DESTINATIONS_QD','DESTINATIONS_CD','DESTINATIONS_HZ'
  ];
  const CITY_OF = {
    DESTINATIONS:'beijing',DESTINATIONS_EXTRA:'beijing',DESTINATIONS_EXTRA2:'beijing',
    DESTINATIONS_BJ500:'beijing',DESTINATIONS_BJ_EXPAND:'beijing',DESTINATIONS_BJ_HIDDEN:'beijing',
    DESTINATIONS_BJ_TALES:'beijing',DESTINATIONS_BJ_2026:'beijing',
    DESTINATIONS_SZ:'shenzhen',DESTINATIONS_WH:'weihai',DESTINATIONS_SU:'suzhou',
    DESTINATIONS_TJ:'tianjin',DESTINATIONS_QD:'qingdao',DESTINATIONS_CD:'chengdu',DESTINATIONS_HZ:'hangzhou'
  };

  function findDest(query) {
    const {id, name, city} = query;
    for (const v of SOURCE_VARS) {
      const arr = g(v);
      if (!Array.isArray(arr)) continue;
      const vcity = CITY_OF[v];
      if (city && vcity !== city) continue;
      for (const d of arr) {
        if (!d) continue;
        if (id != null && String(d.id) === String(id)) return { dest: d, city: vcity };
        if (name && d.name === name) return { dest: d, city: vcity };
      }
    }
    // shared
    const shared = g('SHARED_CROSS_CITY_DESTS') || [];
    for (const s of shared) {
      if ((id != null && String(s.id) === String(id)) || (name && s.name === name)) {
        // prefer city query; else first key
        const ck = city || Object.keys(s.cities||{})[0];
        const ex = ck && s.cities ? s.cities[ck] : {};
        return { dest: Object.assign({}, s, ex || {}), city: ck, _shared: true };
      }
    }
    return null;
  }

  function loadLegendsForDest(destName, city) {
    // BJ legends live in DESTINATIONS_BJ_TALES; other cities in LEGENDS_*
    const LEGEND_VARS = ['DESTINATIONS_BJ_TALES','LEGENDS_DATA','LEGENDS_SZ','LEGENDS_WH','LEGENDS_SU','LEGENDS_QD','LEGENDS_TJ','LEGENDS_CD','LEGENDS_HZ'];
    const out = [];
    const seen = new Set();
    for (const v of LEGEND_VARS) {
      const arr = g(v);
      if (!Array.isArray(arr)) continue;
      // BJ_TALES is BJ only
      if (v === 'DESTINATIONS_BJ_TALES' && city && city !== 'beijing') continue;
      for (const l of arr) {
        if (!l || seen.has(l.name || l.title)) continue;
        if (l.city && city && l.city !== city) continue;
        // Match multiple shapes: {name, subtitle, description} (tales) OR {title, story, destName}
        const text = (l.description || '') + ' ' + (l.story || '') + ' ' + (l.overview || '');
        const matchName = (l.destName === destName) ||
                          (l.location === destName) ||
                          (l.name && l.name.includes(destName)) ||
                          (l.title && l.title.includes(destName)) ||
                          (text && text.includes(destName));
        if (matchName) {
          seen.add(l.name || l.title);
          out.push(l);
        }
      }
    }
    return out.slice(0, 4);
  }

  function findRelated(dest, city, limit=6) {
    const all = [];
    for (const v of SOURCE_VARS) {
      const arr = g(v);
      if (!Array.isArray(arr)) continue;
      if (CITY_OF[v] !== city) continue;
      for (const d of arr) {
        if (!d || !d.name || d.name === dest.name || d.id === dest.id) continue;
        const overlap = (d.themes || []).filter(t => (dest.themes || []).includes(t)).length;
        if (overlap > 0) {
          all.push({ d, score: overlap + (d.rating || 0) * 0.1 });
        }
      }
    }
    all.sort((a,b) => b.score - a.score);
    return all.slice(0, limit).map(x => x.d);
  }

  // Cross-city: pick dests from OTHER cities that share max theme overlap
  function findCrossCityRelated(dest, excludeCity, limit=4) {
    const all = [];
    for (const v of SOURCE_VARS) {
      const arr = g(v);
      if (!Array.isArray(arr)) continue;
      const vcity = CITY_OF[v];
      if (vcity === excludeCity) continue; // different cities only
      for (const d of arr) {
        if (!d || !d.name) continue;
        const overlap = (d.themes || []).filter(t => (dest.themes || []).includes(t)).length;
        if (overlap >= 1) {
          all.push({ d, city: vcity, score: overlap * 2 + (d.rating || 0) * 0.2 });
        }
      }
    }
    all.sort((a,b) => b.score - a.score);
    // Ensure variety: max 2 per city
    const picks = [];
    const perCity = {};
    for (const x of all) {
      perCity[x.city] = perCity[x.city] || 0;
      if (perCity[x.city] >= 2) continue;
      picks.push(x);
      perCity[x.city]++;
      if (picks.length >= limit) break;
    }
    return picks;
  }

  function imgFor(dest) {
    // Prefer mapped image from images.js, else attempt default filename by name
    if (typeof getDestImage === 'function') {
      const mapped = getDestImage(dest);
      if (mapped) return mapped;
    }
    // No image → null, caller falls back to gradient
    return null;
  }

  function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function render(result) {
    const loadingEl = document.getElementById('loading');
    if (loadingEl) loadingEl.remove();

    const content = document.getElementById('content');
    if (!result) {
      content.innerHTML = `
        <div class="error-state">
          <h1>😕 没找到这个目的地</h1>
          <p>URL 参数可能是错的，<a href="/weekend-go/">回主站</a>浏览所有目的地吧。</p>
        </div>
      `;
      return;
    }
    const d = result.dest;
    const cities = g('CITIES') || [];
    const cityObj = cities.find(c => c.key === result.city);
    const cityDisplay = cityObj ? `${cityObj.emoji} ${cityObj.name}` : (result.city || '');

    // Update meta for OG
    document.title = `${d.name} · 周末去哪儿`;
    document.getElementById('meta-desc').content = d.subtitle || d.description?.slice(0,80) || '';
    document.getElementById('og-title').content = `${d.name} · ${d.subtitle || '周末好去处'}`;
    document.getElementById('og-desc').content = d.description?.slice(0,120) || d.subtitle || '';

    const gradient = d.gradient || 'linear-gradient(135deg, #FF7043 0%, #FFC107 100%)';
    const imagePath = imgFor(d);
    const heroBg = imagePath
      ? `background-image:linear-gradient(to bottom,rgba(0,0,0,0.15) 40%,rgba(0,0,0,0.55) 100%),url('${imagePath}');background-size:cover;background-position:center;`
      : `background-image:${gradient}`;
    // Preload og:image
    if (imagePath) document.getElementById('og-image').content = location.origin + location.pathname.replace(/[^/]*$/,'') + imagePath;

    const tags = d.tags || d.themes || [];
    const related = findRelated(d, result.city);
    const crossRelated = findCrossCityRelated(d, result.city);
    const legends = loadLegendsForDest(d.name, result.city);

    const html = `
      <div class="hero" style="${heroBg}">
        <div class="hero-content">
          <div class="hero-city">${cityDisplay}</div>
          <div class="hero-title">${escapeHtml(d.name)}</div>
          <div class="hero-sub">${escapeHtml(d.subtitle || '')}</div>
        </div>
      </div>

      <div class="container">
        <div class="meta-row">
          ${d.rating ? `<div><span class="rating-pill">⭐ ${d.rating}</span></div>` : ''}
          ${d.distanceText ? `<div>📍 <span>${escapeHtml(d.distanceText)}</span></div>` : ''}
          ${d.duration ? `<div>⏱ <span>${escapeHtml([].concat(d.duration).join(' / '))}</span></div>` : ''}
          ${d.budgetText ? `<div>💰 <span>${escapeHtml(d.budgetText)}</span></div>` : ''}
          ${d.bestSeason ? `<div>🌤 <span>${escapeHtml(d.bestSeason)}</span></div>` : ''}
        </div>

        ${tags.length ? `<div class="tags-row">${tags.slice(0,8).map(t => `<span class="tag ${(d.themes||[]).includes(t)?'theme':''}">${escapeHtml(t)}</span>`).join('')}</div>` : ''}

        ${d.description ? `<div class="description">${escapeHtml(d.description)}</div>` : ''}

        ${d.overview ? `<div class="section"><h2>📖 景点概览</h2><div class="body">${escapeHtml(d.overview)}</div></div>` : ''}

        ${d.highlight ? `<div class="section"><h2>✨ 看点</h2><div class="body">${escapeHtml(d.highlight)}</div></div>` : ''}

        ${d.whatToDo ? `<div class="section"><h2>🎯 必做清单</h2><div class="body">${escapeHtml(d.whatToDo)}</div></div>` : ''}

        ${d.whereToEat ? `<div class="section"><h2>🍜 吃什么</h2><div class="body">${escapeHtml(d.whereToEat)}</div></div>` : ''}

        ${d.whereToStay ? `<div class="section"><h2>🏨 住哪里</h2><div class="body">${escapeHtml(d.whereToStay)}</div></div>` : ''}

        ${d.howToGet ? `<div class="section"><h2>🚆 怎么去</h2><div class="body">${escapeHtml(d.howToGet)}</div></div>` : ''}

        ${d.tips ? `<div class="section"><h2>💡 实用 tips</h2><div class="body">${escapeHtml(d.tips)}</div></div>` : ''}

        ${legends.length ? `
        <div class="section legends-list">
          <h2>🌑 另一面 · 相关传说</h2>
          ${legends.map(l => {
            const title = l.title || l.name || '';
            const subtitle = l.subtitle || '';
            const story = l.story || l.description || l.overview || '';
            const vibeBits = [l.vibe, l.vibeIcon].filter(Boolean);
            return `
            <div class="legend-item">
              <div class="legend-title">${escapeHtml(title)}${subtitle?` — <span style="color:var(--ink-500);font-weight:400;">${escapeHtml(subtitle)}</span>`:''}</div>
              ${vibeBits.length ? `<div class="legend-vibe">${escapeHtml(vibeBits.join(' '))}</div>` : ''}
              <div class="legend-body">${escapeHtml(String(story).slice(0, 240))}${String(story).length>240?'...':''}</div>
            </div>`;
          }).join('')}
        </div>
        ` : ''}

        <div class="kv section">
          <h2 style="grid-column:1/3;margin-bottom:12px;">📋 基本信息</h2>
          ${d.transport ? `<dt>交通方式</dt><dd>${escapeHtml([].concat(d.transport).join(' / '))}</dd>` : ''}
          <dt>人均预算</dt><dd>${escapeHtml(d.budgetText || d.budget || '--')}</dd>
          <dt>建议时长</dt><dd>${escapeHtml([].concat(d.duration||['--']).join(' / '))}</dd>
          <dt>最佳时节</dt><dd>${escapeHtml(d.bestSeason || '--')}</dd>
          <dt>主题分类</dt><dd>${escapeHtml((d.themes||['--']).join(' · '))}</dd>
          ${d.source ? `<dt>数据来源</dt><dd>${escapeHtml(d.source)}</dd>` : ''}
        </div>

        ${related.length ? `
        <div class="section">
          <h2>🗺 同城相关（同主题）</h2>
          <div class="related-grid">
            ${related.map(r => `
              <a class="related-card" href="dest.html?id=${r.id}&city=${result.city}">
                <div class="related-name">${escapeHtml(r.name)}</div>
                <div class="related-sub">${escapeHtml(r.subtitle || '')}</div>
                <div class="related-meta">
                  <span>⭐ ${r.rating || '--'}</span>
                  <span>📍 ${escapeHtml(r.distanceText || '')}</span>
                </div>
              </a>
            `).join('')}
          </div>
        </div>
        ` : ''}

        ${crossRelated.length ? `
        <div class="section">
          <h2>🌏 其他城市同类</h2>
          <p style="font-size:13px;color:var(--ink-500);margin-bottom:12px;">同样主题的景点，在其他 7 座城市的样子</p>
          <div class="related-grid">
            ${crossRelated.map(r => {
              const cityObj = (g('CITIES') || []).find(c => c.key === r.city);
              const cityTag = cityObj ? `${cityObj.emoji} ${cityObj.name}` : r.city;
              return `
              <a class="related-card" href="dest.html?id=${r.d.id}&city=${r.city}">
                <div style="font-size:11px;color:var(--action);font-weight:700;margin-bottom:3px;">${cityTag}</div>
                <div class="related-name">${escapeHtml(r.d.name)}</div>
                <div class="related-sub">${escapeHtml(r.d.subtitle || '')}</div>
                <div class="related-meta">
                  <span>⭐ ${r.d.rating || '--'}</span>
                  <span>📍 ${escapeHtml(r.d.distanceText || '')}</span>
                </div>
              </a>
            `}).join('')}
          </div>
        </div>
        ` : ''}

      </div>
    `;
    content.innerHTML = html;

    // Share button
    document.getElementById('share-btn').addEventListener('click', () => {
      const url = location.href;
      const title = `${d.name} · 周末去哪儿`;
      if (navigator.share) {
        navigator.share({ title, text: d.subtitle || '', url }).catch(()=>{});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => toast('✓ 链接已复制'));
      } else {
        toast(url);
      }
    });
  }

  let toastTimer;
  function toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
  }

  function init() {
    const params = new URLSearchParams(location.search);
    const q = {
      id: params.get('id'),
      name: params.get('name'),
      city: params.get('city')
    };
    if (!q.id && !q.name) {
      render(null);
      return;
    }
    const result = findDest(q);
    render(result);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
