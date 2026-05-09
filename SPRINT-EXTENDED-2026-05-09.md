# 周末去哪儿 · 加场 sprint 收尾（2026-05-09 15:48 → 接力）

> 用户回来 "继续推进吧"，owner 视角 17 commit 加场上线

## 累计 commit（commits this extended sprint）

| Commit | 内容 | 类型 |
|---|---|---|
| e84afeb | footer 时间戳标注 | polish |
| 11564a7 | hero quick filters · 时长 chip 直接筛选 | feat |
| 519d2a5 | OG/Twitter card meta 完整化 | seo |
| 83538eb | dest-card name hover scale 1.04 | polish |
| d3c5939 | hero stagger fade-up 入场动画 | polish |
| df49d15 | hero CTA shimmer 光带 | polish |
| 7f1794d | search overlay results 加 micro chip | feat |
| 0ecc8ee | 🎲 随便去哪儿 random btn (二三动画) | feat |
| d1feb7c | recent cities 智能上浮（FIFO 3 + 🕓 标记） | feat |
| d779f03 | hero+recent 联动 mini dropdown | feat |
| cffffe9 | 7H 收尾 handoff | docs |
| 3538666 | bj-410 洛阳白马寺 retry | image |
| 001668d | sprint handoff doc | docs |
| a991a43 | 8 张 BJ 周边 retry 重出 | image |
| 5454aa9 | cachebust v23 | chore |
| 7cba8df | C1 翻牌动画 + B4 recent searches | feat |
| e6faa21 | B1 hero 搜索 + B2 城市下拉 | feat |

## 全部新功能清单

### 搜索体验（5 件套）
- **B1** Hero 搜索框（首屏直达 + ⌘K 兼容）
- **B4** Recent searches localStorage（FIFO 5 + 清空）
- **联动** Hero focus → mini recent dropdown（不强制开 overlay）
- **search overlay** results 加 distance/rating/heat micro chip
- **search hot words** 跨城联合搜索保留

### 城市切换（2 件套）
- **B2** 城市选择器从横排改 2 列 dropdown（10 城网格）
- **Recent cities** 上浮（最近 3 城排在 menu 最前 + 🕓 badge）

### 主页 hero 区（4 件套）
- **🎲 随便去哪儿** random btn（rating ≥ 4.5 偏好 + dice 摇晃动画 + 320ms 延迟）
- **时长快筛** chip：半日游 / 一日往返 / 两日一夜 / 三日两夜
- **stagger fade-up** 入场动画（badge → h1 → p → search → cta → stats，0.04-0.42s 错开）
- **CTA shimmer** 按钮 hover 光带

### 视觉升级（3 件套）
- **C1** 另一面翻牌：btn rotateY 360° + 全屏 flash + perspective tilt
- **dest-card** 标题 hover scale 1.04（transform-origin 左下）
- **SEO** OG image + Twitter card + 完整 keywords + locale

### 技术基建（2 件套）
- **SW v22 → v26** + 多次 cachebust 防 CDN 缓存粘
- **scripts/run-codex-regen.py** Codex 唯一通道（已写进全局 memory feedback）

## 图片质量

- Round 1 (5-08): 9/21 张高清重出 + commit (a991a43)
- Round 2 (5-09): 6+/12 张高清重出（pending commit）
- Codex CLI image2 全程跑，每张 100-200s, 197-398KB Ghibli 风

## 视觉验证

`fetch_and_index https://sherconan.github.io/weekend-go/` 全 17 commit 上线，0 console error，hero 区从 demo 升级为产品级 above-the-fold 全部可达。
