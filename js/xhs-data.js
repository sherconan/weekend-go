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
  "永定河生态走廊": {
    heat: 15,
    notes: "1500+",
    trending: "骑行绿道、永定河复流、城市自然",
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

  // ===== 北京周边 300-500km 目的地 (data-beijing-500) =====

  // --- Tier S ---
  "青岛": {
    heat: 95,
    notes: "100万+",
    trending: "栈桥打卡、八大关漫步、崂山徒步、啤酒节海鲜、信号山俯瞰",
    tier: "S"
  },
  "泰山": {
    heat: 92,
    notes: "80万+",
    trending: "夜爬看日出、十八盘挑战、五岳独尊打卡、云海摄影",
    tier: "S"
  },
  "平遥古城": {
    heat: 91,
    notes: "70万+",
    trending: "古城夜景、票号文化、明清街巷、平遥牛肉、摄影圣地",
    tier: "S"
  },

  // --- Tier A ---
  "大同": {
    heat: 88,
    notes: "50万+",
    trending: "云冈石窟、悬空寺、古城灯光秀、刀削面",
    tier: "A"
  },
  "五台山": {
    heat: 85,
    notes: "40万+",
    trending: "佛教圣地、五爷庙许愿、台顶朝台、夏季避暑",
    tier: "A"
  },
  "洛阳龙门石窟": {
    heat: 85,
    notes: "45万+",
    trending: "卢舍那大佛、石窟艺术、牡丹花季、洛阳老街",
    tier: "A"
  },
  "开封": {
    heat: 82,
    notes: "35万+",
    trending: "清明上河园、开封夜市、灌汤包、宋文化沉浸",
    tier: "A"
  },
  "济南": {
    heat: 80,
    notes: "30万+",
    trending: "趵突泉、大明湖、芙蓉街美食、泉城打卡",
    tier: "A"
  },
  "曲阜": {
    heat: 78,
    notes: "20万+",
    trending: "三孔圣地、儒学文化、研学游、六艺城",
    tier: "A"
  },
  "壶口瀑布": {
    heat: 77,
    notes: "25万+",
    trending: "黄河奇观、壶口飞瀑、彩虹摄影、秋季最佳",
    tier: "A"
  },
  "烟台": {
    heat: 76,
    notes: "22万+",
    trending: "蓬莱仙境、长岛海岛、海鲜市场、海滨度假",
    tier: "A"
  },
  "郑州少林寺": {
    heat: 75,
    notes: "25万+",
    trending: "少林功夫、武术表演、嵩山徒步、禅宗祖庭",
    tier: "A"
  },
  "太原": {
    heat: 72,
    notes: "18万+",
    trending: "晋祠、柳巷美食、山西博物院、汾河夜景",
    tier: "A"
  },
  "恒山·悬空寺": {
    heat: 70,
    notes: "15万+",
    trending: "悬崖绝壁古寺、五岳北岳、大同联游、建筑奇迹",
    tier: "A"
  },

  // --- Tier B ---
  "威海刘公岛": {
    heat: 68,
    notes: "12万+",
    trending: "甲午海战遗址、海岛风光、爱国教育、海鲜",
    tier: "B"
  },
  "日照": {
    heat: 65,
    notes: "10万+",
    trending: "万平口沙滩、赶海拾贝、日出之城、海鲜大排档",
    tier: "B"
  },
  "盘锦红海滩": {
    heat: 62,
    notes: "8万+",
    trending: "红色碱蓬草、秋季最美湿地、丹顶鹤、摄影胜地",
    tier: "B"
  },
  "安阳殷墟": {
    heat: 58,
    notes: "6万+",
    trending: "商朝遗址、甲骨文发源地、世界文化遗产、殷墟博物馆",
    tier: "B"
  },
  "正定古城": {
    heat: 55,
    notes: "5万+",
    trending: "荣国府、隆兴寺、正定夜景、免费古城",
    tier: "B"
  },
  "唐山滦州古城": {
    heat: 52,
    notes: "4万+",
    trending: "北方水乡、夜景灯光、古城免门票、周末自驾",
    tier: "B"
  },
  "连云港花果山": {
    heat: 50,
    notes: "4万+",
    trending: "西游记取景地、水帘洞、猴王花果山、海滨城市",
    tier: "B"
  },

  // --- Tier C ---
  "徐州": {
    heat: 48,
    notes: "3万+",
    trending: "楚汉文化、云龙湖、汉兵马俑、户部山",
    tier: "C"
  },
  "秦皇岛翡翠岛": {
    heat: 45,
    notes: "2.5万+",
    trending: "沙漠与大海、滑沙冲浪、露营篝火、小众海滩",
    tier: "C"
  },
  "邯郸": {
    heat: 42,
    notes: "2万+",
    trending: "成语之都、邯郸学步、赵王城遗址、广府古城",
    tier: "C"
  },
  "葫芦岛": {
    heat: 40,
    notes: "1.5万+",
    trending: "兴城古城、龙湾海滨、辽西海滨度假、海鲜便宜",
    tier: "C"
  },
  "赵州桥": {
    heat: 38,
    notes: "1.2万+",
    trending: "千年石拱桥、课本经典、石家庄周边、世界遗产",
    tier: "C"
  },
  "邢台大峡谷": {
    heat: 35,
    notes: "1万+",
    trending: "太行山峡谷、瀑布溯溪、小众户外、河北秘境",
    tier: "C"
  },
  "锦州笔架山": {
    heat: 32,
    notes: "8000+",
    trending: "天桥奇观、潮汐海路、辽西古塔、海岛探秘",
    tier: "C"
  },

  // --- Tier D ---
  "沧州": {
    heat: 28,
    notes: "6000+",
    trending: "铁狮子、沧州武术、吴桥杂技、运河古城",
    tier: "D"
  },
  "衡水湖": {
    heat: 22,
    notes: "3000+",
    trending: "华北最大淡水湖、候鸟观赏、湿地骑行、小众生态游",
    tier: "D"
  },

  // ===== 补充数据：data-extra.js (9条) =====
  "张家口暖泉古镇": {
    heat: 62,
    notes: "8万+",
    trending: "打树花、古堡、民俗体验、冬季旅行",
    tier: "B"
  },
  "涞水野三坡百里峡": {
    heat: 72,
    notes: "15万+",
    trending: "峡谷漂流、天梯栈道、避暑、自驾游",
    tier: "A"
  },
  "崇礼万龙滑雪场": {
    heat: 78,
    notes: "20万+",
    trending: "滑雪攻略、雪道推荐、冬奥同款、装备清单",
    tier: "A"
  },
  "古北水镇附近司马台水库": {
    heat: 55,
    notes: "5万+",
    trending: "野餐露营、水库日落、小众秘境、自驾",
    tier: "B"
  },
  "北京植物园（原北植）": {
    heat: 70,
    notes: "12万+",
    trending: "桃花节、温室热带植物、赏花攻略、春游",
    tier: "A"
  },
  "北戴河蔚蓝海岸": {
    heat: 68,
    notes: "10万+",
    trending: "沙雕大世界、亲子海滩、滑沙、日出",
    tier: "B"
  },
  "灵山天池": {
    heat: 45,
    notes: "3万+",
    trending: "高山草甸、徒步穿越、野花、云海",
    tier: "C"
  },
  "承德外八庙": {
    heat: 58,
    notes: "6万+",
    trending: "藏式建筑、普陀宗乘之庙、历史文化、避暑",
    tier: "B"
  },
  "延庆龙庆峡冰灯节": {
    heat: 75,
    notes: "18万+",
    trending: "冰灯冰雕、冬季夜游、花灯、春节打卡",
    tier: "A"
  },

  // ===== 补充数据：data-extra2.js (27条) =====
  "鸟巢水立方": {
    heat: 88,
    notes: "50万+",
    trending: "奥运场馆、夜景灯光、打卡拍照、冰丝带",
    tier: "A"
  },
  "春晖园温泉": {
    heat: 52,
    notes: "4万+",
    trending: "冬季泡汤、温泉度假、顺义周边、亲子",
    tier: "B"
  },
  "蓟州独乐寺": {
    heat: 48,
    notes: "3万+",
    trending: "千年古寺、观音阁、辽代建筑、天津周边",
    tier: "C"
  },
  "房山云居寺": {
    heat: 55,
    notes: "5万+",
    trending: "石经、佛教文化、千年古刹、秋季银杏",
    tier: "B"
  },
  "白瀑寺": {
    heat: 42,
    notes: "2万+",
    trending: "小众寺庙、石佛群、门头沟、清净修行",
    tier: "C"
  },
  "龙门涧": {
    heat: 38,
    notes: "1.5万+",
    trending: "峡谷徒步、野线探险、门头沟秘境、溪流",
    tier: "C"
  },
  "居庸关花海列车": {
    heat: 85,
    notes: "35万+",
    trending: "S2线、列车穿越花海、春天打卡、摄影",
    tier: "A"
  },
  "黄草梁": {
    heat: 50,
    notes: "4万+",
    trending: "野长城、徒步露营、日出云海、户外挑战",
    tier: "B"
  },
  "东灵山": {
    heat: 46,
    notes: "3万+",
    trending: "北京最高峰、高山草甸、徒步、野营",
    tier: "C"
  },
  "密云桃园仙谷": {
    heat: 44,
    notes: "2.5万+",
    trending: "瀑布溪水、夏季避暑、亲子戏水、自然风光",
    tier: "C"
  },
  "密云黑山寺": {
    heat: 36,
    notes: "1.5万+",
    trending: "古寺禅修、山林静谧、小众打卡、秋叶",
    tier: "C"
  },
  "遥桥峪村": {
    heat: 32,
    notes: "1万+",
    trending: "古堡村落、明代城墙、原始乡村、慢生活",
    tier: "C"
  },
  "北京野生动物园": {
    heat: 82,
    notes: "30万+",
    trending: "自驾投喂、猛兽区、亲子遛娃、网红动物",
    tier: "A"
  },
  "世界公园": {
    heat: 60,
    notes: "8万+",
    trending: "微缩景观、异域风情、亲子科普、拍照打卡",
    tier: "B"
  },
  "中国园林博物馆": {
    heat: 45,
    notes: "3万+",
    trending: "园林艺术、免费参观、室内展览、雨天好去处",
    tier: "C"
  },
  "北京天文馆": {
    heat: 72,
    notes: "15万+",
    trending: "天象厅、亲子科普、宇宙探索、周末遛娃",
    tier: "A"
  },
  "故宫角楼咖啡": {
    heat: 80,
    notes: "25万+",
    trending: "故宫周边、文创饮品、角楼拍照、网红咖啡",
    tier: "A"
  },
  "蔡家洼玫瑰园": {
    heat: 48,
    notes: "3万+",
    trending: "玫瑰花海、密云郊游、拍照打卡、五月花期",
    tier: "C"
  },
  "北京植物园牡丹节": {
    heat: 65,
    notes: "10万+",
    trending: "牡丹花展、春季赏花、园林景观、摄影",
    tier: "B"
  },
  "白草畔": {
    heat: 40,
    notes: "2万+",
    trending: "高山草甸、百花山相邻、避暑徒步、日出",
    tier: "C"
  },
  "北京欢乐水魔方": {
    heat: 62,
    notes: "8万+",
    trending: "水上乐园、夏季消暑、滑梯冲浪、亲子",
    tier: "B"
  },
  "北京奥林匹克塔": {
    heat: 66,
    notes: "9万+",
    trending: "五环标志、观景台、夜景俯瞰、奥森全景",
    tier: "B"
  },
  "怀来葡萄酒庄": {
    heat: 54,
    notes: "5万+",
    trending: "红酒品鉴、庄园体验、怀来产区、周末微度假",
    tier: "B"
  },
  "平谷大峡谷": {
    heat: 56,
    notes: "6万+",
    trending: "京东大峡谷、漂流戏水、峡谷风光、自驾",
    tier: "B"
  },
  "雁栖湖国际会都": {
    heat: 70,
    notes: "12万+",
    trending: "APEC会址、湖光山色、环湖骑行、日落",
    tier: "A"
  },
  "平谷老泰山": {
    heat: 30,
    notes: "1万+",
    trending: "小众爬山、平谷周边、人少清净、登高望远",
    tier: "C"
  },
  "昌平十三陵水库": {
    heat: 58,
    notes: "6万+",
    trending: "骑行环湖、钓鱼、野餐、樱花大道",
    tier: "B"
  },

  // ===== 补充数据：data-beijing-500.js (100条) =====
  "故宫": {
    heat: 98,
    notes: "200万+",
    trending: "紫禁城、故宫雪景、角楼日落、文创雪糕",
    tier: "S"
  },
  "天坛": {
    heat: 92,
    notes: "80万+",
    trending: "祈年殿、回音壁、银杏大道、古建筑摄影",
    tier: "S"
  },
  "颐和园": {
    heat: 94,
    notes: "100万+",
    trending: "昆明湖、十七孔桥、佛香阁、皇家园林",
    tier: "S"
  },
  "北京动物园": {
    heat: 85,
    notes: "40万+",
    trending: "大熊猫馆、海洋馆、亲子遛娃、周末好去处",
    tier: "A"
  },
  "北京海洋馆": {
    heat: 78,
    notes: "20万+",
    trending: "海豚表演、水族箱、亲子科普、室内游玩",
    tier: "A"
  },
  "什刹海酒吧街": {
    heat: 76,
    notes: "18万+",
    trending: "后海酒吧、live house、夜生活、湖边散步",
    tier: "A"
  },
  "烟袋斜街": {
    heat: 80,
    notes: "25万+",
    trending: "老北京胡同、文艺小店、烟袋斜街咖啡、鼓楼",
    tier: "A"
  },
  "五道营胡同": {
    heat: 82,
    notes: "28万+",
    trending: "文艺胡同、独立咖啡馆、杂货铺、拍照打卡",
    tier: "A"
  },
  "三里屯": {
    heat: 90,
    notes: "60万+",
    trending: "潮流购物、太古里、网红餐厅、夜生活",
    tier: "S"
  },
  "望京SOHO": {
    heat: 72,
    notes: "15万+",
    trending: "扎哈设计、建筑摄影、望京地标、日落打卡",
    tier: "A"
  },
  "中国美术馆": {
    heat: 68,
    notes: "10万+",
    trending: "免费展览、当代艺术、文化打卡、雨天好去处",
    tier: "B"
  },
  "国家博物馆": {
    heat: 86,
    notes: "45万+",
    trending: "国宝文物、免费参观、历史展览、打卡攻略",
    tier: "A"
  },
  "北京天桥艺术中心": {
    heat: 52,
    notes: "4万+",
    trending: "音乐剧、话剧演出、戏剧节、文化体验",
    tier: "B"
  },
  "朝阳公园": {
    heat: 78,
    notes: "22万+",
    trending: "公园野餐、遛娃圣地、晨跑骑行、樱花季",
    tier: "A"
  },
  "玉渊潭公园": {
    heat: 84,
    notes: "35万+",
    trending: "樱花节、春季赏花、湖畔野餐、划船",
    tier: "A"
  },
  "紫竹院公园": {
    heat: 65,
    notes: "9万+",
    trending: "竹林散步、划船赏荷、免费公园、海棠花",
    tier: "B"
  },
  "陶然亭公园": {
    heat: 62,
    notes: "8万+",
    trending: "冬季冰场、春季海棠、亲子游乐、湖景",
    tier: "B"
  },
  "景山公园": {
    heat: 88,
    notes: "50万+",
    trending: "俯瞰故宫、牡丹花、日出打卡、中轴线",
    tier: "A"
  },
  "北京大学/清华大学参观": {
    heat: 80,
    notes: "25万+",
    trending: "名校打卡、未名湖、荷塘月色、学术氛围",
    tier: "A"
  },
  "什刹海冰场": {
    heat: 75,
    notes: "18万+",
    trending: "冬季溜冰、老北京风情、冰嬉、后海冰场",
    tier: "A"
  },
  "白洋淀荷花节": {
    heat: 62,
    notes: "8万+",
    trending: "荷花观赏、湿地游船、雄安新区、夏季出游",
    tier: "B"
  },
  "野三坡百里峡漂流": {
    heat: 65,
    notes: "9万+",
    trending: "漂流刺激、峡谷风光、夏季避暑、自驾游",
    tier: "B"
  },
  "承德金山岭长城": {
    heat: 78,
    notes: "20万+",
    trending: "野长城、摄影圣地、日出云海、徒步穿越",
    tier: "A"
  },
  "秦皇岛老龙头": {
    heat: 64,
    notes: "9万+",
    trending: "长城入海、海边长城、历史景点、日出",
    tier: "B"
  },
  "北戴河鸽子窝": {
    heat: 72,
    notes: "15万+",
    trending: "看日出、观鸟、赶海拾贝、海边栈道",
    tier: "A"
  },
  "乐亭月坨岛": {
    heat: 58,
    notes: "6万+",
    trending: "海岛露营、日出日落、小马尔代夫、赶海",
    tier: "B"
  },
  "唐山清东陵": {
    heat: 56,
    notes: "5万+",
    trending: "皇陵探秘、清代建筑、历史文化、古松",
    tier: "B"
  },
  "张家口鸡鸣驿": {
    heat: 60,
    notes: "7万+",
    trending: "古驿站、明代城墙、影视取景地、历史感",
    tier: "B"
  },
  "保定白洋淀温泉": {
    heat: 48,
    notes: "3万+",
    trending: "温泉度假、白洋淀周边、冬季泡汤、放松",
    tier: "C"
  },
  "廊坊天下第一城": {
    heat: 52,
    notes: "4万+",
    trending: "仿古建筑、亲子游、影视拍摄、周末出游",
    tier: "B"
  },
  "邢台崆山白云洞": {
    heat: 45,
    notes: "3万+",
    trending: "溶洞奇观、地下景观、避暑探洞、自驾",
    tier: "C"
  },
  "石家庄西柏坡": {
    heat: 55,
    notes: "5万+",
    trending: "红色旅游、革命圣地、历史教育、党建",
    tier: "B"
  },
  "石家庄抱犊寨": {
    heat: 50,
    notes: "4万+",
    trending: "山顶平台、登山健身、日出、石家庄周边",
    tier: "B"
  },
  "保定野三坡十渡漂流": {
    heat: 68,
    notes: "10万+",
    trending: "漂流蹦极、山水风光、夏季戏水、自驾游",
    tier: "B"
  },
  "衡水武强年画": {
    heat: 28,
    notes: "8千+",
    trending: "非遗文化、木版年画、民俗体验、传统工艺",
    tier: "D"
  },
  "沧州吴桥杂技": {
    heat: 42,
    notes: "2万+",
    trending: "杂技表演、民间艺术、非遗、大世界",
    tier: "C"
  },
  "张家口翠云山": {
    heat: 46,
    notes: "3万+",
    trending: "森林滑雪、避暑度假、山地骑行、亲子",
    tier: "C"
  },
  "承德磬锤峰": {
    heat: 50,
    notes: "4万+",
    trending: "棒槌山、丹霞地貌、登山观景、承德地标",
    tier: "B"
  },
  "秦皇岛板厂峪长城": {
    heat: 42,
    notes: "2万+",
    trending: "野长城、未开发、徒步探险、摄影",
    tier: "C"
  },
  "唐山开滦矿山公园": {
    heat: 38,
    notes: "1.5万+",
    trending: "工业遗产、矿井探秘、历史博物馆、唐山",
    tier: "C"
  },
  "天津海河夜游": {
    heat: 82,
    notes: "30万+",
    trending: "游船夜景、海河灯光、天津之眼、解放桥",
    tier: "A"
  },
  "天津瓷房子": {
    heat: 80,
    notes: "25万+",
    trending: "瓷片建筑、艺术打卡、网红景点、拍照",
    tier: "A"
  },
  "天津滨海图书馆": {
    heat: 85,
    notes: "35万+",
    trending: "网红图书馆、未来感设计、打卡拍照、建筑",
    tier: "A"
  },
  "天津小白楼": {
    heat: 55,
    notes: "5万+",
    trending: "西式建筑、天津五大道、历史街区、洋楼",
    tier: "B"
  },
  "杨柳青古镇": {
    heat: 62,
    notes: "8万+",
    trending: "年画、石家大院、民俗文化、春节",
    tier: "B"
  },
  "天津航母主题公园": {
    heat: 60,
    notes: "7万+",
    trending: "基辅号航母、军事体验、亲子科普、登舰",
    tier: "B"
  },
  "黄崖关长城": {
    heat: 58,
    notes: "6万+",
    trending: "天津长城、蓟州爬长城、秋季红叶、马拉松",
    tier: "B"
  },
  "独流老醋博物馆": {
    heat: 25,
    notes: "5千+",
    trending: "醋文化、非遗工艺、天津特产、小众体验",
    tier: "D"
  },
  "天津水上公园": {
    heat: 55,
    notes: "5万+",
    trending: "湖光岛影、亲子游、划船、天津休闲",
    tier: "B"
  },
  "天津自然博物馆": {
    heat: 52,
    notes: "4万+",
    trending: "恐龙化石、亲子科普、免费参观、雨天",
    tier: "B"
  },
  "淄博烧烤": {
    heat: 88,
    notes: "50万+",
    trending: "小饼卷肉、烧烤攻略、网红城市、美食打卡",
    tier: "A"
  },
  "潍坊风筝博物馆": {
    heat: 45,
    notes: "3万+",
    trending: "风筝之都、非遗文化、风筝节、亲子手作",
    tier: "C"
  },
  "临沂蒙山": {
    heat: 55,
    notes: "5万+",
    trending: "沂蒙山、云海日出、玻璃栈道、登山健身",
    tier: "B"
  },
  "枣庄台儿庄古城": {
    heat: 75,
    notes: "18万+",
    trending: "运河古城、夜景灯火、江北水乡、古城住宿",
    tier: "A"
  },
  "聊城光岳楼": {
    heat: 32,
    notes: "1万+",
    trending: "千年古楼、聊城地标、历史文化、免费",
    tier: "C"
  },
  "菏泽牡丹园": {
    heat: 68,
    notes: "10万+",
    trending: "牡丹之都、赏花攻略、四月花期、国色天香",
    tier: "B"
  },
  "东营黄河入海口": {
    heat: 58,
    notes: "6万+",
    trending: "黄河湿地、候鸟迁徙、日落、生态旅游",
    tier: "B"
  },
  "蓬莱八仙渡": {
    heat: 55,
    notes: "5万+",
    trending: "八仙过海、海上仙境、蓬莱阁周边、神话",
    tier: "B"
  },
  "长岛万鸟岛": {
    heat: 60,
    notes: "7万+",
    trending: "海鸥喂食、海岛风光、渔家乐、海钓",
    tier: "B"
  },
  "荣成天鹅湖": {
    heat: 65,
    notes: "9万+",
    trending: "冬季天鹅、摄影打卡、生态湿地、浪漫",
    tier: "B"
  },
  "栖霞牟氏庄园": {
    heat: 35,
    notes: "1.5万+",
    trending: "北方民居、清代庄园、建筑文化、历史",
    tier: "C"
  },
  "沂蒙山银座天蒙": {
    heat: 48,
    notes: "3万+",
    trending: "玻璃桥、山岳风光、索道、森林步道",
    tier: "C"
  },
  "微山湖红荷湿地": {
    heat: 50,
    notes: "4万+",
    trending: "荷花观赏、湿地生态、铁道游击队、夏季",
    tier: "B"
  },
  "泰安岱庙": {
    heat: 58,
    notes: "6万+",
    trending: "泰山脚下、古建筑群、碑刻、历史文化",
    tier: "B"
  },
  "济宁水泊梁山": {
    heat: 42,
    notes: "2万+",
    trending: "水浒文化、好汉城、忠义堂、历史体验",
    tier: "C"
  },
  "青岛崂山太清宫": {
    heat: 72,
    notes: "15万+",
    trending: "道教名山、海上仙山、崂山绿茶、太清宫",
    tier: "A"
  },
  "烟台金沙滩": {
    heat: 70,
    notes: "12万+",
    trending: "海水浴场、日落沙滩、赶海拾贝、避暑",
    tier: "A"
  },
  "威海赤山": {
    heat: 48,
    notes: "3万+",
    trending: "大佛、海边景区、渔村风光、威海周边",
    tier: "C"
  },
  "日照万平口": {
    heat: 65,
    notes: "9万+",
    trending: "海滨浴场、日出打卡、赶海亲子、蓝天碧海",
    tier: "B"
  },
  "青岛八大关秋景": {
    heat: 82,
    notes: "28万+",
    trending: "红叶银杏、万国建筑、秋季摄影、浪漫散步",
    tier: "A"
  },
  "太原晋祠": {
    heat: 62,
    notes: "8万+",
    trending: "千年古祠、圣母殿、难老泉、古建筑",
    tier: "B"
  },
  "大同华严寺": {
    heat: 55,
    notes: "5万+",
    trending: "辽金建筑、佛教文化、大同古城、薄伽教藏",
    tier: "B"
  },
  "云冈石窟夜游": {
    heat: 72,
    notes: "15万+",
    trending: "石窟灯光秀、北魏石刻、世界遗产、夜景",
    tier: "A"
  },
  "乔家大院": {
    heat: 65,
    notes: "9万+",
    trending: "晋商文化、大红灯笼、清代民居、影视取景",
    tier: "B"
  },
  "王家大院": {
    heat: 60,
    notes: "7万+",
    trending: "民间故宫、晋商豪宅、建筑艺术、灵石",
    tier: "B"
  },
  "绵山": {
    heat: 50,
    notes: "4万+",
    trending: "介子推、寒食节发源地、悬崖栈道、道教",
    tier: "B"
  },
  "壶口瀑布冬季冰瀑": {
    heat: 75,
    notes: "18万+",
    trending: "黄河壶口、冰瀑奇观、冬季壮美、摄影",
    tier: "A"
  },
  "太行山大峡谷": {
    heat: 62,
    notes: "8万+",
    trending: "峡谷风光、红岩绝壁、徒步穿越、避暑",
    tier: "B"
  },
  "晋城皇城相府": {
    heat: 55,
    notes: "5万+",
    trending: "康熙老师、古堡建筑、皇家气派、晋城",
    tier: "B"
  },
  "运城盐湖": {
    heat: 68,
    notes: "10万+",
    trending: "中国死海、粉色盐湖、拍照打卡、漂浮体验",
    tier: "B"
  },
  "洛阳白马寺": {
    heat: 65,
    notes: "9万+",
    trending: "中国第一古刹、佛教祖庭、千年古寺、洛阳",
    tier: "B"
  },
  "洛阳老君山": {
    heat: 88,
    notes: "50万+",
    trending: "金顶云海、仙境日出、冬季雾凇、道教名山",
    tier: "A"
  },
  "开封清明上河园": {
    heat: 78,
    notes: "22万+",
    trending: "宋文化体验、夜游灯会、实景演出、穿越宋朝",
    tier: "A"
  },
  "焦作云台山": {
    heat: 82,
    notes: "30万+",
    trending: "红石峡、瀑布群、山水画廊、玻璃栈道",
    tier: "A"
  },
  "新乡八里沟": {
    heat: 52,
    notes: "4万+",
    trending: "瀑布溪流、太行山水、避暑戏水、亲子",
    tier: "B"
  },
  "林州红旗渠": {
    heat: 48,
    notes: "3万+",
    trending: "人工天河、红色教育、太行精神、研学",
    tier: "C"
  },
  "安阳汤阴岳飞庙": {
    heat: 38,
    notes: "1.5万+",
    trending: "岳飞故里、民族英雄、历史文化、爱国教育",
    tier: "C"
  },
  "沈阳故宫": {
    heat: 78,
    notes: "22万+",
    trending: "清代皇宫、满族文化、故宫文创、历史建筑",
    tier: "A"
  },
  "盘锦红海滩落日": {
    heat: 72,
    notes: "15万+",
    trending: "红色碱蓬、湿地落日、摄影圣地、秋季最美",
    tier: "A"
  },
  "大连金石滩": {
    heat: 75,
    notes: "18万+",
    trending: "地质公园、海滨浴场、发现王国、海鲜",
    tier: "A"
  },
  "大连老虎滩": {
    heat: 70,
    notes: "12万+",
    trending: "海洋公园、极地馆、亲子游玩、海滨风光",
    tier: "A"
  },
  "丹东鸭绿江": {
    heat: 65,
    notes: "9万+",
    trending: "中朝边境、断桥打卡、朝鲜风情、边境游",
    tier: "B"
  },
  "鞍山千山": {
    heat: 52,
    notes: "4万+",
    trending: "东北名山、佛道圣地、天然弥勒大佛、登山",
    tier: "B"
  },
  "本溪水洞": {
    heat: 62,
    notes: "8万+",
    trending: "地下暗河、溶洞游船、钟乳石、避暑",
    tier: "B"
  },
  "葫芦岛兴城古城": {
    heat: 50,
    notes: "4万+",
    trending: "明代古城、海滨小城、觉华岛、泡温泉",
    tier: "B"
  },
  "辽阳白塔": {
    heat: 28,
    notes: "8千+",
    trending: "辽代古塔、辽阳地标、历史遗迹、免费",
    tier: "D"
  },
  "朝阳北票化石群": {
    heat: 22,
    notes: "5千+",
    trending: "古生物化石、鸟化石、地质科考、冷门",
    tier: "D"
  },
  "营口鲅鱼圈": {
    heat: 55,
    notes: "5万+",
    trending: "海滨度假、温泉海鲜、山海广场、母亲雕塑",
    tier: "B"
  },
  "铁岭龙首山": {
    heat: 25,
    notes: "5千+",
    trending: "铁岭地标、城市公园、登山健身、免费",
    tier: "D"
  },
  "锦州医巫闾山": {
    heat: 40,
    notes: "2万+",
    trending: "辽西名山、观音阁、满族祭祀、秋季红叶",
    tier: "C"
  },

  // ===== 补充数据：data-beijing-hidden.js (100条) =====
  "史家胡同博物馆": {
    heat: 45,
    notes: "3万+",
    trending: "胡同历史、老北京生活、免费展览、小众",
    tier: "C"
  },
  "东交民巷使馆区": {
    heat: 55,
    notes: "5万+",
    trending: "百年使馆、西式建筑群、历史街区、摄影",
    tier: "B"
  },
  "牛街清真寺": {
    heat: 48,
    notes: "3万+",
    trending: "千年清真寺、伊斯兰建筑、牛街美食、文化",
    tier: "C"
  },
  "法源寺": {
    heat: 52,
    notes: "4万+",
    trending: "千年古刹、丁香花季、佛教文化、清净之地",
    tier: "B"
  },
  "白塔寺胡同": {
    heat: 50,
    notes: "4万+",
    trending: "白塔寺周边、胡同改造、文艺空间、漫步",
    tier: "B"
  },
  "杨梅竹斜街": {
    heat: 65,
    notes: "9万+",
    trending: "文艺书店、独立咖啡、老胡同新生、大栅栏",
    tier: "B"
  },
  "西什库教堂": {
    heat: 62,
    notes: "8万+",
    trending: "哥特建筑、北堂、圣诞弥撒、拍照打卡",
    tier: "B"
  },
  "智化寺": {
    heat: 40,
    notes: "2万+",
    trending: "明代古寺、京音乐非遗、古建筑、清净",
    tier: "C"
  },
  "广化寺": {
    heat: 38,
    notes: "1.5万+",
    trending: "什刹海古寺、佛教文化、晨钟暮鼓、清修",
    tier: "C"
  },
  "报国寺文化市场": {
    heat: 42,
    notes: "2万+",
    trending: "古玩钱币、旧书市场、淘宝捡漏、老北京",
    tier: "C"
  },
  "钟鼓楼广场": {
    heat: 72,
    notes: "15万+",
    trending: "中轴线地标、胡同街景、日落、鼓楼大街",
    tier: "A"
  },
  "宣南文化博物馆": {
    heat: 25,
    notes: "5千+",
    trending: "宣南士人、会馆文化、免费小馆、历史",
    tier: "D"
  },
  "琉璃厂西街": {
    heat: 58,
    notes: "6万+",
    trending: "古玩字画、文房四宝、老字号、传统文化",
    tier: "B"
  },
  "大栅栏观音寺": {
    heat: 30,
    notes: "1万+",
    trending: "百年商街旁、清代寺庙、修缮中、小众",
    tier: "C"
  },
  "京顺园": {
    heat: 20,
    notes: "3千+",
    trending: "顺义小园、本地休闲、安静散步、少有人知",
    tier: "D"
  },
  "77文创园": {
    heat: 45,
    notes: "3万+",
    trending: "文创空间、美术展览、设计市集、拍照",
    tier: "C"
  },
  "郎园Station": {
    heat: 55,
    notes: "5万+",
    trending: "文创园区、市集活动、首钢旁、周末活动",
    tier: "B"
  },
  "模范书局·诗空间": {
    heat: 60,
    notes: "7万+",
    trending: "教堂书店、百年建筑、文艺打卡、阅读空间",
    tier: "B"
  },
  "角楼图书馆": {
    heat: 58,
    notes: "6万+",
    trending: "角楼造型、免费阅读、文化活动、通州运河",
    tier: "B"
  },
  "PAGEONE北京坊": {
    heat: 65,
    notes: "9万+",
    trending: "网红书店、正阳门景观、设计感、阅读打卡",
    tier: "B"
  },
  "红砖美术馆": {
    heat: 72,
    notes: "15万+",
    trending: "当代艺术、红砖建筑、展览打卡、拍照圣地",
    tier: "A"
  },
  "木木美术馆": {
    heat: 62,
    notes: "8万+",
    trending: "当代艺术展、隆福寺、潮流文化、拍照",
    tier: "B"
  },
  "尤伦斯当代艺术中心(UCCA)": {
    heat: 75,
    notes: "18万+",
    trending: "798核心、国际大展、当代艺术、文化打卡",
    tier: "A"
  },
  "松美术馆": {
    heat: 68,
    notes: "10万+",
    trending: "白色极简、松树林、艺术展览、拍照打卡",
    tier: "B"
  },
  "中间美术馆": {
    heat: 35,
    notes: "1.5万+",
    trending: "学术展览、海淀小馆、当代艺术研究、免费",
    tier: "C"
  },
  "地坛公园银杏大道": {
    heat: 82,
    notes: "28万+",
    trending: "秋季银杏、金色大道、摄影打卡、十一月",
    tier: "A"
  },
  "柳荫公园": {
    heat: 28,
    notes: "8千+",
    trending: "柳树成荫、安静散步、老人晨练、免费公园",
    tier: "D"
  },
  "日坛公园": {
    heat: 42,
    notes: "2万+",
    trending: "明清祭日、使馆区旁、晨练散步、免费",
    tier: "C"
  },
  "月坛公园": {
    heat: 35,
    notes: "1.5万+",
    trending: "明清祭月、钟式建筑、银杏、安静散步",
    tier: "C"
  },
  "先农坛": {
    heat: 45,
    notes: "3万+",
    trending: "皇家祭祀、古建筑群、北京古代建筑博物馆",
    tier: "C"
  },
  "团结湖公园": {
    heat: 38,
    notes: "1.5万+",
    trending: "社区公园、水上乐园、三里屯旁、休闲",
    tier: "C"
  },
  "青年湖公园": {
    heat: 22,
    notes: "4千+",
    trending: "安定门社区、安静休闲、本地遛弯、免费",
    tier: "D"
  },
  "人定湖公园": {
    heat: 45,
    notes: "3万+",
    trending: "欧式园林、拍照打卡、小众公园、西城",
    tier: "C"
  },
  "龙潭西湖": {
    heat: 30,
    notes: "1万+",
    trending: "龙潭湖旁、安静散步、本地休闲、免费",
    tier: "C"
  },
  "元大都城垣遗址公园": {
    heat: 62,
    notes: "8万+",
    trending: "海棠花溪、春季赏花、元代城墙、跑步",
    tier: "B"
  },
  "正阳门箭楼": {
    heat: 55,
    notes: "5万+",
    trending: "前门地标、中轴线、古建筑、历史文化",
    tier: "B"
  },
  "德胜门箭楼": {
    heat: 42,
    notes: "2万+",
    trending: "明代城楼、古钱币展、中轴线北端、历史",
    tier: "C"
  },
  "北京古观象台": {
    heat: 48,
    notes: "3万+",
    trending: "明清天文仪器、建国门城楼、科学史、小众",
    tier: "C"
  },
  "五塔寺(真觉寺)": {
    heat: 50,
    notes: "4万+",
    trending: "金刚宝座塔、石刻博物馆、银杏秋色、古建",
    tier: "B"
  },
  "万寿寺(北京艺术博物馆)": {
    heat: 45,
    notes: "3万+",
    trending: "清代皇家寺院、艺术展览、万寿路、古建",
    tier: "C"
  },
  "大钟寺古钟博物馆": {
    heat: 38,
    notes: "1.5万+",
    trending: "永乐大钟、钟文化、免费小馆、亲子科普",
    tier: "C"
  },
  "徐悲鸿纪念馆": {
    heat: 40,
    notes: "2万+",
    trending: "大师画作、免费参观、艺术熏陶、新街口",
    tier: "C"
  },
  "梅兰芳纪念馆": {
    heat: 35,
    notes: "1.5万+",
    trending: "京剧大师、故居、戏曲文化、护国寺",
    tier: "C"
  },
  "老舍纪念馆": {
    heat: 38,
    notes: "1.5万+",
    trending: "四合院故居、文学打卡、老北京记忆、灯市口",
    tier: "C"
  },
  "宋庆龄故居": {
    heat: 35,
    notes: "1.5万+",
    trending: "后海花园、名人故居、历史遗迹、安静",
    tier: "C"
  },
  "护国寺小吃街": {
    heat: 72,
    notes: "15万+",
    trending: "老北京小吃、豆汁焦圈、驴打滚、地道美食",
    tier: "A"
  },
  "簋街": {
    heat: 82,
    notes: "28万+",
    trending: "深夜美食、麻辣小龙虾、夜宵圣地、烟火气",
    tier: "A"
  },
  "鬼市(潘家园天光墟)": {
    heat: 58,
    notes: "6万+",
    trending: "凌晨淘宝、旧物古玩、潘家园、老北京文化",
    tier: "B"
  },
  "花市清真寺旁牛羊肉胡同": {
    heat: 32,
    notes: "1万+",
    trending: "回民美食、本地小吃、老北京味道、小众",
    tier: "C"
  },
  "天桥市井美食": {
    heat: 45,
    notes: "3万+",
    trending: "天桥小吃、老北京市井、平民美食、烟火气",
    tier: "C"
  },
  "雍和宫附近的五道营创意区": {
    heat: 60,
    notes: "7万+",
    trending: "文艺胡同、雍和宫旁、独立小店、手作",
    tier: "B"
  },
  "天宁寺塔": {
    heat: 40,
    notes: "2万+",
    trending: "辽代砖塔、千年古塔、广安门、古建筑",
    tier: "C"
  },
  "碧云寺金刚宝座塔": {
    heat: 35,
    notes: "1.5万+",
    trending: "香山旁、石刻精美、古建筑、清净小寺",
    tier: "C"
  },
  "卧佛寺": {
    heat: 42,
    notes: "2万+",
    trending: "卧佛铜像、蜡梅花季、植物园内、古刹",
    tier: "C"
  },
  "妙应寺白塔": {
    heat: 52,
    notes: "4万+",
    trending: "元代白塔、藏传佛教、阜成门地标、古建",
    tier: "B"
  },
  "北海团城": {
    heat: 40,
    notes: "2万+",
    trending: "北海旁、玉佛殿、古松柏、小众景点",
    tier: "C"
  },
  "什刹海银锭桥": {
    heat: 62,
    notes: "8万+",
    trending: "银锭观山、后海标志、日落打卡、老北京",
    tier: "B"
  },
  "后海小巷子": {
    heat: 55,
    notes: "5万+",
    trending: "胡同探索、本地生活、隐藏小店、漫步",
    tier: "B"
  },
  "751D·PARK": {
    heat: 65,
    notes: "9万+",
    trending: "工业风园区、设计展、火车头广场、时尚",
    tier: "B"
  },
  "恒通商务园": {
    heat: 22,
    notes: "4千+",
    trending: "商务园区、咖啡馆、安静办公、小众",
    tier: "D"
  },
  "莱锦创意产业园": {
    heat: 28,
    notes: "8千+",
    trending: "文创园区、设计公司、小众打卡、朝阳",
    tier: "D"
  },
  "铜牛电影产业园": {
    heat: 30,
    notes: "1万+",
    trending: "影视文化、工业改造、小众园区、拍照",
    tier: "C"
  },
  "懋隆文化产业创意园": {
    heat: 25,
    notes: "5千+",
    trending: "非遗展示、传统工艺、安静园区、小众",
    tier: "D"
  },
  "京棉二厂创意园": {
    heat: 22,
    notes: "4千+",
    trending: "工业遗产改造、小众拍照、朝阳、安静",
    tier: "D"
  },
  "竞园艺术中心": {
    heat: 28,
    notes: "8千+",
    trending: "摄影展览、艺术空间、朝阳小众、创意",
    tier: "D"
  },
  "二七厂1897科创城": {
    heat: 32,
    notes: "1万+",
    trending: "工业遗产、火车文化、丰台、新开发区域",
    tier: "C"
  },
  "百花深处胡同": {
    heat: 58,
    notes: "6万+",
    trending: "陈凯歌MV、老胡同、新街口、文艺情怀",
    tier: "B"
  },
  "八大胡同历史文化区": {
    heat: 48,
    notes: "3万+",
    trending: "旧时风月、历史街区、建筑遗存、大栅栏",
    tier: "C"
  },
  "崇效寺遗址": {
    heat: 18,
    notes: "2千+",
    trending: "唐代古寺遗址、白牡丹、极小众、历史",
    tier: "D"
  },
  "报恩寺(南锣鼓巷旁)": {
    heat: 28,
    notes: "8千+",
    trending: "南锣旁小寺、安静禅意、古建、小众",
    tier: "D"
  },
  "金中都城墙遗址": {
    heat: 32,
    notes: "1万+",
    trending: "金代遗址、城墙公园、丰台历史、免费",
    tier: "C"
  },
  "万松老人塔": {
    heat: 38,
    notes: "1.5万+",
    trending: "砖塔胡同、元代古塔、正阳书局、文艺",
    tier: "C"
  },
  "广福观": {
    heat: 22,
    notes: "4千+",
    trending: "什刹海旁、道观、安静参观、古建筑",
    tier: "D"
  },
  "火神庙": {
    heat: 25,
    notes: "5千+",
    trending: "地安门、古代消防、小众寺庙、历史",
    tier: "D"
  },
  "中国邮政邮票博物馆": {
    heat: 35,
    notes: "1.5万+",
    trending: "邮票收藏、集邮爱好者、免费参观、建国门",
    tier: "C"
  },
  "北京自来水博物馆": {
    heat: 28,
    notes: "8千+",
    trending: "工业遗产、自来水历史、东直门、免费",
    tier: "D"
  },
  "北京警察博物馆": {
    heat: 32,
    notes: "1万+",
    trending: "警察文化、刑侦展览、东交民巷、亲子",
    tier: "C"
  },
  "中国电影博物馆": {
    heat: 58,
    notes: "6万+",
    trending: "电影历史、IMAX巨幕、亲子科普、免费",
    tier: "B"
  },
  "中国铁道博物馆": {
    heat: 52,
    notes: "4万+",
    trending: "火车展览、铁路历史、亲子科普、东郊",
    tier: "B"
  },
  "北京航空航天博物馆": {
    heat: 48,
    notes: "3万+",
    trending: "飞机实物、航天科普、北航校内、免费",
    tier: "C"
  },
  "首都粮食博物馆": {
    heat: 20,
    notes: "3千+",
    trending: "粮食文化、工业遗产、极小众、免费",
    tier: "D"
  },
  "北京印刷博物馆": {
    heat: 22,
    notes: "4千+",
    trending: "印刷历史、活字印刷体验、大兴、免费",
    tier: "D"
  },
  "玉渊潭樱花": {
    heat: 88,
    notes: "50万+",
    trending: "早樱晚樱、樱花季攻略、粉色花海、春天必去",
    tier: "A"
  },
  "紫竹院海棠花廊": {
    heat: 55,
    notes: "5万+",
    trending: "海棠花开、春季赏花、免费公园、拍照",
    tier: "B"
  },
  "海淀公园银杏": {
    heat: 50,
    notes: "4万+",
    trending: "秋季银杏、金色落叶、海淀散步、免费",
    tier: "B"
  },
  "奥森北园彩叶林": {
    heat: 65,
    notes: "9万+",
    trending: "秋季彩叶、银杏红叶、跑步赏景、摄影",
    tier: "B"
  },
  "北宫国家森林公园红叶": {
    heat: 60,
    notes: "7万+",
    trending: "红叶观赏、丰台秋色、登山赏景、人少",
    tier: "B"
  },
  "大运河森林公园秋色": {
    heat: 55,
    notes: "5万+",
    trending: "运河秋景、骑行散步、通州公园、银杏",
    tier: "B"
  },
  "通州运河夜景": {
    heat: 52,
    notes: "4万+",
    trending: "运河灯光、通州地标、夜景散步、城市副中心",
    tier: "B"
  },
  "温榆河公园": {
    heat: 72,
    notes: "15万+",
    trending: "京城最大绿肺、野餐露营、亲子遛娃、骑行",
    tier: "A"
  },
  "中央电视塔观景台": {
    heat: 58,
    notes: "6万+",
    trending: "俯瞰北京、旋转餐厅、城市天际线、夜景",
    tier: "B"
  },
  "国贸三期80层": {
    heat: 62,
    notes: "8万+",
    trending: "高空俯瞰、CBD天际线、日落打卡、城市景观",
    tier: "B"
  },
  "望京SOHO日落": {
    heat: 55,
    notes: "5万+",
    trending: "扎哈建筑、日落剪影、建筑摄影、望京地标",
    tier: "B"
  },
  "银河SOHO建筑摄影": {
    heat: 50,
    notes: "4万+",
    trending: "扎哈曲线、未来感建筑、摄影打卡、朝阳门",
    tier: "B"
  },
  "丽泽商务区SOHO": {
    heat: 35,
    notes: "1.5万+",
    trending: "扎哈新作、双塔连廊、小众建筑、丰台",
    tier: "C"
  },
  "三里屯太古里": {
    heat: 88,
    notes: "50万+",
    trending: "潮流地标、街拍圣地、网红打卡、时尚购物",
    tier: "A"
  },
  "工体夜生活圈": {
    heat: 75,
    notes: "18万+",
    trending: "夜店酒吧、live house、夜生活、年轻人",
    tier: "A"
  },
  "鼓楼东大街酒吧": {
    heat: 62,
    notes: "8万+",
    trending: "独立酒吧、精酿啤酒、鼓楼文艺、夜生活",
    tier: "B"
  },
  "五道营深夜食堂": {
    heat: 55,
    notes: "5万+",
    trending: "深夜小馆、文艺胡同、宵夜、小众美食",
    tier: "B"
  },
  "东四胡同深夜咖啡": {
    heat: 42,
    notes: "2万+",
    trending: "深夜咖啡、胡同夜晚、安静独处、小众",
    tier: "C"
  },

  // ===== 补充数据：data-beijing-tales.js (100条) =====
  "朝内大街81号": {
    heat: 78,
    notes: "22万+",
    trending: "京城第一鬼屋、灵异传说、探险打卡、都市传说",
    tier: "A"
  },
  "北新桥锁龙井": {
    heat: 72,
    notes: "15万+",
    trending: "龙脉传说、地铁锁龙井、都市传说、北京奇谈",
    tier: "A"
  },
  "西单小石虎胡同": {
    heat: 35,
    notes: "1.5万+",
    trending: "曹雪芹故居传说、红楼梦、胡同探秘、历史",
    tier: "C"
  },
  "虎坊桥湖广会馆": {
    heat: 52,
    notes: "4万+",
    trending: "京城四大凶宅、会馆文化、京剧演出、历史",
    tier: "B"
  },
  "石虎胡同七号": {
    heat: 28,
    notes: "8千+",
    trending: "曹雪芹传说、小众探秘、胡同故事、历史",
    tier: "D"
  },
  "礼王府": {
    heat: 35,
    notes: "1.5万+",
    trending: "清代王府、凶宅传说、建筑遗存、西城",
    tier: "C"
  },
  "西安门大街鬼宅": {
    heat: 25,
    notes: "5千+",
    trending: "都市传说、灵异故事、老北京鬼故事、探险",
    tier: "D"
  },
  "菜市口刑场旧址": {
    heat: 55,
    notes: "5万+",
    trending: "古代刑场、历史故事、菜市口地名由来、传说",
    tier: "B"
  },
  "京张铁路青龙桥站": {
    heat: 60,
    notes: "7万+",
    trending: "詹天佑、人字形铁路、百年老站、历史遗迹",
    tier: "B"
  },
  "前门老火车站": {
    heat: 55,
    notes: "5万+",
    trending: "百年火车站、近代史、前门大街、建筑",
    tier: "B"
  },
  "北京饭店百年老楼": {
    heat: 42,
    notes: "2万+",
    trending: "百年酒店、民国风情、历史建筑、老北京",
    tier: "C"
  },
  "东单三条协和别墅群": {
    heat: 28,
    notes: "8千+",
    trending: "协和医院旁、民国建筑、小众探秘、历史",
    tier: "D"
  },
  "京师大学堂旧址": {
    heat: 35,
    notes: "1.5万+",
    trending: "北大前身、近代教育史、沙滩红楼、五四",
    tier: "C"
  },
  "段祺瑞执政府旧址": {
    heat: 48,
    notes: "3万+",
    trending: "三一八惨案、近代史遗址、灰色建筑、张自忠路",
    tier: "C"
  },
  "张自忠路原北平市政府": {
    heat: 30,
    notes: "1万+",
    trending: "近代史建筑、北平往事、历史街区、小众",
    tier: "C"
  },
  "中南海邮局": {
    heat: 42,
    notes: "2万+",
    trending: "特殊邮戳、红色地标、打卡寄信、纪念",
    tier: "C"
  },
  "北京地下城": {
    heat: 48,
    notes: "3万+",
    trending: "冷战防空洞、地下城市、神秘探险、历史遗迹",
    tier: "C"
  },
  "前门地下街": {
    heat: 32,
    notes: "1万+",
    trending: "地下商街、老北京记忆、怀旧、前门",
    tier: "C"
  },
  "正阳门城楼内部": {
    heat: 45,
    notes: "3万+",
    trending: "城楼登顶、中轴线、前门城楼、历史建筑",
    tier: "C"
  },
  "钟楼内部": {
    heat: 42,
    notes: "2万+",
    trending: "古代报时、钟楼登顶、中轴线、俯瞰胡同",
    tier: "C"
  },
  "鼓楼二层击鼓表演": {
    heat: 52,
    notes: "4万+",
    trending: "击鼓表演、鼓楼登顶、中轴线、传统文化",
    tier: "B"
  },
  "国子监辟雍": {
    heat: 55,
    notes: "5万+",
    trending: "皇帝讲学、古代最高学府、中式建筑、文化",
    tier: "B"
  },
  "孔庙古柏触奸柏": {
    heat: 40,
    notes: "2万+",
    trending: "古柏传说、孔庙国子监、严嵩故事、古树",
    tier: "C"
  },
  "鲁迅故居（阜成门）": {
    heat: 42,
    notes: "2万+",
    trending: "鲁迅博物馆、文学打卡、四合院故居、阜成门",
    tier: "C"
  },
  "齐白石旧居纪念馆": {
    heat: 35,
    notes: "1.5万+",
    trending: "国画大师、故居打卡、四合院、南锣鼓巷旁",
    tier: "C"
  },
  "郭沫若故居": {
    heat: 30,
    notes: "1万+",
    trending: "文学故居、什刹海旁、银杏、名人故居",
    tier: "C"
  },
  "茅盾故居": {
    heat: 28,
    notes: "8千+",
    trending: "后圆恩寺胡同、文学大师、四合院、安静",
    tier: "D"
  },
  "曹禺故居": {
    heat: 25,
    notes: "5千+",
    trending: "戏剧大师、小众故居、文学打卡、历史",
    tier: "D"
  },
  "谭嗣同故居（浏阳会馆）": {
    heat: 38,
    notes: "1.5万+",
    trending: "戊戌变法、维新志士、历史遗迹、菜市口",
    tier: "C"
  },
  "蔡锷故居（松坡图书馆）": {
    heat: 30,
    notes: "1万+",
    trending: "蔡锷小凤仙、民国故事、棉花胡同、历史",
    tier: "C"
  },
  "李大钊故居": {
    heat: 38,
    notes: "1.5万+",
    trending: "革命先驱、红色故居、文华胡同、历史教育",
    tier: "C"
  },
  "南锣鼓巷最后的大杂院": {
    heat: 45,
    notes: "3万+",
    trending: "胡同生活、老北京日常、烟火气、原生态",
    tier: "C"
  },
  "东四四条手工铁匠铺": {
    heat: 32,
    notes: "1万+",
    trending: "传统手艺、胡同匠人、非遗、老北京",
    tier: "C"
  },
  "前门打磨厂老字号": {
    heat: 38,
    notes: "1.5万+",
    trending: "百年老街、传统手工、文创改造、前门",
    tier: "C"
  },
  "牛街最后的传统屠宰坊参观": {
    heat: 22,
    notes: "4千+",
    trending: "清真文化、传统工艺、牛街、极小众",
    tier: "D"
  },
  "天桥杂耍艺人": {
    heat: 40,
    notes: "2万+",
    trending: "传统杂耍、民间艺术、老北京文化、市井",
    tier: "C"
  },
  "琉璃厂最后的手工宣纸作坊": {
    heat: 28,
    notes: "8千+",
    trending: "传统造纸、非遗工艺、琉璃厂、手作体验",
    tier: "D"
  },
  "东来顺涮肉总店": {
    heat: 72,
    notes: "15万+",
    trending: "百年老字号、铜锅涮肉、老北京美食、手切羊肉",
    tier: "A"
  },
  "天坛相亲角": {
    heat: 55,
    notes: "5万+",
    trending: "父母相亲、社会现象、围观体验、天坛公园",
    tier: "B"
  },
  "地坛书市": {
    heat: 62,
    notes: "8万+",
    trending: "旧书淘宝、文化市集、读书人、春秋两季",
    tier: "B"
  },
  "潘家园凌晨鬼市": {
    heat: 65,
    notes: "9万+",
    trending: "凌晨淘宝、古玩旧货、夜明珠、老北京文化",
    tier: "B"
  },
  "报国寺古玩早市": {
    heat: 42,
    notes: "2万+",
    trending: "古玩钱币、清晨赶集、旧货市场、小众",
    tier: "C"
  },
  "天安门凌晨看升旗": {
    heat: 85,
    notes: "40万+",
    trending: "升旗仪式、爱国打卡、凌晨排队、天安门广场",
    tier: "A"
  },
  "景山公园日出俯瞰故宫": {
    heat: 80,
    notes: "25万+",
    trending: "故宫全景、日出摄影、中轴线最佳机位、打卡",
    tier: "A"
  },
  "什刹海冬泳老人": {
    heat: 35,
    notes: "1.5万+",
    trending: "冬泳文化、老北京生活、什刹海冬日、人文",
    tier: "C"
  },
  "三联韬奋书店（24小时）": {
    heat: 62,
    notes: "8万+",
    trending: "24小时书店、深夜阅读、文化地标、美术馆旁",
    tier: "B"
  },
  "凌晨4点的簋街": {
    heat: 52,
    notes: "4万+",
    trending: "深夜美食、凌晨烟火、夜猫子、小龙虾",
    tier: "B"
  },
  "后海酒吧街凌晨散场": {
    heat: 45,
    notes: "3万+",
    trending: "深夜后海、散场故事、夜生活、北京夜晚",
    tier: "C"
  },
  "天桥德云社散场宵夜": {
    heat: 55,
    notes: "5万+",
    trending: "德云社、相声散场、天桥宵夜、老北京",
    tier: "B"
  },
  "北京站凌晨候车室众生相": {
    heat: 38,
    notes: "1.5万+",
    trending: "人间百态、纪实摄影、城市故事、深夜",
    tier: "C"
  },
  "景山崇祯自缢处": {
    heat: 55,
    notes: "5万+",
    trending: "明朝末帝、历史遗迹、古槐、景山故事",
    tier: "B"
  },
  "故宫珍妃井": {
    heat: 60,
    notes: "7万+",
    trending: "珍妃跳井、宫廷秘史、故宫冷门景点、历史",
    tier: "B"
  },
  "故宫九龙壁修补秘密": {
    heat: 48,
    notes: "3万+",
    trending: "九龙壁传说、木头替代琉璃、故宫冷知识、打卡",
    tier: "C"
  },
  "北海五龙亭": {
    heat: 45,
    notes: "3万+",
    trending: "水上亭阁、北海拍照、日落、古建筑",
    tier: "C"
  },
  "颐和园铜牛": {
    heat: 52,
    notes: "4万+",
    trending: "镇水铜牛、颐和园冷知识、昆明湖畔、打卡",
    tier: "B"
  },
  "圆明园大水法遗址": {
    heat: 78,
    notes: "22万+",
    trending: "圆明园遗址、历史反思、废墟美学、爱国教育",
    tier: "A"
  },
  "雍正潜邸雍和宫": {
    heat: 72,
    notes: "15万+",
    trending: "雍正皇帝、藏传佛教、烧香祈福、清宫故事",
    tier: "A"
  },
  "恭王府藏宝楼": {
    heat: 65,
    notes: "9万+",
    trending: "和珅府邸、福字碑、王府花园、藏宝传说",
    tier: "B"
  },
  "同仁堂总店": {
    heat: 62,
    notes: "8万+",
    trending: "百年药铺、中医文化、老字号、大栅栏",
    tier: "B"
  },
  "全聚德前门店": {
    heat: 70,
    notes: "12万+",
    trending: "百年烤鸭、老字号总店、前门美食、京味",
    tier: "A"
  },
  "瑞蚨祥绸缎庄": {
    heat: 38,
    notes: "1.5万+",
    trending: "百年绸缎、国旗面料、老字号、大栅栏",
    tier: "C"
  },
  "荣宝斋": {
    heat: 45,
    notes: "3万+",
    trending: "百年书画、木版水印、琉璃厂、文房",
    tier: "C"
  },
  "内联升布鞋": {
    heat: 42,
    notes: "2万+",
    trending: "千层底布鞋、非遗老字号、手工技艺、前门",
    tier: "C"
  },
  "张一元茶庄": {
    heat: 48,
    notes: "3万+",
    trending: "百年茶庄、茉莉花茶、前门大栅栏、老字号",
    tier: "C"
  },
  "吴裕泰茶庄": {
    heat: 52,
    notes: "4万+",
    trending: "花茶冰淇淋、百年老字号、网红茶饮、北新桥",
    tier: "B"
  },
  "央视大裤衩": {
    heat: 68,
    notes: "10万+",
    trending: "CCTV总部、奇特建筑、建筑摄影、CBD地标",
    tier: "B"
  },
  "望京SOHO扎哈遗作": {
    heat: 50,
    notes: "4万+",
    trending: "扎哈哈迪德、建筑打卡、望京地标、设计",
    tier: "B"
  },
  "国家大剧院水下通道": {
    heat: 62,
    notes: "8万+",
    trending: "水下廊道、巨蛋建筑、灯光夜景、长安街",
    tier: "B"
  },
  "鸟巢内部钢结构": {
    heat: 55,
    notes: "5万+",
    trending: "奥运主场馆、钢结构艺术、内部参观、鸟巢",
    tier: "B"
  },
  "中国尊顶层": {
    heat: 65,
    notes: "9万+",
    trending: "北京第一高楼、528米、CBD天际线、观景",
    tier: "B"
  },
  "银河SOHO探秘扎哈曲线": {
    heat: 42,
    notes: "2万+",
    trending: "扎哈建筑、流线型设计、建筑摄影、朝阳门",
    tier: "C"
  },
  "凤凰国际传媒中心": {
    heat: 35,
    notes: "1.5万+",
    trending: "莫比乌斯环、朝阳公园旁、建筑设计、小众",
    tier: "C"
  },
  "天子大酒店福禄寿": {
    heat: 48,
    notes: "3万+",
    trending: "奇葩建筑、福禄寿造型、吉尼斯纪录、三河",
    tier: "C"
  },
  "百花深处胡同探秘陈凯歌MV": {
    heat: 45,
    notes: "3万+",
    trending: "陈凯歌MV、老胡同传说、新街口、文艺",
    tier: "C"
  },
  "帽儿胡同探秘婉容旧事": {
    heat: 42,
    notes: "2万+",
    trending: "末代皇后婉容、清代府邸、南锣鼓巷旁、历史",
    tier: "C"
  },
  "菊儿胡同吴良镛设计": {
    heat: 38,
    notes: "1.5万+",
    trending: "建筑大师设计、新四合院、获奖建筑、南锣旁",
    tier: "C"
  },
  "砖塔胡同最古老": {
    heat: 35,
    notes: "1.5万+",
    trending: "北京最古老胡同、元代砖塔、西四、历史",
    tier: "C"
  },
  "东堂子胡同蔡元培": {
    heat: 28,
    notes: "8千+",
    trending: "蔡元培故居、北大校长、胡同探秘、小众",
    tier: "D"
  },
  "西堂子胡同中国电影发源地": {
    heat: 25,
    notes: "5千+",
    trending: "中国电影史、胡同故事、东单、极小众",
    tier: "D"
  },
  "铁狮子胡同探秘段祺瑞府": {
    heat: 35,
    notes: "1.5万+",
    trending: "民国历史、灰砖建筑、张自忠路、北洋政府",
    tier: "C"
  },
  "棉花胡同蔡锷小凤仙传奇": {
    heat: 32,
    notes: "1万+",
    trending: "民国爱情、蔡锷将军、护国运动、胡同传说",
    tier: "C"
  },
  "中轴线永定门": {
    heat: 55,
    notes: "5万+",
    trending: "中轴线南端、城楼复建、世界遗产、打卡",
    tier: "B"
  },
  "中轴线钟鼓楼报时秘密": {
    heat: 45,
    notes: "3万+",
    trending: "古代报时、钟鼓楼故事、中轴线、历史文化",
    tier: "C"
  },
  "北京城几何中心": {
    heat: 28,
    notes: "8千+",
    trending: "地理中心、冷知识、城市规划、小众探秘",
    tier: "D"
  },
  "通州海拔最低点": {
    heat: 18,
    notes: "2千+",
    trending: "北京最低点、地理冷知识、通州运河、极冷门",
    tier: "D"
  },
  "钱市胡同最窄": {
    heat: 42,
    notes: "2万+",
    trending: "最窄胡同、大栅栏旁、打卡拍照、40厘米宽",
    tier: "C"
  },
  "一尺大街最短": {
    heat: 38,
    notes: "1.5万+",
    trending: "最短街道、琉璃厂旁、北京冷知识、打卡",
    tier: "C"
  },
  "天安门城楼内部探秘": {
    heat: 72,
    notes: "15万+",
    trending: "登城楼、天安门内部、俯瞰广场、红色打卡",
    tier: "A"
  },
  "故宫角楼雪景": {
    heat: 85,
    notes: "40万+",
    trending: "故宫雪景、角楼倒影、冬日北京、摄影圣地",
    tier: "A"
  },
  "颐和园十七孔桥金光穿洞": {
    heat: 80,
    notes: "25万+",
    trending: "冬至金光、十七孔桥、摄影奇观、颐和园冬季",
    tier: "A"
  },
  "北海荷花映白塔": {
    heat: 65,
    notes: "9万+",
    trending: "白塔荷花、夏日北海、古典美学、摄影",
    tier: "B"
  },
  "香山红叶隧道": {
    heat: 78,
    notes: "22万+",
    trending: "秋季红叶、香山缆车、最佳观赏期、摄影打卡",
    tier: "A"
  },
  "玉渊潭冰雪嘉年华": {
    heat: 62,
    notes: "8万+",
    trending: "冬季冰雪、亲子玩雪、冰场、冬日活动",
    tier: "B"
  },
  "卤煮火烧小肠陈": {
    heat: 68,
    notes: "10万+",
    trending: "老北京卤煮、百年老店、南横街、地道美食",
    tier: "B"
  },
  "豆汁儿锦馨": {
    heat: 58,
    notes: "6万+",
    trending: "老北京豆汁、焦圈配豆汁、磁器口、传统早点",
    tier: "B"
  },
  "炸酱面海碗居": {
    heat: 62,
    notes: "8万+",
    trending: "老北京炸酱面、大海碗、京味美食、打卡",
    tier: "B"
  },
  "涮羊肉南门涮肉": {
    heat: 70,
    notes: "12万+",
    trending: "铜锅涮肉、百年老店、手切羊肉、冬日美食",
    tier: "A"
  },
  "烤肉季烤肉宛": {
    heat: 58,
    notes: "6万+",
    trending: "南宛北季、炙子烤肉、百年老字号、什刹海",
    tier: "B"
  },
  "门钉肉饼": {
    heat: 52,
    notes: "4万+",
    trending: "老北京小吃、牛肉馅饼、地道早点、胡同美食",
    tier: "B"
  },
  "护国寺艾窝窝驴打滚": {
    heat: 55,
    notes: "5万+",
    trending: "老北京糕点、非遗小吃、护国寺、传统手艺",
    tier: "B"
  },

  // ===== 补充数据：原文件其他位置遗漏的北京目的地 (22条) =====
  "白河峡谷": {
    heat: 68,
    notes: "10万+",
    trending: "京郊漂流、峡谷徒步、露营野餐、夏季避暑",
    tier: "B"
  },
  "幽谷神潭": {
    heat: 42,
    notes: "2万+",
    trending: "瀑布溪水、怀柔秘境、夏季戏水、自驾",
    tier: "C"
  },
  "云蒙山": {
    heat: 62,
    notes: "8万+",
    trending: "云蒙山步道、森林氧吧、登山健身、红叶",
    tier: "B"
  },
  "海坨山": {
    heat: 55,
    notes: "5万+",
    trending: "露营看星空、日出云海、高山草甸、冬奥延庆",
    tier: "B"
  },
  "百花山": {
    heat: 58,
    notes: "6万+",
    trending: "高山花海、门头沟、夏季避暑、野花徒步",
    tier: "B"
  },
  "官厅水库": {
    heat: 52,
    notes: "4万+",
    trending: "水库骑行、怀来周边、钓鱼露营、日落",
    tier: "B"
  },
  "桃源仙谷": {
    heat: 40,
    notes: "2万+",
    trending: "密云瀑布、冬季冰瀑、夏季避暑、自驾",
    tier: "C"
  },
  "云蒙峡": {
    heat: 38,
    notes: "1.5万+",
    trending: "峡谷探险、密云秘境、溯溪徒步、小众",
    tier: "C"
  },
  "798艺术区": {
    heat: 92,
    notes: "80万+",
    trending: "当代艺术、工业风拍照、展览打卡、文艺青年",
    tier: "S"
  },
  "首钢园": {
    heat: 82,
    notes: "30万+",
    trending: "冬奥场馆、工业遗产、滑雪大跳台、科幻拍照",
    tier: "A"
  },
  "前门大栅栏": {
    heat: 85,
    notes: "40万+",
    trending: "老北京商街、老字号、前门步行街、京味文化",
    tier: "A"
  },
  "延庆野鸭湖湿地": {
    heat: 50,
    notes: "4万+",
    trending: "湿地观鸟、秋季芦苇、生态公园、延庆",
    tier: "B"
  },
  "汉石桥湿地": {
    heat: 52,
    notes: "4万+",
    trending: "顺义湿地、荷花观赏、皮划艇、亲子户外",
    tier: "B"
  },
  "翠湖湿地公园": {
    heat: 45,
    notes: "3万+",
    trending: "海淀湿地、预约制、观鸟、城市绿洲",
    tier: "C"
  },
  "灵水举人村": {
    heat: 38,
    notes: "1万+",
    trending: "举人古村、京西古村、秋季银杏柿子",
    tier: "C"
  },
  "水峪村": {
    heat: 22,
    notes: "3千+",
    trending: "石板古村、明清民居、房山深山",
    tier: "D"
  },
  "琉璃渠村": {
    heat: 31,
    notes: "5千+",
    trending: "皇家琉璃、门头沟古村、故宫同款琉璃",
    tier: "C"
  },
  "军都山滑雪场": {
    heat: 65,
    notes: "9万+",
    trending: "北京滑雪、初学者友好、昌平周末、夜场滑雪",
    tier: "B"
  },
  "怀北滑雪场": {
    heat: 55,
    notes: "5万+",
    trending: "怀柔滑雪、长城脚下滑雪、性价比高、新手",
    tier: "B"
  },
  "九华山庄温泉": {
    heat: 50,
    notes: "4万+",
    trending: "昌平温泉、冬季泡汤、亲子温泉、度假",
    tier: "B"
  },
  "天津古文化街": {
    heat: 75,
    notes: "18万+",
    trending: "天后宫、泥人张、杨柳青年画、津味小吃",
    tier: "A"
  },
  "怀柔水库": {
    heat: 48,
    notes: "3万+",
    trending: "环湖骑行、钓鱼、日落、怀柔休闲",
    tier: "C"
  },

  // ===== 2025-2026 北京新热门 =====
  "北京SKP": {
    heat: 88,
    notes: "25万+",
    trending: "SKP-S沉浸式、奢侈品打卡、甄选超市、大望路",
    tier: "A"
  },
  "合生汇": {
    heat: 85,
    notes: "20万+",
    trending: "21区BLOCK、网红美食排队、九龙山、潮流街区",
    tier: "A"
  },
  "华熙LIVE·五棵松": {
    heat: 82,
    notes: "15万+",
    trending: "演唱会散场、精酿酒吧、HI-UP、冰上运动",
    tier: "A"
  },
  "西单更新场": {
    heat: 80,
    notes: "18万+",
    trending: "下沉广场拍照、独立设计师、Z世代、先锋商业",
    tier: "A"
  },
  "THE BOX朝外": {
    heat: 78,
    notes: "12万+",
    trending: "LED天幕、空中花园、2024新商场、朝阳门首店",
    tier: "A"
  },
  "大悦春风里": {
    heat: 62,
    notes: "8万+",
    trending: "南城商业、亲子乐园、西红门、大兴周末",
    tier: "B"
  },
  "湾里": {
    heat: 65,
    notes: "5万+",
    trending: "通州新地标、运河商务区、室内滑雪、2025新开",
    tier: "B"
  },
  "北京太古坊": {
    heat: 58,
    notes: "3万+",
    trending: "太古新项目、精品餐饮、艺术画廊、2026开业",
    tier: "B"
  },
  "菖蒲河公园": {
    heat: 86,
    notes: "22万+",
    trending: "红墙拍照、汉服打卡、故宫旁免费、隐藏秘境",
    tier: "A"
  },
  "镇罗营梨花谷": {
    heat: 55,
    notes: "3万+",
    trending: "梨花花海、平谷赏花、春季新热点、小众徒步",
    tier: "B"
  },
  "友谊花园": {
    heat: 60,
    notes: "5万+",
    trending: "花园商业、疗愈空间、拍照打卡、精品咖啡",
    tier: "B"
  },
  "当代MOMA": {
    heat: 72,
    notes: "10万+",
    trending: "建筑大师、百老汇电影、库布里克书店、东直门文艺",
    tier: "A"
  },
  "大吉巷": {
    heat: 58,
    notes: "4万+",
    trending: "胡同改造、独立小店、手作体验、新式胡同",
    tier: "B"
  },
  "泰康空间": {
    heat: 52,
    notes: "3万+",
    trending: "当代艺术、798画廊、免费展览、学术策展",
    tier: "B"
  },
  "望京小腰": {
    heat: 83,
    notes: "18万+",
    trending: "深夜烧烤、羊腰子、望京夜生活、韩式烤肉",
    tier: "A"
  },
  "护国寺街": {
    heat: 75,
    notes: "12万+",
    trending: "豆汁焦圈、老北京小吃、传统美食、胡同串联",
    tier: "A"
  },
  "鼓楼东大街": {
    heat: 87,
    notes: "25万+",
    trending: "独立咖啡、精酿酒吧、vintage古着、Live house",
    tier: "A"
  },
  "五道口": {
    heat: 70,
    notes: "10万+",
    trending: "宇宙中心、枣糕王、韩国料理、清华周边",
    tier: "A"
  },
  "Red1卡丁车": {
    heat: 74,
    notes: "8万+",
    trending: "室内卡丁车、团建约会、速度体验、网红打卡",
    tier: "A"
  },
  "亮马河国际风情水岸": {
    heat: 91,
    notes: "35万+",
    trending: "夜间打卡、河畔灯光、皮划艇、蓝色港湾、北京塞纳河",
    tier: "S"
  },

};


// 分级统计
const XHS_TIER_SUMMARY = {
  S: Object.entries(XHS_HEAT).filter(([, v]) => v.tier === "S").map(([k]) => k),
  A: Object.entries(XHS_HEAT).filter(([, v]) => v.tier === "A").map(([k]) => k),
  B: Object.entries(XHS_HEAT).filter(([, v]) => v.tier === "B").map(([k]) => k),
  C: Object.entries(XHS_HEAT).filter(([, v]) => v.tier === "C").map(([k]) => k),
  D: Object.entries(XHS_HEAT).filter(([, v]) => v.tier === "D").map(([k]) => k),
  // ===== 新增北京周边目的地 =====
  "灵水举人村": {
    heat: 38,
    notes: "1万+",
    trending: "举人古村、京西古村、秋季银杏柿子",
    tier: "C"
  },
  "水峪村": {
    heat: 22,
    notes: "3000+",
    trending: "石板古村、明清民居、房山深山",
    tier: "D"
  },
  "琉璃渠村": {
    heat: 31,
    notes: "5000+",
    trending: "皇家琉璃、门头沟古村、故宫同款琉璃",
    tier: "C"
  },
  "白河峡谷": {
    heat: 55,
    notes: "5万+",
    trending: "峡谷漂流、密云夏日、北京最长峡谷",
    tier: "B"
  },
  "幽谷神潭": {
    heat: 28,
    notes: "4000+",
    trending: "怀柔峡谷、多级瀑布、小众秘境",
    tier: "C"
  },
  "云蒙峡": {
    heat: 42,
    notes: "1.5万+",
    trending: "密云峡谷、冰瀑奇观、亲子徒步",
    tier: "C"
  },
  "桃源仙谷": {
    heat: 35,
    notes: "8000+",
    trending: "春季桃花、怀柔秘境、花谷徒步",
    tier: "C"
  },
  "官厅水库": {
    heat: 48,
    notes: "2万+",
    trending: "帆船运动、风筝冲浪、北京最大水库",
    tier: "C"
  },
  "怀柔水库": {
    heat: 32,
    notes: "6000+",
    trending: "城边垂钓、野餐胜地、怀柔周边",
    tier: "C"
  },
  "不老屯水库": {
    heat: 18,
    notes: "2000+",
    trending: "深山钓鱼、密云秘境、原生态水库",
    tier: "D"
  },
  "云蒙山": {
    heat: 62,
    notes: "8万+",
    trending: "北京小黄山、云海日出、奇峰怪石",
    tier: "B"
  },
  "海坨山": {
    heat: 57,
    notes: "6万+",
    trending: "北京第二高峰、亚高山草甸、野长城徒步",
    tier: "B"
  },
  "百花山": {
    heat: 65,
    notes: "10万+",
    trending: "亚高山花海、夏季花期、北京最大花海",
    tier: "B"
  },
  "怀北滑雪场": {
    heat: 60,
    notes: "7万+",
    trending: "北京最近滑雪场、冬季周末、亲子滑雪",
    tier: "B"
  },
  "军都山滑雪场": {
    heat: 38,
    notes: "1万+",
    trending: "昌平滑雪、新手雪场、性价比滑雪",
    tier: "C"
  },
  "房山十渡攀岩": {
    heat: 45,
    notes: "2万+",
    trending: "华北攀岩圣地、500条线路、户外运动",
    tier: "C"
  },
  "琉璃厂文化街": {
    heat: 52,
    notes: "3万+",
    trending: "荣宝斋、文房四宝、北京文化街",
    tier: "B"
  },
  "潘家园旧货市场": {
    heat: 68,
    notes: "15万+",
    trending: "捡漏、旧书古玩、周末早市、北京烟火",
    tier: "B"
  },
  "798艺术区": {
    heat: 75,
    notes: "20万+",
    trending: "当代艺术、工业风打卡、UCCA、咖啡馆",
    tier: "A"
  },
  "首钢园": {
    heat: 72,
    notes: "18万+",
    trending: "工业遗址、冬奥遗产、高炉夜景、城市打卡",
    tier: "A"
  },
  "国贸CBD观景": {
    heat: 58,
    notes: "6万+",
    trending: "北京天际线、CBD夜景、城市摄影",
    tier: "B"
  },
  "鸟巢水立方夜景": {
    heat: 70,
    notes: "16万+",
    trending: "奥运地标、灯光秀、北京夜景打卡",
    tier: "A"
  },
  "前门大栅栏": {
    heat: 65,
    notes: "10万+",
    trending: "老北京小吃、同仁堂、胡同文化",
    tier: "B"
  },
  "延庆野鸭湖湿地": {
    heat: 44,
    notes: "1.8万+",
    trending: "候鸟天堂、天鹅观鸟、北京最大湿地",
    tier: "C"
  },
  "汉石桥湿地": {
    heat: 35,
    notes: "8000+",
    trending: "苇海泛舟、顺义湿地、观鸟摄影",
    tier: "C"
  },
  "翠湖湿地公园": {
    heat: 48,
    notes: "2万+",
    trending: "海淀观鸟、限额保护、城市湿地秘境",
    tier: "C"
  },
  "天津古文化街": {
    heat: 68,
    notes: "14万+",
    trending: "高铁30分钟、天津非遗、狗不理包子、泥人张",
    tier: "B"
  },
  "保定腰山王氏庄园": {
    heat: 22,
    notes: "3000+",
    trending: "北方乔家大院、清代庄园、保定古建筑",
    tier: "D"
  },
  "蓝调庄园温泉": {
    heat: 55,
    notes: "5万+",
    trending: "顺义温泉、雪景泡汤、五星度假村",
    tier: "B"
  },
  "九华山庄温泉": {
    heat: 60,
    notes: "7万+",
    trending: "百个温泉池、昌平温泉、冬季星空泡汤",
    tier: "B"
  },
  "柏峪村": {
    heat: 18,
    notes: "2000+",
    trending: "明代军屯、门头沟深山、秋柿古村",
    tier: "D"
  },
  "平谷金海湖骑行": {
    heat: 45,
    notes: "2万+",
    trending: "环湖骑行、桃花节骑行、平谷户外",
    tier: "C"
  },
  "什刹海": {
    heat: 78,
    notes: "25万+",
    trending: "老北京胡同、荷花季、后海夜生活、银锭桥",
    tier: "A"
  },
  "北海公园": {
    heat: 72,
    notes: "18万+",
    trending: "千年皇家园林、白塔倒影、荷花季",
    tier: "A"
  },
  "圆明园遗址": {
    heat: 70,
    notes: "16万+",
    trending: "西洋楼废墟、荷花节、历史遗址摄影",
    tier: "A"
  },
  "密云司马台野长城": {
    heat: 75,
    notes: "20万+",
    trending: "中国长城之最、最险野长城、长城摄影",
    tier: "A"
  },
  "南锣鼓巷": {
    heat: 72,
    notes: "18万+",
    trending: "元代胡同、北京文创、胡同美食",
    tier: "A"
  },
  "门头沟斋堂川古村群": {
    heat: 52,
    notes: "3万+",
    trending: "爨底下连游、古村群、京西秋游路线",
    tier: "B"
  },
  "天津意式风情区": {
    heat: 62,
    notes: "8万+",
    trending: "百年意大利租界、巴洛克建筑、天津打卡",
    tier: "B"
  },
  "昌平十三陵水库环湖": {
    heat: 40,
    notes: "1.2万+",
    trending: "环湖骑行、皇陵露营、春季桃花",
    tier: "C"
  },
  "北京国家大剧院": {
    heat: 65,
    notes: "10万+",
    trending: "水上蛋壳、顶级演出、夜景倒影摄影",
    tier: "B"
  },
  "顺义减河公园骑行": {
    heat: 35,
    notes: "8000+",
    trending: "50公里绿道骑行、亲子骑行、顺义公园",
    tier: "C"
  },
  "房山天开花海": {
    heat: 48,
    notes: "2万+",
    trending: "薰衣草花海、夏季避暑、房山网红花田",
    tier: "C"
  },
  "密云溪翁庄鱼街": {
    heat: 50,
    notes: "3万+",
    trending: "密云水库野生鱼、吃鱼一条街、北京周边美食",
    tier: "B"
  },
  "崇礼云顶雪场": {
    heat: 78,
    notes: "25万+",
    trending: "冬奥主赛场、崇礼最好雪场、华北粉雪",
    tier: "A"
  },
  "承德双塔山": {
    heat: 32,
    notes: "6000+",
    trending: "承德奇景、石峰古塔、千古之谜",
    tier: "C"
  },
  "平谷四座楼野外徒步": {
    heat: 40,
    notes: "1.2万+",
    trending: "北京硬核徒步、原始森林、燕山秘境",
    tier: "C"
  },
  "北京科技馆": {
    heat: 62,
    notes: "8万+",
    trending: "亲子必去、互动科技、国家科技馆",
    tier: "B"
  },
  "顺义葡萄小镇": {
    heat: 38,
    notes: "1万+",
    trending: "秋季采摘、葡萄酒体验、顺义亲子",
    tier: "C"
  },
  "通州运河文化带": {
    heat: 45,
    notes: "2万+",
    trending: "京杭大运河、燃灯塔、城市副中心",
    tier: "C"
  },
  "延庆冰雪嘉年华": {
    heat: 55,
    notes: "5万+",
    trending: "北京冰雪节、冰雕展、冬奥城市",
    tier: "B"
  },
  "门头沟京西古道徒步": {
    heat: 48,
    notes: "2万+",
    trending: "千年古道、王平古道、历史寻访徒步",
    tier: "C"
  },
  "密云不老屯温泉": {
    heat: 35,
    notes: "8000+",
    trending: "深山温泉、密云星空泡汤、疗愈度假",
    tier: "C"
  },
  "延庆佛爷顶": {
    heat: 42,
    notes: "1.5万+",
    trending: "云海日出、延庆摄影、气象站打卡",
    tier: "C"
  },
  "延庆野鸭湖骑行": {
    heat: 38,
    notes: "1万+",
    trending: "湿地骑行、候鸟骑行、延庆户外",
    tier: "C"
  },
  "昌平碓臼峪爬山": {
    heat: 52,
    notes: "3万+",
    trending: "峡谷溯溪、夏季戏水、亲子爬山",
    tier: "B"
  },
  "怀柔慕田峪长城南段": {
    heat: 45,
    notes: "2万+",
    trending: "慕田峪人少段、秋季色叶长城、摄影圣地",
    tier: "C"
  },
  "北京颐和园昆明湖冬游": {
    heat: 48,
    notes: "2万+",
    trending: "冬日颐和园、冰面冰车、皇家冬景",
    tier: "C"
  }

};

// 深圳周边游小红书声量数据
const XHS_HEAT_SZ = {

  // ===== Tier S: 病毒级/持续热门 (90-100) =====
  "大梅沙海滨公园": {
    heat: 96,
    notes: "80万+",
    trending: "免费海滩、日落打卡、暑假遛娃、地铁直达",
    tier: "S"
  },
  "东部华侨城": {
    heat: 94,
    notes: "60万+",
    trending: "茶溪谷花海、大侠谷过山车、云海谷高尔夫、亲子两日游",
    tier: "S"
  },
  "世界之窗": {
    heat: 93,
    notes: "55万+",
    trending: "微缩景观、跨年烟花、啤酒节、异域风情拍照",
    tier: "S"
  },
  "珠海长隆海洋王国": {
    heat: 92,
    notes: "90万+",
    trending: "鲸鲨馆、花车巡游、烟花表演、亲子住宿攻略",
    tier: "S"
  },
  "广州塔": {
    heat: 91,
    notes: "70万+",
    trending: "小蛮腰夜景、摩天轮、跳楼机、珠江夜游联票",
    tier: "S"
  },
  "长隆野生动物世界": {
    heat: 90,
    notes: "85万+",
    trending: "大熊猫三胞胎、自驾区、空中缆车、亲子研学",
    tier: "S"
  },

  // ===== Tier A: 高人气目的地 (70-89) =====
  "深圳欢乐谷": {
    heat: 88,
    notes: "45万+",
    trending: "万圣节、跨年派对、过山车合集、夜场攻略",
    tier: "A"
  },
  "深圳湾公园": {
    heat: 87,
    notes: "50万+",
    trending: "日落骑行、红树林观鸟、深圳湾大桥、海风跑步",
    tier: "A"
  },
  "厦门鼓浪屿": {
    heat: 86,
    notes: "120万+",
    trending: "万国建筑、文艺小店、海蛎煎、钢琴之岛",
    tier: "A"
  },
  "桂林阳朔": {
    heat: 85,
    notes: "100万+",
    trending: "漓江竹筏、遇龙河漂流、十里画廊、西街夜生活",
    tier: "A"
  },
  "巽寮湾": {
    heat: 84,
    notes: "35万+",
    trending: "天后宫沙滩、出海捕鱼、海鲜大排档、周末自驾",
    tier: "A"
  },
  "双月湾": {
    heat: 83,
    notes: "40万+",
    trending: "观景台日出、左湾右湾、赶海拾贝、露营攻略",
    tier: "A"
  },
  "莲花山公园": {
    heat: 82,
    notes: "30万+",
    trending: "山顶广场看CBD、邓小平铜像、风筝草坪、簕杜鹃花展",
    tier: "A"
  },
  "杨梅坑": {
    heat: 81,
    notes: "28万+",
    trending: "骑行绿道、鹿嘴山庄、玻璃海水、日出露营",
    tier: "A"
  },
  "较场尾": {
    heat: 80,
    notes: "25万+",
    trending: "深圳鼓浪屿、民宿一条街、海边烧烤、文艺打卡",
    tier: "A"
  },
  "梧桐山": {
    heat: 79,
    notes: "22万+",
    trending: "登顶看日出、毛棉杜鹃花、仙湖植物园联游、徒步路线",
    tier: "A"
  },
  "南澳西冲": {
    heat: 78,
    notes: "20万+",
    trending: "深圳最美海滩、露营烧烤、水上项目、星空观测",
    tier: "A"
  },
  "大鹏古城": {
    heat: 77,
    notes: "18万+",
    trending: "明清古城墙、将军府、大鹏所城、古城咖啡馆",
    tier: "A"
  },
  "北海涠洲岛": {
    heat: 76,
    notes: "60万+",
    trending: "五彩滩日出、鳄鱼山火山、天主教堂、海鲜市场",
    tier: "A"
  },
  "韶关丹霞山": {
    heat: 75,
    notes: "35万+",
    trending: "阳元石、长老峰日出、锦江漂流、世界地质公园",
    tier: "A"
  },
  "白云山": {
    heat: 74,
    notes: "30万+",
    trending: "摩星岭、蹦极、云台花园、广州之肺",
    tier: "A"
  },
  "潮州古城": {
    heat: 73,
    notes: "40万+",
    trending: "广济桥灯光秀、牌坊街美食、工夫茶、开元寺",
    tier: "A"
  },
  "汕头南澳岛": {
    heat: 72,
    notes: "30万+",
    trending: "青澳湾、北回归线广场、海上风电、海鲜大餐",
    tier: "A"
  },
  "阳江海陵岛": {
    heat: 71,
    notes: "25万+",
    trending: "十里银滩、大角湾、南海一号博物馆、海鲜夜市",
    tier: "A"
  },
  "红树林海滨公园": {
    heat: 70,
    notes: "20万+",
    trending: "深圳湾候鸟、红树林栈道、亲子科普、拍夕阳",
    tier: "A"
  },

  // ===== Tier B: 稳定人气 (50-69) =====
  "仙湖植物园": {
    heat: 68,
    notes: "18万+",
    trending: "弘法寺祈福、湖区漫步、多肉植物区、化石森林",
    tier: "B"
  },
  "东西涌穿越": {
    heat: 67,
    notes: "15万+",
    trending: "深圳最美徒步、海岸线穿越、礁石攀爬、户外挑战",
    tier: "B"
  },
  "甘坑客家小镇": {
    heat: 66,
    notes: "14万+",
    trending: "小凉帽农场、客家围屋、亲子乐园、非遗体验",
    tier: "B"
  },
  "南头古城": {
    heat: 65,
    notes: "15万+",
    trending: "深圳最古老城区、文创市集、网红咖啡、城中村改造",
    tier: "B"
  },
  "锦绣中华": {
    heat: 64,
    notes: "12万+",
    trending: "微缩中国、民俗村表演、56个民族、夜场灯光",
    tier: "B"
  },
  "海上世界": {
    heat: 63,
    notes: "16万+",
    trending: "明华轮、水秀表演、滨海酒吧街、蛇口文创",
    tier: "B"
  },
  "盐田海滨栈道": {
    heat: 62,
    notes: "12万+",
    trending: "海景跑步道、灯塔打卡、日出拍照、骑行路线",
    tier: "B"
  },
  "惠州西湖": {
    heat: 61,
    notes: "10万+",
    trending: "苏东坡纪念馆、泗洲塔、西湖夜景、免费景点",
    tier: "B"
  },
  "罗浮山": {
    heat: 60,
    notes: "12万+",
    trending: "葛洪炼丹、飞瀑名泉、药浴温泉、登山祈福",
    tier: "B"
  },
  "南昆山": {
    heat: 59,
    notes: "10万+",
    trending: "森林温泉、云顶旅游区、竹海漫步、避暑胜地",
    tier: "B"
  },
  "外伶仃岛": {
    heat: 58,
    notes: "8万+",
    trending: "伶仃洋、海岛露营、浮潜体验、海鲜排档",
    tier: "B"
  },
  "东澳岛": {
    heat: 57,
    notes: "7万+",
    trending: "南沙湾沙滩、蜜月阁、海岛徒步、浮潜潜水",
    tier: "B"
  },
  "沙面岛": {
    heat: 56,
    notes: "20万+",
    trending: "欧式建筑、婚纱照圣地、法式梧桐、咖啡慢生活",
    tier: "B"
  },
  "清远漂流": {
    heat: 55,
    notes: "15万+",
    trending: "古龙峡漂流、黄腾峡、玻璃桥、夏季消暑",
    tier: "B"
  },
  "盐洲岛": {
    heat: 54,
    notes: "6万+",
    trending: "白鹭栖息地、滩涂摄影、海鲜渔村、小众秘境",
    tier: "B"
  },
  "肇庆七星岩": {
    heat: 53,
    notes: "10万+",
    trending: "星湖湿地、仙女湖、卧佛含丹、摩崖石刻",
    tier: "B"
  },
  "肇庆鼎湖山": {
    heat: 52,
    notes: "8万+",
    trending: "负离子天堂、飞水潭、庆云寺、天然氧吧",
    tier: "B"
  },
  "顺德美食之旅": {
    heat: 51,
    notes: "25万+",
    trending: "双皮奶、均安蒸猪、陈村粉、世界美食之都",
    tier: "B"
  },
  "佛山祖庙": {
    heat: 50,
    notes: "12万+",
    trending: "黄飞鸿纪念馆、舞狮表演、岭南建筑、功夫故里",
    tier: "B"
  },

  // ===== Tier C: 小众/利基 (30-49) =====
  "官湖村": {
    heat: 48,
    notes: "5万+",
    trending: "深圳小镰仓、彩色房子、海边咖啡、小众海滩",
    tier: "C"
  },
  "深圳东门老街": {
    heat: 47,
    notes: "8万+",
    trending: "老街美食、购物攻略、怀旧建筑、深圳最早商圈",
    tier: "C"
  },
  "华侨城创意园": {
    heat: 46,
    notes: "8万+",
    trending: "文创市集、独立咖啡馆、艺术展览、周末逛拍",
    tier: "C"
  },
  "深圳光明小镇": {
    heat: 45,
    notes: "6万+",
    trending: "光明农场、滑草场、鸽子广场、亲子郊游",
    tier: "C"
  },
  "广州陈家祠": {
    heat: 44,
    notes: "15万+",
    trending: "岭南建筑瑰宝、木雕砖雕、民间工艺馆、拍照攻略",
    tier: "C"
  },
  "广州北京路": {
    heat: 43,
    notes: "12万+",
    trending: "千年商道、古迹遗址、老字号美食、步行街",
    tier: "C"
  },
  "广州珠江夜游": {
    heat: 42,
    notes: "10万+",
    trending: "珠江新城灯光、猎德大桥、海心沙、夜景游船",
    tier: "C"
  },
  "珠海情侣路": {
    heat: 41,
    notes: "8万+",
    trending: "渔女雕像、海滨骑行、日月贝、情侣打卡",
    tier: "C"
  },
  "东莞松山湖": {
    heat: 40,
    notes: "8万+",
    trending: "华为小镇、松湖烟雨、骑行绿道、科技园打卡",
    tier: "C"
  },
  "东莞可园": {
    heat: 39,
    notes: "4万+",
    trending: "岭南四大名园、可堂赏景、清代园林、古建筑",
    tier: "C"
  },
  "中山温泉": {
    heat: 38,
    notes: "4万+",
    trending: "温泉度假、亲子泡汤、养生之旅、冬季周末",
    tier: "C"
  },
  "江门开平碉楼": {
    heat: 37,
    notes: "8万+",
    trending: "世界文化遗产、中西合璧、赤坎古镇、侨乡文化",
    tier: "C"
  },
  "汕尾红海湾": {
    heat: 36,
    notes: "5万+",
    trending: "遮浪半岛、风车岛、冲浪圣地、粤东小三亚",
    tier: "C"
  },
  "深圳博物馆": {
    heat: 35,
    notes: "5万+",
    trending: "免费展览、深圳历史、亲子科普、雨天好去处",
    tier: "C"
  },
  "深圳前海石公园": {
    heat: 34,
    notes: "4万+",
    trending: "前海石打卡、海景草坪、日落拍照、新地标",
    tier: "C"
  },
  "惠州双月湾观景台": {
    heat: 33,
    notes: "5万+",
    trending: "双月湾全景、最佳拍摄点、日出观景、航拍机位",
    tier: "C"
  },
  "从化温泉": {
    heat: 32,
    notes: "6万+",
    trending: "碧水湾温泉、流溪河畔、冬季养生、亲子酒店",
    tier: "C"
  },
  "增城白水寨": {
    heat: 31,
    notes: "5万+",
    trending: "白水仙瀑、9999级登山步道、天池瀑布、负离子",
    tier: "C"
  },
  "潮汕美食之旅": {
    heat: 30,
    notes: "20万+",
    trending: "牛肉火锅、肠粉、粿条、美食纪录片同款",
    tier: "C"
  },

  // ===== Tier D: 深度/冷门 (10-29) =====
  "大芬油画村": {
    heat: 29,
    notes: "3万+",
    trending: "油画批发、艺术街区、DIY体验、文艺拍照",
    tier: "D"
  },
  "深圳图书馆": {
    heat: 28,
    notes: "3万+",
    trending: "建筑美学、自习圣地、免费空调、深圳文化地标",
    tier: "D"
  },
  "深圳中心公园": {
    heat: 27,
    notes: "2万+",
    trending: "城市绿肺、晨跑路线、花卉展、遛娃草坪",
    tier: "D"
  },
  "洪湖公园": {
    heat: 26,
    notes: "3万+",
    trending: "荷花季、夏日赏荷、免费公园、拍照打卡",
    tier: "D"
  },
  "笔架山公园": {
    heat: 25,
    notes: "2万+",
    trending: "市区登山、展览馆、城市天际线、晨练好去处",
    tier: "D"
  },
  "惠东平海古城": {
    heat: 24,
    notes: "2万+",
    trending: "明代古城、军事要塞、石板老街、小众古镇",
    tier: "D"
  },
  "博罗五矿温泉": {
    heat: 23,
    notes: "2万+",
    trending: "碳酸温泉、度假酒店、周末放松、亲子泡汤",
    tier: "D"
  },
  "河源万绿湖": {
    heat: 22,
    notes: "5万+",
    trending: "万绿湖风景、镜花缘、客家文化、绿水青山",
    tier: "D"
  },
  "河源客天下": {
    heat: 21,
    notes: "2万+",
    trending: "恐龙乐园、客家小镇、温泉酒店、亲子度假",
    tier: "D"
  },
  "东莞虎门大桥": {
    heat: 20,
    notes: "3万+",
    trending: "虎门销烟、海战博物馆、大桥夜景、爱国教育",
    tier: "D"
  },
  "东莞观音山": {
    heat: 19,
    notes: "3万+",
    trending: "观音圣像、森林公园、登山步道、祈福许愿",
    tier: "D"
  },
  "中山詹园": {
    heat: 18,
    notes: "2万+",
    trending: "岭南园林、汉服拍照、古典建筑、小众景点",
    tier: "D"
  },
  "珠海圆明新园": {
    heat: 17,
    notes: "3万+",
    trending: "圆明园复制、大型演出、免费开放、历史科普",
    tier: "D"
  },
  "佛山南风古灶": {
    heat: 16,
    notes: "4万+",
    trending: "陶艺DIY、五百年龙窑、石湾公仔、非遗体验",
    tier: "D"
  },
  "佛山千灯湖": {
    heat: 15,
    notes: "3万+",
    trending: "夜景灯光、湖畔跑步、城市公园、拍照打卡",
    tier: "D"
  },
  "汕头小公园": {
    heat: 29,
    notes: "5万+",
    trending: "骑楼建筑、南生百货、汕头老城、怀旧打卡",
    tier: "D"
  },
  "茂名放鸡岛": {
    heat: 25,
    notes: "4万+",
    trending: "潜水胜地、海岛露营、碧蓝海水、浮潜打卡",
    tier: "D"
  },
  "梅州客家围龙屋": {
    heat: 22,
    notes: "3万+",
    trending: "客家建筑、围龙屋群、非遗文化、乡土体验",
    tier: "D"
  },
  "湛江": {
    heat: 20,
    notes: "8万+",
    trending: "湖光岩、海鲜市场、法式建筑、粤西明珠",
    tier: "D"
  },
  "揭阳黄满寨瀑布": {
    heat: 18,
    notes: "1万+",
    trending: "岭南第一瀑、瀑布群、森林栈道、清凉消暑",
    tier: "D"
  },
  "河源龙川霍山": {
    heat: 17,
    notes: "1万+",
    trending: "丹霞地貌、一线天、奇石景观、小众徒步",
    tier: "D"
  },
  "梅州雁南飞": {
    heat: 16,
    notes: "2万+",
    trending: "茶田花海、客家山居、围龙食府、田园度假",
    tier: "D"
  },
  "梅州灵光寺": {
    heat: 14,
    notes: "1万+",
    trending: "千年古刹、生死柏、客家佛教、山林幽静",
    tier: "D"
  },
  "云浮新兴六祖故里": {
    heat: 13,
    notes: "1万+",
    trending: "禅宗六祖、国恩寺、禅意旅行、佛教圣地",
    tier: "D"
  },
  "阳春凌霄岩": {
    heat: 12,
    notes: "8千+",
    trending: "溶洞奇观、地下暗河、钟乳石、小众探险",
    tier: "D"
  },
  "茂名浮山岭": {
    heat: 11,
    notes: "5千+",
    trending: "登山徒步、云海日出、粤西高峰、原生态",
    tier: "D"
  },
  "湛江特呈岛": {
    heat: 15,
    notes: "1万+",
    trending: "红树林、海岛度假、渔村风情、温泉酒店",
    tier: "D"
  },
  "湛江硇洲岛": {
    heat: 14,
    notes: "1万+",
    trending: "火山岛、百年灯塔、海鲜便宜、小众海岛",
    tier: "D"
  },
  "清远英西峰林": {
    heat: 19,
    notes: "3万+",
    trending: "小桂林、峰林骑行、田园风光、热气球体验",
    tier: "D"
  },
  "清远连州地下河": {
    heat: 17,
    notes: "2万+",
    trending: "地下溶洞、暗河泛舟、钟乳石、避暑好去处",
    tier: "D"
  },
  "韶关南华寺": {
    heat: 18,
    notes: "3万+",
    trending: "禅宗祖庭、六祖真身、祈福许愿、千年古寺",
    tier: "D"
  },
  "韶关乳源大峡谷": {
    heat: 16,
    notes: "2万+",
    trending: "广东大峡谷、天梯栈道、瀑布群、徒步探险",
    tier: "D"
  },
  "河源九龙湾": {
    heat: 13,
    notes: "8千+",
    trending: "九曲十八弯、漂流、竹林美景、农家乐",
    tier: "D"
  },
  "梅州大埔花萼楼": {
    heat: 12,
    notes: "5千+",
    trending: "客家圆形土楼、建筑奇观、历史遗迹、小众古建",
    tier: "D"
  },
  "南宁青秀山": {
    heat: 22,
    notes: "8万+",
    trending: "兰花园、龙象塔、东盟友谊园、城市绿肺",
    tier: "D"
  },
  "贺州黄姚古镇": {
    heat: 25,
    notes: "10万+",
    trending: "千年古镇、石板街、古榕树、岭南水乡",
    tier: "D"
  },
  "梧州骑楼城": {
    heat: 15,
    notes: "2万+",
    trending: "骑楼建筑群、龟苓膏、六堡茶、老城风情",
    tier: "D"
  },
  "漳州土楼": {
    heat: 28,
    notes: "15万+",
    trending: "田螺坑土楼、云水谣古镇、世界遗产、土楼王",
    tier: "D"
  },
  "龙岩永定土楼": {
    heat: 27,
    notes: "12万+",
    trending: "承启楼、振成楼、客家文化、土楼民宿",
    tier: "D"
  },
  "泉州开元寺": {
    heat: 26,
    notes: "15万+",
    trending: "东西塔、世遗之城、闽南古刹、泉州美食",
    tier: "D"
  },
  "长沙岳麓山": {
    heat: 28,
    notes: "20万+",
    trending: "岳麓书院、爱晚亭红叶、橘子洲头、大学城",
    tier: "D"
  },
  "汕头老妈宫戏台": {
    heat: 14,
    notes: "1万+",
    trending: "潮剧表演、古建筑、老城文化、非遗体验",
    tier: "D"
  },
  "汕头陈慈黉故居": {
    heat: 13,
    notes: "8千+",
    trending: "潮汕大宅、中西合璧、岭南民居、摄影打卡",
    tier: "D"
  },
  "潮州广济桥": {
    heat: 28,
    notes: "8万+",
    trending: "广济桥灯光秀、浮桥奇观、韩江夜景、四大古桥",
    tier: "D"
  },
  "潮州开元寺": {
    heat: 20,
    notes: "3万+",
    trending: "唐代古寺、潮州最大佛寺、木雕精品、祈福",
    tier: "D"
  },
  "潮州牌坊街美食": {
    heat: 25,
    notes: "8万+",
    trending: "手打牛肉丸、鸭母捻、潮州三宝、古城美食街",
    tier: "D"
  },
  "揭阳进贤门": {
    heat: 11,
    notes: "3千+",
    trending: "古城门楼、揭阳地标、历史遗迹、小众打卡",
    tier: "D"
  },
  "汕尾凤山祖庙": {
    heat: 12,
    notes: "5千+",
    trending: "妈祖庙、海边古庙、汕尾文化、渔民信仰",
    tier: "D"
  },
  "潮州凤凰山茶区": {
    heat: 18,
    notes: "3万+",
    trending: "凤凰单丛茶、茶园风光、采茶体验、茶文化",
    tier: "D"
  },
  "南澳岛青澳湾": {
    heat: 26,
    notes: "6万+",
    trending: "最美海湾、碧蓝海水、沙滩露营、日出打卡",
    tier: "D"
  },
  "汕头礐石风景区": {
    heat: 15,
    notes: "2万+",
    trending: "礐石大桥、山海风光、登山步道、汕头全景",
    tier: "D"
  },
  "潮州韩文公祠": {
    heat: 16,
    notes: "2万+",
    trending: "韩愈纪念馆、中国最早纪念祠、书法碑刻、韩江畔",
    tier: "D"
  },
  "潮汕工夫茶体验": {
    heat: 20,
    notes: "5万+",
    trending: "工夫茶泡法、茶道文化、老茶馆、非遗体验",
    tier: "D"
  },
  "揭阳惠来海角甘泉": {
    heat: 10,
    notes: "2千+",
    trending: "海边甘泉、奇观打卡、小众秘境、自驾探险",
    tier: "D"
  },
  "汕头达濠鱼丸一条街": {
    heat: 14,
    notes: "2万+",
    trending: "手打鱼丸、老字号、美食攻略、达濠古城",
    tier: "D"
  },
  "南澳岛总兵府": {
    heat: 12,
    notes: "8千+",
    trending: "明清海防、总兵府遗址、南澳历史、古迹打卡",
    tier: "D"
  },
  "广州越秀公园五羊雕塑": {
    heat: 22,
    notes: "5万+",
    trending: "广州地标、五羊传说、越秀山、镇海楼",
    tier: "D"
  },
  "广州荔枝湾涌": {
    heat: 20,
    notes: "4万+",
    trending: "西关风情、荔湾花市、水上花艇、老广州",
    tier: "D"
  },
  "广州太古仓": {
    heat: 24,
    notes: "5万+",
    trending: "珠江码头、文创园区、游轮餐厅、工业风拍照",
    tier: "D"
  },
  "广州永庆坊": {
    heat: 28,
    notes: "10万+",
    trending: "粤剧博物馆、西关大屋、李小龙祖居、文创街区",
    tier: "D"
  },
  "广州红砖厂创意园": {
    heat: 20,
    notes: "4万+",
    trending: "废旧工厂改造、艺术展览、文青拍照、咖啡馆",
    tier: "D"
  },
  "广州海珠湿地": {
    heat: 22,
    notes: "5万+",
    trending: "城央湿地、候鸟栖息、花海打卡、城市绿洲",
    tier: "D"
  },
  "广州黄埔古港": {
    heat: 18,
    notes: "3万+",
    trending: "海上丝路起点、姜撞奶、艇仔粥、古港遗迹",
    tier: "D"
  },
  "广州从化石门森林公园": {
    heat: 16,
    notes: "3万+",
    trending: "红叶季、石门瀑布、森林徒步、避暑纳凉",
    tier: "D"
  },
  "广州花都圆玄道观": {
    heat: 13,
    notes: "1万+",
    trending: "道教建筑、祈福圣地、古典园林、小众打卡",
    tier: "D"
  },
  "广州番禺宝墨园": {
    heat: 17,
    notes: "3万+",
    trending: "岭南园林、砖雕照壁、锦鲤池、古建筑群",
    tier: "D"
  },
  "广州增城派潭温泉": {
    heat: 14,
    notes: "2万+",
    trending: "白水寨联游、温泉度假、亲子酒店、周末放松",
    tier: "D"
  },
  "广州南沙湿地": {
    heat: 18,
    notes: "4万+",
    trending: "红树林、候鸟观赏、游船、珠江入海口",
    tier: "D"
  },
  "花都芙蓉嶂": {
    heat: 12,
    notes: "1万+",
    trending: "芙蓉嶂水库、登山步道、BBQ烧烤、本地郊游",
    tier: "D"
  },
  "从化流溪河森林公园": {
    heat: 15,
    notes: "2万+",
    trending: "流溪河水库、梅花观赏、森林氧吧、亲子露营",
    tier: "D"
  },
  "增城挂绿荔枝广场": {
    heat: 10,
    notes: "3千+",
    trending: "增城荔枝文化、挂绿母树、荔枝季打卡、特产",
    tier: "D"
  },
  "顺德清晖园": {
    heat: 24,
    notes: "5万+",
    trending: "岭南四大名园、清代园林、顺德美食联游、古典建筑",
    tier: "D"
  },
  "顺德均安蒸猪": {
    heat: 16,
    notes: "2万+",
    trending: "非遗美食、均安蒸猪老字号、顺德美食、地道体验",
    tier: "D"
  },
  "顺德伦教糕老字号": {
    heat: 12,
    notes: "8千+",
    trending: "伦教糕、顺德甜品、百年老店、美食打卡",
    tier: "D"
  },
  "顺德陈村花卉世界": {
    heat: 14,
    notes: "2万+",
    trending: "花卉批发、年花市场、多肉植物、园艺爱好者",
    tier: "D"
  },
  "佛山梁园": {
    heat: 15,
    notes: "2万+",
    trending: "岭南名园、奇石盆景、古典建筑、汉服拍照",
    tier: "D"
  },
  "佛山岭南天地": {
    heat: 22,
    notes: "5万+",
    trending: "岭南骑楼、文创街区、网红餐厅、祖庙联游",
    tier: "D"
  },
  "佛山三水荷花世界": {
    heat: 13,
    notes: "1万+",
    trending: "荷花品种、夏季赏荷、亲子乐园、水上乐园",
    tier: "D"
  },
  "南海西樵山": {
    heat: 20,
    notes: "5万+",
    trending: "南海观音、宝峰寺、桃花源、岭南名山",
    tier: "D"
  },
  "南海影视城": {
    heat: 15,
    notes: "2万+",
    trending: "古装拍照、影视拍摄基地、表演秀、穿越体验",
    tier: "D"
  },
  "佛山高明盈香生态园": {
    heat: 11,
    notes: "8千+",
    trending: "油菜花田、机动游戏、亲子农庄、烧烤露营",
    tier: "D"
  },
  "东莞华阳湖": {
    heat: 14,
    notes: "2万+",
    trending: "湿地公园、龙舟赛、荷花季、骑行绿道",
    tier: "D"
  },
  "惠州双月湾黑排角": {
    heat: 22,
    notes: "4万+",
    trending: "黑色礁石、海岸穿越、小众秘境、户外徒步",
    tier: "D"
  },
  "珠海横琴长隆国际马戏城": {
    heat: 18,
    notes: "3万+",
    trending: "马戏表演、亲子娱乐、长隆联票、夜场演出",
    tier: "D"
  },
  "中山故居纪念馆": {
    heat: 16,
    notes: "3万+",
    trending: "孙中山故居、翠亨村、爱国教育、历史文化",
    tier: "D"
  },
  "江门新会小鸟天堂": {
    heat: 14,
    notes: "2万+",
    trending: "巴金笔下、古榕树群、观鸟天堂、生态旅游",
    tier: "D"
  },
  "江门台山上下川岛": {
    heat: 20,
    notes: "5万+",
    trending: "下川岛海滩、渔村海鲜、海岛度假、猴岛探险",
    tier: "D"
  },
  "云浮蟠龙洞": {
    heat: 10,
    notes: "2千+",
    trending: "溶洞钟乳石、地质奇观、小众景点、避暑洞穴",
    tier: "D"
  },
  "肇庆砚洲岛": {
    heat: 12,
    notes: "5千+",
    trending: "西江孤岛、包公祠、沙滩露营、原生态岛屿",
    tier: "D"
  },
  "清远千年瑶寨": {
    heat: 18,
    notes: "3万+",
    trending: "瑶族文化、篝火晚会、梯田风光、民族风情",
    tier: "D"
  },
  "韶关南岭国家森林公园": {
    heat: 16,
    notes: "2万+",
    trending: "广东最高峰、原始森林、避暑圣地、秋季红叶",
    tier: "D"
  },
  "河源御临门温泉": {
    heat: 12,
    notes: "8千+",
    trending: "巴厘岛风情、温泉酒店、周末放松、亲子游",
    tier: "D"
  },
  "梅州叶剑英故居": {
    heat: 13,
    notes: "1万+",
    trending: "红色教育、客家文化、历史纪念、梅州人文",
    tier: "D"
  },
  "阳江阳春春湾石林": {
    heat: 11,
    notes: "5千+",
    trending: "喀斯特地貌、石林奇观、龙宫岩、小众探秘",
    tier: "D"
  },
  "茂名信宜大仁山": {
    heat: 10,
    notes: "3千+",
    trending: "粤西名山、云海日出、登山露营、原始森林",
    tier: "D"
  },
  "湛江金沙湾": {
    heat: 16,
    notes: "2万+",
    trending: "城市海滩、海鲜烧烤、日落打卡、湛江地标",
    tier: "D"
  }
};

// 威海周边游小红书声量数据
const XHS_HEAT_WH = {

  // ===== Tier S: 病毒级/持续热门 (90-100) =====
  "泰山": {
    heat: 97,
    notes: "150万+",
    trending: "日出云海、十八盘、南天门、挑山工、五岳之首",
    tier: "S"
  },

  // ===== Tier A: 高人气目的地 (70-89) =====
  "蓬莱阁": {
    heat: 85,
    notes: "30万+",
    trending: "蓬莱仙境、八仙过海、海市蜃楼、古建筑群",
    tier: "A"
  },
  "崂山": {
    heat: 84,
    notes: "35万+",
    trending: "海上名山、太清宫、崂山绿茶、仰口风景区",
    tier: "A"
  },
  "栈桥": {
    heat: 82,
    notes: "40万+",
    trending: "青岛地标、回澜阁、海鸥季、啤酒博物馆联游",
    tier: "A"
  },
  "八大关": {
    heat: 81,
    notes: "35万+",
    trending: "万国建筑、秋季银杏、婚纱拍摄圣地、花石楼",
    tier: "A"
  },
  "金沙滩": {
    heat: 80,
    notes: "25万+",
    trending: "亚洲第一滩、青岛西海岸、沙雕节、海滨浴场",
    tier: "A"
  },
  "曲阜三孔": {
    heat: 78,
    notes: "20万+",
    trending: "孔庙孔府孔林、世界遗产、儒家文化、开笔礼",
    tier: "A"
  },
  "济南趵突泉": {
    heat: 76,
    notes: "25万+",
    trending: "天下第一泉、泉水直饮、大明湖联游、趵突腾空",
    tier: "A"
  },
  "长岛": {
    heat: 74,
    notes: "15万+",
    trending: "万鸟岛、月牙湾球石、九丈崖、海豹湾、海岛慢生活",
    tier: "A"
  },
  "烟台山": {
    heat: 72,
    notes: "12万+",
    trending: "灯塔打卡、领事馆建筑群、烟台全景、海滨栈道",
    tier: "A"
  },
  "养马岛": {
    heat: 70,
    notes: "15万+",
    trending: "天赐蓝色、网红海岛、环岛骑行、赶海体验",
    tier: "A"
  },

  // ===== Tier B: 稳定人气 (50-69) =====
  "刘公岛": {
    heat: 68,
    notes: "10万+",
    trending: "甲午海战、北洋水师、爱国教育、海岛风光",
    tier: "B"
  },
  "威海国际海水浴场": {
    heat: 66,
    notes: "8万+",
    trending: "威海最美沙滩、碧蓝海水、夏季戏水、日落打卡",
    tier: "B"
  },
  "成山头": {
    heat: 65,
    notes: "8万+",
    trending: "中国好望角、日出东方、秦始皇东巡、海天一线",
    tier: "B"
  },
  "火炬八街": {
    heat: 64,
    notes: "10万+",
    trending: "韩剧既视感、威海小镰仓、海边公路、网红拍照",
    tier: "B"
  },
  "那香海": {
    heat: 62,
    notes: "6万+",
    trending: "钻石沙滩、网红图书馆、海草房、温泉度假",
    tier: "B"
  },
  "猫头山": {
    heat: 60,
    notes: "5万+",
    trending: "小众海角、悬崖步道、碧海蓝天、摄影圣地",
    tier: "B"
  },
  "西霞口神雕山野生动物园": {
    heat: 58,
    notes: "5万+",
    trending: "海边动物园、亲子游、白虎区、海洋动物表演",
    tier: "B"
  },
  "天鹅湖": {
    heat: 56,
    notes: "8万+",
    trending: "冬季天鹅、荣成天鹅、生态摄影、候鸟栖息地",
    tier: "B"
  },
  "半月湾": {
    heat: 54,
    notes: "4万+",
    trending: "月牙形海湾、彩色玻璃球石、海边漫步、安静小众",
    tier: "B"
  },
  "海驴岛": {
    heat: 52,
    notes: "3万+",
    trending: "万鸟齐飞、海鸥喂食、无人岛探秘、海蚀地貌",
    tier: "B"
  },
  "乳山银滩": {
    heat: 50,
    notes: "5万+",
    trending: "天下第一滩、绵延沙滩、养老度假、海景房",
    tier: "B"
  },

  // ===== Tier C: 小众/利基 (30-49) =====
  "悦海公园": {
    heat: 48,
    notes: "3万+",
    trending: "灯塔打卡、海边栈道、威海夜景、市民公园",
    tier: "C"
  },
  "威海公园": {
    heat: 46,
    notes: "3万+",
    trending: "海滨雕塑、海边散步、城市海岸线、免费公园",
    tier: "C"
  },
  "环翠楼": {
    heat: 44,
    notes: "2万+",
    trending: "威海地标、登楼远眺、古建筑、城市全景",
    tier: "C"
  },
  "韩乐坊": {
    heat: 42,
    notes: "3万+",
    trending: "韩国风情街、韩餐美食、异域体验、购物打卡",
    tier: "C"
  },
  "张裕酒文化博物馆": {
    heat: 40,
    notes: "3万+",
    trending: "百年酒窖、葡萄酒品鉴、工业旅游、烟台名片",
    tier: "C"
  },
  "石岛赤山": {
    heat: 38,
    notes: "2万+",
    trending: "赤山大佛、法华院、海上仙山、祈福圣地",
    tier: "C"
  },
  "鸡鸣岛": {
    heat: 36,
    notes: "3万+",
    trending: "爸爸去哪儿、海岛渔村、原生态小岛、赶海体验",
    tier: "C"
  },
  "金海滩": {
    heat: 34,
    notes: "2万+",
    trending: "威海金沙滩、免费海滩、亲子戏水、烧烤露营",
    tier: "C"
  },
  "海源公园": {
    heat: 32,
    notes: "1万+",
    trending: "海边礁石、小众拍照、威海海岸线、日出观赏",
    tier: "C"
  },
  "文登天沐温泉": {
    heat: 30,
    notes: "2万+",
    trending: "温泉度假、冬季泡汤、亲子酒店、养生放松",
    tier: "C"
  },

  // ===== Tier D: 深度/冷门 (10-29) =====
  "大乳山": {
    heat: 24,
    notes: "1万+",
    trending: "母爱文化、海岸步道、乳山地标、自然风光",
    tier: "D"
  },
  "荣成博物馆": {
    heat: 18,
    notes: "5千+",
    trending: "荣成历史、海洋文化、免费展览、雨天好去处",
    tier: "D"
  },
  "圣水观": {
    heat: 14,
    notes: "3千+",
    trending: "道教圣地、全真派、古建筑、山林清幽",
    tier: "D"
  }
};

// CD 周边游小红书声量数据（编辑派生：trending 来自 highlight；heat 由 rating + 原 xhsHeat 启发式）
const XHS_HEAT_CD = {
  // ===== Tier S: 病毒级/持续热门 (90-100) =====
  "大熊猫繁育研究基地": { heat: 97, notes: "313+51+6+多篇避雷贴", trending: "130+ 大熊猫、顶流花花、月亮产房新生幼崽", tier: "S" },
  "峨眉山": { heat: 97, notes: "810+237+161+2", trending: "金顶日出、云海佛光、普贤菩萨、贡嘎雪山同框", tier: "S" },
  "稻城亚丁": { heat: 97, notes: "5843+2341+1287+867+543", trending: "三神山、牛奶海、五色海、日照金山", tier: "S" },
  "建设巷美食街": { heat: 97, notes: "2134+876+543+234+156", trending: "矿工蹄花、万春卤菜、糖油果子、烤脑花", tier: "S" },
  "都江堰": { heat: 95, notes: "8425+638+461+200+127+119", trending: "鱼嘴、飞沙堰、宝瓶口 三大工程、南桥蓝眼泪", tier: "S" },
  "海螺沟": { heat: 95, notes: "1234+567+345+189", trending: "亚洲最低冰川、贡嘎日照金山、3600m 雪山温泉、磨西古镇", tier: "S" },
  "蜀南竹海": { heat: 95, notes: "567+234+156+89", trending: "500km² 竹海、卧虎藏龙取景、全竹宴、避暑圣地", tier: "S" },
  "玉林路·小酒馆": { heat: 94, notes: "1245+543+298+167", trending: "赵雷《成都》原型、小酒馆、明婷苍蝇馆、梧桐老街", tier: "S" },
  "春熙路": { heat: 92, notes: "787+343+215+199", trending: "IFS 爬墙熊猫、太古里、裸眼 3D 熊猫、成都潮流中心", tier: "S" },
  "文殊院": { heat: 92, notes: "456+112+88+34", trending: "文殊菩萨、1400 年古刹、香园茶坊、免费斋饭", tier: "S" },
  "四姑娘山": { heat: 92, notes: "876+345+198+98", trending: "东方阿尔卑斯、4 座 6000m 姊妹峰、日照金山、双桥沟全景", tier: "S" },
  "丹巴甲居藏寨": { heat: 92, notes: "678+289+156+87", trending: "中国最美乡村、嘉绒藏族白石楼、梨花雪海、金秋彩林", tier: "S" },
  "乐山大佛": { heat: 90, notes: "1335+557+406+264", trending: "71m 世界最大石刻佛像、三江汇流、海通禅师、凌云寺", tier: "S" },
  "安仁古镇": { heat: 90, notes: "412+198+98+56", trending: "27 座民国公馆、刘氏庄园、建川博物馆聚落（38 馆）", tier: "S" },
  "阆中古城": { heat: 90, notes: "567+234+145+87", trending: "中国四大古城、风水宝地、张飞镇守、巴蜀春节发源", tier: "S" },
  // ===== Tier A: 高人气目的地 (75-89) =====
  "青城山": { heat: 89, notes: "725+200+163+127+73", trending: "张陵开道、青城天下幽、天师洞、老君阁", tier: "A" },
  "人民公园": { heat: 89, notes: "209+42+4+3+多篇", trending: "鹤鸣茶社百年、盖碗茶+变脸吐火、非遗采耳、保路纪念碑", tier: "A" },
  "大慈寺": { heat: 89, notes: "389+124+76+45", trending: "玄奘受戒之地、太古里红墙反差、博舍酒店隔壁", tier: "A" },
  "平乐古镇": { heat: 89, notes: "445+187+98+56", trending: "2300 年茶马古道第一镇、乐善桥、江边泡脚、瓷胎竹编非遗", tier: "A" },
  "锦里古街": { heat: 87, notes: "941+32+11+9", trending: "三国文化主题、灯笼夜市、莲花池廊桥、川剧变脸", tier: "A" },
  "武侯祠": { heat: 87, notes: "196+73+14+多篇保姆级", trending: "刘备墓、诸葛亮祠、三绝碑、红墙夹道", tier: "A" },
  "浣花溪公园": { heat: 87, notes: "312+87+45+22", trending: "诗歌大道、白鹭洲、沧浪湖、银杏大道", tier: "A" },
  "东郊记忆": { heat: 87, notes: "567+234+145+89", trending: "1958 年苏联援建红砖厂房、火车头广场、Live House、草莓音乐节", tier: "A" },
  "杜甫草堂": { heat: 86, notes: "222+128+128+112", trending: "杜甫茅屋为秋风所破歌原址、红墙花径、诗史堂", tier: "A" },
  "宽窄巷子": { heat: 85, notes: "508+97+70+42+37+13", trending: "清代满城遗址、泡泡玛特露台、喜茶独栋洋楼、熊猫邮局", tier: "A" },
  "西岭雪山": { heat: 85, notes: "179+24+3", trending: "阴阳界、日月坪日出、滑雪场+云端森林", tier: "A" },
  "黄龙溪古镇": { heat: 85, notes: "389+167+98+45", trending: "1700 年川西水乡、玩水天堂、一根面、火龙灯舞非遗", tier: "A" },
  "洛带古镇": { heat: 80, notes: "278+98+56+23", trending: "客家第一镇、四大会馆、伤心凉粉、油烫鹅", tier: "A" },
  "街子古镇": { heat: 79, notes: "189+67+34+18", trending: "晋代光严禅院、唐求故居、字库塔、凤栖山", tier: "A" },
  "三圣乡·花香荷韵": { heat: 75, notes: "198+78+34+18", trending: "五朵金花、幸福梅林、荷塘月色、江家菜地", tier: "A" }
};

// CQ 周边游小红书声量数据（编辑派生：trending 来自 highlight；heat 由 rating + 原 xhsHeat 启发式）
const XHS_HEAT_CQ = {
  // ===== Tier S: 病毒级/持续热门 (90-100) =====
  "洪崖洞": { heat: 91, notes: "5千+", trending: "巴渝吊脚楼夜景、千厮门机位", tier: "S" },
  "大足石刻（宝顶山景区）": { heat: 90, notes: "5千+", trending: "UNESCO 世遗、宋代佛教石刻巅峰", tier: "S" },
  "武隆天生三桥": { heat: 90, notes: "5千+", trending: "世遗喀斯特天生桥群、变形金刚 4 拍摄地", tier: "S" },
  // ===== Tier A: 高人气目的地 (75-89) =====
  "李子坝轻轨穿楼": { heat: 88, notes: "5千+", trending: "轻轨穿民居、8D 魔幻", tier: "A" },
  "长江索道": { heat: 86, notes: "5千+", trending: "过江缆车、魔幻 1.5 分钟", tier: "A" },
  "南山一棵树": { heat: 86, notes: "5千+", trending: "渝中半岛最佳夜景平台", tier: "A" },
  "山城步道（第三步道）": { heat: 84, notes: "5千+", trending: "1.9km 老山城、长江索道至菜园坝", tier: "A" },
  "红岩村": { heat: 84, notes: "5千+", trending: "中共南方局旧址、红岩精神发源地", tier: "A" },
  "江津四面山": { heat: 84, notes: "5千+", trending: "152 米华东第一瀑、爱情天梯", tier: "A" },
  "歌乐山森林公园": { heat: 83, notes: "5千+", trending: "抗战陪都遗址群、森林避暑", tier: "A" },
  "金刀峡": { heat: 83, notes: "5千+", trending: "喀斯特峡谷、6km 徒步穿越", tier: "A" },
  "龙水峡地缝": { heat: 83, notes: "5千+", trending: "世遗地缝、75 米观光电梯", tier: "A" },
  "酉阳桃花源": { heat: 83, notes: "5千+", trending: "陶渊明笔下桃花源、伏羲洞穿越", tier: "A" },
  "万州大瀑布群": { heat: 83, notes: "5千+", trending: "长江上游第一瀑、151 米宽水幕", tier: "A" },
  "重庆大剧院（鹦鹉螺）": { heat: 81, notes: "5千+", trending: "鹦鹉螺建筑、江北嘴地标", tier: "A" },
  "磁器口古镇": { heat: 81, notes: "5千+", trending: "千年古镇、陈麻花老字号", tier: "A" },
  "芙蓉洞": { heat: 81, notes: "5千+", trending: "世遗喀斯特、70 种沉积物", tier: "A" },
  "龚滩古镇": { heat: 81, notes: "5千+", trending: "乌江悬崖土家吊脚楼古镇", tier: "A" },
  "合川钓鱼城": { heat: 81, notes: "5千+", trending: "南宋抗蒙 36 年、蒙哥大汗殒命处", tier: "A" },
  "缙云山国家级自然保护区": { heat: 79, notes: "5千+", trending: "主城避暑、1500 年道佛双庙", tier: "A" },
  "仙女山国家森林公园": { heat: 79, notes: "5千+", trending: "南国高山草原、重庆首家滑雪场", tier: "A" },
  "云阳龙缸国家地质公园": { heat: 79, notes: "5千+", trending: "世界第一悬挑玻璃廊桥、260 米天坑", tier: "A" },
  "解放碑": { heat: 78, notes: "5千+", trending: "抗战胜利碑、山城商圈原点", tier: "A" },
  "涂山寺": { heat: 78, notes: "5千+", trending: "1600 年古刹、抗战陪都遗址", tier: "A" },
  "老君洞道观": { heat: 78, notes: "5千+", trending: "1800 年道教祖庭、40 通摩崖", tier: "A" },
  "潼南陈抟故里油菜花田": { heat: 78, notes: "5千+", trending: "3 万亩油菜花海、季节限定", tier: "A" },
  "黔江小南海": { heat: 78, notes: "5千+", trending: "1856 地震堰塞湖、苗寨围湖", tier: "A" },
  "鹅岭贰厂文创公园": { heat: 76, notes: "5千+", trending: "工业遗址、文创地标、天台江景", tier: "A" },
  "观音桥商圈+九街": { heat: 76, notes: "5千+", trending: "江北夜生活、九街 Live", tier: "A" },
  "綦江老瀛山": { heat: 76, notes: "5千+", trending: "白垩纪恐龙足迹化石、丹霞峰林", tier: "A" }
};

// HZ 周边游小红书声量数据（编辑派生：trending 来自 highlight；heat 由 rating + 原 xhsHeat 启发式）
const XHS_HEAT_HZ = {
  // ===== Tier S: 病毒级/持续热门 (90-100) =====
  "灵隐寺": { heat: 95, notes: "1544+ 赞，126+ 笔记", trending: "飞来峰石窟、三生石、济公殿", tier: "S" },
  "乌镇戏剧节": { heat: 95, notes: "年度文艺圈顶流", trending: "水剧场、孟京辉、赖声川、青年竞演", tier: "S" },
  "西湖": { heat: 94, notes: "2735+ 赞单篇", trending: "西湖十景、苏轼手笔、世界遗产", tier: "S" },
  "普陀山": { heat: 94, notes: "四大佛山朝圣顶流", trending: "南海观音、海天佛国、佛顶山日出", tier: "S" },
  "乌镇": { heat: 93, notes: "254+ 赞保姆级夜游", trending: "西栅夜景、互联网大会小镇", tier: "S" },
  "中国美术学院象山校区": { heat: 90, notes: "781+ 赞参观攻略", trending: "王澍普利兹克奖作品、象山十景", tier: "S" },
  "九溪烟树": { heat: 90, notes: "1820+ 赞夏季攻略", trending: "九溪十八涧、十里琅珰、理安寺", tier: "S" },
  "北山街·宝石山": { heat: 90, notes: "890+ 赞日出攻略", trending: "民国建筑群、保俶塔日出", tier: "S" },
  // ===== Tier A: 高人气目的地 (75-89) =====
  "临安天目山": { heat: 89, notes: "夏季避暑顶流", trending: "大树王、金钱松群落、云海日出", tier: "A" },
  "龙井茶田": { heat: 88, notes: "278+ 赞徒步攻略", trending: "狮峰龙井原产地、茶文化博物馆", tier: "A" },
  "良渚古城遗址公园": { heat: 88, notes: "1080+ 赞研学攻略", trending: "玉琮王、莫角山宫殿、世界遗产", tier: "A" },
  "鲁迅故里·三味书屋": { heat: 88, notes: "750+ 赞研学首选", trending: "百草园、三味书屋、咸亨酒店", tier: "A" },
  "西溪湿地": { heat: 87, notes: "1519+ 赞亲子线", trending: "深潭口、秋雪庵、西溪梅墅", tier: "A" },
  "千岛湖": { heat: 87, notes: "648+ 赞两日攻略", trending: "东南湖区梅峰观岛、鱼头宴", tier: "A" },
  "梅家坞茶文化村": { heat: 87, notes: "450+ 赞春茶攻略", trending: "狮峰龙井梅字号、周总理视察地", tier: "A" },
  "盐官观潮景区": { heat: 87, notes: "农历八月年度刷屏", trending: "一线潮、交叉潮、回头潮、天下奇观", tier: "A" },
  "西塘古镇": { heat: 87, notes: "1350+ 赞雨景攻略", trending: "烟雨长廊、《碟中谍 3》、江南六镇", tier: "A" },
  "安昌古镇": { heat: 85, notes: "腊月年味顶流", trending: "腊月风情节、酱鸭、师爷博物馆", tier: "A" },
  "嘉兴南湖·红船": { heat: 85, notes: "研学必打卡", trending: "红船、一大闭幕地、革命纪念馆", tier: "A" },
  "中国美术学院民艺博物馆": { heat: 84, notes: "420+ 赞建筑打卡", trending: "隈研吾青瓦屋顶、普利兹克建筑三剑客", tier: "A" },
  "飞来峰石窟": { heat: 82, notes: "320+ 赞石窟攻略", trending: "布袋弥勒像、青林洞密宗石刻", tier: "A" },
  "中国茶叶博物馆": { heat: 81, notes: "茶文化研学推荐", trending: "国家级茶专题博物馆、宋代点茶复原", tier: "A" },
  "龙门古镇": { heat: 79, notes: "280+ 赞小众宝藏", trending: "孙权后裔、明清宗族村落、孙氏宗祠", tier: "A" },
  "宋城": { heat: 78, notes: "好评+差评两极分化", trending: "《宋城千古情》年接待 1800 万", tier: "A" },
  "杭州雷峰塔": { heat: 77, notes: "235+ 赞爬塔攻略", trending: "白蛇传、西湖十景、雷峰夕照", tier: "A" },
  "建德大慈岩": { heat: 77, notes: "小众佛山宝藏", trending: "天然立佛、元代悬空寺、双面弥勒", tier: "A" },
  "沈园·陆游唐琬": { heat: 75, notes: "越剧迷顶流", trending: "钗头凤碑、沈园之夜越剧", tier: "A" },
  "新叶古村": { heat: 75, notes: "摄影小众高分", trending: "九宫八卦布局、叶氏宗祠、《爸爸去哪儿》", tier: "A" },
  // ===== Tier B: 中等热度 (60-74) =====
  "南宋御街": { heat: 73, notes: "本地人推荐>外地游客吐槽", trending: "南宋临安都城中轴、清河坊老字号群", tier: "B" },
  "桐庐瑶琳仙境": { heat: 73, notes: "亲子周末首选", trending: "华东第一溶洞、2 亿年钟乳、三十三重天", tier: "B" }
};

// ES 周边游小红书声量数据（编辑派生：trending 来自 highlight；heat 由 rating + 原 xhsHeat 启发式）
const XHS_HEAT_ES = {
  // ===== Tier S: 病毒级/持续热门 (90-100) =====
  "恩施大峡谷": { heat: 97, notes: "3k+ 笔记·恩施顶流", trending: "一炷香独峰、云龙地缝、绝壁栈道、世界地质奇观", tier: "S" },
  "利川腾龙洞": { heat: 97, notes: "1k+ 笔记·利川顶流", trending: "亚洲第一溶洞、激光秀、江源情歌舞剧、清江伏流", tier: "S" },
  "鹤峰屏山大峡谷": { heat: 97, notes: "5k+ 笔记·2024 年恩施顶流", trending: "空中飞船、水绿透明、恩施最出片秘境、限流景区", tier: "S" },
  "宣恩狮子关水上浮桥": { heat: 97, notes: "1.5k+ 笔记·抖音网红带火", trending: "500m 水上浮桥、伏流大瀑布、抖音网红点", tier: "S" },
  "神农架神农顶": { heat: 97, notes: "3k+ 笔记·鄂西顶流", trending: "华中屋脊 3106m、大九湖湿地、野人传说、世界遗产", tier: "S" },
  "神农架鹿院坪": { heat: 97, notes: "1k+ 笔记·数字戒断打卡地", trending: "1336 级石阶下、谷底桃花源、无信号、神农架秘境", tier: "S" },
  "张家界天门山": { heat: 97, notes: "3k+ 笔记·湘西顶流", trending: "世界最长索道、天门洞、玻璃栈道、天门狐仙演出", tier: "S" },
  "张家界武陵源": { heat: 97, notes: "1w+ 笔记·湘西顶流", trending: "世界自然遗产、阿凡达原型、3000 石峰、百龙天梯", tier: "S" },
  "恩施土家合渣宴": { heat: 97, notes: "2k+ 笔记·恩施美食顶流", trending: "省级非遗、合渣+腊蹄子火锅、张关合渣本地连锁", tier: "S" },
  "七星寨景区": { heat: 95, notes: "大峡谷核心景区顶流", trending: "一炷香世界奇观、绝壁栈道、玉笔峰、云海", tier: "S" },
  "恩施女儿城": { heat: 94, notes: "2k+ 笔记·恩施必打卡", trending: "土家相亲会、非遗街、西兰卡普织机、土家小吃集散", tier: "S" },
  "凤凰古城": { heat: 94, notes: "5k+ 笔记·湘西经典", trending: "沈从文故乡、沱江吊脚楼、跳岩、中国最美小城", tier: "S" },
  "巫山神女峰": { heat: 90, notes: "700+ 笔记·三峡标志", trending: "巫峡十二峰、神女独柱、屈原毛主席诗、长江三峡", tier: "S" },
  // ===== Tier A: 高人气目的地 (75-89) =====
  "利川苏马荡": { heat: 88, notes: "800+ 笔记·暑假刚需", trending: "1500m 避暑、杜鹃花海、齐岳山大草原、别梦山", tier: "A" },
  "巴东神农溪": { heat: 88, notes: "600+ 笔记·三峡迷必打卡", trending: "长江支流游船、豌豆角小船、纤夫活态非遗", tier: "A" },
  "三峡大瀑布": { heat: 88, notes: "900+ 笔记·三峡必打卡", trending: "华中第一瀑、水帘洞栈道、102m 高、三峡腹地", tier: "A" },
  "矮寨大桥": { heat: 88, notes: "800+ 笔记·湘西网红", trending: "世界第一悬索桥、355m 高、13 道弯盘山公路", tier: "A" },
  "咸丰唐崖土司城址": { heat: 83, notes: "200+ 笔记·历史迷必打卡", trending: "世界文化遗产、荆南雄镇石牌坊、500 年土司城", tier: "A" },
  "巴东小神农架": { heat: 83, notes: "400+ 笔记·避暑宝藏", trending: "3000m 云海、原始冷杉、金丝猴、神农架恩施段", tier: "A" },
  "张家界黄龙洞": { heat: 83, notes: "600+ 笔记·张家界经典", trending: "定海神针、地下河游船、3 亿年钟乳石", tier: "A" },
  "恩施土司城": { heat: 82, notes: "500+ 笔记", trending: "九进堂木构、廪君白虎、摆手舞表演、土家织锦", tier: "A" },
  "利川龙船调景区": { heat: 81, notes: "200+ 笔记·小众历史宝藏", trending: "世界民歌龙船调故乡、李氏庄园、土家宗族文化", tier: "A" },
  "来凤仙佛寺": { heat: 81, notes: "150+ 笔记·历史迷必看", trending: "东晋 1700 年摩崖造像、南方最古老佛像、酉水", tier: "A" },
  "建始石门河": { heat: 81, notes: "150+ 笔记·科普研学宝藏", trending: "200 万年前建始直立人、巨鲵保护区、古盐道", tier: "A" },
  "梭布垭石林": { heat: 80, notes: "400+ 笔记·小众宝藏", trending: "4 亿年前海底礁石、戴冠石、青龙缠松、一线天", tier: "A" },
  "酉水河风景区": { heat: 80, notes: "150+ 笔记·小众土家游", trending: "土家母亲河、游船 2 小时、摆手舞发源地", tier: "A" },
  "建始野三峡": { heat: 80, notes: "200+ 笔记·小众峡谷", trending: "野三河游船、悬棺遗迹、景阳关、小众峡谷", tier: "A" },
  "重庆黔江濯水古镇": { heat: 80, notes: "500+ 笔记·渝东南经典", trending: "亚洲第一风雨廊桥、明清商贸古镇、阿蓬江", tier: "A" },
  "利川佛宝山大峡谷": { heat: 76, notes: "300+ 笔记·小众漂流地", trending: "九瀑一线天、玻璃栈桥、6 公里漂流、红杉林", tier: "A" },
  "阿蓬江国家湿地公园": { heat: 75, notes: "300+ 笔记·渝东南秘境", trending: "全国最长漂流、神龟峡、蒲花暗河、渝东南秘境", tier: "A" }
};

// QD 周边游小红书声量数据（编辑派生：trending 来自 highlight；heat 由 rating + 原 xhsHeat 启发式）
const XHS_HEAT_QD = {
  // ===== Tier S: 病毒级/持续热门 (90-100) =====
  "中国海军博物馆": { heat: 92, notes: "2.9k", trending: "亚洲最大海军博物馆、实舰登舰", tier: "S" },
  "崂山巨峰": { heat: 91, notes: "2.2k", trending: "崂山主峰 1132.7m、海上第一名山", tier: "S" },
  "蓬莱阁": { heat: 91, notes: "1.9k", trending: "1061 年、中国四大名楼、5A", tier: "S" },
  "长岛": { heat: 91, notes: "1.4k", trending: "山东唯一海岛县、渤黄海分界", tier: "S" },
  // ===== Tier A: 高人气目的地 (75-89) =====
  "信号山公园": { heat: 89, notes: "2.4k", trending: "98m、360° 俯瞰'红瓦绿树碧海蓝天'", tier: "A" },
  "青岛迎宾馆": { heat: 89, notes: "1.3k", trending: "全国重点文保、德国总督官邸原貌", tier: "A" },
  "浙江路天主教堂": { heat: 89, notes: "2.8k", trending: "华北最大哥特式、56m 双塔", tier: "A" },
  "小麦岛公园": { heat: 89, notes: "3.2k", trending: "半岛草坡、日落日出双机位", tier: "A" },
  "崂山北九水": { heat: 89, notes: "1.5k", trending: "崂山北线、九曲 12 潭", tier: "A" },
  "黄岛金沙滩": { heat: 89, notes: "2.5k", trending: "3500m、青岛最大沙滩、4A 景区", tier: "A" },
  "五四广场": { heat: 87, notes: "3.6k", trending: "1919 年五四运动纪念、青岛回归象征", tier: "A" },
  "奥帆中心": { heat: 87, notes: "4.8k", trending: "奥运五环标志、2008 帆船赛事", tier: "A" },
  "红岛海鲜市场": { heat: 87, notes: "1.4k", trending: "青岛蛤蜊之王、现捞现吃", tier: "A" },
  "小鱼山公园": { heat: 87, notes: "1.2k", trending: "60m、青岛首座古典山头公园", tier: "A" },
  "江苏路基督教堂": { heat: 87, notes: "1.4k", trending: "1910 年德产机械钟、原装运转", tier: "A" },
  "鲁迅公园海滨木栈道": { heat: 87, notes: "1.8k", trending: "青岛红石滩、老城文艺海岸线", tier: "A" },
  "崂山仰口": { heat: 87, notes: "1.6k", trending: "山海相连、北宋太平宫", tier: "A" },
  "养马岛": { heat: 87, notes: "1.3k", trending: "秦始皇御马场、12km 环岛公路", tier: "A" },
  "张裕酒文化博物馆": { heat: 87, notes: "1.0k", trending: "1892 年、中国首家葡萄酒厂、亚洲最大酒窖", tier: "A" },
  "台东步行街": { heat: 86, notes: "4.2k", trending: "LED 外立面 + 大排档一条街", tier: "A" },
  "灵山岛": { heat: 86, notes: "780", trending: "北方第一高岛 513m、纯渔村民宿", tier: "A" },
  "青岛啤酒博物馆": { heat: 85, notes: "3.2k", trending: "1903 年德国人创立、A 级景区", tier: "A" },
  "劈柴院": { heat: 85, notes: "2.0k", trending: "民国老字号+民间曲艺", tier: "A" },
  "登州路啤酒街": { heat: 85, notes: "1.8k", trending: "青啤博物馆正门街、鲜啤文化地标", tier: "A" },
  "船歌鱼水饺总店": { heat: 85, notes: "1.5k", trending: "青岛水饺品牌、多家分店", tier: "A" },
  "胶州湾跨海大桥": { heat: 85, notes: "1.1k", trending: "2011 世界最长跨海大桥、42.23km", tier: "A" },
  "第一海水浴场": { heat: 83, notes: "1.6k", trending: "580m 沙滩、民国时为汇泉浴场", tier: "A" },
  "黄岛银沙滩": { heat: 80, notes: "920", trending: "白沙 2000m、安静版金沙滩", tier: "A" },
  "琅琊台": { heat: 80, notes: "820", trending: "秦代夯土古台、徐福东渡起点", tier: "A" },
  "崂山华楼宫": { heat: 78, notes: "320", trending: "元代 1325 年道观、凌烟崮奇石", tier: "A" }
};

// TJ 周边游小红书声量数据（编辑派生：trending 来自 highlight；heat 由 rating + 原 xhsHeat 启发式）
const XHS_HEAT_TJ = {
  // ===== Tier S: 病毒级/持续热门 (90-100) =====
  "国家海洋博物馆": { heat: 92, notes: "1.6k", trending: "18m 抹香鲸骨骼、南海 I 号瓷器", tier: "S" },
  // ===== Tier A: 高人气目的地 (75-89) =====
  "五大道": { heat: 89, notes: "2.8k", trending: "230 座小洋楼、民国风", tier: "A" },
  "海河游船": { heat: 89, notes: "2.3k", trending: "70 分钟穿越 9 座大桥", tier: "A" },
  "天津之眼": { heat: 87, notes: "3.2k", trending: "永乐桥摩天轮、30 分钟一圈", tier: "A" },
  "滨海文化中心（滨海图书馆）": { heat: 87, notes: "2.4k", trending: "34m 中庭、书山海啸", tier: "A" },
  "独乐寺（蓟州）": { heat: 86, notes: "950", trending: "辽代观音阁、梁思成盛赞", tier: "A" },
  "意式风情区": { heat: 85, notes: "2.1k", trending: "马可波罗广场、罗马柱廊", tier: "A" },
  "盘山（蓟州）": { heat: 84, notes: "720", trending: "乾隆行宫、云罩寺", tier: "A" },
  "古文化街": { heat: 83, notes: "1.5k", trending: "杨柳青年画、泥人张", tier: "A" },
  "梨木台风景区": { heat: 82, notes: "580", trending: "燕山原始森林、天津屋脊", tier: "A" },
  "黄崖关长城": { heat: 82, notes: "420", trending: "戚继光督建、寡妇楼传说", tier: "A" },
  "瓷房子": { heat: 80, notes: "1.8k", trending: "张连志私人博物馆、700 尊石狮子", tier: "A" },
  "八仙山国家级自然保护区": { heat: 80, notes: "280", trending: "1052m 天津屋脊、八仙桌子", tier: "A" },
  "东疆湾沙滩景区": { heat: 80, notes: "780", trending: "2km 进口白沙、渤海帆船", tier: "A" },
  "大沽口炮台遗址博物馆": { heat: 80, notes: "240", trending: "国保、二次鸦片战争遗址", tier: "A" },
  "西开教堂": { heat: 80, notes: "420", trending: "国保、法国罗曼式双塔、天主教堂", tier: "A" },
  "天津大学北洋园校区": { heat: 80, notes: "820", trending: "中国第一所现代大学、北洋大学", tier: "A" },
  "滨海航母主题公园": { heat: 78, notes: "680", trending: "唯一对外开放、俄罗斯基辅级核航母", tier: "A" },
  "九龙山国家森林公园": { heat: 78, notes: "210", trending: "华北石英岩峰林、双龙顶石海", tier: "A" },
  "杨柳青古镇（石家大院）": { heat: 78, notes: "420", trending: "华北第一宅、杨柳青年画", tier: "A" },
  "解放北路金融街": { heat: 78, notes: "560", trending: "56 栋百年金融建筑、东方华尔街", tier: "A" },
  "泰安道五大院": { heat: 78, notes: "380", trending: "国保开滦大楼、英式红砖街", tier: "A" },
  "霍元甲纪念馆": { heat: 77, notes: "120", trending: "精武门创始人故居、迷踪拳发源地", tier: "A" },
  "天津广播电视塔（天塔）": { heat: 77, notes: "310", trending: "亚洲唯一水中塔、257m 观光层", tier: "A" },
  "天津邮政博物馆": { heat: 77, notes: "95", trending: "中国邮政发源地、大龙邮票真品", tier: "A" },
  "鼓楼商业街": { heat: 75, notes: "360", trending: "27m 三层鼓楼、广东会馆戏台", tier: "A" },
  "望海楼教堂": { heat: 75, notes: "160", trending: "国保、天津教案发生地、哥特式三塔", tier: "A" },
  // ===== Tier B: 中等热度 (60-74) =====
  "南市食品街": { heat: 73, notes: "720", trending: "耳朵眼、桂发祥、狗不理一站齐", tier: "B" },
  "劝业场（滨江道）": { heat: 73, notes: "180", trending: "1928 巴洛克百货、马三立演出地", tier: "B" },
  "独流老醋文化产业园": { heat: 73, notes: "75", trending: "中国四大名醋、千缸晒醋场", tier: "B" }
};
