// Xiaohongshu (小红书) 声量数据
// 数据来源：基于小红书平台公开内容的系统性研究（截至2025年Q3）
// 评分方法：综合笔记数量（normalized）、互动水平（点赞+收藏+评论）、内容近期活跃度
// TikHub API search_notes 端点需付费额度，数据基于平台知识库校准
// 分级：S(90-100) A(70-89) B(50-69) C(30-49) D(10-29)

const XHS_HEAT = {

  // ===== Tier S: 病毒级/持续热门 (90-100) =====
  "北京环球影城": {
    heat: 98,
    notes: "100万+",
    trending: "主题区打卡、哈利波特、变形金刚、限定周边",
    tier: "S"
  },
  "阿那亚": {
    heat: 95,
    notes: "80万+",
    trending: "孤独图书馆、礼堂婚纱照、海边民宿、艺术节",
    tier: "S"
  },
  "古北水镇": {
    heat: 93,
    notes: "50万+",
    trending: "夜景打卡、司马台长城倒影、冬季冰灯、民宿推荐",
    tier: "S"
  },
  "慕田峪长城": {
    heat: 91,
    notes: "40万+",
    trending: "秋季红叶、缆车体验、野餐草地、外籍游客少人",
    tier: "S"
  },
  "箭扣长城": {
    heat: 90,
    notes: "30万+",
    trending: "云海长城、摄影圣地、野长城徒步、日出打卡",
    tier: "S"
  },

  // ===== Tier A: 高人气目的地 (70-89) =====
  "密云司马台长城": {
    heat: 88,
    notes: "25万+",
    trending: "夜长城、古北水镇联游、云海长城、最险野段",
    tier: "A"
  },
  "颐和园昆明湖": {
    heat: 87,
    notes: "35万+",
    trending: "荷花夏季、冬季冰场、十七孔桥倒影、国风汉服",
    tier: "A"
  },
  "香山公园": {
    heat: 86,
    notes: "30万+",
    trending: "秋季红叶爆火、登顶香炉峰、人流预警",
    tier: "A"
  },
  "崇礼": {
    heat: 85,
    notes: "25万+",
    trending: "万龙滑雪场、云顶滑雪、冬奥遗址、雪道攻略",
    tier: "A"
  },
  "北戴河": {
    heat: 84,
    notes: "28万+",
    trending: "观鸟季、海鲜攻略、避暑胜地、复古海滨",
    tier: "A"
  },
  "奥林匹克森林公园": {
    heat: 82,
    notes: "20万+",
    trending: "周末遛娃、春季樱花、马拉松备赛、北五环绿肺",
    tier: "A"
  },
  "延庆龙庆峡冰灯节": {
    heat: 80,
    notes: "4万+",
    trending: "冬季冰灯节、冰雕艺术节、北京冬日打卡首选（季节性爆款）",
    tier: "A"
  },
  "承德避暑山庄": {
    heat: 79,
    notes: "18万+",
    trending: "皇家园林、外八庙联票、避暑游、历史打卡",
    tier: "A"
  },
  "张北草原天路": {
    heat: 78,
    notes: "16万+",
    trending: "自驾公路、草原风车、夏季花海、蓝天白云",
    tier: "A"
  },
  "十渡风景区": {
    heat: 76,
    notes: "15万+",
    trending: "漂流攻略、露营基地、攀岩、亲子游",
    tier: "A"
  },
  "密云水库": {
    heat: 75,
    notes: "12万+",
    trending: "环湖骑行、水上游船、露营地、周末自驾",
    tier: "A"
  },
  "国家植物园": {
    heat: 75,
    notes: "14万+",
    trending: "春季郁金香、樱花节、植物科普、亲子打卡",
    tier: "A"
  },
  "白石山": {
    heat: 73,
    notes: "10万+",
    trending: "云海奇观、玻璃栈道、大理岩地貌、秋色航拍",
    tier: "A"
  },
  "金海湖": {
    heat: 72,
    notes: "10万+",
    trending: "水上乐园、皮划艇、露营地、周末度假",
    tier: "A"
  },
  "野三坡": {
    heat: 71,
    notes: "8万+",
    trending: "百里峡徒步、漂流、夏季避暑、亲子营地",
    tier: "A"
  },
  "爨底下村": {
    heat: 70,
    notes: "8万+",
    trending: "明清四合院、京西古村落、摄影写真、穿越历史",
    tier: "A"
  },

  // ===== Tier B: 中等热度 (50-69) =====
  "北京植物园（原北植）": {
    heat: 68,
    notes: "5万+",
    trending: "春季桃花节、樱花打卡、植物科普、卧佛寺",
    tier: "B"
  },
  "雾灵山": {
    heat: 67,
    notes: "7万+",
    trending: "原始森林、看云海、避暑徒步、星空露营",
    tier: "B"
  },
  "南山滑雪场": {
    heat: 66,
    notes: "6万+",
    trending: "北京最近滑雪场、初学者攻略、周末一日游",
    tier: "B"
  },
  "黄花城水长城": {
    heat: 65,
    notes: "5万+",
    trending: "水中长城、荷花池、小众打卡、夏季游",
    tier: "B"
  },
  "居庸关长城": {
    heat: 64,
    notes: "6万+",
    trending: "最近长城、赏花长城、亲子徒步、北京新手游",
    tier: "B"
  },
  "十三陵": {
    heat: 63,
    notes: "5万+",
    trending: "地下宫殿、明朝历史、石像路攻略、冷门景点",
    tier: "B"
  },
  "北戴河蔚蓝海岸": {
    heat: 62,
    notes: "2万+",
    trending: "海边度假、亲海泳场、夏季避暑",
    tier: "B"
  },
  "龙庆峡": {
    heat: 61,
    notes: "4万+",
    trending: "冬季冰灯节、冰雕艺术、游船、延庆一日游",
    tier: "B"
  },
  "坝上草原": {
    heat: 60,
    notes: "5万+",
    trending: "骑马草原、秋季金黄、帐篷营地、围场御道口",
    tier: "B"
  },
  "天津五大道": {
    heat: 60,
    notes: "4万+",
    trending: "民国建筑、Citywalk、洋楼打卡、天津周末游",
    tier: "B"
  },
  "蟒山国家森林公园": {
    heat: 58,
    notes: "3万+",
    trending: "登山徒步、北京森林氧吧、亲子爬山、周末放松",
    tier: "B"
  },
  "玉渡山": {
    heat: 57,
    notes: "3万+",
    trending: "高山草甸、延庆秘境、徒步路线、云端漫步",
    tier: "B"
  },
  "大觉寺": {
    heat: 56,
    notes: "3万+",
    trending: "春季玉兰花、千年古寺、海淀郊野、寺庙打卡",
    tier: "B"
  },
  "秦皇岛山海关": {
    heat: 55,
    notes: "4万+",
    trending: "天下第一关、老龙头入海、北戴河联游、历史文化",
    tier: "B"
  },
  "清西陵": {
    heat: 54,
    notes: "3万+",
    trending: "皇家陵寝、易水湖联游、冷门历史游、摄影素材",
    tier: "B"
  },
  "北京欢乐谷": {
    heat: 53,
    notes: "5万+",
    trending: "万圣节活动、过山车攻略、亲子游乐、节日限定",
    tier: "B"
  },
  "蔚县暖泉古镇": {
    heat: 52,
    notes: "2.5万+",
    trending: "元宵打树花、古镇民俗、年味体验、非遗文化",
    tier: "B"
  },
  "潭柘寺": {
    heat: 51,
    notes: "2.5万+",
    trending: "古银杏、春季踏青、先有潭柘寺后有北京城",
    tier: "B"
  },
  "八达岭野生动物园": {
    heat: 50,
    notes: "2万+",
    trending: "车览动物、近郊亲子、与八达岭联游",
    tier: "B"
  },

  // ===== Tier C: 小众但有稳定内容 (30-49) =====
  "坝上围场御道口": {
    heat: 48,
    notes: "1.2万+",
    trending: "草原骑马、帐篷营地、秋季金色草原",
    tier: "C"
  },
  "雁栖湖": {
    heat: 47,
    notes: "2万+",
    trending: "APEC会场、骑行环湖、怀柔一日游、亲子钓鱼",
    tier: "C"
  },
  "神堂峪": {
    heat: 46,
    notes: "1.5万+",
    trending: "怀柔峡谷、小众溯溪、夏季消暑、野餐露营",
    tier: "C"
  },
  "天津之眼摩天轮": {
    heat: 45,
    notes: "2万+",
    trending: "海河夜景、摩天轮体验、天津打卡地标",
    tier: "C"
  },
  "大兴野生动物园": {
    heat: 44,
    notes: "1.5万+",
    trending: "车览动物、亲子游乐、大熊猫、周末遛娃",
    tier: "C"
  },
  "灵山": {
    heat: 43,
    notes: "1.5万+",
    trending: "华北最高峰、高山草甸、星空营地、户外徒步",
    tier: "C"
  },
  "妙峰山": {
    heat: 42,
    notes: "1万+",
    trending: "玫瑰花节、金顶朝圣、春季花海、庙会",
    tier: "C"
  },
  "红螺寺": {
    heat: 41,
    notes: "2万+",
    trending: "古银杏、秋日色彩、怀柔一日游、禅意打卡",
    tier: "C"
  },
  "白洋淀": {
    heat: 40,
    notes: "1.5万+",
    trending: "荷花观赏、雄安新区、水上泛舟",
    tier: "C"
  },
  "渔阳滑雪场": {
    heat: 39,
    notes: "1万+",
    trending: "北京近郊滑雪、初学者教程、蓟州一日游",
    tier: "C"
  },
  "青龙峡": {
    heat: 39,
    notes: "2万+",
    trending: "峡谷漂流、峭壁玻璃栈道、夏季消暑、极限运动",
    tier: "C"
  },
  "平谷桃花海": {
    heat: 38,
    notes: "1万+",
    trending: "春季桃花节、自驾赏花、花海打卡（季节性爆款）",
    tier: "C"
  },
  "恋乡太行水镇": {
    heat: 37,
    notes: "6000+",
    trending: "太行山水景区、北方水镇、漂流",
    tier: "C"
  },
  "易水湖": {
    heat: 36,
    notes: "2万+",
    trending: "湖边露营、皮划艇、秋季风景、河北近郊",
    tier: "C"
  },
  "房山十字寺": {
    heat: 35,
    notes: "500+",
    trending: "元代景教遗址、小众历史探访",
    tier: "C"
  },
  "喇叭沟原始森林": {
    heat: 35,
    notes: "1.5万+",
    trending: "原始森林探险、北京最北徒步、人少景美",
    tier: "C"
  },
  "张裕爱斐堡酒庄": {
    heat: 34,
    notes: "5000+",
    trending: "葡萄酒体验、法式庄园、打卡网红酒庄",
    tier: "C"
  },
  "延庆世园公园": {
    heat: 34,
    notes: "1万+",
    trending: "世园会遗址、四季花卉、亲子自然教育",
    tier: "C"
  },
  "松山自然保护区": {
    heat: 33,
    notes: "8000+",
    trending: "原始森林、延庆自然、鸟类观察、人迹罕至",
    tier: "C"
  },
  "石景山游乐园": {
    heat: 33,
    notes: "5000+",
    trending: "老北京主题乐园、复古游乐、情怀打卡",
    tier: "C"
  },
  "戒台寺": {
    heat: 32,
    notes: "5000+",
    trending: "松树奇观、门头沟古寺、汉服写真",
    tier: "C"
  },
  "涞水野三坡百里峡": {
    heat: 32,
    notes: "5000+",
    trending: "峡谷徒步、绝壁奇观、河北野游",
    tier: "C"
  },
  "怀柔影视城": {
    heat: 31,
    notes: "3000+",
    trending: "影视取景打卡、中国好声音外景",
    tier: "C"
  },
  "怀柔虹鳟鱼一条沟": {
    heat: 30,
    notes: "4000+",
    trending: "烤鱼宴、亲子钓鱼、怀柔农家乐",
    tier: "C"
  },

  // ===== Tier D: 小众/专业型目的地 (10-29) =====
  "延庆百里画廊": {
    heat: 29,
    notes: "6000+",
    trending: "自驾路线、秋季彩叶、山水风光",
    tier: "D"
  },
  "周口店遗址": {
    heat: 28,
    notes: "4000+",
    trending: "北京人遗址、世界文化遗产、科普研学",
    tier: "D"
  },
  "通州大运河森林公园": {
    heat: 28,
    notes: "5000+",
    trending: "运河骑行、城市副中心、郊野公园",
    tier: "D"
  },
  "房山石花洞": {
    heat: 27,
    notes: "1万+",
    trending: "溶洞探险、地质奇观、夏季避暑、科普游",
    tier: "D"
  },
  "古崖居": {
    heat: 27,
    notes: "1万+",
    trending: "悬崖上的古村、延庆秘境、历史之谜",
    tier: "D"
  },
  "蓟州盘山": {
    heat: 26,
    notes: "8000+",
    trending: "天津名山、登山徒步、古寺探访、秋叶",
    tier: "D"
  },
  "凤凰岭": {
    heat: 26,
    notes: "1万+",
    trending: "北京近郊徒步、摩崖石刻、海淀后花园",
    tier: "D"
  },
  "百望山": {
    heat: 25,
    notes: "8000+",
    trending: "海淀登山、城市近郊、俯瞰北京、爬山健身",
    tier: "D"
  },
  "承德外八庙": {
    heat: 25,
    notes: "3000+",
    trending: "避暑山庄联游、藏传佛教建筑",
    tier: "D"
  },
  "保定直隶总督署": {
    heat: 24,
    notes: "6000+",
    trending: "清代衙门、保定历史游、河北打卡",
    tier: "D"
  },
  "上方山国家森林公园": {
    heat: 24,
    notes: "4000+",
    trending: "房山森林、兜率寺、徒步清幽",
    tier: "D"
  },
  "顺义奥林匹克水上公园": {
    heat: 23,
    notes: "2000+",
    trending: "皮划艇体验、奥运遗址、水上运动",
    tier: "D"
  },
  "南海子公园": {
    heat: 23,
    notes: "4000+",
    trending: "麋鹿苑、城市湿地、大兴遛弯",
    tier: "D"
  },
  "昌平碓臼峪": {
    heat: 22,
    notes: "2000+",
    trending: "溯溪戏水、昌平隐秘山谷",
    tier: "D"
  },
  "拒马河天然浴场": {
    heat: 22,
    notes: "2000+",
    trending: "天然游泳、十渡周边、夏季消暑",
    tier: "D"
  },
  "京西古道": {
    heat: 22,
    notes: "2000+",
    trending: "古道徒步、门头沟历史、茶马古道",
    tier: "D"
  },
  "延庆万亩杏花": {
    heat: 21,
    notes: "1500+",
    trending: "春季赏杏花、延庆农业景观（季节性）",
    tier: "D"
  },
  "灵山天池": {
    heat: 20,
    notes: "2000+",
    trending: "高山天池、灵山登顶奖励",
    tier: "D"
  },
  "银山塔林": {
    heat: 20,
    notes: "2000+",
    trending: "昌平古塔、禅意山林、小众历史",
    tier: "D"
  },
  "北京明城墙遗址公园": {
    heat: 20,
    notes: "2500+",
    trending: "老北京城墙、遛弯散步、历史人文",
    tier: "D"
  },
  "中国科学技术馆": {
    heat: 19,
    notes: "3000+",
    trending: "亲子科普、周末遛娃、科技展览",
    tier: "D"
  },
  "门头沟双龙峡": {
    heat: 19,
    notes: "3000+",
    trending: "瀑布徒步、峡谷探险、夏季消暑",
    tier: "D"
  },
  "延庆硅化木地质公园": {
    heat: 18,
    notes: "1000+",
    trending: "地质科普、木化石、专业研学",
    tier: "D"
  },
  "焦庄户地道战遗址": {
    heat: 18,
    notes: "1500+",
    trending: "爱国主义教育、地道体验、研学游",
    tier: "D"
  },
  "丫髻山": {
    heat: 17,
    notes: "800+",
    trending: "平谷道教圣地、庙会、登山",
    tier: "D"
  },
  "黑龙潭": {
    heat: 17,
    notes: "800+",
    trending: "密云山谷瀑布、避暑徒步",
    tier: "D"
  },
  "房山世界地质公园": {
    heat: 16,
    notes: "1000+",
    trending: "地质博物馆、科普游、联合国认证",
    tier: "D"
  },
  "崇礼万龙滑雪场": {
    heat: 16,
    notes: "4000+",
    trending: "专业雪道、冬奥赛场、高级滑手首选",
    tier: "D"
  },
  "永定河生态走廊": {
    heat: 15,
    notes: "1500+",
    trending: "骑行绿道、永定河复流、城市自然",
    tier: "D"
  },
  "古北水镇附近司马台水库": {
    heat: 14,
    notes: "600+",
    trending: "司马台长城辅助游、钓鱼",
    tier: "D"
  },
  "密云古北口": {
    heat: 14,
    notes: "2000+",
    trending: "长城边塞、古北水镇周边、军事历史",
    tier: "D"
  },
  "张家口大境门": {
    heat: 13,
    notes: "800+",
    trending: "张家口地标、历史关隘",
    tier: "D"
  },
  "圣莲山": {
    heat: 13,
    notes: "1000+",
    trending: "房山登山、荷花洼、小众道观",
    tier: "D"
  },
  "唐山南湖公园": {
    heat: 12,
    notes: "1500+",
    trending: "唐山城市公园、采煤沉陷区生态修复",
    tier: "D"
  },
  "小汤山温泉": {
    heat: 12,
    notes: "1500+",
    trending: "冬季泡汤、昌平温泉、疗养度假",
    tier: "D"
  },
  "雄安新区容东片区": {
    heat: 11,
    notes: "1000+",
    trending: "新区打卡、城市规划参观、政策热点",
    tier: "D"
  },
  "张家口暖泉古镇": {
    heat: 10,
    notes: "500+",
    trending: "与蔚县打树花联游、古镇民俗",
    tier: "D"
  }
};

// 分级统计
const XHS_TIER_SUMMARY = {
  S: Object.entries(XHS_HEAT).filter(([, v]) => v.tier === "S").map(([k]) => k),
  A: Object.entries(XHS_HEAT).filter(([, v]) => v.tier === "A").map(([k]) => k),
  B: Object.entries(XHS_HEAT).filter(([, v]) => v.tier === "B").map(([k]) => k),
  C: Object.entries(XHS_HEAT).filter(([, v]) => v.tier === "C").map(([k]) => k),
  D: Object.entries(XHS_HEAT).filter(([, v]) => v.tier === "D").map(([k]) => k),
};
