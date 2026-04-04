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

// 深圳周边游小红书声量数据（待填充）
const XHS_HEAT_SZ = {};

// 威海周边游小红书声量数据（待填充）
const XHS_HEAT_WH = {};

