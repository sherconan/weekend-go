// top3.js — 首屏「本周末 Top 3」：打开即给答案
// 规则：当季匹配（bestSeason × 当前月份）+ 周末可行（时长越轻量越优先）+ 口碑/热度，
//       已打卡的往后排；只从「内容扎实」（玩法/交通/美食三件套齐全）的目的地里挑。
// 由 app.js 的 switchCity() 在城市切换时调用 renderTop3()；DOMContentLoaded 兜底自渲染。
(function () {
  'use strict';

  const MONTH = new Date().getMonth() + 1; // 1-12

  function seasonName(m) {
    if (m >= 3 && m <= 5) return '春';
    if (m >= 6 && m <= 8) return '夏';
    if (m >= 9 && m <= 11) return '秋';
    return '冬';
  }

  // 把 hero 徽标里写死的「X季版」换成当前季节
  function seasonEditionBadge(str) {
    return String(str || '').replace(/[春夏秋冬]季版/, seasonName(MONTH) + '季版');
  }

  const s = (v) => (v == null ? '' : String(v).trim());

  // 「内容扎实」= 玩法攻略成段 + 至少一个实用板块（交通或美食）——
  // 详情页是空壳的卡不进推荐池（也不进随便去哪儿）
  function isSolid(d) {
    if (!d || s(d.whatToDo).length < 30) return false;
    return s(d.howToGet).length >= 10 || s(d.whereToEat).length >= 6;
  }

  // 与 seasonal.js 同语义：bestSeason 字符串 × 当前月份 → 0~3 分
  function seasonScore(bestSeason) {
    const bs = s(bestSeason);
    if (!bs) return 0;
    const range = bs.match(/(\d+)\s*[-~到至]\s*(\d+)\s*月/);
    if (range) {
      const lo = parseInt(range[1], 10);
      const hi = parseInt(range[2], 10);
      const inRange = lo <= hi ? (MONTH >= lo && MONTH <= hi) : (MONTH >= lo || MONTH <= hi);
      return inRange ? 3 : 0.3;
    }
    const single = bs.match(/(\d+)\s*月/);
    if (single) {
      const m = parseInt(single[1], 10);
      if (m === MONTH) return 2.5;
      if (Math.abs(m - MONTH) <= 1) return 1.5;
    }
    if (bs.includes(seasonName(MONTH))) return 2;
    if (/四季|全年|皆宜|皆可/.test(bs)) return 0.8;
    return 0.2;
  }

  // 周末可行性：半日/一日 > 两日一夜 > 三日两夜
  function weekendScore(d) {
    const dur = Array.isArray(d.duration) ? d.duration : [];
    if (dur.includes('半日游') || dur.includes('一日往返')) return 2;
    if (dur.includes('两日一夜')) return 1.5;
    if (dur.includes('三日两夜')) return 0.5;
    return 1;
  }

  function heatScore(d) {
    const tier = d.xhsHeat && d.xhsHeat.tier;
    return tier === 'high' ? 1 : tier === 'mid' ? 0.6 : 0.3;
  }

  function scoreDest(d, visited) {
    let score = seasonScore(d.bestSeason) * 2.2
      + weekendScore(d) * 1.6
      + (d.rating || 0) * 0.6
      + heatScore(d);
    if (visited) score -= 3;
    return score;
  }

  function activeList() {
    try { return (typeof ACTIVE_DESTINATIONS !== 'undefined' && ACTIVE_DESTINATIONS) || []; }
    catch (e) { return []; }
  }

  function getQualityPool() {
    return activeList().filter(isSolid);
  }

  function rankedPool() {
    const visited = (id) => typeof isVisited === 'function' && isVisited(id);
    return getQualityPool()
      .map((d) => ({ d, score: scoreDest(d, visited(d.id)) }))
      .sort((a, b) => b.score - a.score)
      .map((x) => x.d);
  }

  let _page = 0;

  function pickTop3(ranked) {
    const list = ranked || rankedPool();
    if (!list.length) return [];
    const n = Math.min(3, list.length);
    const start = (_page * 3) % list.length;
    const out = [];
    for (let i = 0; i < n; i++) out.push(list[(start + i) % list.length]);
    return out;
  }

  function reasonChips(d) {
    const chips = [];
    if (seasonScore(d.bestSeason) >= 2) chips.push('☀️ 正当季');
    if (!(typeof isVisited === 'function' && isVisited(d.id))) chips.push('🆕 还没去过');
    if (d.xhsHeat && d.xhsHeat.tier === 'high') chips.push('🔥 小红书热');
    return chips.slice(0, 3);
  }

  const esc = (t) => s(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  function cardHTML(d, rank) {
    const img = (typeof getDestImage === 'function' && getDestImage(d)) || d.image || null;
    const cover = img
      ? `background-image: url('${img}'); background-size: cover; background-position: center;`
      : `background: ${d.gradient || 'var(--coral-light)'};`;
    const dur = Array.isArray(d.duration) && d.duration[0] ? d.duration[0] : '';
    const meta = [
      d.distanceText || (d.distance != null ? d.distance + 'km' : ''),
      dur,
      d.rating ? '⭐ ' + d.rating : ''
    ].filter(Boolean).join(' · ');
    const chips = reasonChips(d).map((c) => `<span class="top3-chip">${c}</span>`).join('');
    return `
      <div class="top3-card" role="button" tabindex="0" data-id="${d.id}"
           onclick="openDetail(${d.id})"
           onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openDetail(${d.id});}">
        <div class="top3-card-cover" style="${cover}"><span class="top3-rank">TOP ${rank}</span></div>
        <div class="top3-card-body">
          <div class="top3-card-name">${esc(d.name)}</div>
          <div class="top3-card-sub">${esc(d.subtitle || d.highlight || '')}</div>
          <div class="top3-card-meta">${esc(meta)}</div>
          <div class="top3-card-chips">${chips}</div>
        </div>
      </div>`;
  }

  function renderTop3() {
    const wrap = document.getElementById('top3-section');
    const grid = document.getElementById('top3-cards');
    if (!wrap || !grid) return;
    const ranked = rankedPool();
    if (!ranked.length) { grid.innerHTML = ''; wrap.style.display = 'none'; return; }
    wrap.style.display = '';
    grid.innerHTML = pickTop3(ranked).map((d, i) => cardHTML(d, i + 1)).join('');
    const title = document.getElementById('top3-title');
    if (title) title.textContent = `☀️ 本周末 · ${MONTH}月当季为你挑了 3 个`;
    const note = document.getElementById('top3-note');
    if (note) note.textContent = `从 ${ranked.length} 个内容完整的目的地里选 · 点卡片直接看怎么玩怎么去`;
  }

  function shuffleTop3() {
    _page += 1;
    renderTop3();
  }

  if (typeof window !== 'undefined') {
    window.renderTop3 = renderTop3;
    window.shuffleTop3 = shuffleTop3;
    window.getQualityPool = getQualityPool;
    window.seasonEditionBadge = seasonEditionBadge;
    // 测试钩子
    window.__top3 = { isSolid, seasonScore, weekendScore, scoreDest, pickTop3, rankedPool, MONTH, _setPage: (p) => { _page = p; } };
  }
  if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('DOMContentLoaded', renderTop3);
  }
})();
