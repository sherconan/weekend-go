// node tests/test-planner.js — 行程规划器单测（真实北京+天津数据，不 mock 内容）
// 覆盖 2026-06-11 实测发现的三类问题：
//   1) 预算档位不生效（选 200-500 出"人均 ¥700"）
//   2) 分配与渲染时间预算不一致 → Day 静默丢点；两日一夜无住宿/晚餐
//   3) 一天连排多个爬山点，无体力约束
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const sandbox = {
  console,
  localStorage: { getItem: () => null, setItem: () => {} },
  document: { readyState: 'loading', addEventListener: () => {}, getElementById: () => null },
};
sandbox.window = sandbox;
const ctx = vm.createContext(sandbox);

function load(rel) {
  vm.runInContext(fs.readFileSync(path.join(root, rel), 'utf8'), ctx, { filename: rel });
}

// 与 planner.html 相同的数据加载顺序
load('config/cities.js');
load('js/data.js');
load('js/data-extra.js');
load('js/data-extra2.js');
load('js/data-beijing-500.js');
load('js/data-beijing-expand.js');
load('js/data-beijing-hidden.js');
load('js/data-beijing-tales.js');
load('js/data-beijing-new2026.js');
load('js/data-tianjin.js');
load('js/data-shared-cross-city.js');
load('js/planner.js');

const P = sandbox.__planner;

let passed = 0;
let failed = 0;
function assert(cond, msg) {
  if (cond) { passed++; }
  else { failed++; console.error('  ✗ ' + msg); }
}

const CAP = { '200以下': 200, '200-500': 500, '500-1000': 1000 };
const ALL_BUDGETS = ['200以下', '200-500', '500-1000', '1000以上'];

// 1. Bug 复现 case：北京两日 · 自然户外 · 200-500 —— 旧实现固定输出 ¥700
const plan = P.generatePlan('beijing', 2, ['自然户外'], '200-500', null);
assert(!plan.error, `北京两日自然户外应能生成行程: ${plan.error || ''}`);
assert(plan.totalBudget <= 500, `预算硬约束：预计人均 ¥${plan.totalBudget} 应 ≤ 500`);

// 2. 全档位 × 天数扫描：totalBudget 不超档位上限，且所有入选点档位合规
for (const b of ALL_BUDGETS) {
  for (const days of [1, 2, 3]) {
    const p = P.generatePlan('beijing', days, ['自然户外'], b, null);
    if (p.error) { assert(false, `beijing ${days}日 ${b} 生成失败: ${p.error}`); continue; }
    if (CAP[b]) assert(p.totalBudget <= CAP[b], `${days}日 ${b}: 预计人均 ¥${p.totalBudget} 超档位上限`);
    for (const day of p.days) {
      for (const s of day.slots) {
        assert(P.budgetOk(s.dest, b), `${days}日 ${b}: ${s.dest.name}(${s.dest.budget}) 超出预算档位`);
      }
    }
  }
}

// 3. relaxed 兜底路径也不能绕过预算（小数据城市 + 冷门主题触发兜底）
const pRelax = P.generatePlan('tianjin', 2, ['度假慢游'], '200以下', null);
if (!pRelax.error) {
  for (const day of pRelax.days) {
    for (const s of day.slots) {
      assert(P.budgetOk(s.dest, '200以下'), `relaxed 路径泄漏超预算点: ${s.dest.name}(${s.dest.budget})`);
    }
  }
}

// 4. 时间轴一致性：allocateDays 分配的每个点都渲染得出（无静默丢点），
//    且 slot 全部落在 09:00-20:00 窗口内
const allBJ = P.loadCityDests('beijing');
const ranked = P.scoreAndRank(allBJ, ['自然户外'], '200-500');
const rawDays = P.allocateDays(ranked, 2);
for (const day of rawDays) {
  const slots = P.assignTimeSlots(day.dests);
  assert(slots.length === day.dests.length,
    `分配了 ${day.dests.length} 个点但只渲染出 ${slots.length} 个（静默丢点）: ${day.dests.map(d=>d.name).join('/')}`);
}
for (const day of plan.days) {
  assert(day.slots.length >= 1, `Day ${day.idx} 至少应有 1 个点`);
  for (const s of day.slots) {
    assert(s.start >= 9 && s.end <= 20, `${s.dest.name} ${s.startText}-${s.endText} 超出 09:00-20:00 窗口`);
  }
}
// 两日行程 Day 1 不应再是"一个点之后一片空白"
assert(plan.days[0].slots.length >= 2, `两日行程 Day1 只排了 ${plan.days[0].slots.length} 个点`);

// 5. 体力约束：任意档位/天数下，每天最多 1 个爬山类点
for (const b of ALL_BUDGETS) {
  for (const days of [1, 2, 3]) {
    const p = P.generatePlan('beijing', days, ['自然户外'], b, null);
    if (p.error) continue;
    for (const day of p.days) {
      const n = day.slots.filter(s => P.isStrenuous(s.dest)).length;
      assert(n <= 1, `${days}日 ${b} Day${day.idx}: 同日 ${n} 个高体力点 (${day.slots.filter(s=>P.isStrenuous(s.dest)).map(s=>s.dest.name).join('+')})`);
    }
  }
}
assert(P.isStrenuous({ themes: ['爬山'], tags: [] }) === true, 'isStrenuous 应识别 themes 爬山');
assert(P.isStrenuous({ themes: [], tags: ['百望山', '爬山', '城内'] }) === true, 'isStrenuous 应识别 tags 爬山');
assert(P.isStrenuous({ themes: ['露营', '赏花'] }) === false, '露营赏花类（永定河）不算高体力');

// 6. 过夜安排：两日一夜 Day1 结尾有住宿+晚餐，最后一天没有；单日行程没有
assert(plan.days[0].stay && plan.days[0].stay.text, '两日行程 Day1 应有住宿建议（whereToStay）');
assert(plan.days[0].dinner && plan.days[0].dinner.text, '两日行程 Day1 应有晚餐提示（whereToEat）');
assert(!plan.days[1].stay, '最后一天（返程日）不应有住宿建议');
const p1 = P.generatePlan('beijing', 1, ['自然户外'], '200-500', null);
assert(!p1.error && !p1.days[0].stay, '单日行程不应有住宿建议');

// 7. 口径单元测试：时长解析 / 花费解析 / legacy 档位归一
assert(P.durationHours({ duration: ['一日往返'] }) === 6, '一日往返 = 6h');
assert(P.durationHours({ duration: ['两日一夜'] }) === 8, '两日一夜 = 8h（驻留型）');
assert(P.durationHours({ duration: ['半日游'] }) === 3, '半日游 = 3h');
assert(P.destCost({ budgetText: '免费' }) === 0, '免费 = ¥0');
assert(P.destCost({ budgetText: '人均 ¥200-350' }) === 275, '区间取中值 200-350 → 275');
assert(P.destCost({ budgetText: '门票 ¥80' }) === 80, '单值取数 80');
assert(P.budgetOk({ budget: '0-200' }, '200以下') === true, 'legacy 0-200 应归一为 200以下');
assert(P.budgetOk({ budget: '500以下' }, '200以下') === false, 'legacy 500以下 不应通过 200以下 档');
assert(P.budgetOk({ budget: '500以下' }, '200-500') === true, 'legacy 500以下 应归一为 200-500');

// 8. 多城联程：体力/过夜/预算同样生效
const pm = P.generatePlan('beijing', 3, [], '500-1000', ['tianjin']);
if (pm.error) {
  assert(false, `京津 3 日联程生成失败: ${pm.error}`);
} else {
  const realDays = pm.days.filter(d => !d.isTransit);
  assert(realDays.length === 3, `3 日联程应有 3 个游玩日，得到 ${realDays.length}`);
  for (const day of realDays) {
    const n = day.slots.filter(s => P.isStrenuous(s.dest)).length;
    assert(n <= 1, `联程同日 ${n} 个高体力点`);
  }
  assert(realDays[0].stay, '联程第 1 天应有住宿建议');
  assert(!realDays[realDays.length - 1].stay, '联程最后一天不应有住宿建议');
  const play = pm.totalBudget - pm.transit.cost;
  assert(play <= 1000, `联程游玩部分人均 ¥${play} 应 ≤ 1000（高铁费单列）`);
}

// 9. 行程文本（复制/分享）：单城含晚餐住宿行；多城换乘日不再崩溃且输出换乘行
const singleText = P.buildPlanText(plan);
assert(singleText.includes('不含住宿'), '复制文本预算行应注明不含住宿');
assert(singleText.includes('🌙 住宿：'), '复制文本应含 Day1 住宿行');
assert(singleText.includes('🍜 晚餐：'), '复制文本应含 Day1 晚餐行');
if (!pm.error) {
  let multiText = null;
  let threw = false;
  try { multiText = P.buildPlanText(pm); } catch (e) { threw = true; }
  assert(!threw, '多城行程 buildPlanText 不应抛错（旧版换乘日 day.slots undefined 崩溃）');
  if (multiText) {
    assert(multiText.includes('【换乘】') && multiText.includes('🚄'), '多城复制文本应含换乘行');
    assert((multiText.match(/【Day /g) || []).length === 3, '多城复制文本应含 3 个游玩日');
    assert(multiText.includes('🌙 住宿：'), '多城复制文本应含住宿行');
  }
}

console.log(`\nplanner tests: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
