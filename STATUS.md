# weekend-go · 当前状态 (2026-05-25)

> 单一现在时入口文档。历史 handoff/sprint 归档到 `docs/archive/`。

## 实时数据

| 项 | 数值 |
|---|---|
| Live URL | https://sherconan.github.io/weekend-go/ |
| 城市数 | 10 (bj/sz/wh/su/tj/qd/cd/hz/cq/es) |
| dest 图总数 | 807 (10 城 dest-{city}-*.webp) |
| Codex 合规率 | bj 71% · sz 60% · wh 62% · su 53% · qd 41% · hz 40% · es 36% · cd 30% · cq 20% · tj 13% |
| legends 图 | bj 100 (待重生) · 9 城 0 (待新生) |
| SW 版本 | v29 (nuclear cache reset + auto-reload) |
| IMAGE_CACHE | v9 (R5 batch close) |

## 自动化基建 (本工程独有 SOP)

- `scripts/build-p0/p1/p3-queue.js` — dest queue 生成
- `scripts/build-legends-queue.js` — 9 城 legends queue (170)
- `scripts/build-bj-legends-queue.js` — bj legends queue (100, new)
- `scripts/run-codex-regen.py` — Codex CLI image2 唯一执行器
- `scripts/auto-commit-loop.sh` — 自动 commit + push + SW final bump (60s 间隔避 GH Pages rate-limit)
- `scripts/deploy-image-batch.sh` — 一键完整闭环

## 待办 (按优先级)

1. **P0 dest 余 ~121 张**：tj 26 / cq 24 / qd 30 / hz 18 / es 19 / cd 21 / su 28 (R6 19:36 PM auto)
2. **P1 9 城 legends 170 张**：data 齐全无图,产品 "另一面" 模式刚性需要 (R6 同批跑)
3. **P2 bj legends 100 张**：当前 41KB 旧 Pollinations,重生为 Codex Ghibli 暗黑都市传说风
4. ~~功能缺憾 B3/C2/C3~~ ✅ 已闭环

## 红线 (违反立即 revert)

1. **只用 Codex CLI image2** (禁 Gemini/ChatGPT/Pollinations) — 全局规则
2. **push 间隔 ≥60s** — 避 GH Pages deploy rate-limit (历史教训: 4 个 deploy 失败)
3. **CACHE_NAME bump 必须 v++** — 否则 SW cache 顽固 (历史教训: 浏览器卡 v27 SW 多 hop)
4. **JS 字符串内嵌引号用「」全角** — ASCII " 嵌入字符串会 SyntaxError (历史教训: 数据层炸过一次)

## Scheduled Tasks

- `weekend-go-round6-codex-1936pm` @ 19:36 PM 2026-05-25 — dest + legends 9 城 双管并跑

## 历史归档

20 个旧 HANDOFF / SPRINT / AUDIT → `docs/archive/`
最新主线 README → `README.md`
关键审计 → `LEGENDS-AUDIT-2026-05-25.md`
