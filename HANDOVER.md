# WeekendGo 交接文档
> 更新时间：2026-04-15 01:00

## 当前状态

| 模块 | 状态 |
|------|------|
| 另一面传说图片 | ✅ 100/100 |
| 目的地图片 | ✅ 38 张 Pollinations 已用 Google Gemini 重生成，+5 张新目的地图已补 |
| SVG 占位文件 | ✅ 38 个全部清理 |
| XHS Voices（小红书真实笔记） | ✅ 154 个目的地 × 3 条 = 462 条，覆盖全部 Tier S+A |
| GitHub Pages | ✅ 线上 https://sherconan.github.io/weekend-go/ |
| 最新 commit | `77c94a2` |

---

## 今晚（2026-04-14 → 04-15）完成的 9 个 commit

| # | Commit | 内容 |
|---|--------|------|
| 1 | `1851655` | 删除 38 个无用 SVG 占位文件 |
| 2 | `05dafd6` | 用 Google Gemini (gemini-3-pro-image-preview) 重生成 38 张 Pollinations 替换图 |
| 3 | `8537b2d` | 5 张新目的地图 + `js/images.js` 映射（百花深处胡同 / 菜市口 / 段祺瑞 / 地下城 / 景山崇祯）|
| 4 | `d2fb305` | XHS Voices Pilot：3 个目的地（环球影城/古北/慕田峪）+ UI 模块 + CSS |
| 5 | `16c5b91` | Batch 1：+29 目的地 |
| 6 | `b1d2fa8` | Batch 2：+30 目的地 |
| 7 | `2c2ac62` | Batch 3：+30 目的地 |
| 8 | `87ba70a` | Batch 4：+5 目的地（XHS 反爬触发） |
| 9 | `77c94a2` | Batch 5：+57 目的地，切 rednote-mcp 拿完剩余 S+A |

---

## XHS Voices 技术栈

### 数据源双通路
1. **xiaohongshu-skills (xhs-explore CLI)** — 带封面图（`assets/xhs/*.webp`），走浏览器扩展
   - 单次批量 ~100 搜索后会触发 `__INITIAL_STATE__` 超时风控
   - 路径：`~/xiaohongshu-skills/scripts/cli.py search-feeds --keyword "X攻略"`
2. **rednote-mcp** — 带 `excerpt` 文字摘录，无封面图
   - 不走浏览器，未见风控
   - 调用：`mcp__rednote-mcp__search_notes`

### 数据结构（`js/xhs-voices.js`）
```js
const XHS_VOICES = {
  "目的地名": [
    {title, author, likes, cover?: "assets/xhs/...", excerpt?: "...", url},
    ...
  ]
};
```
- `cover` 存在 → 图文卡
- `excerpt` 存在 → 文字卡（粉色渐变背景）

### UI 渲染
- 入口：`js/app.js` 的 `openDetail(id)` 末尾追加 `modal-xhs-voices` 段
- 样式：`css/styles.css` 文件末尾 `.modal-xhs-voices` 块 + `.xhs-voice-card--text` 变体
- 调 `getXhsVoices(dest.name)` 得 voices 数组

### 复用脚本
| 脚本 | 用途 |
|------|------|
| `xhs-research/batch-harvest.py` | xhs-explore 批量抓取（`OUT_DIR=... python3 ... queue.json 30`） |
| `xhs-research/pilot-harvest.sh` | 3-dest pilot demo |

---

## 待完成（按优先级）

### 🔴 Tier B 档 XHS Voices（~180 个目的地）
- heat 50-69 的 B 档目的地
- 仍未采集 voices
- 推荐用 `rednote-mcp` 走 subagent 批处理（昨晚 57 条 40 分钟跑完，不卡风控）
- 目标：总覆盖率从 154/693 提到 ~330/693（~50%）

**执行步骤**：
1. 运行下面这段拿 B 档待办 queue：
```js
// /tmp/extract-b-queue.js
const fs = require("fs");
const done = new Set(Object.keys(eval("(" + fs.readFileSync("/Users/sherconan/weekend-go/js/xhs-voices.js","utf8").match(/const XHS_VOICES = (\{[\s\S]*?\n\});/)[1] + ")")));
const src = fs.readFileSync("/Users/sherconan/weekend-go/js/xhs-data.js", "utf8");
const rx = /"([^"]+)":\s*\{\s*heat:\s*(\d+),\s*notes:\s*"([^"]+)",\s*trending:\s*"([^"]+)",\s*tier:\s*"([SABCD])"/g;
const list = []; let m;
while ((m = rx.exec(src)) !== null) list.push({name: m[1], heat: +m[2], tier: m[5]});
const bTier = list.filter(x => x.tier === 'B').sort((a,b) => b.heat - a.heat);
const seen=new Set(), uniq=[];
for (const x of bTier) { if (!seen.has(x.name)) { seen.add(x.name); uniq.push(x); } }
const dataFiles = fs.readdirSync("/Users/sherconan/weekend-go/js/").filter(f => /^data[\w-]*\.js$/.test(f));
const valid = new Set();
for (const f of dataFiles) { const s = fs.readFileSync("/Users/sherconan/weekend-go/js/" + f, "utf8"); const rx2 = /name:\s*"([^"]+)"/g; let mm; while ((mm = rx2.exec(s)) !== null) valid.add(mm[1]); }
const pending = uniq.filter(x => !done.has(x.name) && valid.has(x.name));
fs.writeFileSync("/tmp/rednote-b-queue.json", JSON.stringify(pending, null, 2));
console.log("B tier pending:", pending.length);
```
2. 派 subagent 带 `mcp__rednote-mcp__search_notes`，prompt 模板参考今晚 batch 5 的（HANDOVER.md 仅说明，具体已归档在 commit `77c94a2` 历史里）

### 🟡 小程序端同步
- `~/weekend-go-miniapp` 还没引入 `xhs-voices.js` 和对应 UI
- 需要把数据结构和渲染移植成小程序的 wxml/wxss
- AppID `wx0b74dd706ede4b84`

### 🟢 新加城市
- 目前：北京 ~530 + 深圳 159 + 威海 35
- 候选：成都 / 杭州 / 苏州 / 上海

---

## 关键文件清单

```
weekend-go/
├── index.html              # 主页（script 引用顺序已加 xhs-voices.js）
├── js/
│   ├── data*.js            # 目的地数据（10 个文件，693 条）
│   ├── xhs-data.js         # 752 条 XHS 热度分级
│   ├── xhs-voices.js       # ⭐ 154 条真实笔记数据（本次新增）
│   ├── images.js           # 724+5 条图片映射
│   ├── stamp-designs.js    # 盖章映射
│   ├── legends.js          # 另一面传说
│   └── app.js              # 详情弹窗在 openDetail() 追加了 XHS voices 渲染段
├── assets/
│   ├── images/             # 718 张目的地 webp
│   ├── legends/            # 100 张另一面 webp
│   └── xhs/                # ⭐ 291 张 XHS 封面 webp（前 97 个目的地用，新增）
├── css/styles.css          # ⭐ 末尾加了 modal-xhs-voices 和 xhs-voice-card 样式
├── xhs-research/
│   ├── batch-harvest.py    # ⭐ xhs-explore 批量脚本
│   ├── pilot/              # 3 个 pilot 的原始 JSON
│   ├── batch1-4/           # 四批原始搜索结果
│   └── rednote-harvest.json # ⭐ rednote-mcp 57 条汇总
└── HANDOVER.md             # 本文件
```

---

## Gemini 图片生成（以备后续补图）

| 工具 | 用途 |
|------|------|
| `gen-missing-google-batch.ts` | ⭐ 新增，读 `gen-all-missing.ts` 的 prompt 列表，用 Google Gemini 官方 API |
| `gen-5-new-destinations.ts` | ⭐ 新增，5 张新目的地图的硬编码脚本 |
| `gen-all-missing.ts` | 原版（baoyu-danger-gemini-web，cookie 已失效） |
| `gen-replace-svgs.ts` | 原版，SVG 替换的完整 prompt 清单 |

**Google Gemini 配置**：
- API key 硬编码在 `gen-missing-google-batch.ts` 中：`AIzaSyBEKl7SnAM4CeIUzbxJknS6ZqCqBoTNaR8`
- 默认模型：`gemini-3-pro-image-preview`（付费，约 $0.04/张）
- 可通过 EXTEND.md 切换到 `gemini-2.0-flash-preview-image-generation`（免费）

---

## 线上地址

- Web 版：https://sherconan.github.io/weekend-go/
- 小程序：AppID `wx0b74dd706ede4b84`（repo: sherconan/weekend-go-miniapp）

## 联系

下一个接棒的 agent 可以直接 commit `77c94a2` 为起点，B 档的 queue 抽取脚本见上。
