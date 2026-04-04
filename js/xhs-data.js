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

