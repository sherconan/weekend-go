// Agent 工具层：在 data.json 上做检索与详情查询
// 季节打分与 web 端 js/top3.js 同语义同正则（四季皆宜优先于具体区间）
const DATA = require('./data.json');

const CITY_KEYS = Object.keys(DATA.cities);

function seasonName(m) {
  if (m >= 3 && m <= 5) return '春';
  if (m >= 6 && m <= 8) return '夏';
  if (m >= 9 && m <= 11) return '秋';
  return '冬';
}

const RANGE_RE = /(\d+)月?[底中初旬上下]{0,2}[-~到至](?:次年)?(\d+)月/;

function seasonScore(bestSeason, month) {
  const m = month || (new Date().getMonth() + 1);
  const bs = String(bestSeason == null ? '' : bestSeason).trim().replace(/\s+/g, '');
  if (!bs) return 1; // 缺字段按中性
  if (/四季|全年|皆宜|皆可/.test(bs)) return 1.2;
  const range = bs.match(RANGE_RE);
  if (range) {
    const lo = parseInt(range[1], 10);
    const hi = parseInt(range[2], 10);
    const inRange = lo <= hi ? (m >= lo && m <= hi) : (m >= lo || m <= hi);
    return inRange ? 3 : 0.3;
  }
  const single = bs.match(/(\d+)月/);
  if (single) {
    const sm = parseInt(single[1], 10);
    if (sm === m) return 2.5;
    if (Math.abs(sm - m) <= 1) return 1.5;
  }
  if (bs.indexOf(seasonName(m)) !== -1) return 2;
  return 1;
}

function weekendScore(d) {
  const dur = d.duration || [];
  if (dur.includes('半日游') || dur.includes('一日往返')) return 2;
  if (dur.includes('两日一夜')) return 1.5;
  if (dur.includes('三日两夜')) return 0.5;
  return 1;
}

function heatScore(d) {
  return d.heatTier === 'high' ? 1 : d.heatTier === 'mid' ? 0.6 : 0.3;
}

function scoreDest(d, month) {
  return seasonScore(d.bestSeason, month) * 2.2 + weekendScore(d) * 1.6 + (d.rating || 0) * 0.6 + heatScore(d);
}

const BUDGET_ORDER = { '200以下': 1, '200-500': 2, '500-1000': 3, '1000以上': 4 };

function normCity(city) {
  return CITY_KEYS.includes(city) ? city : 'beijing';
}

function seasonNote(d, month) {
  const sc = seasonScore(d.bestSeason, month);
  if (sc >= 3) return '当季';
  if (sc === 0.3) return '当前反季（' + d.bestSeason + '）';
  return '';
}

// 工具1：按条件搜索（默认只在内容扎实的非 facet 池里；反季不隐藏但明确标注）
function searchDestinations(args, month) {
  const city = normCity(args.city);
  const m = month || (new Date().getMonth() + 1);
  const kw = String(args.keywords || '').trim();
  const themes = Array.isArray(args.themes) ? args.themes.filter(Boolean) : [];
  const duration = String(args.duration || '').trim();
  const budgetMax = String(args.budget_max || '').trim();
  const maxKm = Number(args.max_distance_km) || 0;
  const limit = Math.min(Math.max(Number(args.limit) || 6, 1), 8);

  let pool = DATA.cities[city].dests.filter((d) => d.solid && !d.shared);
  if (themes.length) pool = pool.filter((d) => themes.some((t) => (d.themes || []).includes(t) || (d.tags || []).includes(t)));
  if (duration) pool = pool.filter((d) => (d.duration || []).includes(duration));
  if (budgetMax && BUDGET_ORDER[budgetMax]) pool = pool.filter((d) => !d.budget || (BUDGET_ORDER[d.budget] || 2) <= BUDGET_ORDER[budgetMax]);
  if (maxKm > 0) pool = pool.filter((d) => d.distance == null || d.distance <= maxKm);
  if (kw) {
    const kws = kw.split(/[\s,，、]+/).filter(Boolean);
    pool = pool.filter((d) => {
      const hay = [d.name, d.subtitle, d.highlight, (d.themes || []).join(' '), (d.tags || []).join(' ')].join(' ');
      return kws.some((k) => hay.includes(k));
    });
  }

  const ranked = pool
    .map((d) => ({ d, score: scoreDest(d, m) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ d }) => ({
      id: d.id,
      name: d.name,
      subtitle: d.subtitle,
      distanceText: d.distanceText,
      duration: (d.duration || []).join('/'),
      transport: (d.transport || []).slice(0, 2).join('/'),
      budgetText: d.budgetText,
      rating: d.rating,
      themes: (d.themes || []).slice(0, 4),
      bestSeason: d.bestSeason,
      seasonNote: seasonNote(d, m),
      highlight: d.highlight,
    }));

  return { city, cityLabel: DATA.cities[city].label, month: m, count: ranked.length, results: ranked };
}

// 工具2：取详情（玩法/交通/美食/住宿/贴士）
function getDestinationDetail(args) {
  const city = normCity(args.city);
  const id = Number(args.id);
  const byId = DATA.cities[city].dests.find((d) => d.id === id);
  const byName = !byId && args.name
    ? DATA.cities[city].dests.find((d) => d.name === String(args.name).trim())
    : null;
  const d = byId || byName;
  if (!d) return { error: `在 ${DATA.cities[city].label} 没找到该目的地（id=${args.id || ''} name=${args.name || ''}）` };
  return {
    id: d.id, name: d.name, subtitle: d.subtitle,
    distanceText: d.distanceText, duration: (d.duration || []).join('/'),
    budgetText: d.budgetText, rating: d.rating, bestSeason: d.bestSeason,
    overview: d.detail.overview, whatToDo: d.detail.whatToDo,
    whereToEat: d.detail.whereToEat, whereToStay: d.detail.whereToStay,
    howToGet: d.detail.howToGet, tips: d.detail.tips,
  };
}

// 给前端渲染卡片用：按 id 取卡片摘要
function cardById(city, id) {
  const d = DATA.cities[normCity(city)].dests.find((x) => x.id === id);
  if (!d) return null;
  return { id: d.id, name: d.name, subtitle: d.subtitle, distanceText: d.distanceText, rating: d.rating, image: d.id != null ? undefined : undefined, city: normCity(city) };
}

module.exports = { DATA, CITY_KEYS, seasonScore, scoreDest, searchDestinations, getDestinationDetail, cardById, normCity, seasonName };
