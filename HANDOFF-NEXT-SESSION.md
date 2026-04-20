# WeekendGo · 新会话交接文档

> 写给下一次重启的 Claude · 2026-04-20 02:30 GMT+8
> 读完这个就能接上进度。不读要踩坑。

---

## 🔴 优先级最高：三条红线（违反立即 revert）

1. **XHS 作为内容主源** — `~/.claude/projects/-Users-sherconan/memory/feedback_weekendgo_enrichment_source.md`。派 enrichment agent 必须显式约束用 `rednote-mcp` / `xiaohongshu-search-summarizer` / `xhs-explore` / `xhs-content-ops`，**禁止 WebSearch / Bocha / 百度百科** 作为主源。WebSearch fallback 允许但 ≤5%。本 session 踩过 3 次 — 派 agent 用 WebSearch 后又 revert。
2. **不编造** — xhsHeat / xhsQuote / description / overview / whatToDo 必须来自真实 XHS 笔记。多笔记综合允许（memory 明确写 summarize vibe from posts），但必须透明标注 "— 综合 XHS..."
3. **不用付费 API** — `feedback_no_paid_api.md`。所有 AI 调用走免费 / 逆向通道（Gemini Web / ChatGPT Web / Pollinations）。

## 📊 当前状态 snapshot（2026-04-20 02:30）

### 数据深度（content audit）

本 session **从 UI feature 切换到内容深度**后，XHS enrichment 状态：

| 城 | dest | XHS% | Commit | 状态 |
|---|---|---|---|---|
| 天津 | 9/9 | 94% | `c580368` | ✅ 完成 |
| 青岛 | 10/10 | 92% | `a0e9cc8` | ✅ 完成 |
| 杭州 | 10/10 | 95% | `95608f6` | ✅ 完成 |
| 成都 | 12/12 | 98% | `1bcca07` | ✅ 完成 |
| 苏州 | 60/60 | 98.7% | `0e9d6b4` | ✅ 完成（30 直引 + 30 综合） |
| 威海 | 31/31 | 95% | `bbf30f8` | ✅ 完成（22 直引 + 9 综合） |
| **小城累计** | **132 dest** | | | |
| 深圳 | 159 | — | — | ❌ 未启动（xhsQuote 156/159 空） |
| 北京 | 498 | — | — | ❌ 未启动（xhsQuote 498/498 全空）**最大缺口** |

### Git / CI / Deploy

- 最新 commit: `bbf30f8` (WH XHS)
- CI smoke: ✅ green
- full-city-smoke: 799 dest 全部 render > 0
- Remote: `git@github.com:sherconan/weekend-go.git` 已推
- Live URL: https://sherconan.github.io/weekend-go/

### 工作区状态

- ✅ `js/data-{city}.js` 全部 clean
- 未 tracked: `HANDOFF-NEXT-SESSION.md`（本文件）、`scripts/audit-*.js`、backup dirs
- `xhs-research/` 下有 `xhs_data.json` 采集结果可复用

---

## ⏭ 下一步工作清单（按优先级）

### P0 · BJ 498 dest xhsQuote/xhsHeat 补齐（最大内容缺口）

- 当前状态：xhsQuote 0/498、xhsHeat 0/498，其他字段相对充实
- **分批策略**：498 太大，不能单 agent。推荐分 10 批，每批 50 dest，并行跑
- 文件散落在 8 个 js file: `data.js` / `data-extra.js` / `data-extra2.js` / `data-beijing-500.js` / `data-beijing-expand.js` (empty) / `data-beijing-hidden.js` / `data-beijing-tales.js` / `data-beijing-new2026.js`
- 建议按文件派 agent（每文件一个 agent）

### P1 · SZ 159 dest XHS 深度补齐

- description avg 64 字（浅）、overview avg 143 字（浅）、whereToEat avg 101 字（边界）、xhsQuote 3/159
- 可一次性派单 agent 处理 159 条

### P2 · 外部阻塞（非本 session 可解决）

- **CD/HZ 22 张图片**：ChatGPT "Image Generation Limit" 未解封（明早 quota reset 再试）
- **小程序 v1.5.0 体验版上传**：WeChat DevTools 登录过期，需扫码重登

### P3 · 已交付 feature 的打磨（非紧急）

- Planner ICS 时区 bug：用 `new Date().toISOString().slice(0,10)` UTC 切，跨日用户选日期被切到前一天。改 local date。
- index.html inline styles 抽 CSS var：主页 dark mode 有几处 inline color 未被 theme 覆盖。
- Dest detail 传说关联逻辑松：description 包含 dest.name 即匹配，偶尔带出不相关提及。

---

## 🛠 工具链索引

### XHS enrichment agent 模板（复用）

派 agent 时必包含以下约束 prompt：

```
**绝对红线**：
1. 禁止 WebSearch / Bocha / 百度百科 — 除非 XHS 返回 0
2. 禁止编造 xhsHeat/xhsQuote/description/overview/whatToDo
3. 必须用 XHS skills: rednote-mcp / xiaohongshu-search-summarizer / xhs-explore / xhs-content-ops
4. 每条 dest 至少 3 条真实 XHS 笔记
5. 保留 id/name/subtitle/distance/rating/budget/themes/gradient/transport/duration/howToGet/bestSeason/highlight/tags/imageQuery

**字段目标**：
- description 60-80字：XHS 第一人称
- overview 150-200字：多笔记综合
- whatToDo 200-300字：带真实价格清单
- whereToEat / whereToStay / tips 100-150字
- xhsQuote：「...」直接引用 或 "— 综合 XHS..."
- xhsHeat: {heat, notes, trending, tier}

**报告 JSON**：{processed, xhsNotesRead, directQuotes, synthesized, syntaxOK, sourceBreakdown}

开工前 Read pua SKILL.md（Glob **/pua/skills/pua/SKILL.md）
```

### 关键 scripts

- `scripts/audit-content-depth.js` — 跑一次看哪个城哪个字段浅
- `scripts/weekend-go-helper.js full-city-smoke` — 回归测试 799 dest render
- `scripts/sync-to-miniapp.js --apply` — 同步数据到 miniapp
- `scripts/gen-sitemap.js` — 重新生成 sitemap.xml

### Agent 审查流程

agent 完成后审 transcript：
```bash
grep -oE 'xiaohongshu-search-summarizer|xhs-explore|xhs-content-ops|WebSearch|rednote' \
  /private/tmp/claude-501/-Users-sherconan/{session}/tasks/{agent-id}.output | sort | uniq -c
```

XHS 工具调用占比 ≥90% 才 commit。否则 `git checkout js/data-{city}.js` revert。

### Commit message 模板

```
enrich({city}, XHS-source): {N}/{total} dests · {XHS%}% 合规 · {direct}直引+{synth}综合

Agent transcript: N rednote + M xhs-skills + K WebSearch fallback
样本: {dest-name} 点赞数 / tier

红线守住: 0 编造 · 保留所有原字段
```

---

## 🗂 Session 已交付全景（17 深度 feature + 6 城 XHS）

### Feature 层（commit hash）

1. Trip Planner (`a8c84a1`) — 1-3 日智能行程
2. Dest 独立详情页 (`bf43265`) — `dest.html?id=X`
3. SEO sitemap + modal 联动 (`d502797`)
4. Search 2.0 多 token + facet (`4301497`)
5. PWA v14 离线 + install prompt (`07cc568`)
6. Stats v2 SVG 地图 + timeline (`c72180b`)
7. Dest hero image + OG (`1283620`)
8. Search 2.1 distance/budget/city slider (`0b281d3`)
9. Planner v2 2-city multi (`6961839`)
10. Dark mode toggle (`de5ddd1`)
11. Compare 3-dests (`e208a41`)
12. Achievements 徽章系统 (`7b85dd6`)
13. Stats v3 季节柱状图 + 数据质量 (`1b772f3`)
14. Planner v3 N-city TSP (`2938552`)
15. Planner ICS + Home 最近打卡 (`c2f2537`)
16. 季节推荐引擎 + Dest 跨城同类 (`6eeb297`)

### Content 层（XHS enrichment）

17. 6 小城 132 dest XHS 真数据（见上表）

### CI + 基础设施

- `.github/workflows/smoke.yml`：全局 smoke test 每 push 跑
- schema validator、shared-facet check、cache-bust check
- sitemap.xml 665 URLs · robots.txt · manifest shortcuts
- sw.js v19 离线 precache 所有 JS + HTML

---

## ⚠️ 踩过的坑（别再踩）

1. **忘查 memory 就派 agent** — 前 4 个 WebSearch agent 全部 revert。**派 agent 前必 Read `~/.claude/projects/-Users-sherconan/memory/feedback_weekendgo_enrichment_source.md`**
2. **SW cache 劫持旧 JS** — Search 2.1 开发时清 SW cache 花了 15 min 定位。当改 inline script/JS 后浏览器验证前先 `caches.keys().then(ks=>Promise.all(ks.map(k=>caches.delete(k))))`
3. **const 不 attach 到 window** — 跨 script 桥接必须用 `(0, eval)('typeof X !== undefined ? X : undefined')`，参考 `feedback_bare_vs_window_globals.md`
4. **AppleScript execute javascript 在 isolated world** — 读页面全局变量（CITIES / DESTINATIONS_*）返回 undefined。测试时要么通过 DOM 交互（click）间接触发，要么用 `document.*` 纯 DOM API。
5. **Discord allowlist 时好时坏** — 频道 `1484568024311922728` 的 reply 允许状态间歇性失效，重要汇报同时写到本文件避免丢失。

---

## 🎯 接手建议（3 个抓手）

1. **立即做**：BJ 498 xhsQuote/xhsHeat 分 8-10 批 XHS agent 并行。Day 1 能多补 150-200 dest。
2. **下一步**：SZ 159 dest XHS（单 agent 可跑）。
3. **有配额时**：重启 CD/HZ 22 张图片生成，走 Gemini Web / ChatGPT Web 逆向。

**底层逻辑**：产品核心 = 799 dest × 内容深度。UI feature 饱和（17 个已交付），现在只有堆内容密度才产生边际效应。

---

## 📞 外部联系

- 用户 Discord: chat_id `1484568024311922728`（有时 allowlist 丢需走主 session 回）
- Live site: https://sherconan.github.io/weekend-go/
- 用户时区: GMT+8
- 用户习惯：产品视角不看代码，要真实数据不要 demo
