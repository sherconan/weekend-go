# WeekendGo · Claude Design Review

> 评审时间：2026-04-19  
> 评审人：Claude（Opus 4.7）via Chrome 实时审计  
> 覆盖：首页 · 筛选 · 目的地卡 · 详情弹窗 · 搜索 · 另一面  
> 设备：1440×900 桌面 + 移动端断点

---

## TL;DR — 5 条最高 ROI 改动

| # | 改动 | ROI | 改动颗粒度 |
|---|------|-----|------|
| 1 | 统一色彩系统（把 10+ 灰阶合并为 4 级 token） | ⭐⭐⭐⭐⭐ | 1 文件 CSS 变量 |
| 2 | 简化目的地卡阴影（4 层 shadow → 1 层） | ⭐⭐⭐⭐ | 1 CSS 规则 |
| 3 | 首屏 Hero 压高（610px → 480px） | ⭐⭐⭐⭐ | 2 CSS 规则 |
| 4 | 搜索框纳入 Hero（当前藏在 nav） | ⭐⭐⭐⭐⭐ | HTML + CSS 调整 |
| 5 | 目的地卡图片容器加「渐变遮罩 + 标题反色」 | ⭐⭐⭐ | 1 组件样式 |

---

## 一、现状诊断（审计数据）

### 字体
```
PingFang SC · Hiragino Sans GB · Microsoft YaHei · system-ui · sans-serif
```
**问题**：fallback 链中混入 `Arial` 和 `SF Pro Display`，在 Windows/Linux 上会漏回 Arial（中文依旧 PingFang，但英文字距断裂）。

**建议**：中英文统一用一条链，优先 Inter（开源、质感接近 SF Pro）：
```css
font-family: "PingFang SC", "Inter", -apple-system, "Segoe UI Variable", "Segoe UI", system-ui, sans-serif;
```

### 色彩
审计发现的文字颜色有 **10 种**（包括 `rgb(106,110,118)`、`rgb(90,107,123)`、`rgb(138,142,151)` 等语义接近的灰）。

**问题**：视觉信息层级不清晰，不同组件挑了不同灰阶，累积成"花"。

**建议**：收敛为 4 级灰 + 2 级品牌色：
```css
:root {
  --ink-900: #101828;   /* 主标题 */
  --ink-700: #344054;   /* 正文 */
  --ink-500: #667085;   /* 辅助 */
  --ink-300: #D0D5DD;   /* 分隔线 */

  --brand: #4CAF50;     /* 绿：品牌 / 打卡 */
  --action: #FF7043;    /* 橙：CTA */
  --bg: #FAFBF8;        /* 米白背景 */
  --surface: #FFFFFF;   /* 卡片 */
}
```
把现有 `#1A2332 / #1a1d21 / #4a4d53 / #6a6e76 / #8a8e97 / #a9adb4 / #5A6B7B` 全部按语义映射到 4 级。**一次改 styles.css 顶部的变量块即可收敛全站。**

### 目的地卡片
- **尺寸** 363×529px（4 列）
- **圆角** 20px（合适）
- **阴影** `rgb(212,237,218) 0px 0px 0px 2px, rgba(76,175,80,0.2) 0px 0px 12px 0px, rgba(0,0,0,0.04) 0px 1px 3px 0px, rgba(0,0,0,0.06) 0px 1px 2px 0px`

**问题**：4 层 box-shadow 叠加（含双色 ring），**肉眼感觉卡片像"选中态"**，每一张都在喊。用户无法从视觉重量中判断 focus。

**建议**：降到 1 层柔和阴影 + hover 时加 ring：
```css
.dest-card {
  box-shadow: 0 1px 3px rgba(16,24,40,0.06), 0 1px 2px rgba(16,24,40,0.04);
  transition: transform .2s, box-shadow .2s;
}
.dest-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(16,24,40,0.08), 0 0 0 2px rgba(76,175,80,0.25);
}
```

### Hero 区（首屏）
- 当前高度 **610px**
- 内容密度：badge + title + desc + 2 CTA + 3 stat-item = 6 行

**问题**：1440×900 屏下 Hero 占 68% 视窗，**"精选目的地"列表几乎看不到**，用户必须滚屏才能看到核心内容。这违背了"决策工具"的定位。

**建议**：
1. Hero 高度压到 480px
2. 把 stat-bar 从 Hero 移到卡片列表顶部作为 sticky 过滤条
3. 筛选按钮入口从 nav 提升到 Hero 的主 CTA 旁：

```
┌────────────────────────────┐
│ 🌱 北京周边游 · 2026       │
│                            │
│ 这个周末，去哪儿好？       │
│ 不用翻遍小红书和攻略       │
│                            │
│ [🔍 搜一下 / 按主题筛选]  │ ← 统一入口，融合 search + filter
│                            │
└────────────────────────────┘
```

### 搜索入口（🔍 按钮）
**问题**：搜索按钮是 nav 右上角的小图标，用户第一眼不易发现。产品人常识：搜索是核心决策动作，不该被埋没。

**建议方案 A**：Hero 内嵌"大搜索框"（Airbnb/美团首页范式）
```html
<div class="hero-search">
  🔍 <input placeholder="搜目的地、主题、美食…">
  <button>搜一下</button>
</div>
```

**建议方案 B**：保留 nav 图标但放大 + 加标签（⌘K 快捷键提示）：
```html
<button class="nav-search-chip">
  🔍 <span>搜目的地</span> <kbd>⌘K</kbd>
</button>
```

### 城市切换器
当前是 4 个等宽按钮：`🏯 北京 / 🏖 深圳 / 🌊 威海 / 🏮 苏州`

**问题**：扁平 4 选一，不具扩展性，再加一个城市就挤。

**建议**：改为下拉式 city-picker（同美团/飞猪模式）：
```
┌─────────────┐
│ 🏯 北京 ▼  │ ← 点击弹出
└─────────────┘
 │
 ├─ 🏯 北京周边游
 ├─ 🏖 深圳周边游
 ├─ 🌊 威海周边游
 ├─ 🏮 苏州周边游
 └─ + 更多城市
```

---

## 二、交互 / 可用性观察

### 🧭 导航
- **Nav 内容过载**：logo + 城市 + 搜索 + 筛选 + 聊一聊 + 🌑 另一面 = 6 元素，**窄屏会换行或挤成一条横线**
- **建议**：把 "筛选" 合并到搜索浮层里（作为 tab 或 chips），Nav 保留 4 元素：logo / city / search / flip

### 🃏 卡片信息密度
当前一张 dest-card：
- 图片（16:9）
- 名字 + subtitle
- 距离 / 耗时 / 交通 / 预算 / 主题（5 行）
- 评分 / XHS 热度 / 打卡按钮

**每张卡 12+ 数据点**，视觉上非常拥挤。产品人的使用场景是"快速扫一眼筛出 3-5 个候选"，不是详读每张。

**建议**：把卡片分为 3 层：
1. **Cover**：图片 + 标题叠加（图片右下贴 XHS 热度徽章）
2. **Meta**：距离 · 主题 · 预算（一行 icon-label）
3. **Hover 才出**：完整 subtitle / 耗时 / 交通 / 打卡按钮

### 🔍 搜索 UX
- ✅ 已完成：⌘K 快捷键、热门词、键盘导航、跨城市联合搜索
- 🔧 建议：加 "recent searches" 记忆（localStorage，5 条）
- 🔧 建议：搜索结果按"类别"分组（目的地 · 传说 · 美食 · 主题）

### 🌑 另一面
- ✅ 已完成：多城市支持（北京 100 · 深圳 30 · 威海 20 · 苏州 30）
- 🔧 建议：进入 另一面 时**翻页动画**（当前切换太突兀，失去"另一面"仪式感）
- 🔧 建议：vibe 标签条动态渲染（当前可能只显示 BJ 的 8 类 vibe，切换到 suzhou 时新的 "园林幽韵/江南秘境" 未显示为可点击 chip）

---

## 三、"阴间" / 产品级 自检

对照用户 CLAUDE.md 里明确不要的：
- ❌ "不要暗色阴间 UI" → 当前 UI 主体是米白+深墨，专业；但 另一面 (night-mode) 色调偏紫/黑，**可能触发"阴间"观感**。建议：把 night-mode 背景从纯黑改为 `#1A1E28` + 琥珀点缀（类似纽约客杂志夜间模式），避免 gamer dark theme。

- ❌ "不要过于简单/玩具级别" → **卡片阴影和 emoji 用量偏"玩具感"**，建议减 emoji 密度（每张卡最多 2 个 emoji，当前 3-5 个）

- ❌ "不要假数据" → 数据全部真实，✅

---

## 四、落地优先级（可逐个实施）

### Phase A（1-2h 改动，影响全站）
- [ ] A1. styles.css 顶部引入色彩 token + 全站替换（**低风险，高收益**）
- [ ] A2. 卡片阴影从 4 层降到 1 层（**零风险**）
- [ ] A3. Hero 高度 480px + 移除 stat-bar（移到 sticky）
- [ ] A4. 字体 fallback 链清理（移除 Arial，统一 Inter）

### Phase B（2-4h 改动，影响 UX 结构）
- [ ] B1. Hero 内嵌大搜索框（融合 filter chip）
- [ ] B2. 城市切换器改下拉 picker
- [ ] B3. dest-card 3 层结构（Cover / Meta / Hover detail）
- [ ] B4. Recent searches + 搜索结果分组

### Phase C（锦上添花）
- [ ] C1. 另一面翻页动画（CSS 3D flip 或 Framer Motion）
- [ ] C2. Night mode 配色调优（#1A1E28 基调）
- [ ] C3. 卡片 emoji 密度控制（最多 2 个）

---

## 五、参考标杆

| 维度 | 参考 | 为什么 |
|------|------|------|
| Hero + 搜索融合 | Airbnb / 美团 / 马蜂窝 | 决策工具的标准 pattern |
| 城市切换 | 美团 / 飞猪 | 点一个按钮弹城市 grid |
| 卡片 3 层信息 | Booking / Airbnb | Cover / Meta / Hover |
| Night mode | The New Yorker / Medium dark | 不阴间、有温度 |
| 色彩 token | Tailwind / Radix UI | 4 级灰 + 2 级品牌 |

---

## 六、最脆弱 3 个地方（自检）

1. **本 review 是 1440×900 桌面视角**，移动端（375px）很多结论不一定适用（特别是卡片 3 层信息、hero 高度）。建议走 `design-qa` skill 单独跑一遍移动端审计。

2. **色彩 token 的重构会影响 Lanhu 设计稿对齐**。如果用户要继续走蓝湖设计稿驱动，需要先在蓝湖那边定义同一套 token，再同步到代码。

3. **Night mode 配色是主观建议**，没有用户研究数据支持。改之前建议：A/B 测试（或直接问用户是否觉得"阴间"）。

---

## 七、下一步建议

- 先落地 Phase A（1-2h，低风险），上线后看视觉变化
- Phase B 建议拆成 3 个独立 PR，方便回滚
- Phase C 作为"v2 产品升级"打包做
