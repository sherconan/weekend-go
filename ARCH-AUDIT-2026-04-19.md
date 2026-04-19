# 架构审计 · 2026-04-19

> 用户指出两大根因：(1) 新增城市改动面太大，模块间容易遗漏；(2) 同一景点（如泰山）跨城应复用同一张卡，当前是散点重复。
> 本文用**数据证据**量化问题，再给重构方案。

---

## 一、证据 · 硬编码散点（"改一处必须改多处"）

### Web 端 — 14 处硬编码城市名
- `js/data.js`, `js/data-extra.js`, `js/data-extra2.js`, `js/data-beijing-500.js`, `js/data-beijing-expand.js`, `js/data-beijing-hidden.js`, `js/data-beijing-tales.js`, `js/data-beijing-new2026.js` — BJ 数据散 8 个文件
- `js/data-shenzhen.js`, `js/data-weihai.js`, `js/data-suzhou.js` — 其他城市各 1 个文件，风格不一
- `js/legends.js` — 有 `getCitiesWithLegends()` 兜底，但 vibe 条、热门词、emoji 还是硬编码
- `js/app.js` — `CITY_DATA`, `SEARCH_HOT_WORDS`, `cityHeatMap`, 共 3 处硬编码 city 列表
- `index.html` — `.city-selector` 4 个按钮 + 5 个 `<script src="data-city">` tag
- `sw.js` — ASSETS 列表包含每个 data 文件
- `js/images.js` — 729 条 name→file mapping，按 city 命名但没中心化

### 小程序端 — 11 处硬编码（比 Web 更散）
- `utils/data.js`, `utils/data-legends.js` — 大 JSON 块，加城市要手写
- `pages/index/index.js`, `pages/profile/profile.js`, `pages/stamp/stamp.js` — **各自独立声明 `CITY_CONFIG`**（今日加苏州时改了 3 份）
- `pages/index/index.js`, `pages/stamp/stamp.js`, `pages/profile/profile.js` — `CITY_KEYS` 数组分 3 份
- `pages/search/search.js` — `CITY_LABELS` + `HOT_WORDS` 又是硬编码副本
- `pages/onboarding/onboarding.wxml` — 选择城市页面硬编码
- `packageDetail/data-detail.js` — keyed by `city_id` 格式
- `app.js` — `globalData.currentCity` 默认值

**新增一个城市需要触摸 14 (Web) + 11 (Mini) = 25 个位置**。今日加苏州时我明确遗漏至少 3 处。

---

## 二、证据 · 跨城+城内重名 60 组

### 最典型案例
| 景点名 | 出现在 |
|--------|--------|
| 泰山 | beijing (data-beijing-500) + weihai (data-weihai) |
| 故宫 | beijing (data-beijing-500) + beijing (data-beijing-expand) |
| 天坛 | beijing (data-beijing-500) + beijing (data-beijing-expand) |
| 朝阳公园 / 玉渊潭公园 / 景山公园 / 紫竹院公园 / 三里屯 / 798 / 国家博物馆 / 中国美术馆 / 烟袋斜街 / 五道营胡同 / 北京动物园 / 北京海洋馆 / 陶然亭公园 | BJ 自己内部 data-beijing-500 vs data-beijing-expand 双份 |

**共 60 组 / 813 条 ≈ 7.4% 数据污染率**（部分是 BJ 内部，部分跨城）。用户查看详情、打卡、分享时会遇到"同一景点 2 张卡但数据不同"的问题。

---

## 三、顶层设计方案

### 3.1 单一城市注册表 — `config/cities.js`

```js
// ⭐ 新增城市时，只改这一个文件
const CITIES = [
  {
    key: "beijing",
    name: "北京",
    emoji: "🏯",
    color: "#4CAF50",
    origin: { lat: 39.9042, lng: 116.4074 },  // 火车站/市中心坐标
    maxRange: 500,  // 纳入卡片的最大距离 km
    badge: "🌱 北京周边游 · 2026 春季版",
    desc: "从北京出发，500公里范围内的精选目的地。",
    hotWords: ["故宫", "长城", "环球影城", "颐和园"],
    hasLegends: true
  },
  {
    key: "shenzhen",
    name: "深圳",
    emoji: "🏖",
    color: "#2196F3",
    origin: { lat: 22.5431, lng: 114.0579 },
    maxRange: 500,
    // ...
  },
  // weihai, suzhou...
];
```

**影响**：`app.js` 的 `CITY_DATA`、`SEARCH_HOT_WORDS`、`cityHeatMap`、搜索页的 tabs、nav 的 city-selector、hero badge、miniapp 的 `CITY_CONFIG × 3`、`CITY_KEYS × 3` 全部由这一份派生，零散点。

### 3.2 景点数据：一条景点 = 一个对象，跨城通过 `cities` 字段

```js
// destinations/mount-tai.js（slug 化，按名字而非数字 ID）
{
  id: "mount-tai",
  name: "泰山",
  subtitle: "五岳之首·天下第一山",
  location: { lat: 36.2702, lng: 117.1041 },  // 真实坐标
  themes: ["爬山", "历史", "宗教"],
  budget: "200-500",
  rating: 4.9,
  image: "assets/images/dest-mount-tai.webp",
  gradient: "linear-gradient(...)",

  // 基础公共字段（所有城市共享）：description, highlights, whereToEat, 等
  overview: "...",
  whereToEat: [...],

  // 🔑 按出发城市定制的字段：距离、耗时、交通、预算说明
  cities: {
    beijing:  {
      distance: 480, distanceText: "480km",
      duration: ["两日一夜"],
      transport: ["自驾", "高铁+大巴"],
      budgetText: "人均 ¥800-1200（含住宿）",
      bestFrom: "秋高气爽 9-11月"
    },
    weihai: {
      distance: 140, distanceText: "140km",
      duration: ["一日往返", "半日游"],
      transport: ["自驾", "大巴"],
      budgetText: "人均 ¥200-400（当日往返）",
      bestFrom: "夏秋"
    },
    suzhou: {
      distance: 580, distanceText: "580km",
      duration: ["两日一夜"],
      transport: ["高铁"],
      budgetText: "人均 ¥900-1400",
      bestFrom: "秋季"
    }
  }
}
```

### 3.3 运行时派生

```js
// 替换 CITY_DATA[city].build()
function buildDestinationsForCity(cityKey) {
  return ALL_DESTINATIONS
    .filter(d => d.cities && d.cities[cityKey])
    .map(d => ({
      ...d,
      // 展平：把当前城市的 cities[city] 摊上来
      ...d.cities[cityKey],
      originCity: cityKey
    }));
}
```

**打卡系统**：以 `id: "mount-tai"` 为唯一键，BJ 打过的泰山卡，切到 WH 视角也显示"已去过"——用户视角统一。

### 3.4 数据组织

```
~/weekend-go/
├── config/
│   └── cities.js          ← 单一城市注册表
├── destinations/           ← 每条景点一个 js 文件（或合并为一个 all.js）
│   ├── mount-tai.js
│   ├── gugong.js
│   ├── ... (~700 条)
│   └── _index.js           ← 聚合 + 去重
├── legends/
│   ├── locksong-well.js
│   └── ... (180 条 by city)
└── js/
    ├── app.js              ← 不再有硬编码 city
    ├── images.js           ← 由 destination.image 字段派生
    └── ...
```

小程序端同构：`utils/cities.js` + `utils/destinations/`。

---

## 四、迁移路径（分 4 Phase）

### Phase 1 · 不破坏现状，建立新层（2-3h）
- [ ] 写 `config/cities.js` 单一注册表
- [ ] app.js / index.html / legends.js 从 `CITIES` 派生 city-selector, hot words, etc.
- [ ] miniapp 同步
- [ ] **不动数据文件**，先消除"城市硬编码散点"

### Phase 2 · 景点数据统一（3-5h）
- [ ] 写迁移脚本 `migrate-destinations.js`：读所有 `data-*.js` → 输出新 schema 到 `destinations/all.js`
- [ ] 模糊匹配去重（name + location 相近）；60 组重名合并为单条带 `cities: {...}`
- [ ] 人工复核跨城条目（尤其是 "泰山" 这种真正跨城的）
- [ ] 旧 `data-*.js` 仍保留，新 `destinations/all.js` 并行运行，新代码走新数据

### Phase 3 · 切换读取路径 + 删旧数据（1-2h）
- [ ] app.js 改为 `buildDestinationsForCity()`
- [ ] 打卡/收藏的 key 从 `${city}_${id}` 改为 `${destId}` + `{visited: [cityContext], firstVisitCity: ...}`
- [ ] 删掉 data-beijing-500.js 等老文件
- [ ] miniapp 同步

### Phase 4 · 文档 + 回归（1h）
- [ ] README：新增城市 SOP（改一个 config 文件，跑一次检查脚本）
- [ ] 线上端到端回归：四城切换、打卡、搜索、详情
- [ ] 写"加一个城市" CI 检查（if CITIES 多出一个，必须有对应 hot words + translations 等）

---

## 五、风险 · 3 个最脆弱点

1. **打卡数据迁移**：用户在 localStorage / 小程序 storage 有"已打卡"记录，key 格式从 `beijing_1` 改成 `gugong`——**必须写迁移钩子**，否则全员打卡进度归零（血案）
2. **图片文件名**：`dest-bj-001.webp` 这种 city-prefixed 命名如果改 slug-based，要么保留旧名映射，要么一次性批量重命名 540 张图（风险大）
3. **小程序分包**：当前 `packageDetail` 依赖 `city_id` 格式的 DETAIL_DATA，重构要兼顾这个下沉路径

---

## 六、我的建议

**先对齐，再动手**。问你：
1. 新 schema 你 OK 吗？（单一 CITIES + 每条景点带 `cities: {...}` 子字段）
2. 打卡 key 从 `city_id` → `id` 的迁移策略你认可吗？（需写 migration hook）
3. 图片文件名要保留还是批量改？（保留风险低，改干净风险高）
4. 先只做 Phase 1（消除硬编码散点），还是 Phase 1+2 一起做（含数据合并去重）？

拿到你的对齐后我再动代码。今日已把 scope 明确：审计+设计到位，落地交 Phase 1 产出可回退。
