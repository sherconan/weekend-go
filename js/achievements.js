// achievements.js — 从 stamp visited 数据派生徽章
// 3 大类：连续打卡 · 城市集齐 · 主题达人 + 里程碑总数
(function(){
  'use strict';

  function g(name) {
    try { return (0, eval)('typeof ' + name + ' !== "undefined" ? ' + name + ' : undefined'); }
    catch { return undefined; }
  }

  const STAMP_KEY = 'visited_destinations_shared';

  function getVisited() {
    try { return JSON.parse(localStorage.getItem(STAMP_KEY) || '{}'); }
    catch { return {}; }
  }

  // ---------- Aggregate dest metadata from all sources ----------
  const SOURCE_VARS = [
    ['DESTINATIONS','beijing'],['DESTINATIONS_EXTRA','beijing'],['DESTINATIONS_EXTRA2','beijing'],
    ['DESTINATIONS_BJ500','beijing'],['DESTINATIONS_BJ_EXPAND','beijing'],['DESTINATIONS_BJ_HIDDEN','beijing'],
    ['DESTINATIONS_BJ_TALES','beijing'],['DESTINATIONS_BJ_2026','beijing'],
    ['DESTINATIONS_SZ','shenzhen'],['DESTINATIONS_WH','weihai'],['DESTINATIONS_SU','suzhou'],
    ['DESTINATIONS_TJ','tianjin'],['DESTINATIONS_QD','qingdao'],['DESTINATIONS_CD','chengdu'],['DESTINATIONS_HZ','hangzhou']
  ];

  let _destIndex = null;
  function buildDestIndex() {
    if (_destIndex) return _destIndex;
    const out = {};
    for (const [v, city] of SOURCE_VARS) {
      const arr = g(v);
      if (!Array.isArray(arr)) continue;
      for (const d of arr) {
        if (!d || !d.id) continue;
        if (out[d.id]) continue;
        out[d.id] = { id: d.id, name: d.name, city, themes: d.themes || [] };
      }
    }
    // shared
    const shared = g('SHARED_CROSS_CITY_DESTS') || [];
    for (const s of shared) {
      if (!s.id || out[s.id]) continue;
      const firstCity = s.cities ? Object.keys(s.cities)[0] : 'beijing';
      out[s.id] = { id: s.id, name: s.name, city: firstCity, themes: s.themes || [], shared: true };
    }
    _destIndex = out;
    return out;
  }

  // ---------- Streak calculation ----------
  function computeStreak(visited) {
    const dates = Object.values(visited)
      .map(v => (v.date || '').slice(0, 10))
      .filter(Boolean)
      .sort();
    if (!dates.length) return { current: 0, longest: 0, totalDays: 0 };

    const uniqueDates = [...new Set(dates)];
    const totalDays = uniqueDates.length;

    // Longest streak
    let longest = 1, current = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const prev = new Date(uniqueDates[i-1]);
      const cur = new Date(uniqueDates[i]);
      const diff = Math.round((cur - prev) / (1000 * 60 * 60 * 24));
      if (diff === 1) { current++; longest = Math.max(longest, current); }
      else if (diff > 1) { current = 1; }
    }

    // Current streak (ending at today or most recent)
    const today = new Date();
    const todayISO = today.toISOString().slice(0, 10);
    const dateSet = new Set(uniqueDates);
    let curStreak = 0;
    let cursor = new Date(today);
    // If hasn't stamped today, check yesterday as start
    if (!dateSet.has(todayISO)) {
      cursor.setDate(cursor.getDate() - 1);
    }
    while (dateSet.has(cursor.toISOString().slice(0, 10))) {
      curStreak++;
      cursor.setDate(cursor.getDate() - 1);
    }

    return { current: curStreak, longest, totalDays };
  }

  // ---------- Main compute ----------
  function compute() {
    const visited = getVisited();
    const destIndex = buildDestIndex();
    const visitedIds = Object.keys(visited);
    const totalVisited = visitedIds.length;

    // City coverage
    const cityHit = {};
    const themeHit = {};
    for (const id of visitedIds) {
      const meta = destIndex[id];
      if (!meta) continue;
      cityHit[meta.city] = (cityHit[meta.city] || 0) + 1;
      for (const t of meta.themes) themeHit[t] = (themeHit[t] || 0) + 1;
    }
    const citiesTouched = Object.keys(cityHit).length;

    const streaks = computeStreak(visited);

    // Badges — earned/in-progress/locked
    const badges = [];

    // Total milestones
    const TOTAL_TIERS = [{n:1,t:'初次打卡',e:'🌱'},{n:5,t:'5 个脚印',e:'👣'},{n:10,t:'10 次出游',e:'🎒'},{n:25,t:'25 站达人',e:'🧭'},{n:50,t:'50 场冒险',e:'🗺'},{n:100,t:'百站旅人',e:'🏆'}];
    for (const tier of TOTAL_TIERS) {
      badges.push({
        id: 'total-' + tier.n,
        category: '里程碑',
        name: tier.t,
        emoji: tier.e,
        desc: `累计打卡 ${tier.n} 个目的地`,
        progress: Math.min(1, totalVisited / tier.n),
        progressText: `${totalVisited} / ${tier.n}`,
        earned: totalVisited >= tier.n
      });
    }

    // Streak badges
    const STREAK_TIERS = [{n:3,t:'连打三天',e:'🔥'},{n:7,t:'一周坚持',e:'⚡'},{n:14,t:'两周连击',e:'💎'},{n:30,t:'月度打卡王',e:'👑'}];
    for (const tier of STREAK_TIERS) {
      badges.push({
        id: 'streak-' + tier.n,
        category: '连续打卡',
        name: tier.t,
        emoji: tier.e,
        desc: `连续 ${tier.n} 天打卡（历史最长）`,
        progress: Math.min(1, streaks.longest / tier.n),
        progressText: `${streaks.longest} / ${tier.n}`,
        earned: streaks.longest >= tier.n
      });
    }

    // City coverage badges
    const CITY_TIERS = [{n:2,t:'双城记',e:'🏮'},{n:4,t:'半壁江山',e:'🏙'},{n:6,t:'中华半圈',e:'🌆'},{n:8,t:'八城全集',e:'🗺'}];
    for (const tier of CITY_TIERS) {
      badges.push({
        id: 'cities-' + tier.n,
        category: '城市集齐',
        name: tier.t,
        emoji: tier.e,
        desc: `打卡 ${tier.n} 座不同城市的目的地`,
        progress: Math.min(1, citiesTouched / tier.n),
        progressText: `${citiesTouched} / ${tier.n}`,
        earned: citiesTouched >= tier.n
      });
    }

    // Theme master badges (top themes)
    const THEME_TIERS = [
      {theme:'历史',n:10,name:'史海达人',emoji:'📜'},
      {theme:'美食',n:10,name:'吃货认证',emoji:'🍜'},
      {theme:'自然',n:10,name:'自然派',emoji:'🌿'},
      {theme:'亲子',n:10,name:'遛娃专家',emoji:'👨‍👩‍👧'},
      {theme:'海滨',n:5,name:'海之子',emoji:'🌊'},
      {theme:'灵异',n:5,name:'都市探险家',emoji:'👻'},
      {theme:'文化',n:10,name:'文化爱好者',emoji:'🎭'}
    ];
    for (const tier of THEME_TIERS) {
      const count = themeHit[tier.theme] || 0;
      badges.push({
        id: 'theme-' + tier.theme,
        category: '主题达人',
        name: tier.name,
        emoji: tier.emoji,
        desc: `「${tier.theme}」主题打卡 ${tier.n} 次`,
        progress: Math.min(1, count / tier.n),
        progressText: `${count} / ${tier.n}`,
        earned: count >= tier.n
      });
    }

    return {
      totalVisited,
      citiesTouched,
      streaks,
      cityHit,
      themeHit,
      badges,
      earned: badges.filter(b => b.earned),
      nextUp: badges.filter(b => !b.earned && b.progress > 0).sort((a,b) => b.progress - a.progress).slice(0, 3)
    };
  }

  // Expose
  window.WG_Achievements = { compute, buildDestIndex };
})();
