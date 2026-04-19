// 天津周边游目的地数据 — 新增城市 smoke test
// 原点：天津站（0km）。数据来源：真实地标 + 公开地图里程 + 大众点评/小红书游记
const DESTINATIONS_TJ = [
  {
    id: 1100, name: "五大道", subtitle: "民国租界洋楼博物馆",
    distance: 3, distanceText: "3km",
    duration: ["半日游"], transport: ["公交可达", "地铁"],
    themes: ["历史", "建筑", "文艺"],
    budget: "200以下", budgetText: "免费（外观 + 人均 ¥100 咖啡馆）",
    rating: 4.6,
    gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    whereToEat: "起士林西餐厅 / 狗不理包子和平路店", whereToStay: "天津利顺德",
    bestSeason: "四季皆宜，秋最佳",
    tips: "1. 免费开放\n2. 推荐骑马车游览 (¥80/人)\n3. 瓷房子需单独购票 ¥35", highlight: "230 座小洋楼·民国风",
    tags: ["租界", "小洋楼", "慢生活"], imageQuery: "Tianjin Five Great Avenues historical buildings"
  },
  {
    id: 1101, name: "古文化街", subtitle: "津门十景·民俗老街",
    distance: 2, distanceText: "2km",
    duration: ["半日游"], transport: ["地铁", "公交可达"],
    themes: ["古街", "美食", "民俗"],
    budget: "200以下", budgetText: "免费逛 + 人均 ¥60 小吃",
    rating: 4.3,
    gradient: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
    whereToEat: "耳朵眼炸糕 / 崩豆张 / 果仁张", whereToStay: "利顺德 / 香格里拉",
    bestSeason: "四季", tips: "1. 免费\n2. 天后宫需单独购票 ¥10\n3. 靠海河可一并游览", highlight: "杨柳青年画·泥人张",
    tags: ["非遗", "老字号", "海河"], imageQuery: "Tianjin Ancient Culture Street night lanterns"
  },
  {
    id: 1102, name: "意式风情区", subtitle: "亚洲最大意大利风貌建筑群",
    distance: 2, distanceText: "2km",
    duration: ["半日游"], transport: ["地铁", "步行"],
    themes: ["建筑", "文艺", "夜景"],
    budget: "200以下", budgetText: "免费外观 + 人均 ¥150 意餐",
    rating: 4.4,
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    whereToEat: "SOLO 西餐厅 / 萨伏伊小馆", whereToStay: "瑞吉 / 圣瑞吉",
    bestSeason: "春秋夜晚最佳",
    tips: "1. 免费\n2. 夜景最美\n3. 马可波罗广场常有艺术展", highlight: "马可波罗广场·罗马柱廊",
    tags: ["夜拍", "异域", "海河北岸"], imageQuery: "Tianjin Italian Style Street evening"
  },
  {
    id: 1103, name: "天津之眼", subtitle: "世界唯一建在桥上的摩天轮",
    distance: 4, distanceText: "4km",
    duration: ["半日游"], transport: ["地铁", "公交可达"],
    themes: ["夜景", "摄影", "浪漫"],
    budget: "200以下", budgetText: "人均 ¥70-140",
    rating: 4.5,
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    whereToEat: "沿河小馆 / 海河啤酒屋", whereToStay: "海河两岸民宿",
    bestSeason: "春秋夜晚",
    tips: "1. 成人票 ¥70\n2. 情侣厢 ¥400\n3. 日落到亮灯时段最美", highlight: "永乐桥摩天轮·30 分钟一圈",
    tags: ["摩天轮", "海河", "打卡"], imageQuery: "Tianjin Eye Ferris wheel sunset"
  },
  {
    id: 1104, name: "瓷房子", subtitle: "4 亿片古瓷片拼成的童话楼",
    distance: 3, distanceText: "3km",
    duration: ["半日游"], transport: ["步行", "地铁"],
    themes: ["建筑", "博物馆", "文艺"],
    budget: "200以下", budgetText: "门票 ¥35",
    rating: 4.1,
    gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    whereToEat: "五大道周边西餐厅", whereToStay: "利顺德",
    bestSeason: "四季", tips: "1. 门票 ¥35\n2. 只能外观拍照\n3. 和粤唯鲜相邻", highlight: "张连志私人博物馆·700 尊石狮子",
    tags: ["网红", "瓷器", "奇观"], imageQuery: "Tianjin Porcelain House"
  },
  {
    id: 1105, name: "海河游船", subtitle: "夜游天津最浪漫方式",
    distance: 3, distanceText: "3km",
    duration: ["半日游"], transport: ["地铁", "步行"],
    themes: ["夜景", "浪漫", "观光"],
    budget: "200以下", budgetText: "船票 ¥100-180",
    rating: 4.6,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    whereToEat: "船上咖啡 / 登船前古文化街觅食", whereToStay: "海河沿岸酒店",
    bestSeason: "5-10月，夜景最佳",
    tips: "1. 船票 ¥100（普通）¥180（上层）\n2. 19:30 后夜景灯光开启\n3. 天津站后广场码头最多", highlight: "70 分钟穿越 9 座大桥",
    tags: ["夜游", "海河", "灯光"], imageQuery: "Tianjin Haihe river night cruise"
  },
  {
    id: 1106, name: "独乐寺（蓟州）", subtitle: "中国现存最古老木构建筑之一",
    distance: 105, distanceText: "105km",
    duration: ["一日往返"], transport: ["自驾", "大巴"],
    themes: ["历史", "寺庙", "古迹"],
    budget: "200以下", budgetText: "门票 ¥40 + 来回 ¥200",
    rating: 4.7,
    gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    whereToEat: "蓟州炸糕 / 贴饽饽熬小鱼", whereToStay: "盘山脚下农家院",
    bestSeason: "春秋最佳",
    tips: "1. 门票 ¥40（与盘山联票 ¥110）\n2. 观音阁 16 米高观音像\n3. 国保一级·辽代 984 年建",
    highlight: "辽代观音阁·梁思成盛赞",
    tags: ["国保", "辽代", "木构"], imageQuery: "Dule Temple Ji County ancient wooden architecture"
  },
  {
    id: 1107, name: "盘山（蓟州）", subtitle: "京东第一山·乾隆 32 次巡幸",
    distance: 110, distanceText: "110km",
    duration: ["一日往返", "两日一夜"], transport: ["自驾", "大巴"],
    themes: ["爬山", "历史", "自然"],
    budget: "200-500", budgetText: "门票 ¥78 + 缆车 ¥80",
    rating: 4.6,
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    whereToEat: "盘山脚下农家乐·山野菜炖鱼", whereToStay: "山下民宿",
    bestSeason: "春秋最佳",
    tips: "1. 门票 ¥78\n2. 有缆车也可徒步（3-4h 到顶）\n3. 与独乐寺联票更划算",
    highlight: "乾隆行宫·云罩寺",
    tags: ["五岳外名山", "乾隆", "徒步"], imageQuery: "Panshan Mountain Ji County Tianjin"
  },
  {
    id: 1108, name: "滨海航母主题公园", subtitle: "真·基辅号航母改造的主题公园",
    distance: 45, distanceText: "45km",
    duration: ["半日游", "一日往返"], transport: ["自驾", "地铁 9 号线"],
    themes: ["军事", "亲子", "博物馆"],
    budget: "200-500", budgetText: "成人 ¥110",
    rating: 4.3,
    gradient: "linear-gradient(135deg, #5DADE2 0%, #2E86AB 100%)",
    whereToEat: "塘沽海鲜大排档", whereToStay: "泰达万丽 / 滨海希尔顿",
    bestSeason: "春秋夏",
    tips: "1. 成人 ¥110\n2. 可登甲板、进驾驶舱\n3. 周边滨海旅游码头可出海",
    highlight: "唯一对外开放·俄罗斯基辅级核航母",
    tags: ["航母", "军事", "亲子"], imageQuery: "Tianjin Binhai Aircraft Carrier Theme Park"
  },
  {
    id: 1109, name: "天津滨海图书馆", subtitle: "'滨海之眼'·刷爆 Instagram",
    distance: 50, distanceText: "50km",
    duration: ["半日游"], transport: ["地铁 9 号线"],
    themes: ["建筑", "文艺", "摄影"],
    budget: "200以下", budgetText: "免费",
    rating: 4.4,
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    whereToEat: "滨海万象汇", whereToStay: "滨海泰达万丽",
    bestSeason: "四季", tips: "1. 免费但需预约\n2. 白色阶梯书墙·必拍\n3. 工作日人少", highlight: "MVRDV 设计·3.4 万㎡·'滨海之眼'球体",
    tags: ["网红建筑", "MVRDV", "书墙"], imageQuery: "Tianjin Binhai Library"
  }
];

if (typeof window !== 'undefined') window.DESTINATIONS_TJ = DESTINATIONS_TJ;
if (typeof module !== 'undefined' && module.exports) module.exports = DESTINATIONS_TJ;
