// seasonal.js — 基于当前月份 + bestSeason 字段 匹配时令最佳 dest
// 嵌入在 index.html，触发于 load
(function(){
  'use strict';

  function g(name) {
    try { return (0, eval)('typeof ' + name + ' !== "undefined" ? ' + name + ' : undefined'); }
    catch { return undefined; }
  }

  const MONTH = new Date().getMonth() + 1; // 1-12
  const SEASON_MAP = {
    1:{name:'冬',emoji:'❄️',subtitle:'北地雪色 · 南方温泉'},
    2:{name:'冬末',emoji:'🌨',subtitle:'早春将至 · 室内展馆正好'},
    3:{name:'春',emoji:'🌸',subtitle:'赏花踏青正当时'},
    4:{name:'春',emoji:'🌸',subtitle:'暮春赏花 · 郊野徒步'},
    5:{name:'春末',emoji:'🌿',subtitle:'初夏将至 · 海边开季'},
    6:{name:'夏',emoji:'☀️',subtitle:'避暑纳凉 · 海滨沙滩'},
    7:{name:'夏',emoji:'🏖',subtitle:'盛夏避暑 · 山间瀑布'},
    8:{name:'夏末',emoji:'🍃',subtitle:'秋意渐浓 · 海岛最后一波'},
    9:{name:'秋',emoji:'🍂',subtitle:'秋高气爽 · 赏叶登山'},
    10:{name:'秋',emoji:'🍁',subtitle:'秋叶最美 · 长城古镇'},
    11:{name:'秋末',emoji:'🌾',subtitle:'冬将至 · 银杏红叶最后时段'},
    12:{name:'冬',emoji:'❄️',subtitle:'雪乡温泉 · 室内博物馆'}
  };

  // Score how well a bestSeason string matches current month
  function seasonScore(bestSeason) {
    if (!bestSeason) return 0;
    const bs = String(bestSeason);

    // Explicit month range like "5-10月"
    const rangeMatch = bs.match(/(\d+)\s*[-~到至]\s*(\d+)\s*月/);
    if (rangeMatch) {
      const lo = parseInt(rangeMatch[1], 10);
      const hi = parseInt(rangeMatch[2], 10);
      // handle wraparound (e.g., "11-2月")
      if (lo <= hi) {
        if (MONTH >= lo && MONTH <= hi) return 3;
      } else {
        if (MONTH >= lo || MONTH <= hi) return 3;
      }
      return 0.3; // out of range
    }

    // Single month mention
    const singleMonth = bs.match(/(\d+)\s*月/);
    if (singleMonth) {
      const m = parseInt(singleMonth[1], 10);
      if (m === MONTH) return 2.5;
      if (Math.abs(m - MONTH) <= 1) return 1.5;
    }

    // Season names
    const season = SEASON_MAP[MONTH].name; // 春/春末/夏/.../冬
    const coreName = season.replace('末','').replace('初','');
    if (bs.includes(coreName)) return 2;

    // "四季皆宜" / "全年" / "皆可" — neutral match (low boost)
    if (/四季|全年|皆宜|皆可/.test(bs)) return 0.8;

    return 0.2;
  }

  function loadAllDests() {
    const SRC = ['DESTINATIONS','DESTINATIONS_EXTRA','DESTINATIONS_EXTRA2',
      'DESTINATIONS_BJ500','DESTINATIONS_BJ_EXPAND','DESTINATIONS_BJ_HIDDEN',
      'DESTINATIONS_BJ_TALES','DESTINATIONS_BJ_2026',
      'DESTINATIONS_SZ','DESTINATIONS_WH','DESTINATIONS_SU',
      'DESTINATIONS_TJ','DESTINATIONS_QD','DESTINATIONS_CD','DESTINATIONS_HZ'];
    const CITY_OF = {
      DESTINATIONS:'beijing',DESTINATIONS_EXTRA:'beijing',DESTINATIONS_EXTRA2:'beijing',
      DESTINATIONS_BJ500:'beijing',DESTINATIONS_BJ_EXPAND:'beijing',DESTINATIONS_BJ_HIDDEN:'beijing',
      DESTINATIONS_BJ_TALES:'beijing',DESTINATIONS_BJ_2026:'beijing',
      DESTINATIONS_SZ:'shenzhen',DESTINATIONS_WH:'weihai',DESTINATIONS_SU:'suzhou',
      DESTINATIONS_TJ:'tianjin',DESTINATIONS_QD:'qingdao',DESTINATIONS_CD:'chengdu',DESTINATIONS_HZ:'hangzhou'
    };
    const seen = new Set();
    const out = [];
    for (const v of SRC) {
      const arr = g(v);
      if (!Array.isArray(arr)) continue;
      const city = CITY_OF[v];
      for (const d of arr) {
        if (!d || !d.name || seen.has(d.name)) continue;
        seen.add(d.name);
        out.push(Object.assign({}, d, { _city: city }));
      }
    }
    return out;
  }

  function currentActiveCity() {
    // If main app exposes currentCity, filter by it
    return g('currentCity') || null;
  }

  function renderSeasonal() {
    const container = document.getElementById('season-cards');
    const titleEl = document.getElementById('season-title');
    const emojiEl = document.getElementById('season-emoji');
    const subEl = document.getElementById('season-subtitle');
    if (!container) return;

    const info = SEASON_MAP[MONTH];
    emojiEl.textContent = info.emoji;
    titleEl.textContent = `本季精选 · ${info.name}`;
    subEl.textContent = `${info.subtitle} · ${MONTH}月`;

    const activeCity = currentActiveCity();
    const all = loadAllDests();

    // Score each dest
    const scored = all.map(d => {
      const ss = seasonScore(d.bestSeason);
      if (ss <= 0.3) return null; // exclude off-season
      const rating = d.rating || 4;
      // light city preference
      const cityBonus = (activeCity && d._city === activeCity) ? 1.5 : 0;
      return { d, score: ss * 3 + rating * 0.5 + cityBonus };
    }).filter(Boolean);

    scored.sort((a,b) => b.score - a.score);

    // Deduplicate & take top 6 — vary by city (at least 2 different cities)
    const picks = [];
    const cityCount = {};
    for (const s of scored) {
      const c = s.d._city;
      cityCount[c] = cityCount[c] || 0;
      if (cityCount[c] >= 2) continue;
      picks.push(s.d);
      cityCount[c]++;
      if (picks.length >= 6) break;
    }
    // Fill remaining if fewer than 6
    if (picks.length < 6) {
      for (const s of scored) {
        if (picks.includes(s.d)) continue;
        picks.push(s.d);
        if (picks.length >= 6) break;
      }
    }

    container.innerHTML = picks.map(d => {
      const imgPath = (typeof getDestImage === 'function') ? getDestImage(d) : null;
      const thumb = imgPath
        ? `<div style="width:100%;height:120px;background:url('${imgPath}') center/cover;border-radius:10px 10px 0 0;"></div>`
        : `<div style="width:100%;height:120px;background:${d.gradient || 'linear-gradient(135deg,#FF7043,#FFC107)'};border-radius:10px 10px 0 0;display:flex;align-items:center;justify-content:center;font-size:36px;">📍</div>`;
      const cityEmoji = {beijing:'🏯',shenzhen:'🏖',weihai:'🌊',suzhou:'🏮',tianjin:'🥐',qingdao:'🍺',chengdu:'🐼',hangzhou:'🍵'}[d._city] || '📍';
      return `
        <a href="dest.html?id=${d.id}&city=${d._city}" style="background:white;border-radius:12px;overflow:hidden;text-decoration:none;color:inherit;display:block;transition:transform .15s,box-shadow .15s;box-shadow:0 2px 8px rgba(16,24,40,0.06);" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 24px rgba(16,24,40,0.1)'" onmouseout="this.style.transform='';this.style.boxShadow='0 2px 8px rgba(16,24,40,0.06)'">
          ${thumb}
          <div style="padding:10px 12px;">
            <div style="display:flex;align-items:center;gap:4px;font-size:11px;color:#667085;margin-bottom:3px;">${cityEmoji}${' '}${d.distanceText || ''} · ⭐ ${d.rating||'--'}</div>
            <div style="font-size:14px;font-weight:700;margin-bottom:2px;line-height:1.2;">${d.name}</div>
            <div style="font-size:11px;color:#667085;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${d.subtitle || ''}</div>
            <div style="margin-top:6px;font-size:10px;color:#FF7043;font-weight:600;">🗓 ${d.bestSeason || ''}</div>
          </div>
        </a>
      `;
    }).join('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(renderSeasonal, 100));
  } else {
    setTimeout(renderSeasonal, 100);
  }

  // Re-render on city change
  window.addEventListener('wg-city-change', renderSeasonal);
})();
