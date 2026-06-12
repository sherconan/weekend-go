// Phase 2 B · 跨城共享景点（cities{} facet schema）
// 这些景点物理上在某个城市，但在周边城市的"500km 范围内"也会被游客选。
// 统一入口，每个城市按各自 distance/transport/duration 视图展示。

const SHARED_CROSS_CITY_DESTS = [
  {
    id: 5001,
    slug: 'qingdao-zhanqiao',
    name: '栈桥',
    whatToDo: '1. 走到栈桥尽头回澜阁，360 度看青岛湾；2. 冬季（11月-次年3月）是喂海鸥的首选地，带点面包；3. 傍晚在桥上拍老城红瓦+夕阳；4. 周边步行串联中山路、劈柴院、天主教堂，老城半日刚好。',
    howToGet: '地铁：1/3 号线青岛站 G 口出步行约 500 米\n火车：青岛站下车步行约 10 分钟\n提示：旺季桥上人多，早 8 点前或日落后体验最好',
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
    whatToDo: '1. 经典南线=太清+仰口：大河东游客中心购票坐观光车（坐右侧看海）；2. 太清宫看千年道教祖庭，蒲松龄《聊斋》崂山道士的原型地；3. 垭口换乘 618 沿海公交（1 元）到仰口，整条路是最美海岸线；4. 仰口觅天洞手脚并用钻 5 层天然石洞，登顶天苑看仰口湾全景；5. 体力好选巨峰线登崂山主峰 1132 米；6. 亲子选北九水玩溪流瀑布。',
    howToGet: '地铁：4 号线大河东站出站即南线游客服务中心\n公交：市区 304 路至大河东，约 1.5 小时\n自驾：导航「崂山大河东游客服务中心」，停车 10-30 元；山路弯多，观光车含在门票内',
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
    whatToDo: '1. 花石楼（约 10 元）登楼看第二海水浴场全景，老青岛最出名的海景洋楼；2. 从第一海水浴场沿滨海木栈道步行进入，是最美的打开方式；3. 八条以关隘命名的马路逛老别墅建筑群，春有花、秋有叶四季各异；4. 第二海水浴场礁石区拍照人少景好。',
    howToGet: '步行：第一海水浴场沿滨海木栈道步行约 20 分钟即入景区（推荐）\n地铁：3 号线中山公园站步行约 1 公里\n提示：区内免费开放，花石楼等单体建筑单独购票',
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
    id: 5005,
    slug: 'mount-tai',
    name: '泰山',
    whatToDo: '1. 经典红门御道徒步：红门→中天门→十八盘→南天门→天街→玉皇顶，全程约 6 小时；2. 省力路线：天外村坐景区大巴到中天门，再索道（单程约 100 元）直上南天门；3. 夜爬看日出：约 21 点红门出发，日出点选瞻鲁台或日观峰，山顶可租军大衣（约 30 元）；4. 十八盘 1600 级是最陡精华段，量力选索道；5. 门票 115 元三日有效，学生半价。',
    howToGet: '高铁：北京南/济南至泰安站约 2 小时起，转 37 路公交或出租车（约 35 元）至红门，约 40 分钟\n火车：泰山站离登山口更近，3 路公交直达红门（徒步起点）或天外村（乘车起点）\n自驾：京台高速泰安出口下，导航「红门游客中心」',
    subtitle: '五岳独尊·世界文化与自然双遗产',
    themes: ['爬山', '历史', '世界遗产'],
    budget: '500-1000',
    budgetText: '门票 ¥115+交通+住宿',
    rating: 4.9,
    gradient: 'linear-gradient(135deg, #37474F 0%, #78909C 100%)',
    whereToEat: '岱庙街糖葫芦 / 红门路泰山煎饼',
    whereToStay: '山顶神憩宾馆（看日出）/ 岱庙酒店',
    highlight: '秦始皇至清 13 帝封禅·1545m·日出云海',
    tags: ['五岳', '日出', '封禅', '世界遗产', '泰安'],
    imageQuery: 'Mount Tai sunrise ancient stairs Shandong',
    bestSeason: '4-10月（夜爬看日出最经典）',
    tips: '1. 门票 ¥115 + 索道 ¥100\n2. 夜爬经典：21 点红门出发\n3. 十八盘最陡 1600 级\n4. 山顶需住宿待日出',
    cities: {
      beijing: { distance: 450, distanceText: '450km', duration: ['两日一夜'], transport: ['高铁+大巴', '自驾'] },
      weihai:  { distance: 480, distanceText: '480km', duration: ['两日一夜', '三日两夜'], transport: ['自驾', '高铁'] }
    }
  },
  {
    id: 5004,
    slug: 'tianjin-binhai-library',
    name: '天津滨海图书馆',
    whatToDo: '1. 「滨海之眼」球形中庭+波浪书山是必拍机位（《庆余年》取景地）；2. 微信小程序「天津市滨海新区图书馆」免费预约，带身份证；3. 馆在滨海文化中心商场内，从南 1 门进（导航常带错路）；4. 馆内转一圈约 1 小时，可顺路逛同楼美术馆、科技馆；5. 出馆步行 10 分钟到 K11/万达用餐。注意周一闭馆，周二至周日 9:30-20:00。',
    howToGet: '高铁：京津城际至滨海站，北京出发约 1 小时，天津站出发约 20 分钟\n地铁：9 号线市民广场站步行约 20 分钟\n自驾：滨海文化中心有免费停车位',
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
