# Phase 2 · 去重分析报告（dry-run）

> 生成工具：`node scripts/weekend-go-helper.js dedup-report`
> 本报告**只分析不改数据**。

## 统计

- **总重名组**: 63
- **同城重名**（必须合并）: **58 组**（全部是 `data-beijing-500` vs `data-beijing-expand` 重叠）
- **跨城重名**（Phase 2 `cities{}` 候选）: **5 组**

## 🔴 A. 同城重名 58 组（技术债清理）

全部出在 Beijing 的两个数据文件：
- `data-beijing-500.js`（130 条，主源）
- `data-beijing-expand.js`（59 条，可能是扩展版）

**59 条中有 58 条与 500 源重名**。说明 `data-beijing-expand.js` 本质上是 `500` 的重复批次，近乎全部是污染。

### 清理方案

两种 schema 可能不同（id 一致或不同）：
- **id 相同**（如 故宫 330/330）：保留 500 版，删 expand 版
- **id 不同**（如 北京动物园 333/332）：说明 expand 用了新 id 段，但景点是重复。保留信息更完整的一版，删另一版

### 执行建议

1. 写 `scripts/merge-intra-city.js`：对每组重名，自动选完整度高的版本保留，另一版打 `_removed: 'duplicate of {other_id}'` 标记
2. 人工 review 30 秒/条（58 条 ≈ 30 分钟）
3. 确认后实际删除 expand 重复条目；保留 expand 中未与 500 重名的 ~1 条独有

### 样本（前 10 组）

| 名字 | 500 id | expand id | 说明 |
|------|--------|-----------|------|
| 故宫 | 330 | 330 | 同 id |
| 天坛 | 331 | 331 | 同 id |
| 北京动物园 | 333 | 332 | 不同 id |
| 北京海洋馆 | 334 | 333 | 不同 id |
| 烟袋斜街 | 336 | 334 | 不同 id |
| 三里屯 | 338 | 336 | 不同 id |
| 国家博物馆 | 341 | 338 | 不同 id |
| 朝阳公园 | 343 | 343 | 同 id |
| 玉渊潭公园 | 344 | 340 | 不同 id |
| 景山公园 | 347 | 339 | 不同 id |

## 🟠 B. 跨城重名 5 组（cities{} facet 候选）

| 景点名 | 出现城市 | 推荐 canonical | 备注 |
|--------|---------|---------------|------|
| 泰山 | beijing, weihai | beijing 450km（算法选）⚠️ | **需人工判断**：450km 是山东泰山；140km 可能是威海某同名景点 |
| 天津滨海图书馆 | beijing, tianjin | tianjin 50km | 真跨城，BJ 扩展数据误把 TJ 条目拉入 |
| 栈桥 | weihai, qingdao | qingdao 1km | 真跨城，QD 本地地标 |
| 崂山 | weihai, qingdao | qingdao 40km | 真跨城，QD 本地山 |
| 八大关 | weihai, qingdao | qingdao 6km | 真跨城，QD 本地街区 |

### Phase 2 目标 schema（跨城）

把每条合并为单一 entry，加 `cities: {}` 字段：

```js
{
  id: "mount-tai",  // 或数字 id
  name: "泰山",
  location: { lat: 36.27, lng: 117.10 },
  // 共享字段：themes, budget, rating, subtitle...
  cities: {
    beijing: { distance: 450, distanceText: "450km", transport: ["高铁+大巴"], duration: ["两日一夜"] },
    weihai: { distance: 140, distanceText: "140km", transport: ["自驾"], duration: ["一日往返"] }
  }
}
```

`buildDestinationsForCity(cityKey)` 只返回 `d.cities[cityKey]` 存在的条目，展开对应的城市视图字段。

## ⚠️ 3 个脆弱点（人工 review 必看）

1. **"泰山" 可能是伪重名**：BJ 450km 的泰山（山东）和 WH 140km 的"泰山"可能是**两个不同地方**的同名。需人工核查 WH 数据里 "泰山" 的地理坐标。
2. **"天津滨海图书馆" 出现在 BJ**：这是 BJ 数据集污染（跨城条目误加），canonical 应是 TJ。合并时需从 BJ 数据删除对应条目。
3. **58 组 intra-city BJ 清理**：部分 expand 版本字段可能更丰富（后补完的）。**不要**盲目选 500 版——应比较字段完整度。

## 下一步

1. **人工 review**：打开本报告 + 每组重名的具体数据，确认合并方向
2. **写 merge 脚本**：先从简单的同 id 案例（10 组）开始
3. **先做 intra-city BJ**：解决 58 组 + 提升 BJ 数据质量
4. **再做 cross-city**：5 组需要引入 `cities{}` schema + 改 `buildDestinationsForCity` 逻辑
5. **最后 miniapp 同步**：utils/data.js 是大 JSON，需 sync 脚本

Phase 2 估算工作量：**intra-city 2-3h（含 review + 脚本）+ cross-city 3-4h（含 schema 重构）= 6-7h**
