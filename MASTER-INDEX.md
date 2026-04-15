# WeekendGo MASTER-INDEX
> 一句话起手：`cat HANDOVER.md && cat MASTER-INDEX.md`
> 更新：2026-04-15 10:15 · 基线 commit `bd5d5aa`

## 一、你是谁 · 你在哪
- 项目：`/Users/sherconan/weekend-go`（线上 https://sherconan.github.io/weekend-go/）
- 上家交接：HANDOVER.md（数据/架构/历史）。本文件只讲"下一步干什么、怎么开跑"。
- 用户偏好：产品人，不看代码，要结果；端到端自验证；批量完成再汇总；不在时用 Discord 通知。

## 二、下一步优先级（按序执行，不要问）

### 🔴 P0 — Tier B XHS Voices 批量采集（~180 目的地）
**目标**：覆盖率 154/693 → ~330/693（50%）
**通路**：`mcp__rednote-mcp__search_notes`（无风控，已验证 57 条 40 min 跑完）
**交付**：追加到 `js/xhs-voices.js` 的 `XHS_VOICES` 对象，同一 commit 推 GitHub Pages。

**一键开跑**：
```bash
cd ~/weekend-go
# 1. 抽 B 档待办队列（输出到 /tmp/rednote-b-queue.json）
node -e "$(sed -n '80,95p' HANDOVER.md | sed 's/^```js$//;s/^```$//')"
# 2. 查队列长度
cat /tmp/rednote-b-queue.json | node -e "console.log(JSON.parse(require('fs').readFileSync(0)).length)"
# 3. 起 subagent 批处理（模板见 §四）
```

### 🟡 P1 — 小程序端 XHS Voices 移植
- 目录：`~/weekend-go-miniapp`（AppID `wx0b74dd706ede4b84`）
- 移植 `js/xhs-voices.js` → wxml/wxss；详情页加 voices 区块
- 参考 Web 端 `js/app.js` 的 `openDetail(id)` 末尾渲染段

### 🟢 P2 — 新城市扩容
候选：成都 / 杭州 / 苏州 / 上海。走现有数据生成 → 图片（Gemini）→ 盖章 → XHS 的流水线。

## 三、关键文件地图（30 秒读懂）

| 文件 | 用途 | 本次会改吗 |
|------|------|-----------|
| `js/xhs-voices.js` | ⭐ 154 → 目标 330+ 条 voices | **✅ 追加** |
| `js/xhs-data.js` | 752 条热度分级（读取 tier） | 只读 |
| `js/data*.js` | 693 条目的地数据（10 文件） | 只读 |
| `js/app.js` | `openDetail()` 渲染 voices | 只读 |
| `css/styles.css` | `.modal-xhs-voices` 样式块 | 只读 |
| `xhs-research/rednote-harvest.json` | 上批 57 条原始数据（模板） | 参考格式 |
| `xhs-research/batch-harvest.py` | xhs-explore 方案（已失效备胎） | 不用 |

## 四、Subagent 批处理 Prompt 模板

```
任务：给 weekend-go 项目 Tier B 目的地批量抓取小红书笔记并写入 js/xhs-voices.js

输入：/tmp/rednote-b-queue.json（[{name, heat, tier}]）
工具：mcp__rednote-mcp__search_notes，关键词格式 "{name} 攻略"

每个目的地：
1. search_notes(keyword="{name} 攻略", limit=5)
2. 取点赞/收藏最高的 3 条，抽取 {title, author, likes, excerpt, url}
3. excerpt 取 note 正文前 80 字
4. 失败跳过，不重试

输出：
- 原始汇总 → xhs-research/rednote-batch-b.json
- 追加到 js/xhs-voices.js 的 XHS_VOICES 对象（不要覆盖已有 key）
- 完成后 git add/commit/push，msg："XHS Voices batch B: +N destinations"

验收：线上 https://sherconan.github.io/weekend-go/ 随机抽 3 个 B 档目的地打开详情，能看到 voices 卡片。
```

## 五、边界与红线
- **禁止 mock 数据**；抓不到就跳过，不编造笔记
- **禁止猜 API**；rednote-mcp 工具参数以 ToolSearch 返回的 schema 为准
- **端到端验证**：commit 后 fetch 线上 `js/xhs-voices.js` 确认已更新
- **不要动** `js/data*.js` / `js/xhs-data.js` / `css/styles.css` / `js/app.js` 的结构
- Gemini 图片 API key 在 `gen-missing-google-batch.ts`（付费，谨慎触发）

## 六、未 commit 的现状（2026-04-15 10:15）
```
 M xhs-research/batch-harvest.py      ← 上轮调试痕迹，可忽略
?? xhs-research/xhs_data.json          ← 上轮中间产物，可忽略
?? xhs-research/batch1/96e1e7c4.json   ← 上轮中间产物，可忽略
?? prompts-legends-041-050.txt         ← 图片 prompt 草稿，可忽略
```
开工前不用清理，直接新建 `xhs-research/rednote-batch-b.json` 即可。

## 七、完成汇报模板
做完向用户发 Discord，模板：
```
✅ WeekendGo Tier B XHS Voices 批量完成
- 新增：X 个目的地 × 3 条 = Y 条笔记
- 总覆盖：(154+X)/693 = Z%
- Commit：<hash>
- 线上验证：已 fetch 确认 js/xhs-voices.js 更新
- 最脆弱 3 点：<列 3 条自检风险>
```
