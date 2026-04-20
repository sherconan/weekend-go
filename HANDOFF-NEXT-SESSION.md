# WeekendGo · 新会话交接文档

> 写给下一次重启的 Claude · 2026-04-20 19:15 GMT+8
> 读完这个就能接上进度。不读要踩坑。

---

## 🔴 优先级最高：三条红线（违反立即 revert）

1. **XHS 作为内容主源** — `~/.claude/projects/-Users-sherconan/memory/feedback_weekendgo_enrichment_source.md`。WebSearch / Bocha / 百度百科**禁止**作主源，fallback ≤5%。
2. **不编造** — xhsHeat / xhsQuote / description / overview / whatToDo 必须来自真实 XHS 笔记。多笔记综合允许，但必须透明标注 "— 综合 XHS..."。
3. **不用付费 API** — `feedback_no_paid_api.md`。所有 AI 调用走免费 / 逆向通道（Gemini Web / ChatGPT Web / Pollinations）。

## 🚨 本 session 新增的第四条红线（重要）

4. **禁止主动触发会"弹 Chrome / 抢焦点 / 弹 QR 登录"的工具链** —— `feedback_xhs_no_popup_pipeline.md`。用户本 session 两次被 `rednote-mcp login()` + `xhs-cli check-login` 的 Chrome 弹窗骚扰（"你怎么老在登录小红书啊？？"）。

**正确抓手**：`pycookiecheat` 从主 Chrome 抠 cookies → `playwright headless Chromium` 隔离 context 注入 → 零弹窗访问 XHS web。模板脚本在 `xhs-research/batch-harvest-playwright.py`。

---

## 📊 当前状态 snapshot（2026-04-20 19:15）

### XHS 内容深度（final）

| 城 | dest | XHS 覆盖 | Commit | 状态 |
|---|---|---|---|---|
| 天津 | 9/9 | 94% | `c580368` | ✅ |
| 青岛 | 10/10 | 92% | `a0e9cc8` | ✅ |
| 杭州 | 10/10 | 95% | `95608f6` | ✅ |
| 成都 | 12/12 | 98% | `1bcca07` | ✅ |
| 苏州 | 60/60 | 98.7% | `0e9d6b4` | ✅ |
| 威海 | 31/31 | 95% | `bbf30f8` | ✅ |
| **北京** | **293/348** | **84%** | **`1b836d2`** | ✅ 本 session |
| 深圳 | 0/159 | — | — | ❌ 未启动 |
| **总** | **425/688** | | | 缺 263 |

### BJ 本 session 详情

- data-beijing-500.js: 114/128 (89%)
- data-beijing-hidden.js: 92/100 (92%)
- data-beijing-tales.js: 87/100 (87%)
- data-beijing-new2026.js: 0/20（尾部 rate-limit 返空）
- **剩 55 条 retry 2 轮 0 ok**：`retry-gaps.py` 和 `retry-smart.py`（4 query 变体 + shuffle）都救不回 —— 诊断见下。

### P3 bugfix（本 session 附带清）

- ✅ Planner ICS 时区 bug（commit `dfbe082`）
- ✅ index.html 暗色模式 10 处 inline hex 归一（commit `dfbe082`）
- ✅ Dest 传说关联从宽匹配收紧为 structured-first（commit `29f2828`）

### 图片生成（正在处理）

- ✅ pollinations-regen-queue.json (234): 全跑完
- ✅ primitive-regen-queue.json (106): 全跑完
- ⚠️ suzhou-regen-queue.json: 43/60 done，**17 张 missing source file**（需重跑）
- ⚠️ **CD/HZ 22 张未进 `js/images.js`**（不是跑完质量差，是从未落地）
- 🧪 本 session 新建 `cdhz-regen-queue.json`（12 CD + 10 HZ + 手写 location-specific anchors）
- 📬 2 张 smoke（1300 宽窄巷子 + 1400 西湖）已发 Discord，**等用户视觉判断再铺全量**

### Git / CI / Deploy

- 最新 commit: `72eda3c` (chore · retry-gaps 脚本 + 55 gap 交接日志)
- origin/main: ✅ 已推
- Live URL: https://sherconan.github.io/weekend-go/
- 本 session 共 **4 个 commit pushed**（dfbe082 · 29f2828 · 1b836d2 · 72eda3c）

---

## 🛠 本 session 新增工具链（重要 · 跨 session 复用）

### 1. 零弹窗 XHS 抓手（`xhs-research/`）

```
build-bj-queue.py         # 从 data 文件扫 (id, name, file) → queue.json
batch-harvest-playwright.py  # 幂等单进程 harvest，每 dest ~8s，幂等缓存
apply-bj-enrichment.py    # 解析 harvest JSON → patch 4 个 data-beijing-*.js
                          #   auto-detects bare vs JSON-quoted syntax
retry-gaps.py             # 第一版 retry（单名 + 3 query）
retry-smart.py            # 分类 + 4 query 变体 + shuffle（实证也救不回）
```

**关键点**：
- 登录态从用户**主 Chrome** 直接抠，不触发 QR
- playwright `headless=True` 无窗口无焦点
- 注入 13 个 XHS cookies（`a1`/`web_session`/`xsecappid` 是关键）
- 复用 selector：`section.note-item` → `a.title span` / `.like-wrapper .count` / `.author .name`
- 节流：2-5s/req，尾部 20 条会被 rate-limit 返空（首轮观察）

### 2. Gemini Web 图片生成

```
refresh-gemini-cookies.py    # 从主 Chrome 抠 gemini/accounts.google cookies
gen-pollinations-regen.ts    # 跑 pollinations queue
gen-primitive-regen.ts       # 跑 primitive queue
gen-suzhou-regen.ts          # 跑 suzhou queue
gen-cdhz-smoke.sh            # 新：2 张 CD/HZ smoke（本 session 加）
build-cdhz-queue.py          # 新：构建 CD/HZ queue + 手写 location anchors
cdhz-regen-queue.json        # 新：12 CD + 10 HZ，每张 anchor 手写
```

**Gemini cookies 过期修法**（本 session 第一次踩到）：

```bash
python3 ~/weekend-go/refresh-gemini-cookies.py
# 看到 "OK refreshed 30 cookies" 就 OK
```

### 3. ChatGPT Web 图片生成（备选 · 用户说质量差，暂不用）

```
gen-chatgpt-regen.py         # AppleScript → chatgpt.com tab · 会抢 Chrome 焦点
chatgpt-web-imagegen.py      # 旧版
```

---

## ⏭ 下一步工作清单（按优先级）

### P0 · CD/HZ 22 张图片（本 session 卡在用户审 smoke）

- smoke 2 张（宽窄巷子 + 西湖）已发 Discord msg `1495738529...`，等用户过审
- 过了就 `bun gen-xxx-regen.ts --queue cdhz-regen-queue.json` 跑剩 20 张
- 落地后去 `js/images.js` 加 22 条映射 + sw.js v 号 bump + cache-bust query string

### P1 · Suzhou 17 张缺图

- missing_src 列表在 `suzhou-regen-queue.json`（id 1003/1029/1030/1031/1047-1059）
- 走 `gen-suzhou-regen.ts`（Gemini Web），和 CD/HZ 串行别并发（抢 Gemini session）

### P2 · SZ 159 dest XHS 深度补齐

- 现有 data-suzhou.js xhsQuote 3/159（之前 commit 0e9d6b4 是 60/60 的子集？核对）
- 走**零弹窗抓手**：同样 `playwright + 主 Chrome cookies`
- 注意 SZ 是 bare syntax，`apply-bj-enrichment.py` 的 bare 分支直接能用

### P3 · BJ 55 gap 补救（非刚需）

- 如果用户点头允许破红线 ≤5% → 16% 走 Bocha fallback
- 13 个外地城市（青岛/曲阜/大同/…）XHS 做城市 filter 不出笔记，Bocha 拿通用攻略摘要最合适
- 32 个 BJ 胡同 / 老字号 XHS 无词库，可以上 Bocha 或人肉

### P4 · 未完成的小程序工作（外部阻塞）

- 小程序 v1.5.0 体验版上传：WeChat DevTools 登录过期，需用户扫码重登

---

## ⚠️ 本 session 新增踩坑录

1. **sub-agent 里 call rednote-mcp login** — 弹 Chrome + QR。**绝对禁止**。
2. **xhs-cli check-login 会自动启动 Bridge server + 开 Chrome** — 和 rednote-mcp 同级的雷。
3. **xiaohongshu-search-summarizer 依赖 playwright headed browser** —— 同样弹窗，绕开。
4. **playwright Chromium 安装到 `~/Library/Caches/ms-playwright/` 不是 `~/.cache/`**（macOS），脚本写路径时注意。
5. **apply-bj-enrichment.py 自动识别 bare vs JSON-quoted syntax**（BJ500 是 "id": 300 quoted，hidden/tales/new2026 是 id: 430 bare），复用到其他城市也要 bare-detect。
6. **XHS 首轮批量跑 300+ 条后尾部会 rate-limit 返空 feed**（不是登录问题，是速率）。策略：batch 时 shuffle queue，或单 batch ≤200 条。
7. **pkill -9 chromium_headless_shell 会清掉后续脚本的 browser context** → TargetClosedError。清僵尸进程时用 pkill（不加 -9）让它 graceful。
8. **Gemini Web cookies 过期触发 AuthError: Failed to refresh cookies** → 跑 `refresh-gemini-cookies.py` 从主 Chrome 重抠。

---

## 🎯 接手建议（3 个抓手）

1. **立即做**：等用户审 CD/HZ smoke → 一键 `build-cdhz-queue.py` 剩 20 张 + Suzhou 17 缺图（用 Gemini Web，零抢焦点）。
2. **下一步**：SZ 159 dest XHS 补齐（复用 `batch-harvest-playwright.py` 改文件路径即可）。
3. **破红线需要授权**：BJ 55 gap 用 Bocha（16% > 5%，必须用户明确点头）。

**底层逻辑**：产品内容密度核心 = 真实 XHS 深度 + 真实 AI 图。本 session 把 BJ 从 0% 推到 84%，把 XHS 抓手从"subagent + login" 升级到"cookies + playwright headless"零弹窗级。下次可以拿模板直接套到 SZ。

---

## 📞 外部联系

- 用户 Discord: chat_id `1484568024311922728`（allowlist 时好时坏，重要汇报同时写本文件）
- Live site: https://sherconan.github.io/weekend-go/
- 用户时区: GMT+8
- 用户习惯：产品视角不看代码，要真实数据不要 demo；弹窗会直接吐槽
- 用户偏好：本 session 的 commit message 中文 + 明确"顶层设计 / 底层逻辑 / 抓手 / 闭环"的 Alibaba 风格（PUA 🟠 flavor alibaba）
