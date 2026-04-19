// recent.js — 主页 hero 下 "最近打卡" 3 卡
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

  function findDestMeta(destId) {
    const SOURCE_VARS = [
      ['DESTINATIONS','beijing'],['DESTINATIONS_EXTRA','beijing'],['DESTINATIONS_EXTRA2','beijing'],
      ['DESTINATIONS_BJ500','beijing'],['DESTINATIONS_BJ_EXPAND','beijing'],['DESTINATIONS_BJ_HIDDEN','beijing'],
      ['DESTINATIONS_BJ_TALES','beijing'],['DESTINATIONS_BJ_2026','beijing'],
      ['DESTINATIONS_SZ','shenzhen'],['DESTINATIONS_WH','weihai'],['DESTINATIONS_SU','suzhou'],
      ['DESTINATIONS_TJ','tianjin'],['DESTINATIONS_QD','qingdao'],['DESTINATIONS_CD','chengdu'],['DESTINATIONS_HZ','hangzhou']
    ];
    for (const [v, city] of SOURCE_VARS) {
      const arr = g(v);
      if (!Array.isArray(arr)) continue;
      for (const d of arr) {
        if (String(d.id) === String(destId)) return { dest: d, city };
      }
    }
    const shared = g('SHARED_CROSS_CITY_DESTS') || [];
    for (const s of shared) {
      if (String(s.id) === String(destId)) {
        const firstCity = s.cities ? Object.keys(s.cities)[0] : 'beijing';
        return { dest: s, city: firstCity };
      }
    }
    return null;
  }

  function formatRelTime(isoDate) {
    if (!isoDate) return '';
    const t = new Date(isoDate);
    const diff = Math.floor((Date.now() - t.getTime()) / 1000);
    if (diff < 60) return '刚刚';
    if (diff < 3600) return Math.floor(diff/60) + '分钟前';
    if (diff < 86400) return Math.floor(diff/3600) + '小时前';
    if (diff < 604800) return Math.floor(diff/86400) + '天前';
    return t.toLocaleDateString('zh-CN');
  }

  function render() {
    const container = document.getElementById('recent-stamps');
    if (!container) return;
    const visited = getVisited();
    const entries = Object.entries(visited)
      .map(([id, v]) => ({ id, name: v.name, date: v.date || v.ts }))
      .filter(e => e.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);

    if (!entries.length) {
      container.innerHTML = `
        <a href="#filters" onclick="scrollToSection('filters');return false;"
           style="display:block;background:var(--surface,#fff);border-radius:14px;padding:16px 20px;text-align:center;color:#667085;font-size:13px;text-decoration:none;border:1.5px dashed #E5E7EB;">
          🗺 还没打过卡——往下滚动选一个目的地，回来这里能看到最近足迹
        </a>
      `;
      return;
    }

    const cities = g('CITIES') || [];
    container.innerHTML = entries.map(e => {
      const meta = findDestMeta(e.id);
      let cityEmoji = '📍';
      let cityName = '';
      let subtitle = '';
      let imgPath = null;
      if (meta) {
        const cObj = cities.find(c => c.key === meta.city);
        if (cObj) { cityEmoji = cObj.emoji; cityName = cObj.name; }
        subtitle = meta.dest.subtitle || meta.dest.description?.slice(0, 30) || '';
        imgPath = (typeof getDestImage === 'function') ? getDestImage(meta.dest) : null;
      }
      const href = meta ? `dest.html?id=${e.id}&city=${meta.city}` : '#';
      const thumb = imgPath
        ? `<div style="width:100%;height:90px;background:url('${imgPath}') center/cover;border-radius:10px 10px 0 0;"></div>`
        : `<div style="width:100%;height:90px;background:${meta?.dest?.gradient || 'linear-gradient(135deg,#FF7043,#FFC107)'};border-radius:10px 10px 0 0;display:flex;align-items:center;justify-content:center;font-size:32px;">${cityEmoji}</div>`;
      return `
        <a href="${href}" style="background:var(--surface,#fff);border-radius:12px;overflow:hidden;text-decoration:none;color:inherit;box-shadow:0 2px 8px rgba(16,24,40,.06);display:block;transition:transform .15s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform=''">
          ${thumb}
          <div style="padding:10px 12px;">
            <div style="font-size:11px;color:#667085;margin-bottom:3px;">${cityEmoji} ${cityName} · ${formatRelTime(e.date)}</div>
            <div style="font-size:14px;font-weight:700;margin-bottom:2px;line-height:1.2;">${e.name}</div>
            <div style="font-size:11px;color:#667085;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${subtitle}</div>
          </div>
        </a>
      `;
    }).join('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(render, 120));
  } else {
    setTimeout(render, 120);
  }

  window.addEventListener('storage', render);
})();
