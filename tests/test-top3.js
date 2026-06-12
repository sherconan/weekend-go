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
// 2026-06-12 数据补齐后：跨城滨海图书馆已有玩法+交通，应为 solid 并可进推荐池
const binhai = ALL.find(d => (d.name || '').includes('滨海图书馆') && d.id === 5004);
assert(binhai && t.isSolid(binhai), '跨城滨海图书馆补齐内容后应判为 solid');
assert(pool.some(d => d.id === 5004), '补齐后的滨海图书馆应进入推荐池');
// 排除逻辑本身用合成空壳验证（whatToDo 为空 = 不进池）
vm.runInContext('ACTIVE_DESTINATIONS = ACTIVE_DESTINATIONS.concat([{ id: 999001, name: "合成空壳", whatToDo: "", whereToEat: "某店", rating: 5 }]);', ctx);
const pool2 = sandbox.getQualityPool();
assert(!pool2.some(d => d.id === 999001) && pool2.length === pool.length, '空壳卡仍被排除出推荐池（合成验证）');
vm.runInContext('ACTIVE_DESTINATIONS = ACTIVE_DESTINATIONS.filter(d => d.id !== 999001);', ctx);

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

// 8. 当季打分公平性（destSeasonScore）
const curSeason = t.seasonName(t.MONTH);
const kwBySeason = { '春': '赏花', '夏': '海滩', '秋': '红叶', '冬': '滑雪' };
const curKw = kwBySeason[curSeason];
const offKw = Object.entries(kwBySeason).find(([k]) => k !== curSeason)[1];
const base = { name: 'X', subtitle: '', themes: [], tags: [] };
assert(t.destSeasonScore({ ...base }) === 1, '无 bestSeason 且无关键词 = 中性 1 分（不再吃 0）');
assert(t.destSeasonScore({ ...base, name: curKw + '公园' }) === 2, `无字段但含当季关键词(${curKw}) = 2 分`);
assert(t.destSeasonScore({ ...base, name: offKw + '场' }) === 0.4, `无字段但只含反季关键词(${offKw}) = 0.4 分`);
assert(t.destSeasonScore({ ...base, name: offKw + '场', bestSeason: '5-10月' }) === t.seasonScore('5-10月'), '明确 bestSeason 优先于关键词推断');
assert(t.destSeasonScore({ ...base, bestSeason: '四季皆宜' }) === 1.2, '明确四季皆宜(1.2)应高于缺字段中性(1)');
const outOfRange = t.MONTH >= 5 && t.MONTH <= 10 ? '11-2月' : '5-10月';
assert(t.destSeasonScore({ ...base, bestSeason: outOfRange }) === 0.3, '明确反季(0.3)应低于缺字段中性(1)');
// 数据库里的真实区间写法必须全部按区间语义打分（曾静默降级为单月/0.2 分）
assert(t.seasonScore('5 月-10 月') === t.seasonScore('5-10月'), '带空格区间应与紧凑区间同分');
assert(t.seasonScore('5月-10月') === (M >= 5 && M <= 10 ? 3 : 0.3), '首数字带月的区间写法');
assert(t.seasonScore('5月中旬-10月底') === (M >= 5 && M <= 10 ? 3 : 0.3), '带修饰词（中旬/底）的区间写法');
assert(t.seasonScore('10月底-11月中旬') === (M >= 10 && M <= 11 ? 3 : 0.3), '秋叶季窗口写法');
assert(t.seasonScore('12月-次年3月') === (M >= 12 || M <= 3 ? 3 : 0.3), '跨年带"次年"的区间写法');
assert(t.seasonScore('3月底至4月中') === (M >= 3 && M <= 4 ? 3 : 0.3), '"至"连接符 + 修饰词');
// 真实回归：五大道（2026-06 已补"四季皆宜"开头的 bestSeason）按 1.2 分参与排序
const wudadao = TJ.find(d => d.name === '五大道');
assert(wudadao && /四季/.test(String(wudadao.bestSeason || '')), '前提：五大道已补四季皆宜类 bestSeason');
assert(t.destSeasonScore(wudadao) === 1.2, '五大道按四季皆宜 1.2 分参与排序');
// 天津数据债清零：30 张全部具备 bestSeason
assert(TJ.every(d => String(d.bestSeason || '').trim().length > 0), '天津 30 张卡 bestSeason 全覆盖');

// 9. 每日轮换：同日稳定、跨日变化、头部池约束
t._setPage(0);
t._setDateKey('20260611');
const dayA1 = t.pickTop3().map(d => d.id);
const dayA2 = t.pickTop3().map(d => d.id);
assert(String(dayA1) === String(dayA2), '同一天两次打开应得到同一批');
const rankedIds = t.rankedPool().slice(0, t.HEAD_POOL).map(d => d.id);
assert(dayA1.every(id => rankedIds.includes(id)), '当日 Top3 必须全部来自排名前 12 的头部池');
const order = t.buildOrder();
assert(order.length === t.rankedPool().length, '轮换序列应覆盖全部推荐池（换一批可一直翻）');
const headSet = new Set(order.slice(0, t.HEAD_POOL).map(d => d.id));
assert(rankedIds.every(id => headSet.has(id)) && headSet.size === rankedIds.length, '序列前 12 应是头部池的洗牌排列');
const firsts = new Set();
let everyDayHasSeasonal = true;
for (const dk of ['20260611', '20260612', '20260613', '20260614', '20260618', '20260625']) {
  t._setDateKey(dk);
  const picks = t.pickTop3();
  firsts.add(picks[0].id);
  if (!picks.some(d => t.destSeasonScore(d) >= 2)) everyDayHasSeasonal = false;
}
assert(firsts.size >= 2, `跨 6 天 Top1 应出现变化（实际 ${firsts.size} 种）`);
assert(everyDayHasSeasonal, '池中有当季卡时，每天的 3 张至少含 1 张当季（标题承诺兜底）');
t._setDateKey(null);

console.log(`\ntop3 tests: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
