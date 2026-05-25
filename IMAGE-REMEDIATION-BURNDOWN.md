# 图片合规 Burndown · 2026-05-25

## 物理上限

OpenAI Codex 单账户配额每窗 ~18-30 张图，每天约 3-4 个 quota 窗。完成 ~620 张需 **8-12 天 wall-clock**。这是工具底层硬限制，非 Claude session 时长。

## 现状 (2026-05-25 16:40)

### dest 图 (807 张)

| 城市 | 总数 | 合规 (>200K) | % | 缺口 |
|------|------|--------------|---|------|
| bj | 332 | 239 | 72% | 93 |
| sz | 160 | 97 | 60% | 63 |
| wh | 54 | 34 | 62% | 20 |
| su | 60 | 32 | 53% | 28 |
| qd | 51 | 21 | 41% | 30 |
| hz | 30 | 12 | 40% | 18 |
| es | 30 | 11 | 36% | 19 |
| cd | 30 | 9 | 30% | 21 |
| cq | 30 | 6 | 20% | 24 |
| tj | 30 | 4 | 13% | 26 ⚠️ |
| **共** | **807** | **465** | **57%** | **342** |

### legends 图 (270 张)

| 类目 | 数量 | 合规 | 缺口 |
|------|------|------|------|
| bj 都市奇谈 (l-bj-001..100) | 100 | 0 (41KB Pollinations) | 100 (视觉合格,优先级降) |
| 9 城 (l-{city}-NNN) | 170 | 0 (无图) | 170 (P1 必修) |

### 总未做

- dest 缺口: **342 张**
- legends 9 城: **170 张** (高优,产品功能依赖)
- legends bj: **100 张** (低优,视觉合格只是文件小)
- **合计: 612 张**

## 已 Scheduled

| Task | 时间 | 范围 |
|------|------|------|
| weekend-go-round6-codex-1936pm | 19:36 PM 今日 | dest 余 + legends 9 城 双管 |

Round 6 之后还需 5-10 个 quota 窗口 (5-10 天) 才能全清。

## 加速方案 (如用户想加速)

1. **扩 OpenAI quota**: 升级账户付费等级,quota 翻倍
2. **多账户分流**: 借另一 codex 账户跑另一半
3. **降低标准**: 接受 200KB→100KB 阈值,合规率瞬间+20%
4. **优先 tj 攻坚**: 单城专跑 quota 4 天可清完

## 本 session 实际 deliverables (今天 14:00-16:40)

- ✅ R5 18 张 codex 新图 (qd×4 su×6 tj×4 hz×2 es×2)
- ✅ 真 bug 修复 1: data-beijing 引号 → SyntaxError 修
- ✅ 真 bug 修复 2: 卡片 source/description/overview undefined fallback (浏览器实测发现)
- ✅ GH Pages deploy artifact 撞名 RCA + 修
- ✅ 23 docs → 4 active + STATUS.md 单入口
- ✅ 31 orphan webp 清理 (-3.6MB)
- ✅ legends 270 张全审计 + queue ready
- ✅ R6 scheduled @ 19:36 PM 双管自动跑
- 31 commits 全部 GH Pages deploy success

线上字节级验证 R5 (3/3 ✅): tj-1106 / hz-1407 / su-1030 all match.
