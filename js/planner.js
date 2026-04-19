// planner.js — WeekendGo 行程规划引擎
// 顶层设计：过滤 → 评分 → 距离聚类 → 按天分配 → 时间预算收敛 → 输出 itinerary
// 无外部依赖，纯 JS，localStorage 持久化
(function(){
  'use strict';

  // ---------- Globals bridge (indirect eval for const globals) ----------
  function g(name) {
    try { return (0, eval)('typeof ' + name + ' !== "undefined" ? ' + name + ' : undefined'); }
    catch { return undefined; }
  }

  // ---------- Data aggregation ----------
  const CITY_DATA_SRC = {
    beijing: ['DESTINATIONS','DESTINATIONS_EXTRA','DESTINATIONS_EXTRA2','DESTINATIONS_BJ500','DESTINATIONS_BJ_EXPAND','DESTINATIONS_BJ_HIDDEN','DESTINATIONS_BJ_TALES','DESTINATIONS_BJ_2026'],
    shenzhen: ['DESTINATIONS_SZ'],
    weihai:   ['DESTINATIONS_WH'],
    suzhou:   ['DESTINATIONS_SU'],
    tianjin:  ['DESTINATIONS_TJ'],
    qingdao:  ['DESTINATIONS_QD'],
    chengdu:  ['DESTINATIONS_CD'],
    hangzhou: ['DESTINATIONS_HZ']
  };

  function loadCityDests(cityKey) {
    const seen = new Set();
    const out = [];
    for (const v of CITY_DATA_SRC[cityKey] || []) {
      const arr = g(v);
      if (!Array.isArray(arr)) continue;
      for (const d of arr) {
        if (!d || !d.name || seen.has(d.name)) continue;
        seen.add(d.name);
        out.push(Object.assign({}, d, { _city: cityKey }));
      }
    }
    // Merge shared cross-city
    const shared = g('SHARED_CROSS_CITY_DESTS') || [];
    for (const s of shared) {
      if (!s.cities || !s.cities[cityKey] || seen.has(s.name)) continue;
      const v = s.cities[cityKey];
      out.push(Object.assign({}, s, {
        distance: v.distance,
        distanceText: v.distanceText,
        duration: v.duration,
        transport: v.transport,
        _city: cityKey,
        _shared: true
      }));
      seen.add(s.name);
    }
    return out;
  }

  // ---------- Theme matching ----------
  const THEME_FAMILIES = {
    '历史文化': ['历史','文化','胡同','古街','传统','民俗','建筑','宗教','博物馆','展览','古镇','非遗'],
    '美食吃喝': ['美食','咖啡','市集','夜生活','精酿','深夜'],
    '自然户外': ['自然','爬山','徒步','露营','风景','观景','森林浴','骑行','峡谷','瀑布','漂流','亲水','观鸟','赏花','户外','探险'],
    '亲子遛娃': ['亲子','动物','科普','娱乐','科技'],
    '摄影打卡': ['拍照','摄影','文艺','艺术','设计','网红'],
    '度假慢游': ['度假','温泉','避暑','休闲','海滨','亲水']
  };

  function themeScore(dest, selectedFamilies) {
    if (!Array.isArray(dest.themes) || dest.themes.length === 0) return 0;
    if (selectedFamilies.length === 0) return 0.5; // neutral
    let hits = 0;
    const expanded = new Set();
    for (const fam of selectedFamilies) {
      for (const t of THEME_FAMILIES[fam] || []) expanded.add(t);
    }
    for (const t of dest.themes) if (expanded.has(t)) hits++;
    return hits / Math.max(1, dest.themes.length);
  }

  // ---------- Budget matching ----------
  const BUDGET_ORDER = ['200以下','200-500','500-1000','1000以上'];
  function budgetOk(dest, userBudget) {
    const b = dest.budget || '200-500';
    const ui = BUDGET_ORDER.indexOf(userBudget);
    const di = BUDGET_ORDER.indexOf(b);
    if (ui < 0 || di < 0) return true;
    return di <= ui; // dest budget <= user budget
  }

  // ---------- Duration parsing ----------
  function durationHours(dest) {
    const list = Array.isArray(dest.duration) ? dest.duration : (dest.duration ? [dest.duration] : []);
    for (const d of list) {
      if (/多日|两日|三日|三天|两天/.test(d)) return 8; // anchor-stay destination
      if (/一日|全天/.test(d)) return 6;
      if (/半日/.test(d)) return 3;
      if (/(\d+)\s*小时/.test(d)) return Math.min(8, parseInt(RegExp.$1, 10));
    }
    return 3; // default half-day
  }

  // ---------- Scoring ----------
  function scoreDest(dest, selectedFamilies, userBudget) {
    const themeS = themeScore(dest, selectedFamilies);
    const rating = (dest.rating || 4.0) / 5.0;
    const distancePenalty = Math.min(1, (dest.distance || 0) / 200);
    const budgetFit = budgetOk(dest, userBudget) ? 1 : 0.3;
    // Weighted: theme 3x, rating 2x, budget 1x, distance penalty 0.5x
    return themeS * 3 + rating * 2 + budgetFit * 1 - distancePenalty * 0.5;
  }

  // ---------- Greedy day allocation with distance awareness ----------
  function allocateDays(candidates, numDays) {
    // Per day budget: ~10 hours, 3-5 dests
    const maxHoursPerDay = 10;
    const minDestsPerDay = 3;
    const maxDestsPerDay = 5;

    const days = [];
    const used = new Set();

    for (let d = 0; d < numDays; d++) {
      const day = { dests: [], hours: 0 };
      // Seed: pick the highest-scoring unused destination
      const seed = candidates.find(c => !used.has(c.name));
      if (!seed) break;
      day.dests.push(seed);
      day.hours += durationHours(seed);
      used.add(seed.name);

      // Grow: greedily add nearest (by distance similarity) unused dest while budget allows
      while (day.dests.length < maxDestsPerDay && day.hours < maxHoursPerDay) {
        const remaining = candidates.filter(c => !used.has(c.name));
        if (!remaining.length) break;
        // score by distance closeness + own score
        const withDistScore = remaining.map(c => {
          const avgD = day.dests.reduce((s,x)=>s+(x.distance||0),0) / day.dests.length;
          const dDiff = Math.abs((c.distance||0) - avgD);
          return { c, proximity: 1 / (1 + dDiff/30), hoursCost: durationHours(c) };
        });
        withDistScore.sort((a,b) => (b.c._score + b.proximity*2) - (a.c._score + a.proximity*2));
        const next = withDistScore[0];
        if (!next || day.hours + next.hoursCost > maxHoursPerDay) break;
        day.dests.push(next.c);
        day.hours += next.hoursCost;
        used.add(next.c.name);
      }

      if (day.dests.length < minDestsPerDay) {
        // pad with next best
        while (day.dests.length < minDestsPerDay) {
          const next = candidates.find(c => !used.has(c.name));
          if (!next) break;
          day.dests.push(next);
          day.hours += durationHours(next);
          used.add(next.name);
          if (day.hours > maxHoursPerDay + 2) break;
        }
      }
      days.push(day);
    }
    return days;
  }

  // ---------- Time-slot renderer ----------
  // Day window: 09:00 → 20:00; 30-min transit/meal between dests
  const DAY_END = 20;
  const TRANSIT = 0.5;
  function assignTimeSlots(dests) {
    const slots = [];
    let cursor = 9;
    for (const d of dests) {
      const h = durationHours(d);
      const start = cursor;
      const end = cursor + h;
      if (end > DAY_END) break;
      slots.push({ dest: d, start, end, startText: fmtTime(start), endText: fmtTime(end) });
      cursor = end + TRANSIT;
      if (cursor >= DAY_END) break;
    }
    return slots;
  }
  function fmtTime(h) {
    const hi = Math.floor(h);
    const mi = Math.round((h - hi) * 60);
    return String(hi).padStart(2,'0') + ':' + String(mi).padStart(2,'0');
  }

  // ---------- Plan generation (single-city or multi-city) ----------
  function scoreAndRank(dests, selectedFamilies, userBudget) {
    const scored = dests
      .filter(d => budgetOk(d, userBudget))
      .map(d => Object.assign({}, d, { _score: scoreDest(d, selectedFamilies, userBudget) }))
      .filter(d => d._score > 1.0)
      .sort((a,b) => b._score - a._score);
    if (scored.length < 3) {
      const relaxed = dests
        .map(d => Object.assign({}, d, { _score: scoreDest(d, selectedFamilies, userBudget) * 0.8 }))
        .sort((a,b) => b._score - a._score);
      for (const r of relaxed) {
        if (!scored.find(s => s.name === r.name)) scored.push(r);
        if (scored.length >= Math.max(3, dests.length / 2)) break;
      }
    }
    return scored;
  }

  function generatePlan(cityKey, numDays, selectedFamilies, userBudget, extraCitiesArg) {
    // Normalize extra cities argument — accept string (legacy) or array
    let extras = [];
    if (Array.isArray(extraCitiesArg)) extras = extraCitiesArg.filter(c => c && c !== cityKey);
    else if (typeof extraCitiesArg === 'string' && extraCitiesArg && extraCitiesArg !== cityKey) extras = [extraCitiesArg];

    if (extras.length && numDays >= extras.length + 1) {
      return generateNCityPlan(cityKey, extras, numDays, selectedFamilies, userBudget);
    }
    const all = loadCityDests(cityKey);
    if (!all.length) return { error: '该城市暂无数据' };
    const scored = scoreAndRank(all, selectedFamilies, userBudget);
    if (scored.length < 3) return { error: '符合条件的目的地太少了，换个偏好试试？' };

    const days = allocateDays(scored, numDays);
    if (!days.length) return { error: '无法组合出合理行程' };

    return {
      cityKey,
      numDays,
      familyTags: selectedFamilies,
      userBudget,
      days: days.map((day, i) => {
        const slots = assignTimeSlots(day.dests);
        return {
          idx: i + 1,
          city: cityKey,
          slots,
          hours: slots.length ? (slots[slots.length-1].end - slots[0].start) : 0
        };
      }),
      totalBudget: estimateBudget(days, userBudget),
      totalDests: days.reduce((s,d)=>s+assignTimeSlots(d.dests).length, 0),
      createdAt: Date.now()
    };
  }

  // N-city TSP planner (primary + extras ordered by greedy nearest-neighbor)
  function generateNCityPlan(primaryKey, extraKeys, numDays, selectedFamilies, userBudget) {
    const cities = g('CITIES') || [];
    const byKey = {};
    for (const c of cities) byKey[c.key] = c;

    const order = planTSP(primaryKey, extraKeys);
    const totalCities = order.length;
    if (numDays < totalCities) return { error: `${totalCities} 城至少需要 ${totalCities} 天` };

    // Allocate days per city (base = 1, remaining distributed to primary first then round-robin)
    const perCity = new Array(totalCities).fill(1);
    let remaining = numDays - totalCities;
    let idx = 0;
    while (remaining > 0) {
      perCity[idx % totalCities]++;
      idx++;
      remaining--;
    }

    const allDays = [];
    const transits = [];
    let totalBudgetPerDay = 0;

    for (let i = 0; i < order.length; i++) {
      const cKey = order[i];
      const cObj = byKey[cKey];
      const daysCount = perCity[i];

      const dests = loadCityDests(cKey);
      if (dests.length < 2) return { error: `${cObj.name} 数据不足` };
      const scored = scoreAndRank(dests, selectedFamilies, userBudget);
      const parts = allocateDays(scored, daysCount);

      parts.forEach(day => {
        const slots = assignTimeSlots(day.dests);
        allDays.push({
          idx: allDays.filter(d => !d.isTransit).length + 1,
          city: cKey,
          cityLabel: cObj.emoji + ' ' + cObj.name,
          slots,
          hours: slots.length ? (slots[slots.length-1].end - slots[0].start) : 0
        });
      });
      totalBudgetPerDay += estimateBudget(parts, userBudget);

      // Transit to next city
      if (i < order.length - 1) {
        const nextKey = order[i + 1];
        const nextObj = byKey[nextKey];
        const km = Math.round(haversineKm(cObj.origin, nextObj.origin));
        const h = transitHours(km);
        const cost = transitCost(km);
        transits.push({ km, h, cost });
        allDays.push({
          idx: -1,
          isTransit: true,
          fromCity: cKey, toCity: nextKey,
          fromLabel: cObj.emoji + ' ' + cObj.name,
          toLabel: nextObj.emoji + ' ' + nextObj.name,
          km, hours: h, cost
        });
      }
    }

    const totalTransitCost = transits.reduce((s, t) => s + t.cost, 0);
    const totalTransitKm = transits.reduce((s, t) => s + t.km, 0);
    const totalTransitH = Math.round(transits.reduce((s, t) => s + t.h, 0) * 10) / 10;

    const totalDests = allDays.filter(d => !d.isTransit).reduce((s, d) => s + d.slots.length, 0);

    return {
      cityKey: primaryKey,
      extraCities: extraKeys,
      citiesOrder: order,
      isMultiCity: true,
      isNCity: true,
      numDays,
      familyTags: selectedFamilies,
      userBudget,
      transit: { km: totalTransitKm, hours: totalTransitH, cost: totalTransitCost, hops: transits.length },
      transitsDetail: transits,
      days: allDays,
      totalBudget: totalBudgetPerDay + totalTransitCost,
      totalDests,
      createdAt: Date.now()
    };
  }

  function generateMultiCityPlan(cityA, cityB, numDays, selectedFamilies, userBudget) {
    const cities = g('CITIES') || [];
    const ca = cities.find(c => c.key === cityA);
    const cb = cities.find(c => c.key === cityB);
    if (!ca || !cb) return { error: '城市数据未找到' };

    const destsA = loadCityDests(cityA);
    const destsB = loadCityDests(cityB);
    if (destsA.length < 2 || destsB.length < 2) return { error: '两城数据不足组合行程' };

    const rankA = scoreAndRank(destsA, selectedFamilies, userBudget);
    const rankB = scoreAndRank(destsB, selectedFamilies, userBudget);

    // Split days: roughly half/half, with cityA getting floor(numDays/2) + 1 if odd
    const daysA = Math.ceil(numDays / 2);
    const daysB = numDays - daysA;

    const partA = allocateDays(rankA, daysA);
    const partB = allocateDays(rankB, daysB);

    // Transit metadata
    const transitKm = Math.round(haversineKm(ca.origin, cb.origin));
    const transitBudget = transitCost(transitKm);
    const transitH = transitHours(transitKm);

    const allDays = [];
    partA.forEach((day, i) => {
      const slots = assignTimeSlots(day.dests);
      allDays.push({
        idx: allDays.length + 1,
        city: cityA,
        cityLabel: ca.emoji + ' ' + ca.name,
        slots,
        hours: slots.length ? (slots[slots.length-1].end - slots[0].start) : 0
      });
    });
    // Insert transit marker between A and B
    if (partB.length) {
      allDays.push({
        idx: -1, // marker
        isTransit: true,
        fromCity: cityA,
        toCity: cityB,
        fromLabel: ca.emoji + ' ' + ca.name,
        toLabel: cb.emoji + ' ' + cb.name,
        km: transitKm,
        hours: transitH,
        cost: transitBudget
      });
      partB.forEach((day, i) => {
        const slots = assignTimeSlots(day.dests);
        allDays.push({
          idx: allDays.filter(d => !d.isTransit).length + 1,
          city: cityB,
          cityLabel: cb.emoji + ' ' + cb.name,
          slots,
          hours: slots.length ? (slots[slots.length-1].end - slots[0].start) : 0
        });
      });
    }

    const budgetAB = estimateBudget(partA, userBudget) + estimateBudget(partB, userBudget);
    const totalDests = allDays
      .filter(d => !d.isTransit)
      .reduce((s,d) => s + d.slots.length, 0);

    return {
      cityKey: cityA,
      cityKey2: cityB,
      isMultiCity: true,
      numDays,
      familyTags: selectedFamilies,
      userBudget,
      transit: { km: transitKm, hours: transitH, cost: transitBudget, fromLabel: ca.emoji+' '+ca.name, toLabel: cb.emoji+' '+cb.name },
      days: allDays,
      totalBudget: budgetAB + transitBudget,
      totalDests,
      createdAt: Date.now()
    };
  }

  function estimateBudget(days, userBudget) {
    const per = { '200以下': 150, '200-500': 350, '500-1000': 750, '1000以上': 1500 }[userBudget] || 400;
    return per * days.length;
  }

  // ---------- UI state ----------
  const state = {
    city: null,
    extraCities: [],  // array of city keys, multi-city mode
    multiCity: false,
    days: 2,
    themes: [],
    budget: '200-500'
  };
  const MAX_EXTRA_CITIES = 3; // primary + 3 extra = 4 total

  // ---------- Haversine distance between two origins (km) ----------
  function haversineKm(a, b) {
    const R = 6371;
    const toRad = (d) => d * Math.PI / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const h = Math.sin(dLat/2)**2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng/2)**2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  function transitCost(km) {
    // rough CRH fare: ¥0.45/km + ¥40 base
    return Math.round(km * 0.45 + 40);
  }
  function transitHours(km) {
    // CRH avg 250km/h, +45min station buffer both ends
    return Math.round((km / 250 + 1.5) * 10) / 10;
  }

  // Greedy nearest-neighbor TSP starting from primary; returns ordered city key array
  function planTSP(primaryKey, extraKeys) {
    const cities = g('CITIES') || [];
    const byKey = {};
    for (const c of cities) byKey[c.key] = c;
    const order = [primaryKey];
    const remaining = new Set(extraKeys);
    let cursor = byKey[primaryKey];
    while (remaining.size) {
      let best = null, bestDist = Infinity;
      for (const k of remaining) {
        const d = haversineKm(cursor.origin, byKey[k].origin);
        if (d < bestDist) { bestDist = d; best = k; }
      }
      order.push(best);
      remaining.delete(best);
      cursor = byKey[best];
    }
    return order;
  }

  // ---------- UI render ----------
  function renderCityChips() {
    const cities = g('CITIES') || [];
    const container = document.getElementById('city-chips');
    const container2 = document.getElementById('city-chips-2');
    container.innerHTML = cities.map(c => `<div class="chip city-chip" data-city="${c.key}">${c.emoji} ${c.name}</div>`).join('');
    container.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      container.querySelectorAll('.chip').forEach(el => el.classList.remove('active'));
      chip.classList.add('active');
      state.city = chip.dataset.city;
      rebuildCity2Chips();
    });
    const first = container.querySelector('.chip');
    if (first) { first.classList.add('active'); state.city = first.dataset.city; }

    function updateTSPPreview() {
      const el = document.getElementById('tsp-preview');
      if (!el) return;
      if (!state.multiCity || !state.extraCities.length) { el.style.display = 'none'; return; }
      const primary = cities.find(c => c.key === state.city);
      if (!primary) { el.style.display = 'none'; return; }
      const order = planTSP(state.city, state.extraCities);
      const chain = order.map(k => {
        const c = cities.find(x => x.key === k);
        return c ? c.emoji + ' ' + c.name : k;
      }).join(' → ');
      el.style.display = 'block';
      el.textContent = `🗺 路线预览（按距离贪心排序）：${chain}`;
    }

    function rebuildCity2Chips() {
      if (!container2) return;
      container2.innerHTML = cities.filter(c => c.key !== state.city).map(c =>
        `<div class="chip city-chip" data-city="${c.key}">${c.emoji} ${c.name}</div>`
      ).join('');
      // Filter out primary from extras
      state.extraCities = state.extraCities.filter(k => k !== state.city);
      container2.querySelectorAll('.chip').forEach(chip => {
        if (state.extraCities.includes(chip.dataset.city)) chip.classList.add('active');
        chip.addEventListener('click', () => {
          const k = chip.dataset.city;
          if (state.extraCities.includes(k)) {
            state.extraCities = state.extraCities.filter(x => x !== k);
            chip.classList.remove('active');
          } else if (state.extraCities.length < MAX_EXTRA_CITIES) {
            state.extraCities.push(k);
            chip.classList.add('active');
          } else {
            toast(`最多选 ${MAX_EXTRA_CITIES} 个附加城市`);
            return;
          }
          updateTSPPreview();
        });
      });
      updateTSPPreview();
    }
    rebuildCity2Chips();

    // Multi-city toggle
    const toggle = document.getElementById('multi-city-toggle');
    if (toggle) {
      toggle.addEventListener('change', () => {
        state.multiCity = toggle.checked;
        container2.style.display = state.multiCity ? 'flex' : 'none';
        if (state.multiCity && state.days < 2) {
          state.days = 2;
          document.querySelectorAll('#days-row .day-btn').forEach(b => b.classList.toggle('active', parseInt(b.dataset.days,10) === 2));
        }
        updateTSPPreview();
      });
    }
  }

  function renderThemeChips() {
    const container = document.getElementById('theme-chips');
    const icons = { '历史文化':'🏛', '美食吃喝':'🍜', '自然户外':'🌲', '亲子遛娃':'👨‍👩‍👧', '摄影打卡':'📷', '度假慢游':'🏖' };
    container.innerHTML = Object.keys(THEME_FAMILIES).map(fam =>
      `<div class="chip" data-theme="${fam}">${icons[fam]||'✨'} ${fam}</div>`
    ).join('');
    container.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      chip.classList.toggle('active');
      state.themes = [...container.querySelectorAll('.chip.active')].map(el => el.dataset.theme);
    });
  }

  function bindDaysAndBudget() {
    document.getElementById('days-row').addEventListener('click', (e) => {
      const btn = e.target.closest('.day-btn');
      if (!btn) return;
      document.querySelectorAll('#days-row .day-btn').forEach(el => el.classList.remove('active'));
      btn.classList.add('active');
      state.days = parseInt(btn.dataset.days, 10);
    });
    document.getElementById('budget-row').addEventListener('click', (e) => {
      const btn = e.target.closest('.budget-btn');
      if (!btn) return;
      document.querySelectorAll('#budget-row .budget-btn').forEach(el => el.classList.remove('active'));
      btn.classList.add('active');
      state.budget = btn.dataset.budget;
    });
  }

  function renderPlan(plan) {
    const box = document.getElementById('result');
    if (plan.error) {
      box.innerHTML = `<div class="plan-summary"><div class="plan-summary-title">😕 ${plan.error}</div></div>`;
      box.style.display = 'block';
      return;
    }
    const cities = g('CITIES') || [];
    const city = cities.find(c => c.key === plan.cityKey);
    const cityDisplay = city ? `${city.emoji} ${city.name}` : plan.cityKey;

    let summaryTitle;
    if (plan.isNCity && plan.citiesOrder) {
      const chain = plan.citiesOrder.map(k => {
        const c = cities.find(x => x.key === k);
        return c ? `${c.emoji} ${c.name}` : k;
      }).join(' → ');
      summaryTitle = `${chain} · ${plan.numDays}日联程 · ${plan.totalDests} 个目的地`;
    } else if (plan.isMultiCity) {
      const cityB = cities.find(c => c.key === plan.cityKey2);
      const bDisplay = cityB ? `${cityB.emoji} ${cityB.name}` : plan.cityKey2;
      summaryTitle = `${cityDisplay} → ${bDisplay} · ${plan.numDays}日联程 · ${plan.totalDests} 个目的地`;
    } else {
      summaryTitle = `${cityDisplay} · ${plan.numDays}日 · ${plan.totalDests} 个目的地`;
    }
    let html = `
      <div class="plan-summary">
        <div class="plan-summary-title">${summaryTitle}</div>
        <div class="plan-summary-meta">
          <span>💰 预计人均 ¥${plan.totalBudget}${plan.isMultiCity ? '（含高铁 ¥'+plan.transit.cost+'）' : ''}</span>
          <span>🎯 ${plan.familyTags.join(' · ') || '全主题'}</span>
          <span>🏷 ${plan.userBudget}</span>
          ${plan.isMultiCity ? `<span>🚄 ${plan.transit.km}km · ${plan.transit.hours}h${plan.transit.hops > 1 ? ' · '+plan.transit.hops+' 次换乘' : ''}</span>` : ''}
        </div>
      </div>
    `;

    for (const day of plan.days) {
      // Transit marker between cities
      if (day.isTransit) {
        html += `
          <div style="background:linear-gradient(135deg,#E0F2F1 0%,#B2DFDB 100%);border-radius:14px;padding:16px 20px;margin:8px 0;display:flex;align-items:center;gap:14px;font-size:14px;color:#004D40;">
            <div style="font-size:32px;">🚄</div>
            <div style="flex:1;">
              <div style="font-weight:700;margin-bottom:2px;">${day.fromLabel} → ${day.toLabel}</div>
              <div style="font-size:12px;color:#00695C;">高铁约 ${day.hours}h · ${day.km}km · 车票约 ¥${day.cost}</div>
            </div>
          </div>
        `;
        continue;
      }
      const cityBadge = day.cityLabel ? `<span style="font-size:13px;color:var(--ink-500);margin-left:8px;font-weight:400;">${day.cityLabel}</span>` : '';
      html += `
        <div class="day-card">
          <div class="day-header">
            <div class="day-title">Day ${day.idx}${cityBadge}</div>
            <div class="day-meta">总时长约 ${day.hours}小时 · ${day.slots.length}个点</div>
          </div>
      `;
      for (const slot of day.slots) {
        const d = slot.dest;
        const tags = (d.tags || d.themes || []).slice(0, 3);
        const dCity = day.city || plan.cityKey;
        const destLink = `dest.html?id=${d.id}&city=${dCity}`;
        html += `
          <a class="dest-item" href="${destLink}" style="display:flex;text-decoration:none;color:inherit;">
            <div class="dest-time">${slot.startText}<br>-${slot.endText}</div>
            <div class="dest-body">
              <div class="dest-name">${d.name} <span style="color:var(--ink-300);font-weight:400;font-size:12px;">›</span></div>
              <div class="dest-sub">${d.subtitle || d.description?.slice(0,40) || ''}</div>
              <div class="dest-tags">${tags.map(t => `<span class="dest-tag">${t}</span>`).join('')}</div>
              <div class="dest-meta">
                <span>📍 ${d.distanceText || (d.distance + 'km')}</span>
                <span>⭐ ${d.rating || '--'}</span>
                <span>💵 ${d.budgetText || d.budget || '--'}</span>
              </div>
            </div>
          </a>
        `;
      }
      html += `</div>`;
    }

    const todayISO = new Date().toISOString().slice(0,10);
    html += `
      <div style="background:var(--surface);border-radius:12px;padding:12px 14px;margin:12px 0;display:flex;align-items:center;gap:10px;box-shadow:var(--shadow-sm);font-size:13px;">
        <span style="color:var(--ink-500);">📅 出发日期</span>
        <input type="date" id="plan-start-date" value="${todayISO}" style="flex:1;padding:6px 10px;border:1.5px solid var(--border);border-radius:8px;font-size:13px;">
        <span style="color:var(--ink-500);font-size:11px;">用于导出 ICS 日历</span>
      </div>
      <div class="action-row">
        <button class="action-btn primary" id="save-btn">💾 保存历史</button>
        <button class="action-btn" id="ics-btn">📅 导出日历</button>
        <button class="action-btn" id="share-btn">📤 分享卡</button>
        <button class="action-btn" id="copy-btn">📋 复制</button>
      </div>
    `;

    box.innerHTML = html;
    box.style.display = 'block';
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });

    document.getElementById('save-btn').addEventListener('click', () => savePlan(plan));
    document.getElementById('share-btn').addEventListener('click', () => generateShareCard(plan));
    document.getElementById('copy-btn').addEventListener('click', () => copyPlanText(plan));
    document.getElementById('ics-btn').addEventListener('click', () => {
      const startDateInp = document.getElementById('plan-start-date');
      const startDate = startDateInp ? startDateInp.value : new Date().toISOString().slice(0,10);
      exportICS(plan, startDate);
    });
  }

  // ---------- ICS (iCalendar) export ----------
  function padZ(n) { return String(n).padStart(2, '0'); }
  function isoToICSDate(isoDate, hourFloat) {
    // isoDate: "2026-04-20", hourFloat: 9.5 → "20260420T093000"
    const [y, m, d] = isoDate.split('-').map(Number);
    const hour = Math.floor(hourFloat);
    const min = Math.round((hourFloat - hour) * 60);
    return `${y}${padZ(m)}${padZ(d)}T${padZ(hour)}${padZ(min)}00`;
  }
  function addDaysISO(isoDate, n) {
    const d = new Date(isoDate + 'T00:00:00');
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0,10);
  }
  function icsEscape(s) {
    return String(s || '').replace(/[\\;,]/g, m => '\\' + m).replace(/\n/g, '\\n');
  }
  function foldLine(line) {
    // RFC 5545: lines > 75 bytes must be folded with CRLF + space
    if (line.length <= 74) return line;
    const parts = [];
    let i = 0;
    while (i < line.length) {
      const chunk = line.slice(i, i + 73);
      parts.push(i === 0 ? chunk : ' ' + chunk);
      i += 73;
    }
    return parts.join('\r\n');
  }

  function exportICS(plan, startDate) {
    const cities = g('CITIES') || [];
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//WeekendGo//Trip Planner//ZH',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      `X-WR-CALNAME:${icsEscape('WeekendGo ' + plan.numDays + '日行程')}`
    ];

    let dayOffset = 0;
    const nowStamp = new Date().toISOString().replace(/[-:]|\.\d+/g, '').slice(0, 15) + 'Z';

    for (const day of plan.days) {
      if (day.isTransit) {
        // Transit event 08:00-10:00 (placeholder) of the start date of next day segment
        const transitDate = addDaysISO(startDate, dayOffset);
        const uid = `transit-${transitDate}-${day.fromCity}-${day.toCity}@weekend-go`;
        lines.push('BEGIN:VEVENT');
        lines.push('UID:' + uid);
        lines.push('DTSTAMP:' + nowStamp);
        // Transit kicks off at 07:30 previous day's end, but keep simple: 08:00 - 08+h:00 same day as next city
        const tStart = isoToICSDate(transitDate, 8);
        const tEnd = isoToICSDate(transitDate, 8 + day.hours);
        lines.push('DTSTART;TZID=Asia/Shanghai:' + tStart);
        lines.push('DTEND;TZID=Asia/Shanghai:' + tEnd);
        lines.push(foldLine('SUMMARY:🚄 ' + icsEscape(day.fromLabel + ' → ' + day.toLabel)));
        lines.push(foldLine('DESCRIPTION:' + icsEscape(`高铁约 ${day.hours}h · ${day.km}km · 车票约 ¥${day.cost}`)));
        lines.push('LOCATION:' + icsEscape(day.fromLabel + ' → ' + day.toLabel));
        lines.push('END:VEVENT');
        continue;
      }
      // Regular day
      const dateISO = addDaysISO(startDate, dayOffset);
      for (const slot of day.slots) {
        const d = slot.dest;
        const uid = `dest-${d.id}-${dateISO}@weekend-go`;
        const cityObj = cities.find(c => c.key === day.city);
        const cityLabel = cityObj ? (cityObj.emoji + ' ' + cityObj.name) : (day.city || '');

        lines.push('BEGIN:VEVENT');
        lines.push('UID:' + uid);
        lines.push('DTSTAMP:' + nowStamp);
        lines.push('DTSTART;TZID=Asia/Shanghai:' + isoToICSDate(dateISO, slot.start));
        lines.push('DTEND;TZID=Asia/Shanghai:' + isoToICSDate(dateISO, slot.end));
        lines.push(foldLine('SUMMARY:' + icsEscape(d.name + (d.subtitle ? ' · ' + d.subtitle : ''))));
        const descLines = [];
        if (cityLabel) descLines.push('📍 ' + cityLabel);
        if (d.distanceText) descLines.push('距离 ' + d.distanceText);
        if (d.rating) descLines.push('⭐ ' + d.rating);
        if (d.budgetText || d.budget) descLines.push('💰 ' + (d.budgetText || d.budget));
        if (d.howToGet) descLines.push('🚆 ' + d.howToGet.slice(0, 100));
        if (d.whereToEat) descLines.push('🍜 ' + String(d.whereToEat).slice(0, 100));
        descLines.push('详情: https://sherconan.github.io/weekend-go/dest.html?id=' + d.id + '&city=' + day.city);
        lines.push(foldLine('DESCRIPTION:' + icsEscape(descLines.join('\n'))));
        lines.push('LOCATION:' + icsEscape(d.name + (cityLabel ? ', ' + cityLabel.replace(/^[^ ]+ /, '') : '')));
        lines.push('URL:https://sherconan.github.io/weekend-go/dest.html?id=' + d.id + '&city=' + day.city);
        lines.push('END:VEVENT');
      }
      dayOffset++;
    }
    lines.push('END:VCALENDAR');
    const content = lines.join('\r\n');

    // Download
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const cityObj = cities.find(c => c.key === plan.cityKey);
    const cityName = cityObj ? cityObj.name : plan.cityKey;
    a.download = `WeekendGo-${cityName}-${plan.numDays}日.ics`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
    toast('✓ ICS 日历已下载 · 双击导入');
  }

  // ---------- Persistence ----------
  const LS_KEY = 'wg_plans_v1';
  function savePlan(plan) {
    const plans = loadHistory();
    plans.unshift(plan);
    localStorage.setItem(LS_KEY, JSON.stringify(plans.slice(0, 20))); // cap 20
    renderHistory();
    toast('✓ 已保存');
  }
  function loadHistory() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }
    catch { return []; }
  }
  function renderHistory() {
    const box = document.getElementById('history');
    const plans = loadHistory();
    if (!plans.length) {
      box.innerHTML = `<div class="history-empty">还没有保存的行程。生成一个试试？</div>`;
      return;
    }
    const cities = g('CITIES') || [];
    box.innerHTML = plans.map((p, i) => {
      const city = cities.find(c => c.key === p.cityKey);
      const date = new Date(p.createdAt);
      const dateStr = `${date.getMonth()+1}/${date.getDate()} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
      return `
        <div class="history-item" data-idx="${i}">
          <div class="history-item-main">
            <div class="history-item-title">${city ? city.emoji : '📍'} ${city ? city.name : p.cityKey} · ${p.numDays}日 · ${p.totalDests}点</div>
            <div class="history-item-sub">${p.familyTags.join(' · ') || '全主题'} · ${p.userBudget} · ${dateStr}</div>
          </div>
          <div class="history-item-actions">
            <button class="history-del" data-del="${i}" title="删除">×</button>
          </div>
        </div>
      `;
    }).join('');
    box.querySelectorAll('.history-item').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.dataset.del !== undefined) {
          e.stopPropagation();
          const i = parseInt(e.target.dataset.del, 10);
          const ps = loadHistory();
          ps.splice(i, 1);
          localStorage.setItem(LS_KEY, JSON.stringify(ps));
          renderHistory();
          toast('已删除');
          return;
        }
        const idx = parseInt(el.dataset.idx, 10);
        renderPlan(plans[idx]);
      });
    });
  }

  // ---------- Share card (Canvas) ----------
  function generateShareCard(plan) {
    const cities = g('CITIES') || [];
    const city = cities.find(c => c.key === plan.cityKey);
    const cityName = city ? city.name : plan.cityKey;
    const emoji = city ? city.emoji : '🗺';

    const W = 1080, H = 1920;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d');

    // BG gradient
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#FFF8E1');
    grad.addColorStop(1, '#FFF3E0');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Header block
    ctx.fillStyle = '#FF7043';
    ctx.fillRect(0, 0, W, 240);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 52px "PingFang SC", sans-serif';
    ctx.fillText('周末去哪儿 · 我的行程', 60, 110);
    ctx.font = '36px "PingFang SC", sans-serif';
    ctx.fillText(`${emoji} ${cityName} · ${plan.numDays}日 · ${plan.totalDests} 个目的地`, 60, 180);

    // Meta
    ctx.fillStyle = '#344054';
    let y = 310;
    ctx.font = '28px "PingFang SC", sans-serif';
    ctx.fillText(`💰 预计人均 ¥${plan.totalBudget}`, 60, y); y += 50;
    ctx.fillText(`🎯 ${plan.familyTags.join(' · ') || '全主题'}`, 60, y); y += 70;

    // Days
    for (const day of plan.days) {
      ctx.fillStyle = '#FF7043';
      ctx.font = 'bold 42px "PingFang SC", sans-serif';
      ctx.fillText(`Day ${day.idx}`, 60, y); y += 56;
      for (const slot of day.slots) {
        if (y > H - 200) break;
        ctx.fillStyle = '#FF7043';
        ctx.font = 'bold 22px "PingFang SC", sans-serif';
        ctx.fillText(`${slot.startText}-${slot.endText}`, 60, y);
        ctx.fillStyle = '#101828';
        ctx.font = 'bold 30px "PingFang SC", sans-serif';
        ctx.fillText(slot.dest.name, 220, y);
        ctx.fillStyle = '#667085';
        ctx.font = '22px "PingFang SC", sans-serif';
        ctx.fillText((slot.dest.subtitle || '').slice(0, 24), 220, y + 34);
        y += 78;
      }
      y += 20;
      if (y > H - 200) break;
    }

    // Footer
    ctx.fillStyle = '#667085';
    ctx.font = '22px "PingFang SC", sans-serif';
    ctx.fillText('生成于 sherconan.github.io/weekend-go/planner.html', 60, H - 60);

    c.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `WeekendGo-${cityName}-${plan.numDays}日行程.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 3000);
      toast('✓ 分享卡已下载');
    }, 'image/png');
  }

  function copyPlanText(plan) {
    const cities = g('CITIES') || [];
    const city = cities.find(c => c.key === plan.cityKey);
    let text = `🗺 ${city ? city.name : plan.cityKey} ${plan.numDays}日行程（周末去哪儿）\n`;
    text += `💰 预计人均 ¥${plan.totalBudget}  🎯 ${plan.familyTags.join(' · ') || '全主题'}\n\n`;
    for (const day of plan.days) {
      text += `【Day ${day.idx}】约 ${day.hours}小时\n`;
      for (const slot of day.slots) {
        text += `  ${slot.startText}-${slot.endText} ${slot.dest.name}\n`;
        if (slot.dest.subtitle) text += `    ${slot.dest.subtitle}\n`;
      }
      text += '\n';
    }
    text += '生成自 sherconan.github.io/weekend-go/planner.html';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => toast('✓ 已复制到剪贴板'));
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      toast('✓ 已复制');
    }
  }

  // ---------- Toast ----------
  let toastTimer;
  function toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
  }

  // ---------- Init ----------
  function init() {
    renderCityChips();
    renderThemeChips();
    bindDaysAndBudget();
    renderHistory();
    document.getElementById('gen-btn').addEventListener('click', () => {
      if (!state.city) { toast('请先选城市'); return; }
      if (state.multiCity) {
        if (!state.extraCities.length) { toast('多城模式请再选至少 1 座城市'); return; }
        const needed = state.extraCities.length + 1;
        if (state.days < needed) { toast(`${needed} 城至少需要 ${needed} 天`); return; }
      }
      const plan = generatePlan(
        state.city, state.days, state.themes, state.budget,
        state.multiCity ? state.extraCities : null
      );
      renderPlan(plan);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
