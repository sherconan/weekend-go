/**
 * WeekendGo · 单一城市注册表
 * ⭐ 新增一个城市，只需改这一个文件（加一项）。所有 city-selector / hot-words / hero-badge / stats / search tabs / 小程序 CITY_CONFIG 都由此派生。
 *
 * 必填：key, name, emoji, origin (lat/lng), maxRange
 * 选填：badge, desc, color, hotWords, hasLegends
 */
const CITIES = [
  {
    key: 'beijing',
    name: '北京',
    emoji: '🏯',
    color: '#4CAF50',
    origin: { lat: 39.9042, lng: 116.4074 }, // 北京站/天安门一带
    maxRange: 500, // km，纳入"周边游"的最大直线距离
    badge: '🌱 北京周边游 · 2026 春季版',
    desc: '从北京出发，500公里范围内的精选目的地。',
    hotWords: ['故宫', '长城', '环球影城', '颐和园', '古北水镇', '798', '雍和宫', '锁龙井'],
    hasLegends: true
  },
  {
    key: 'shenzhen',
    name: '深圳',
    emoji: '🏖',
    color: '#2196F3',
    origin: { lat: 22.5431, lng: 114.0579 }, // 深圳福田
    maxRange: 500,
    badge: '🏖 深圳周边游 · 2026 春季版',
    desc: '从深圳出发，海滩、美食、古镇，应有尽有。',
    hotWords: ['大梅沙', '世界之窗', '东部华侨城', '深圳湾', '甘坑', '大鹏所城'],
    hasLegends: true
  },
  {
    key: 'weihai',
    name: '威海',
    emoji: '🌊',
    color: '#9C27B0',
    origin: { lat: 37.5128, lng: 122.1201 }, // 威海站
    maxRange: 500,
    badge: '🌊 威海周边游 · 2026 春季版',
    desc: '从威海出发，海鲜、海景、韩国风情。',
    hotWords: ['刘公岛', '那香海', '威海湾', '成山头', '国际海水浴场'],
    hasLegends: true
  },
  {
    key: 'suzhou',
    name: '苏州',
    emoji: '🏮',
    color: '#FF7043',
    origin: { lat: 31.2983, lng: 120.5832 }, // 苏州站
    maxRange: 500,
    badge: '🏮 苏州周边游 · 2026 春季版',
    desc: '从苏州出发，江南园林、水乡古镇、太湖烟雨。',
    hotWords: ['拙政园', '平江路', '山塘街', '虎丘', '同里古镇', '金鸡湖'],
    hasLegends: true
  },
  {
    key: 'tianjin',
    name: '天津',
    emoji: '🥐',
    color: '#E91E63',
    origin: { lat: 39.1040, lng: 117.2010 }, // 天津站
    maxRange: 500,
    badge: '🥐 天津周边游 · 2026 春季版',
    desc: '从天津出发，洋楼、相声、狗不理，海河一日游到京冀晋辽。',
    hotWords: ['五大道', '古文化街', '意式风情区', '天津之眼', '独乐寺', '盘山', '瓷房子', '海河'],
    hasLegends: false
  },
  {
    key: 'qingdao',
    name: '青岛',
    emoji: '🍺',
    color: '#FFC107',
    origin: { lat: 36.0671, lng: 120.3148 }, // 青岛站
    maxRange: 500,
    badge: '🍺 青岛周边游 · 2026 春季版',
    desc: '从青岛出发，栈桥、崂山、啤酒节，海边+山居任选。',
    hotWords: ['栈桥', '崂山', '八大关', '奥帆中心', '青岛啤酒博物馆', '第一海水浴场', '五四广场', '信号山'],
    hasLegends: true
  }
];

/**
 * 距离 tier（按直线距离分层）。
 * Phase 2 启用（每条景点加 location 坐标后）。Phase 1 保留为工具函数。
 */
const DISTANCE_TIERS = [
  { key: 'nearby', label: '近郊', minKm: 0,   maxKm: 100, durationDefault: ['半日游', '一日往返'] },
  { key: 'short',  label: '短途', minKm: 100, maxKm: 300, durationDefault: ['一日往返'] },
  { key: 'mid',    label: '中途', minKm: 300, maxKm: 600, durationDefault: ['两日一夜'] },
  { key: 'long',   label: '长途', minKm: 600, maxKm: 2000, durationDefault: ['两日一夜', '三日两夜'] }
];

/**
 * Haversine 公式：两经纬点直线距离（km）。
 */
function haversineKm(a, b) {
  if (!a || !b) return null;
  const R = 6371;
  const toRad = (d) => d * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return Math.round(R * c);
}

/**
 * 查城市配置。
 */
function getCityConfig(cityKey) {
  return CITIES.find(c => c.key === cityKey) || null;
}

/**
 * 按距离给 tier。
 */
function tierForDistance(km) {
  return DISTANCE_TIERS.find(t => km >= t.minKm && km < t.maxKm) || DISTANCE_TIERS[DISTANCE_TIERS.length - 1];
}

// Expose for both browser (Web) and miniprogram (CommonJS) contexts
if (typeof window !== 'undefined') {
  window.CITIES = CITIES;
  window.DISTANCE_TIERS = DISTANCE_TIERS;
  window.haversineKm = haversineKm;
  window.getCityConfig = getCityConfig;
  window.tierForDistance = tierForDistance;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CITIES, DISTANCE_TIERS, haversineKm, getCityConfig, tierForDistance };
}
