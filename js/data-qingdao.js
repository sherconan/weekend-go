// 青岛周边游目的地数据 — 新增城市 via weekend-go:add-city skill smoke-test
// 原点：青岛站（0km）。数据来源：真实地标 + 公开地图里程 + XHS/大众点评游记
const DESTINATIONS_QD = [
  {
    id: 1200, name: "栈桥", subtitle: "青岛海滨地标·百年老栈",
    distance: 1, distanceText: "1km",
    duration: ["半日游"], transport: ["步行", "公交可达"],
    themes: ["海边", "历史", "观景"],
    budget: "200以下", budgetText: "免费",
    rating: 4.5,
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    whereToEat: "王姐烧烤 / 劈柴院小吃", whereToStay: "中山路老城区民宿",
    bestSeason: "5-10月",
    tips: "1. 免费\n2. 日出+日落最美\n3. 潮涨潮落看完全不同", highlight: "回澜阁·清代始建",
    tags: ["地标", "老城", "海边"], imageQuery: "Qingdao Zhanqiao Pier sunset"
  },
  {
    id: 1201, name: "八大关", subtitle: "万国建筑博览·青岛最美街区",
    distance: 6, distanceText: "6km",
    duration: ["半日游"], transport: ["公交可达", "地铁"],
    themes: ["建筑", "文艺", "历史"],
    budget: "200以下", budgetText: "免费",
    rating: 4.7,
    gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    whereToEat: "花石楼附近 / 太平角 Jyoti", whereToStay: "八大关精品酒店",
    bestSeason: "春秋",
    tips: "1. 免费\n2. 韶关路最美\n3. 花石楼需单独购票 ¥10", highlight: "200 余栋欧美日式别墅",
    tags: ["异域", "老别墅", "蒋介石公馆"], imageQuery: "Qingdao Badaguan Scenic Area European villas"
  },
  {
    id: 1202, name: "崂山", subtitle: "海上名山·道教发源地",
    distance: 40, distanceText: "40km",
    duration: ["一日往返"], transport: ["自驾", "公交"],
    themes: ["爬山", "宗教", "自然"],
    budget: "200-500", budgetText: "门票 ¥90-180（分区）",
    rating: 4.6,
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    whereToEat: "崂山脚下农家·崂山豆腐", whereToStay: "崂山客栈",
    bestSeason: "4-10月",
    tips: "1. 流清游览区 ¥90\n2. 太清游览区 ¥180 (含索道)\n3. 徒步登顶 4-6h", highlight: "1132.7m·太清宫·蒲松龄聊斋写作地",
    tags: ["道教", "徒步", "海景"], imageQuery: "Laoshan Mountain Qingdao sunrise"
  },
  {
    id: 1203, name: "青岛啤酒博物馆", subtitle: "中国 No.1 啤酒品牌的 120 年",
    distance: 4, distanceText: "4km",
    duration: ["半日游"], transport: ["地铁 M2", "公交可达"],
    themes: ["博物馆", "美食", "工业"],
    budget: "200以下", budgetText: "门票 ¥60（含试饮）",
    rating: 4.4,
    gradient: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
    whereToEat: "博物馆内餐厅·试饮原浆", whereToStay: "登州路啤酒街附近",
    bestSeason: "四季·8 月啤酒节最佳",
    tips: "1. 门票 ¥60（含两杯试饮）\n2. 登州路啤酒街步行可达\n3. 8 月国际啤酒节必打卡", highlight: "1903 年德国人创立·A 级景区",
    tags: ["啤酒", "非遗", "Tsingtao"], imageQuery: "Tsingtao Beer Museum Qingdao"
  },
  {
    id: 1204, name: "五四广场", subtitle: "青岛新城地标·五月的风",
    distance: 7, distanceText: "7km",
    duration: ["半日游"], transport: ["地铁 M3", "公交可达"],
    themes: ["观景", "城市", "摄影"],
    budget: "200以下", budgetText: "免费",
    rating: 4.5,
    gradient: "linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)",
    whereToEat: "万象城 / 海信广场", whereToStay: "香格里拉 / 万丽",
    bestSeason: "四季", tips: "1. 免费\n2. 红色'五月的风'雕塑\n3. 夜景灯光秀", highlight: "1919 年五四运动纪念·青岛回归象征",
    tags: ["地标", "夜景", "纪念"], imageQuery: "Qingdao May Fourth Square wind sculpture"
  },
  {
    id: 1205, name: "奥帆中心", subtitle: "2008 奥运帆船赛场·情人坝夜景",
    distance: 8, distanceText: "8km",
    duration: ["半日游"], transport: ["地铁 M3", "公交可达"],
    themes: ["海边", "体育", "夜景"],
    budget: "200-500", budgetText: "免费（帆船体验 ¥100-300）",
    rating: 4.5,
    gradient: "linear-gradient(135deg, #5DADE2 0%, #1F618D 100%)",
    whereToEat: "奥帆中心咖啡店 / 情人坝酒吧", whereToStay: "浮山湾酒店群",
    bestSeason: "5-10月",
    tips: "1. 免费\n2. 可体验帆船 ¥100 起\n3. 情人坝夜景 + 海上皇宫", highlight: "奥运五环标志·2008 帆船赛事",
    tags: ["奥运", "帆船", "夜拍"], imageQuery: "Qingdao Olympic Sailing Center marina"
  },
  {
    id: 1206, name: "第一海水浴场", subtitle: "青岛市中心最便利的沙滩",
    distance: 3, distanceText: "3km",
    duration: ["半日游"], transport: ["公交可达", "步行"],
    themes: ["海边", "亲子", "休闲"],
    budget: "200以下", budgetText: "免费（更衣 ¥30）",
    rating: 4.3,
    gradient: "linear-gradient(135deg, #00b4db 0%, #0083b0 100%)",
    whereToEat: "汇泉广场周边海鲜大排档", whereToStay: "鲁迅公园附近民宿",
    bestSeason: "6-9月",
    tips: "1. 免费开放\n2. 更衣间 ¥30\n3. 暑假人山人海建议清晨去", highlight: "580m 沙滩·民国时为汇泉浴场",
    tags: ["沙滩", "亲子", "市区"], imageQuery: "Qingdao First Bathing Beach"
  },
  {
    id: 1207, name: "信号山公园", subtitle: "俯瞰青岛红瓦绿树最佳机位",
    distance: 2, distanceText: "2km",
    duration: ["半日游"], transport: ["步行", "公交可达"],
    themes: ["观景", "摄影", "登山"],
    budget: "200以下", budgetText: "门票 ¥15",
    rating: 4.6,
    gradient: "linear-gradient(135deg, #FF6B6B 0%, #FFD166 100%)",
    whereToEat: "大学路沿街小店", whereToStay: "迎宾馆/老城区民宿",
    bestSeason: "四季", tips: "1. 门票 ¥15\n2. 旋转观景台 ¥5\n3. 日落/蓝调时段最佳", highlight: "98m·360° 俯瞰'红瓦绿树碧海蓝天'",
    tags: ["打卡", "俯瞰", "老城"], imageQuery: "Qingdao Signal Hill Park overlook red roofs"
  }
];

if (typeof window !== 'undefined') window.DESTINATIONS_QD = DESTINATIONS_QD;
if (typeof module !== 'undefined' && module.exports) module.exports = DESTINATIONS_QD;
