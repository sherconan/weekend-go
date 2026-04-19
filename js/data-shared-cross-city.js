// Phase 2 B · 跨城共享景点（cities{} facet schema）
// 这些景点物理上在某个城市，但在周边城市的"500km 范围内"也会被游客选。
// 统一入口，每个城市按各自 distance/transport/duration 视图展示。

const SHARED_CROSS_CITY_DESTS = [
  {
    id: 5001,
    slug: 'qingdao-zhanqiao',
    name: '栈桥',
    // 公共字段（所有城市共享）
    subtitle: '青岛海滨地标·百年老栈',
    themes: ['海边', '历史', '观景'],
    budget: '200以下',
    budgetText: '免费',
    rating: 4.5,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    whereToEat: '王姐烧烤 / 劈柴院小吃',
    whereToStay: '中山路老城区民宿',
    highlight: '回澜阁·清代始建',
    tags: ['地标', '老城', '海边'],
    imageQuery: 'Qingdao Zhanqiao Pier sunset',
    bestSeason: '5-10月·冬夜东北风涨潮最独特',
    tips: '1. 免费\n2. 日出+日落最美\n3. 潮涨潮落看完全不同\n4. 冬季夜潮可听礁石共振钟声（见另一面）',
    // 每个城市的视图字段
    cities: {
      qingdao: { distance: 1,   distanceText: '1km',   duration: ['半日游'],       transport: ['步行', '公交可达'] },
      weihai:  { distance: 265, distanceText: '265km', duration: ['两日一夜'],    transport: ['自驾', '高铁+公交'] }
    }
  },
  {
    id: 5002,
    slug: 'qingdao-laoshan',
    name: '崂山',
    subtitle: '海上名山·道教发源地',
    themes: ['爬山', '宗教', '自然'],
    budget: '200-500',
    budgetText: '门票 ¥90-180（分区）',
    rating: 4.6,
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    whereToEat: '崂山脚下农家·崂山豆腐',
    whereToStay: '崂山客栈',
    highlight: '1132.7m·太清宫·蒲松龄聊斋写作地',
    tags: ['道教', '徒步', '海景'],
    imageQuery: 'Laoshan Mountain Qingdao sunrise',
    bestSeason: '4-10月',
    tips: '1. 流清游览区 ¥90\n2. 太清游览区 ¥180 (含索道)\n3. 徒步登顶 4-6h',
    cities: {
      qingdao: { distance: 40,  distanceText: '40km',  duration: ['一日往返'],    transport: ['自驾', '公交'] },
      weihai:  { distance: 280, distanceText: '280km', duration: ['两日一夜'],    transport: ['自驾', '高铁+包车'] }
    }
  },
  {
    id: 5003,
    slug: 'qingdao-badaguan',
    name: '八大关',
    subtitle: '万国建筑博览·青岛最美街区',
    themes: ['建筑', '文艺', '历史'],
    budget: '200以下',
    budgetText: '免费',
    rating: 4.7,
    gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    whereToEat: '花石楼附近 / 太平角 Jyoti',
    whereToStay: '八大关精品酒店',
    highlight: '200 余栋欧美日式别墅',
    tags: ['异域', '老别墅', '蒋介石公馆'],
    imageQuery: 'Qingdao Badaguan Scenic Area European villas',
    bestSeason: '春秋',
    tips: '1. 免费\n2. 韶关路最美\n3. 花石楼需单独购票 ¥10',
    cities: {
      qingdao: { distance: 6,   distanceText: '6km',   duration: ['半日游'],       transport: ['公交可达', '地铁'] },
      weihai:  { distance: 270, distanceText: '270km', duration: ['两日一夜'],    transport: ['自驾', '高铁+公交'] }
    }
  },
  {
    id: 5004,
    slug: 'tianjin-binhai-library',
    name: '天津滨海图书馆',
    subtitle: "'滨海之眼'·刷爆 Instagram",
    themes: ['建筑', '文艺', '摄影'],
    budget: '200以下',
    budgetText: '免费',
    rating: 4.4,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    whereToEat: '滨海万象汇',
    whereToStay: '滨海泰达万丽',
    highlight: 'MVRDV 设计·3.4 万㎡·滨海之眼球体',
    tags: ['网红建筑', 'MVRDV', '书墙'],
    imageQuery: 'Tianjin Binhai Library',
    bestSeason: '四季',
    tips: '1. 免费但需预约\n2. 白色阶梯书墙·必拍\n3. 工作日人少',
    cities: {
      tianjin: { distance: 50,  distanceText: '50km',  duration: ['半日游'],       transport: ['地铁 9 号线'] },
      beijing: { distance: 170, distanceText: '170km', duration: ['一日往返'],    transport: ['高铁', '自驾'] }
    }
  }
];

if (typeof window !== 'undefined') window.SHARED_CROSS_CITY_DESTS = SHARED_CROSS_CITY_DESTS;
if (typeof module !== 'undefined' && module.exports) module.exports = SHARED_CROSS_CITY_DESTS;
