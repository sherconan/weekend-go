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

  // ---- 当季打分公平性：没写 bestSeason 的卡不再吃 0 分 ----
  // 从卡片已有的真实字段（名称/副标题/主题/标签）推断季节信号；推断不出 = 中性 1 分。
  // 语义排序：明确当季(3) > 关键词当季(2) > 四季皆宜(1.2) > 无信号(1) > 关键词反季(0.4) > 明确反季(0.3)
  const SEASON_KEYWORDS = {
    '春': /赏花|花海|樱花|桃花|海棠|杏花|梨花|踏青|郁金香/,
    '夏': /海滩|沙滩|海岛|海水浴|戏水|玩水|漂流|避暑|瀑布|峡谷|溶洞|露营|荷花|向日葵/,
    '秋': /红叶|银杏|秋叶|秋色|芦苇|稻田/,
    '冬': /滑雪|冰雪|雾凇|冰灯|滑冰|温泉/
  };
  function derivedSeasonScore(d) {
    const text = [d.name, d.subtitle, d.highlight,
      Array.isArray(d.themes) ? d.themes.join(' ') : '',
      Array.isArray(d.tags) ? d.tags.join(' ') : ''].filter(Boolean).join(' ');
    const cur = seasonName(MONTH);
    if (SEASON_KEYWORDS[cur] && SEASON_KEYWORDS[cur].test(text)) return 2;
    for (const k in SEASON_KEYWORDS) {
      if (k !== cur && SEASON_KEYWORDS[k].test(text)) return 0.4;
    }
    return 1;
  }
  function destSeasonScore(d) {
    const bs = s(d.bestSeason);
    if (!bs) return derivedSeasonScore(d);
    // 明确写了"四季皆宜"的不应排在缺字段的卡后面
    if (/四季|全年|皆宜|皆可/.test(bs)) return 1.2;
    return seasonScore(bs);
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

  // 权重依据（经验值，量纲对齐后各因子的满分贡献）：
  //   当季 ≤6.6（核心卖点："本周末"的时令感） > 周末可行 ≤3.2 > 口碑 ≤3（rating×0.6）> 热度 ≤1（只做平手裁决）
  //   已打卡 -3 ≈ 让出一个量级，但不至于把打过卡的全压到池底
  function scoreDest(d, visited) {
    let score = destSeasonScore(d) * 2.2
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

  // ---- 每日轮换：同一天打开是同一批（稳定可复现），跨天自动换 ----
  // 头部池 = 排名前 12 的卡，按「城市+日期」种子洗牌后放在最前；其余按分数顺延。
  // 这样 Top1 不再永远是同一张，但任何一天给出的 3 张都来自最优池。
  const HEAD_POOL = 12;
  let _dateKeyOverride = null; // 测试注入
  function dateKey() {
    if (_dateKeyOverride) return _dateKeyOverride;
    const d = new Date();
    return '' + d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
  }
  function hashStr(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function seededShuffle(arr, seed) {
    const a = arr.slice();
    const rnd = mulberry32(seed);
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }
  function buildOrder() {
    const ranked = rankedPool();
    if (!ranked.length) return [];
    let city = 'beijing';
    try { if (typeof currentCity !== 'undefined' && currentCity) city = currentCity; } catch (e) {}
    const head = ranked.slice(0, Math.min(HEAD_POOL, ranked.length));
    const rest = ranked.slice(head.length);
    return seededShuffle(head, hashStr(city + '|' + dateKey())).concat(rest);
  }

  function pickTop3(order) {
    const list = order || buildOrder();
    if (!list.length) return [];
    const n = Math.min(3, list.length);
    const start = (_page * 3) % list.length;
    const out = [];
    for (let i = 0; i < n; i++) out.push(list[(start + i) % list.length]);
    return out;
  }

  function reasonChips(d) {
    const chips = [];
    if (destSeasonScore(d) >= 2) chips.push('☀️ 正当季');
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
    const order = buildOrder();
    if (!order.length) { grid.innerHTML = ''; wrap.style.display = 'none'; return; }
    wrap.style.display = '';
    grid.innerHTML = pickTop3(order).map((d, i) => cardHTML(d, i + 1)).join('');
    const title = document.getElementById('top3-title');
    if (title) title.textContent = `☀️ 本周末 · ${MONTH}月当季为你挑了 3 个`;
    const note = document.getElementById('top3-note');
    if (note) note.textContent = `从 ${order.length} 个内容完整的目的地里选，每天换一轮 · 点卡片直接看怎么玩怎么去`;
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
    window.__top3 = {
      isSolid, seasonScore, weekendScore, scoreDest, pickTop3, rankedPool, MONTH,
      destSeasonScore, derivedSeasonScore, seasonName, buildOrder, HEAD_POOL,
      _setPage: (p) => { _page = p; },
      _setDateKey: (k) => { _dateKeyOverride = k; }
    };
  }
  if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('DOMContentLoaded', renderTop3);
  }
})();
