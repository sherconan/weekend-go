# WeekendGo · 10h Sprint 复盘 · 2026-04-19

> 从用户出门爬山说"继续做不要停"开始，到当前为止的全量产出审计。

---

## 📊 数据总账（Before → After）

| 维度 | 开始 | 现在 | Δ |
|------|------|------|---|
| 城市数 | 3（BJ/SZ/WH）| **8**（+SU/TJ/QD/CD/HZ）| +5 |
| 目的地总数 | ~693 | **799**（去重后）| +106 净增 |
| 另一面传说 | 100（仅 BJ）| **231**（8 城）| +131 |
| Shared 跨城景点 | 0 | **5**（栈桥/崂山/八大关/泰山/滨海图书馆）| +5 |
| 生图覆盖 | 162/234 | **234/234** + 43/60 Suzhou + 16/22 CD/HZ pending | ~86% |
| 小程序城市同步 | 3 | 8 | +5 |
| 小程序传说同步 | 1 | 8 | +7 |

## 🧱 架构演进（3 大刀）

### Phase 1 · 单 CITIES 注册表
- `config/cities.js` + `utils/cities.js`（miniapp 同构）
- 加一座城市从触碰 25 处 → 触碰 4 处（新城 + data 文件）
- Bridge：`cities-dataset.js` 自动派生 CITY_DATA / SEARCH_HOT_WORDS / city-selector HTML
- 实测证明：天津 / 青岛 / 成都 / 杭州 4 城新增均走此路径

### Phase 2 · Cross-city Shared Facet
- `data-shared-cross-city.js` — 同一景点多城共享 `cities: {beijing:{distance,duration,transport}, weihai:{...}}`
- 5 条 shared entry 覆盖 8 城（跨城重名 0 duplication）
- Bridge `_buildSharedForCity(cityKey)` 展平到顶层字段

### Phase 2 C · 源数据清理
- BJ intra-city 58 + cross-city 10 = 68 条 shadowed entries 删除
- Pre-sprint duplication rate 7.4% → post 0%

## 🔧 工具链基础设施

### `scripts/weekend-go-helper.js`（8 commands）
- `bump-cache` / `next-dest-id` / `next-legend-id` / `scan-skeletons` / `cross-city-check` / `chrome-verify` / `full-city-smoke` / `dedup-report`

### `scripts/sync-to-miniapp.js`
- Web `data-*.js` 聚合 → Mini `utils/data.js` 单 JSON
- 6-cities map → 8-cities map（CD/HZ 本轮加入）

### `scripts/clean-shared-source.js`
- Dead-code 条目自动清理（shared 覆盖的源副本）

### `scripts/merge-intra-city-bj.js`
- BJ data-beijing-500 vs expand 自动 dedup（58 条）

### `.github/workflows/smoke.yml`（新）
- 每 push 自动跑 6 个 job：syntax / CITIES / vars / schema / shared-facet / cache-bust
- 防 Phase 1 类"silent broken"潜伏 bug 再爆

## 🔴 抓到的真 bug（6 个全修）

1. **legends.js 缺 cache-bust**（B2 自测发现）
2. **helper.nextLegendId 用全 key 做 prefix**（应是 2 字缩写）
3. **helper.scanSkeletons 对无 export 老数据文件失败**（vm.runInNewContext 不捕获 const）
4. **cities-dataset.js bridge window[name] 不读 const globals**（Phase 1 潜伏 bug，Phase 2 暴露）
5. **stats.html 同一 bug 再现**（第一版 totD=51，修同样手法）
6. **BJ B4 agent 编造数据**（xhsHeat 从 rating 派生 / xhsQuote 从 description 切）— revert + 严格 retry

**规律**：3 次踩同一个坑 = Chrome 非 module script 中 `const` 不 attach 到 window。现在已入档 `feedback_bare_vs_window_globals.md`。

## 📦 Plugin · weekend-go-toolkit v0.2.0

7 skills · 符合 Claude Code 官方 plugin 规范（对标 pua / context-mode）：
- `.claude-plugin/plugin.json` v0.2.0
- `.claude-plugin/marketplace.json` (publish-ready)
- `CLAUDE.md` (plugin-level policy)
- `USAGE-WORKFLOW.md` (7 scenario flows)
- `HELPER-REFERENCE.md` (8 commands)
- `ROADMAP.md` (21 weakest points)
- `CHANGELOG.md`

实测通过：A1 / B1 / B2 / B3 / B4 / C2 · C1 待 quota 恢复

## 🌐 对外 Landing

**https://sherconan.github.io/weekend-go/stats.html**
- 4 hero stats 实时计算
- 8 city cards
- 5 shared facet cards
- 6 架构亮点

## ⏱ 10h 任务完成表

| # | 任务 | 状态 | 证据 |
|---|------|------|------|
| H1 | 3 城 legends (45 条) | ✅ | 3477f02 / ece73bb / 5657196 |
| H2 | 泰山 shared 合入 | ✅ | c015150 |
| H3 | BJ B4 strict (50) | ✅ | cb3f688 |
| H4 | CD/HZ 图 22 张 | 🔒 quota blocked | 明日 retry |
| H5 | Mini upload | 🔒 WeChat 登录过期 | 待扫码 |
| H6 | Design Phase A | ✅ | 7eeab85 |
| H7 | BJ tales 100 条 | ✅ | b90b708 |
| H8 | CI smoke workflow | ✅ | b85c98f |
| H9 | Landing stats.html | ✅ | 7bea5b9 + 29e3339 |
| H10 | 本文档 | ✅ in progress |

**8 交付 / 2 外部阻塞 / 0 未完成**

## 🎯 Memory 长期入档（跨会话持久）

- `feedback_no_paid_api.md` — 不走付费 API
- `feedback_bare_vs_window_globals.md` — const 跨 script 用 eval fallback
- `feedback_no_external_pr_mentions.md` — 不提他人 PR / repo
- `project_weekend_go.md` — 项目全景（会更新）

## 🔭 下一轮（明日配额重置后自动启动）

1. **Suzhou 17 + CD/HZ 22 = 39 张图片补齐**（双通道并行）
2. **BJ 剩余 ~100 条 enrich**（data-extra / extra2 / new2026 未跑过）
3. **WeChat 体验版 v1.5.0 上传**（等你重登）
4. **Phase 3 explore**：AI 推荐 / 行程规划 / 打卡社区
