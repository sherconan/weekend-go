// 青岛周边游目的地数据 — 新增城市 via weekend-go:add-city skill smoke-test
// 原点：青岛站（0km）。数据来源：真实地标 + 公开地图里程 + XHS/大众点评游记
const DESTINATIONS_QD = [
  {
    "id": 1203,
    "name": "青岛啤酒博物馆",
    "subtitle": "中国 No.1 啤酒品牌的 120 年",
    "distance": 4,
    "distanceText": "4km",
    "duration": [
      "半日游"
    ],
    "transport": [
      "地铁 M2",
      "公交可达"
    ],
    "themes": [
      "博物馆",
      "美食",
      "工业"
    ],
    "budget": "200以下",
    "budgetText": "门票 ¥60（含试饮）",
    "rating": 4.4,
    "gradient": "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
    "whereToEat": "博物馆内餐厅·试饮原浆",
    "whereToStay": "登州路啤酒街附近",
    "bestSeason": "四季·8 月啤酒节最佳",
    "tips": "1. 门票 ¥60（含两杯试饮）\n2. 登州路啤酒街步行可达\n3. 8 月国际啤酒节必打卡",
    "highlight": "1903 年德国人创立·A 级景区",
    "tags": [
      "啤酒",
      "非遗",
      "Tsingtao"
    ],
    "imageQuery": "Tsingtao Beer Museum Qingdao"
  },
  {
    "id": 1204,
    "name": "五四广场",
    "subtitle": "青岛新城地标·五月的风",
    "distance": 7,
    "distanceText": "7km",
    "duration": [
      "半日游"
    ],
    "transport": [
      "地铁 M3",
      "公交可达"
    ],
    "themes": [
      "观景",
      "城市",
      "摄影"
    ],
    "budget": "200以下",
    "budgetText": "免费",
    "rating": 4.5,
    "gradient": "linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)",
    "whereToEat": "万象城 / 海信广场",
    "whereToStay": "香格里拉 / 万丽",
    "bestSeason": "四季",
    "tips": "1. 免费\n2. 红色'五月的风'雕塑\n3. 夜景灯光秀",
    "highlight": "1919 年五四运动纪念·青岛回归象征",
    "tags": [
      "地标",
      "夜景",
      "纪念"
    ],
    "imageQuery": "Qingdao May Fourth Square wind sculpture"
  },
  {
    "id": 1205,
    "name": "奥帆中心",
    "subtitle": "2008 奥运帆船赛场·情人坝夜景",
    "distance": 8,
    "distanceText": "8km",
    "duration": [
      "半日游"
    ],
    "transport": [
      "地铁 M3",
      "公交可达"
    ],
    "themes": [
      "海边",
      "体育",
      "夜景"
    ],
    "budget": "200-500",
    "budgetText": "免费（帆船体验 ¥100-300）",
    "rating": 4.5,
    "gradient": "linear-gradient(135deg, #5DADE2 0%, #1F618D 100%)",
    "whereToEat": "奥帆中心咖啡店 / 情人坝酒吧",
    "whereToStay": "浮山湾酒店群",
    "bestSeason": "5-10月",
    "tips": "1. 免费\n2. 可体验帆船 ¥100 起\n3. 情人坝夜景 + 海上皇宫",
    "highlight": "奥运五环标志·2008 帆船赛事",
    "tags": [
      "奥运",
      "帆船",
      "夜拍"
    ],
    "imageQuery": "Qingdao Olympic Sailing Center marina"
  },
  {
    "id": 1206,
    "name": "第一海水浴场",
    "subtitle": "青岛市中心最便利的沙滩",
    "distance": 3,
    "distanceText": "3km",
    "duration": [
      "半日游"
    ],
    "transport": [
      "公交可达",
      "步行"
    ],
    "themes": [
      "海边",
      "亲子",
      "休闲"
    ],
    "budget": "200以下",
    "budgetText": "免费（更衣 ¥30）",
    "rating": 4.3,
    "gradient": "linear-gradient(135deg, #00b4db 0%, #0083b0 100%)",
    "whereToEat": "汇泉广场周边海鲜大排档",
    "whereToStay": "鲁迅公园附近民宿",
    "bestSeason": "6-9月",
    "tips": "1. 免费开放\n2. 更衣间 ¥30\n3. 暑假人山人海建议清晨去",
    "highlight": "580m 沙滩·民国时为汇泉浴场",
    "tags": [
      "沙滩",
      "亲子",
      "市区"
    ],
    "imageQuery": "Qingdao First Bathing Beach"
  },
  {
    "id": 1207,
    "name": "信号山公园",
    "subtitle": "俯瞰青岛红瓦绿树最佳机位",
    "distance": 2,
    "distanceText": "2km",
    "duration": [
      "半日游"
    ],
    "transport": [
      "步行",
      "公交可达"
    ],
    "themes": [
      "观景",
      "摄影",
      "登山"
    ],
    "budget": "200以下",
    "budgetText": "门票 ¥15",
    "rating": 4.6,
    "gradient": "linear-gradient(135deg, #FF6B6B 0%, #FFD166 100%)",
    "whereToEat": "大学路沿街小店",
    "whereToStay": "迎宾馆/老城区民宿",
    "bestSeason": "四季",
    "tips": "1. 门票 ¥15\n2. 旋转观景台 ¥5\n3. 日落/蓝调时段最佳",
    "highlight": "98m·360° 俯瞰'红瓦绿树碧海蓝天'",
    "tags": [
      "打卡",
      "俯瞰",
      "老城"
    ],
    "imageQuery": "Qingdao Signal Hill Park overlook red roofs"
  },
  {
    "id": 1208,
    "name": "劈柴院",
    "subtitle": "百年小吃街·江宁会馆旁",
    "distance": 1,
    "distanceText": "1km",
    "duration": [
      "半日游"
    ],
    "transport": [
      "步行",
      "公交可达"
    ],
    "themes": [
      "美食",
      "古街",
      "市井"
    ],
    "budget": "200以下",
    "budgetText": "人均 ¥60-120",
    "rating": 4.2,
    "gradient": "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
    "whereToEat": "王姐烧烤 / 豆腐脑张 / 朝天锅",
    "whereToStay": "老城区民宿",
    "bestSeason": "四季",
    "tips": "1. 免费\n2. 必尝王姐烧烤鱿鱼\n3. 江宁会馆相声演出（¥30）\n4. 晚上最热闹",
    "highlight": "民国老字号+民间曲艺",
    "tags": [
      "小吃街",
      "老字号",
      "夜市"
    ],
    "imageQuery": "Qingdao Pichaiyuan food street night"
  },
  {
    "id": 1209,
    "name": "登州路啤酒街",
    "subtitle": "青啤厂门口的街区·原浆鲜啤",
    "distance": 4,
    "distanceText": "4km",
    "duration": [
      "半日游"
    ],
    "transport": [
      "地铁 M2",
      "公交可达"
    ],
    "themes": [
      "美食",
      "夜生活",
      "啤酒"
    ],
    "budget": "200-500",
    "budgetText": "人均 ¥150-300（烤串+原浆）",
    "rating": 4.4,
    "gradient": "linear-gradient(135deg, #f7971e 0%, #E65100 100%)",
    "whereToEat": "青啤 1903 总店 / 登州路 79 号烤肉",
    "whereToStay": "附近商务酒店",
    "bestSeason": "5-10月（尤其 8 月啤酒节）",
    "tips": "1. 必点塑料袋装原浆（¥15/袋）\n2. 8 月国际啤酒节封街狂欢\n3. 烧烤配鲜啤是标配",
    "highlight": "青啤博物馆正门街·鲜啤文化地标",
    "tags": [
      "啤酒",
      "烧烤",
      "夜市"
    ],
    "imageQuery": "Qingdao Dengzhou Road Beer Street night"
  },
  {
    "id": 1210,
    "name": "台东步行街",
    "subtitle": "青岛最大夜市·LED 霓虹楼",
    "distance": 3,
    "distanceText": "3km",
    "duration": [
      "半日游"
    ],
    "transport": [
      "地铁 M2",
      "公交可达"
    ],
    "themes": [
      "美食",
      "购物",
      "夜景"
    ],
    "budget": "200以下",
    "budgetText": "人均 ¥80-150",
    "rating": 4.3,
    "gradient": "linear-gradient(135deg, #E91E63 0%, #FF9800 100%)",
    "whereToEat": "大尧烧烤 / 青岛人家海鲜",
    "whereToStay": "台东商圈酒店",
    "bestSeason": "四季",
    "tips": "1. 免费\n2. 周日 17:00 后 LED 灯光秀\n3. 大鲍岛啤酒市场 + 台东步行街连游",
    "highlight": "LED 外立面 + 大排档一条街",
    "tags": [
      "夜市",
      "购物",
      "霓虹"
    ],
    "imageQuery": "Qingdao Taidong Pedestrian Street night LED"
  },
  {
    "id": 1211,
    "name": "红岛海鲜市场",
    "subtitle": "青岛吃蛤蜊的正宗地",
    "distance": 35,
    "distanceText": "35km",
    "duration": [
      "半日游",
      "一日往返"
    ],
    "transport": [
      "自驾",
      "公交"
    ],
    "themes": [
      "美食",
      "海边",
      "市场"
    ],
    "budget": "200-500",
    "budgetText": "人均 ¥80-200（蛤蜊现蒸）",
    "rating": 4.5,
    "gradient": "linear-gradient(135deg, #00b4db 0%, #0083b0 100%)",
    "whereToEat": "市场旁自选加工店 / 红岛渔家宴",
    "whereToStay": "红岛民宿",
    "bestSeason": "5-10月（蛤蜊最肥）",
    "tips": "1. 先买后加工（¥10/斤加工费）\n2. 挑活跳蛤蜊·外壳合拢\n3. 可一并游红岛蛤蜊节（4-5月）",
    "highlight": "青岛蛤蜊之王·现捞现吃",
    "tags": [
      "蛤蜊",
      "海鲜",
      "在地"
    ],
    "imageQuery": "Qingdao Hongdao seafood market clams"
  },
  {
    "id": 1212,
    "name": "船歌鱼水饺总店",
    "subtitle": "青岛代表性海鲜水饺",
    "distance": 5,
    "distanceText": "5km",
    "duration": [
      "半日游"
    ],
    "transport": [
      "地铁 M3",
      "公交可达"
    ],
    "themes": [
      "美食",
      "海鲜",
      "老字号"
    ],
    "budget": "200-500",
    "budgetText": "人均 ¥120-200",
    "rating": 4.4,
    "gradient": "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
    "whereToEat": "本店（闽江三路店）",
    "whereToStay": "浮山湾附近",
    "bestSeason": "四季",
    "tips": "1. 人均 ¥120-200\n2. 黄花鱼+墨鱼饺子必点\n3. 可订位·旺季排队 1h+",
    "highlight": "青岛水饺品牌·多家分店",
    "tags": [
      "水饺",
      "海鲜",
      "品牌"
    ],
    "imageQuery": "Qingdao Chuange fish dumpling restaurant"
  }
];
if (typeof window !== 'undefined') window.DESTINATIONS_QD = DESTINATIONS_QD;
if (typeof module !== 'undefined' && module.exports) module.exports = DESTINATIONS_QD;
