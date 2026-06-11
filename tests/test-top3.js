// node tests/test-top3.js — top3 推荐池/打分/换一批 单测（用真实天津数据，不 mock 内容）
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const sandbox = {
  console,
  localStorage: { getItem: () => null, setItem: () => {} },
  document: { addEventListener: () => {}, getElementById: () => null },
};
sandbox.window = sandbox;
const ctx = vm.createContext(sandbox);

function load(rel) {
  vm.runInContext(fs.readFileSync(path.join(root, rel), 'utf8'), ctx, { filename: rel });
}

load('js/data-tianjin.js');
load('js/data-shared-cross-city.js'); // 真实空壳卡来源（滨海图书馆等 facet 条目，whatToDo 为空）
load('js/top3.js');
vm.runInContext('ACTIVE_DESTINATIONS = DESTINATIONS_TJ.concat(SHARED_CROSS_CITY_DESTS);', ctx);

const t = sandbox.__top3;
const TJ = vm.runInContext('DESTINATIONS_TJ', ctx);
const M = t.MONTH;

let passed = 0;
let failed = 0;
function assert(cond, msg) {
  if (cond) { passed++; }
  else { failed++; console.error('  ✗ ' + msg); }
}

// 1. 季节版徽标跟随当前月份
const badge = sandbox.seasonEditionBadge('🌱 北京周边游 · 2026 春季版');
const expectSeason = M >= 3 && M <= 5 ? '春' : M >= 6 && M <= 8 ? '夏' : M >= 9 && M <= 11 ? '秋' : '冬';
assert(badge.includes(expectSeason + '季版'), `seasonEditionBadge 应输出${expectSeason}季版，得到: ${badge}`);
assert(!badge.includes('春季版') || expectSeason === '春', '不应残留写死的春季版');

// 2. seasonScore 语义（按当前月份动态断言）
assert(t.seasonScore('5-10月') === (M >= 5 && M <= 10 ? 3 : 0.3), 'seasonScore 区间匹配 5-10月');
assert(t.seasonScore('11-2月') === (M >= 11 || M <= 2 ? 3 : 0.3), 'seasonScore 跨年区间 11-2月');
assert(t.seasonScore('') === 0 && t.seasonScore(undefined) === 0, 'seasonScore 空值为 0');
assert(t.seasonScore('四季皆宜') === 0.8, 'seasonScore 四季皆宜 = 0.8');
assert(t.seasonScore(`${M}月最佳`) === 2.5, 'seasonScore 单月命中 = 2.5');

// 3. 内容扎实门槛：真实数据 + 人造空壳
const full = TJ[0]; // 五大道：玩法/美食扎实（无 howToGet 字段，不应被误杀）
assert(t.isSolid(full) === true, 'isSolid 对内容完整的真实目的地应为 true');
assert(t.isSolid({ ...full, whatToDo: '' }) === false, 'isSolid 缺玩法应为 false（空壳卡核心特征）');
assert(t.isSolid({ ...full, whatToDo: '短' }) === false, 'isSolid 玩法过短应为 false');
assert(t.isSolid({ ...full, whereToEat: ' ', howToGet: '' }) === false, 'isSolid 玩法之外无任何实用板块应为 false');

// 4. 推荐池 = 全量里内容扎实的子集（独立口径复核）；线上真实空壳卡必须被排除
const ALL = vm.runInContext('ACTIVE_DESTINATIONS', ctx);
const expectSolid = ALL.filter(d =>
  String(d.whatToDo || '').trim().length >= 30 &&
  (String(d.howToGet || '').trim().length >= 10 || String(d.whereToEat || '').trim().length >= 6)
);
const pool = sandbox.getQualityPool();
assert(pool.length === expectSolid.length, `推荐池数量 ${pool.length} 应等于独立统计 ${expectSolid.length}`);
assert(pool.length < ALL.length, `空壳卡（${ALL.length - pool.length} 条）应被排除出推荐池`);
const binhai = ALL.find(d => (d.name || '').includes('滨海图书馆') && !d.whatToDo);
assert(binhai && !t.isSolid(binhai), '线上空白详情的真实案例（跨城版滨海图书馆）应被判为空壳');
assert(!pool.some(d => d.id === (binhai && binhai.id)), '空壳滨海图书馆不应出现在推荐池');

// 5. 排序：分数单调不增
const ranked = t.rankedPool();
let monotonic = true;
for (let i = 1; i < ranked.length; i++) {
  if (t.scoreDest(ranked[i], false) - t.scoreDest(ranked[i - 1], false) > 1e-9) { monotonic = false; break; }
}
assert(monotonic, 'rankedPool 应按分数从高到低');

// 6. pickTop3：3 个不重复；换一批后窗口移动
t._setPage(0);
const first = t.pickTop3().map(d => d.id);
assert(first.length === 3 && new Set(first).size === 3, 'pickTop3 返回 3 个不重复目的地');
t._setPage(1);
const second = t.pickTop3().map(d => d.id);
assert(ranked.length <= 3 || String(first) !== String(second), '换一批后应给出不同的 3 个');
t._setPage(0);

// 7. 已打卡惩罚
assert(Math.abs((t.scoreDest(full, false) - t.scoreDest(full, true)) - 3) < 1e-9, '已打卡应 -3 分');

console.log(`\ntop3 tests: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
