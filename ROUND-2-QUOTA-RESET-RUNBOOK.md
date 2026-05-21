# Round 2 Runbook — Codex quota resets 05:56 AM 2026-05-22

## Round 1 闭环成果（已上线）

| 项 | 数据 |
|----|------|
| 总尝试 | 18 items in codex |
| 成功落盘 | **16 张** Codex image2 Ghibli |
| 已 commit + push | **16 张 + SW v27 + cachebust** |
| 线上验证 | sherconan.github.io/weekend-go SW v27 + 新图字节级 OK |
| Quota 触顶 | 01:12 AM (07-08 张/分钟 burn rate) |

**Round 1 命中 16 张**（按城市）：
- qd 青岛 × 6（1203/1204/1205/1207/1210/1215 全 ✅）
- hz 杭州 × 3（1402/1416/1429）
- cq 重庆 × 4（1502/1503/1508/1511）
- es 恩施 × 1（1600 恩施大峡谷）
- cd 成都 × 1（1307 乐山大佛 from P1）
- su 苏州 × 1（1003 狮子林 from P1 retry）
- tj 天津 × 0 ❌（chunk 排序不利）

## Round 2 队列（165 张 ready）

文件：`codex-queue-round2.json`

| 城市 | 张数 | 备注 |
|------|------|------|
| enshi (es) | 29 | 最大缺口（Round 1 只完成 1 张） |
| qingdao (qd) | 24 | 余下中段+尾段 |
| tianjin (tj) | 24 | 全部需要（Round 1 没轮到） |
| hangzhou (hz) | 24 | 中段 + 尾段 |
| chongqing (cq) | 25 | 中段 + 尾段 |
| chengdu (cd) | 23 | P1 + P3 余下 |
| suzhou (su) | 16 | P1 retry 余下 |
| **Total** | **165** | — |

## 启动 Round 2 步骤（05:56 AM 后）

```bash
cd ~/weekend-go

# 1. 探活 Codex CLI（确认 quota 已重置）
/Applications/Codex.app/Contents/Resources/codex exec --skip-git-repo-check --full-auto "回 OK 一字"
# 期望：回复 "OK"，无 "usage limit" 字样

# 2. 启动并行 codex chunks（4 路并行避免再次触顶）
mkdir -p logs
python3.12 scripts/run-codex-regen.py --queue codex-queue-round2.json --start-from 0   --limit 42 > logs/r2-chunkA.log 2>&1 &
python3.12 scripts/run-codex-regen.py --queue codex-queue-round2.json --start-from 42  --limit 41 > logs/r2-chunkB.log 2>&1 &
python3.12 scripts/run-codex-regen.py --queue codex-queue-round2.json --start-from 83  --limit 41 > logs/r2-chunkC.log 2>&1 &
python3.12 scripts/run-codex-regen.py --queue codex-queue-round2.json --start-from 124 --limit 41 > logs/r2-chunkD.log 2>&1 &

# 3. 启动 auto-commit-loop（与 Round 1 同款，自动 commit+push+SW final 收口）
bash scripts/auto-commit-loop.sh > logs/r2-autocommit.log 2>&1 &

# 4. 监控（每 30s 看下成功数）
watch -n 30 'grep -c "✅ ok" logs/r2-chunk*.log'

# 5. 全部跑完后线上 fetch 验证
curl -s 'https://sherconan.github.io/weekend-go/sw.js' | head -1
curl -sLI 'https://sherconan.github.io/weekend-go/assets/images/dest-tj-1100.webp' | grep -i content-length
```

## 已知风险

1. **Codex CLI 配额每日上限**：上次 ~18 张就触顶。Round 2 165 张可能再次中途断。需要继续等下一日 reset。
2. **4 路并行 vs 7 路**：Round 1 用 7 路 burn 太快，Round 2 降到 4 路更稳。
3. **OpenAI image2 偶尔 fail**：保留 `--retry-tail` 队列文件，failed 列表会自动生成 `codex-queue-round2.codex-failed.json`。

## 功能侧缺憾（独立于本轮图片任务）

来自 DESIGN-REVIEW-2026-04-19 Phase B/C：
- **B3**: dest-card 3 层结构 (Cover/Meta/Hover detail) — pending
- **C2**: Night mode #1A1E28 配色调优 — pending
- **C3**: 卡片 emoji 密度控制（最多 2 个）— pending

这 3 个不需要 codex quota，可在 Round 2 之前/之后实施。
