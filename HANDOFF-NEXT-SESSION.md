# WeekendGo · 新会话交接文档

> 写给下一次重启的 Claude · 2026-04-21 09:00 GMT+8（更新 8h 大会战收口）
> 读完这个就能接上进度。不读要踩坑。

---

## 🔴 优先级最高：四条红线（违反立即 revert）

1. **XHS 作为内容主源** — `~/.claude/projects/-Users-sherconan/memory/feedback_weekendgo_enrichment_source.md`。WebSearch / Bocha / 百度百科**禁止**作主源，fallback ≤5%。
2. **不编造** — xhsHeat / xhsQuote / description / overview / whatToDo 必须来自真实源。多笔记综合允许，但必须透明标注 "— 综合 XHS..."。
3. **不用付费 API** — `feedback_no_paid_api.md`。所有 AI 调用走免费 / 逆向通道（Gemini Web / ChatGPT Web / Pollinations / 社交抓取）。
4. **禁止主动触发会"弹 Chrome / 抢焦点 / 弹 QR 登录"的工具链** —— `feedback_xhs_no_popup_pipeline.md`。**正确抓手**：`pycookiecheat` 从主 Chrome 抠 cookies → `playwright headless Chromium` 隔离 context 注入 → 零弹窗访问 XHS web。模板脚本在 `xhs-research/batch-harvest-playwright-sz.py`（用 rednote-mcp cookies）。
5. **WeekendGo ChatGPT 生图归档** — `feedback_chatgpt_weekendgo_project.md`。所有 ChatGPT 生图必须放在名为"周末去哪儿玩"的 ChatGPT 项目下。helper 已写：`chatgpt-weekendgo-nav.js`。

---

## 📊 当前状态 snapshot（2026-04-21 收口）

### 🌆 10 城全量 dest 957 + legends 270

| 城 | dest | legends | 图覆盖 |
|---|---|---|---|
| 北京 | 500 | 100 | 既有大部分 |
| 深圳 | 159 | 30 | 既有 |
| 威海 | **54** (+19 本轮 35→54) | 20 | +19 ✅ |
| 苏州 | 60 | 30 | +16 (1030 丝绸博物馆 Gemini timeout 缺) |
| 天津 | **31** (+21 本轮 9→30+) | 15 | +21 ✅ |
| 青岛 | **33** (+20 本轮 13→30+) | 15 | +20 ✅ |
| 成都 | 30 (+18 本轮 12→30) | 15 | +18 ✅ |
| 杭州 | 30 (+20 本轮 10→30) | 15 | +20 ✅ |
| **重庆** 🌶️ | **30 新城** | 15 | +30 ✅ |
| **恩施** 🏞 | **30 新城** | 15 | +30 ✅ |

### 🚀 本 8h 会战 39 commits push 一览（按时间序）

**Web (25 commits)**
- 8 城对齐：bf43227 / ec80777 / b7c0634 / c549318 / d92d85f / b6f2d92
- 加 2 城：651e238 / c675bdf
- 内容：04dbfdf (TJ/QD/CD/HZ +79) / b40571f (ES) / b7a3ad8 (CQ) / ee247cc (CQ+ES legends) / 407c57f (QD legends + Suzhou 图)
- 图：2560bc7 / d30ac41 / 9a7be09 / 473cc85 / 42d458f / d6eaff2 / **53b5c6c (final 158/158)**
- bugs: ad56cf2 / eb0e15d (retry queues)

**Miniapp (14 commits)**
- 8 城对齐 + 防抖 + 隐身根因：4657d90d / 95be338e / 12d5b43e / 44d16d2b / 03063cd0
- 内容 sync: 1ab1f66c / 0e27bbfb / ca1de360 / 224ad174 / 40fcde19 / 1cc6c39d / 533ab849
- 图: 40e58834

### 🚨 14 条本 8h 修的隐身 Bug（按用户感知排序）

1. **app.js:34** preferredCity 白名单锁死 3 城 → CITY_KEYS 10 城（最关键根因，用户切 TJ/QD/CD/HZ/CQ/ES 后重启必回 beijing）
2. **sync-to-miniapp `cityKey.slice(0,2)`** → IMG_PREFIX 字典（7 城 image URL 404 的根因，"图片大面积显示不出来"的锅）
3. **stamp/search tabs** 硬编码 3-4 城 → CITY_KEYS.map 动态
4. **index.wxml otherside-banner** 只 beijing 显示 → cityConfig[currentCity]
5. **legends.js onGoToLinked** city=beijing 写死 → this._city 透传
6. **list.js** 3 处 shadow CITY_KEYS/NAMES/LABELS → cities.js 派生
7. **packageDetail/detail.js** similar 推荐 CITY_KEYS shadow → CITY_CONFIG
8. **全制霸弹窗** CITY_NAMES/EMOJIS 3 城 → CITY_CONFIG
9. **onboarding** 写死 3 城 block → CITIES 动态
10. **web js/app.js** search jumpToResult 写死 beijing → it.city
11. **web legends.js** flip btn 只 beijing 显示 → getCitiesWithLegends()
12. **5 HTML 页**（planner/dest/achievements/stats/compare）漏加 CQ/ES script
13. **seasonal/achievements/recent** 3 JS 模块 SOURCE_VARS 漏 CQ/ES
14. **sw.js** cache v19→v20 + 6 新数据文件 offline 支持

### 🎨 图片：Pollinations 158/158 全量上线

`gen-pollinations-http.ts` HTTP 直调 image.pollinations.ai · 1376×768 photo-realistic editorial 风 · 64-136KB · 0 failed。

**为什么不用 Gemini**：本 session 期间 Gemini Web returned 404（endpoint 改了）跑 22 张才出 3 张。Pollinations HTTP 不依赖 cookies 也不抢 Chrome 焦点，遇 429 会有重试 — 适合大批量 backfill。

### Git / CI / Deploy

- 最新 commit: `53b5c6c` (images final)
- origin/main: ✅ 已推
- Live URL: https://sherconan.github.io/weekend-go/
- GH Actions 最近 3 条全 success

---

## 🛠 本 session 沉淀的工具链

### 1. 双图片 pipeline 并行
- **Gemini Web** (`gen-cdhz-regen.ts` / `gen-suzhou-regen.ts --queue ...`): 走 baoyu-danger-gemini-web skill，有抢 Chrome 焦点风险，质量稍好。**注意** Gemini cookies 过期会触发 AuthError，跑 `python3 refresh-gemini-cookies.py` 重抠。
- **Pollinations HTTP** (`gen-pollinations-http.ts --queue ...`): 纯 HTTP 直调 image.pollinations.ai，零 Chrome 依赖、零 session 抢占，扛得住 429。**这是图片大批量生成的主力管道**。

### 2. 同步脚本（关键）
- `scripts/sync-to-miniapp.js --apply`: web → miniapp 单向同步
- **重要**：IMG_PREFIX 显式映射（不是 cityKey.slice(0,2)）。8 城里 7 城前缀对不上，刚修过。
- CITY_SOURCE_VARS / legendCityFiles 新增城市必须改 2 处。

### 3. XHS 抓手（仍封中）
- `xhs-research/batch-harvest-playwright-sz.py`：proven 跑过 SZ 95/159
- cookies 从 `~/.mcp/rednote/cookies.json`（rednote-mcp 登录后保存的 16 个 cookies），**不是** pycookiecheat 主 Chrome（差 web_session token）
- retry 模板：`xhs-research/retry-smart-sz.py`（带 query 变体 + shuffle 防尾部 rate-limit）

### 4. 加新城基建 checklist（重庆+恩施时验证过）
1. `config/cities.js` CITIES[] 加一项（key/name/emoji/origin/maxRange/hotWords/hasLegends）
2. `~/weekend-go-miniapp/utils/cities.js` CITIES[] 加一项
3. `js/cities-dataset.js` CITY_SOURCE_VARS 加 `'DESTINATIONS_XX'`
4. `scripts/sync-to-miniapp.js`: CITY_SOURCE_VARS + legendCityFiles + **IMG_PREFIX**
5. `js/legends.js` 末尾 if (typeof LEGENDS_XX !== 'undefined') push 分支
6. `index.html` + `dest.html` + `planner.html` + `achievements.html` + `stats.html` + `compare.html` 加 script 标签（data + legends）
7. `js/seasonal.js` + `js/achievements.js` + `js/recent.js` SOURCE_VARS 加映射
8. `sw.js` CORE_ASSETS 加 + 升 CACHE_NAME 版本
9. 新建 `js/data-XX.js` + `js/data-legends-XX.js` stub
10. 跑内容 agent 填 30 dest + 15 legends
11. `node scripts/sync-to-miniapp.js --apply` 同步
12. `git add -A && commit && push`

---

## ⏸ 阻塞到次日（外部依赖）

### XHS 封禁
- 距首封 ~10h（晚上 21:00 封，凌晨 1:00 还封）
- 通常 12-24h 解，**今早起来再 probe `playwright headless + ~/.mcp/rednote/cookies.json` 跑 `大梅沙海滨公园 攻略`**
- 解了之后立即跑 `xhs-research/batch-harvest-playwright-sz.py` 模板对：BJ 55 gap (`xhs-research/bj-gaps-queue.json`) + SZ 60 gap (`xhs-research/sz-retry-queue.json`) + 给新 158 dest 做 xhsQuote 归因

### WeChat DevTools 体验版上传
- 用户需扫码重登 WeChat DevTools
- 然后 `cli upload --project ~/weekend-go-miniapp --version 1.6.0 --desc "10 城 957 dest + 适配大修"`

### Suzhou 1030 丝绸博物馆缺图
- Gemini 3 连 240s timeout 跳过
- 下次跑 Pollinations 一发就好

---

## ⚠️ 本 session 新增踩坑录

1. **content agent socket 断 + watchdog stall**：CQ dest 写 30 条规模，agent 连续 2 次失败（socket closed + 600s watchdog）。**结论**：30+ 条规模建议 inline 写，不要赌 agent。
2. **Pollinations rate-limit 429**：单 IP 跑 200+ 张会触发，约 1h 解。可双 process 并发但都会 429。**最好 batch ≤ 100 + 间隔 1.5s**。
3. **Gemini Web endpoint 偶尔 404**：CD/HZ 22 张跑出 3 张，后 19 张连 404 fail。可能 endpoint 路径短期失效，等几小时或刷 cookies。
4. **JS 字符串内嵌中文双引号**：`由"永宇美学"改造` 看似中文双引号实际被 JS parser 当 ASCII " — 用 `「永宇美学」` 中文角括号或转义。
5. **agent 5 个 city 的 7 个 letter prefix 错**：cityKey.slice(0,2) 对 5/8 城都不对（tianjin→ti、qingdao→qi、chengdu→ch、hangzhou→ha、weihai→we、shenzhen→sh、beijing→be 全错），只有 suzhou→su 巧合。

---

## 🎯 接手建议（按优先级）

### P0：明早 XHS 解封后立即做
1. probe XHS：`python3 -c "..."` (cookies + playwright headless 跑大梅沙)
2. 解了就批量跑 BJ 55 + SZ 60 + 新 158 dest 的 xhsQuote 归因
3. apply + commit + push 一把

### P1：用户扫码重登 WeChat DevTools 后
1. 上传 v1.6.0 体验版
2. 扫码体验，验证 10 城 + 957 dest + 270 legends 全显示

### P2：Pollinations 限制解后
1. Suzhou 1030 丝绸博物馆补图（单张）

### P3：内容打磨（用户偶尔会让做）
- BJ 348 dest 的 xhsQuote 现在 293/348（85%），剩 55 条结构性无货，要破红线用 Bocha
- TJ/QD/CD/HZ/CQ/ES 6 城每城 30 条，可以再补到 50 条提升内容密度
- legends 量不均（QD 15/BJ 100），可以补 QD/TJ/CD/HZ/CQ/ES 到 20-30

### P4（外部依赖：得用户拍板）
- 破红线 5%：BJ 55 + SZ 60 + ?新 158 用 Bocha fallback 给 xhsQuote 兜底（user 明确点头）
- 加新城（用户偶尔会想加）

---

## 📞 外部联系

- 用户 Discord: chat_id `1484568024311922728`
- Live site: https://sherconan.github.io/weekend-go/
- 用户时区: GMT+8
- 用户习惯：产品视角不看代码，要真实数据不要 demo；弹窗会直接吐槽；"非常多功能显示不对"要 audit 找隐身根因不是表面修
- 用户偏好：commit message 中文 + 明确"顶层设计 / 底层逻辑 / 抓手 / 闭环 / 颗粒度"的 Alibaba 风格

---

## 底层逻辑沉淀

本 8h 大会战拉通的核心抓手：
- **单一注册表**：cities.js → 所有 UI / sync / image URL / data load 全派生
- **零弹窗 image gen**：Pollinations HTTP 是首选，不要碰 Gemini/ChatGPT 抢焦点
- **隐身 bug 找法**：grep `'beijing'\|'shenzhen'\|'weihai'\|CITY_KEYS\s*=` 跨 web + miniapp + scripts，shadow 硬编码全清
- **db backfill 路径**：先建 stub + 改基建 → 跑内容 agent → 同步 → commit per-city，最坏 agent 死了 inline 顶上

跨 session 看，本次最重要遗产：**重新建立了 image gen 的备份路径**（Pollinations 直 HTTP）。下次任何 image batch 直接用，不要再赌 Gemini Web。
