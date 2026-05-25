# LEGENDS (传说) 图集合规审计 · 2026-05-25

## 概况

| 类目 | 数据条数 | 现有图 | 大图(>200K) | 缺口 | 状态 |
|------|---------|--------|-------------|------|------|
| **bj 都市奇谈** (data-beijing-tales.js) | 100 | 100 | **0** | 100 张全要重生 | ❌ 全 41KB 旧 Pollinations |
| **9 城传说** (data-legends-*.js) | 170 | **0** | 0 | 170 张全要新生 | ❌ 数据齐全无图 |
| **TOTAL** | **270** | 100 | 0 | **270** | ❌ 100% 不合规 |

## 9 城 legends 分布

| 城市 | 条数 | 文件 |
|------|------|------|
| 苏州 su | 30 | data-legends-suzhou.js |
| 深圳 sz | 30 | data-legends-shenzhen.js |
| 威海 wh | 20 | data-legends-weihai.js |
| qd/tj/hz/es/cq/cd | 6×15=90 | 各城 data-legends-{city}.js |

## 命名规范

- `assets/legends/l-{city-prefix}-{NNN}.webp`
- city-prefix: `qd/tj/hz/es/cq/cd/su/wh/sz/bj`
- 例: `l-qd-001.webp`（栈桥夜半回澜阁钟声）

## 内容现状

**数据完整性**：100% OK（170 + 100 = 270 条 legends 全部有 name/subtitle/story/themes 等完整字段）

**图片现状**：
- bj 100 张：全部 ~41KB 平均，全 Pollinations 旧批次
- 9 城 170 张：**完全缺失**——产品"另一面传说"模式切到这些城市时图位是空的

## Prompt 模板（暗黑 Ghibli 都市传说风）

```
Dark moody Ghibli-style illustration of urban legend / folklore:
{name}, {subtitle}, {city} China.
Atmosphere: {vibe}, {themes}.
Misty, mysterious, dramatic lighting, painterly hand-drawn anime style.
16:9 widescreen horizontal poster format, no text, no watermark.
```

## 执行 (待 R5 dest 完成 + quota 还剩)

```bash
cd ~/weekend-go
# 已生成 9 城 170 张队列 (不含 bj 100 重生)
node scripts/build-legends-queue.js > codex-queue-legends-9city.json
# 配额允许时按 4 路并行跑
python3.12 scripts/run-codex-regen.py --queue codex-queue-legends-9city.json &
```

bj 100 张需另写 build-bj-legends-queue.js（依赖 data-beijing-tales.js 的 image 字段）。

## 影响

- "另一面传说"模式 9 城用户体验：图位空（grey placeholder）→ 加图后焕然一新
- bj 100 张升级：Ghibli 暗黑风替代糊版 Pollinations，与 dest 图风格统一

## 优先级建议

1. **P0**：当前 R5 dest 跑完（139→0 张缺口）
2. **P1**：legends 9 城（170 张，新生）— 用户切其他城就有传说图
3. **P2**：bj legends 100 张（重生升级，旧版至少有图能用）
