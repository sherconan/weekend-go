# WeekendGo 图片质量抽查报告 · 2026-04-23

**审计日期**: 2026-04-23
**样本**: 全量 1003 张 `assets/images/dest-*.webp`
**方法**: 文件大小统计 + 像素尺寸分布 + 生成源推断

---

## 一、核心发现

**两代图片质量分层明显。** 10 城按生成源分成两批：

| 批次 | 生成源 | 尺寸 | 中位大小 | 覆盖城市 |
|---|---|---|---|---|
| **高清批（老图）** | Gemini Web (kawaii Ghibli) | **1376×768** | 220-330 KB | bj / sz / su / wh |
| **标清批（新图）** | Pollinations (kawaii Ghibli) | **1027×573** | 85-125 KB | qd / tj / hz / es / cq / cd |

卡片缩略图尺寸下两者基本无差，但：
- **详情页 hero 区** 新城图片细节明显更薄（像素数仅老图 55%）
- **分辨率降档约 25%**（长边 1376 → 1027）
- **文件体积约 1/3**（压缩比更高 + 像素更少双重作用）

## 二、分城统计

```
city  n    主尺寸              变体数   推断源
bj    332  1376×768            3       Gemini Web (16:9 hi-res)
sz    160  1376×768            3       Gemini Web (16:9 hi-res)
su    60   1376×768            2       Gemini Web (16:9 hi-res)
wh    54   1376×768            2       Gemini Web + 19 Pollinations 混
qd    50   1027×573            1       Pollinations
tj    30   1027×573            1       Pollinations
hz    30   1027×573            1       Pollinations
es    30   1027×573            1       Pollinations
cq    30   1027×573            1       Pollinations
cd    30   1027×573            2       Pollinations + 3 Gemini 混
```

## 三、发现的问题

### 🟡 Wh 威海批次混源
- 54 张里 35 张 1376×768 (Gemini)，19 张 1027×573 (Pollinations)
- 列表页会出现**同城图片分辨率不齐**（挨着的卡片一张清一张糊）
- **建议**：重跑这 19 张 → 全城统一成 Gemini Web 版

### 🟡 Pollinations 批 6 城全量偏糊
- qd/tj/hz/es/cq/cd 共 200 张 1027×573
- 若接下来要做 **详情页 hero 全屏展示** 或 **海报分享导出**，这批需要升格
- **建议**：用 `weekend-go-gen-images` skill（Gemini Web + ChatGPT Web 双通道）重跑 top-20 的地标 dest

### 🟢 Cd 成都批混了 3 张老 Gemini 图
- dest-cd-1301.webp (414KB)、另 2 张 1376×768
- 说明当时 skill 有 fallback，不算问题，但体积偏大（414KB 比同城均值 124KB 大 3 倍）
- **建议**：保留即可，偶尔有高清更好

### 🟢 无 <20KB 超小文件
- 1003 张里最小 32KB（`dest-bj-xxx`），无疑似空图 / 占位图 / 错误生成

## 四、候选重跑清单（建议）

**优先级 P1（影响视觉一致性）**
1. 威海 19 张 Pollinations 图 → 重跑 Gemini Web 统一
2. 各城 top-5 地标 dest（共 ~30 张）→ 重跑 Gemini Web 作为 hero 素材

**优先级 P2（低 ROI）**
- 其余 170 张 Pollinations 图保留，卡片展示下肉眼无差

## 五、不改动的决定

- **不打算**全量重跑 200 张 Pollinations 图 — ROI 低、消耗 Gemini Web 额度大
- **不打算**改 Pollinations 尺寸参数 — 服务端限制 1024 附近
- **交付物**：`thumb-audit.html`（1003 张可交互审计页）已刷新

## 六、验证路径

线上实际观感验证：
```
打开 https://sherconan.github.io/weekend-go/
切到 qd/tj/hz/es/cq/cd 任一城
对比 bj / sz
看列表页卡片 → 详情页 hero 的清晰度差
```

若用户判定"肉眼有感"，再走上面的 P1 重跑路线。
