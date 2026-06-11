// node tests/test-agent.js — Agent 数据/工具/循环 单测（LLM 用 mock，不花钱）
const path = require('path');
const tools = require('../api/_lib/tools');
const { searchDestinations, getDestinationDetail, DATA, seasonScore } = tools;

let passed = 0, failed = 0;
const assert = (c, msg) => { if (c) passed++; else { failed++; console.error('  ✗ ' + msg); } };

// 1. 数据包完整性（与 web/miniapp 口径交叉验证）
const counts = { beijing: 500, shenzhen: 159, weihai: 54, suzhou: 60, tianjin: 31, qingdao: 33, chengdu: 30, hangzhou: 30, chongqing: 30, enshi: 30 };
for (const k in counts) assert(DATA.cities[k] && DATA.cities[k].dests.length === counts[k], `${k} 条目数 ${counts[k]}`);
const bjSolid = DATA.cities.beijing.dests.filter(d => d.solid && !d.shared).length;
assert(bjSolid === 498, `北京 solid 非 facet = 498（实际 ${bjSolid}）`);
const tjBoat = DATA.cities.tianjin.dests.find(d => d.name === '海河游船');
assert(tjBoat && /停航/.test(tjBoat.bestSeason), '海河游船 bestSeason 带停航信息');

// 2. 搜索工具：质量池、主题过滤、预算、反季标注、排序
const june = searchDestinations({ city: 'tianjin' }, 6);
assert(june.results.length === 6 && june.cityLabel === '天津', '默认返回 6 条天津结果');
assert(!june.results.some(r => DATA.cities.tianjin.dests.find(d => d.id === r.id).shared), '结果不含跨城 facet');
const dec = searchDestinations({ city: 'tianjin', keywords: '游船' }, 12);
assert(dec.results.length >= 1 && /反季/.test(dec.results[0].seasonNote || ''), '12月搜游船：返回但带反季标注');
const guzhen = searchDestinations({ city: 'beijing', themes: ['古镇'], duration: '两日一夜' }, 6);
assert(guzhen.results.length > 0 && guzhen.results.every(r => r.duration.includes('两日一夜')), '北京古镇两日一夜过滤生效');
const cheap = searchDestinations({ city: 'beijing', budget_max: '200以下' }, 6);
assert(cheap.results.length > 0, '低预算过滤有结果');
const near = searchDestinations({ city: 'beijing', max_distance_km: 30 }, 6);
assert(near.results.length > 0, '近距离过滤有结果');
const badCity = searchDestinations({ city: 'tokyo' }, 6);
assert(badCity.city === 'beijing', '未知城市回落北京');

// 3. 详情工具
const first = june.results[0];
const detail = getDestinationDetail({ city: 'tianjin', id: first.id });
assert(detail.name === first.name && detail.whatToDo && detail.whatToDo.length > 20, '按 id 取详情含玩法');
const byName = getDestinationDetail({ city: 'tianjin', name: '五大道' });
assert(byName.id != null && byName.howToGet !== undefined, '按名称取详情');
const miss = getDestinationDetail({ city: 'tianjin', id: 999999 });
assert(miss.error, '不存在的 id 返回 error 字段');

// 4. Agent 循环（mock fetch：第一轮 tool_calls，第二轮最终回答）
(async () => {
  const { runAgent } = require('../api/_lib/agent');
  const realFetch = global.fetch;
  let llmCalls = 0;
  global.fetch = async (url, opts) => {
    llmCalls++;
    const reqBody = JSON.parse(opts.body);
    if (llmCalls === 1) {
      assert(Array.isArray(reqBody.tools) && reqBody.tools.length === 2, 'LLM 请求带 2 个工具定义');
      return { ok: true, json: async () => ({ choices: [{ finish_reason: 'tool_calls', message: { tool_calls: [{ id: 'c1', type: 'function', function: { name: 'search_destinations', arguments: JSON.stringify({ city: 'tianjin', themes: ['爬山'] }) } }] } }] }) };
    }
    const toolMsg = reqBody.messages.find(m => m.role === 'tool');
    assert(toolMsg && /results/.test(toolMsg.content), '第二轮请求包含工具结果');
    const toolData = JSON.parse(toolMsg.content);
    const picked = toolData.results[0];
    return { ok: true, json: async () => ({ choices: [{ finish_reason: 'stop', message: { content: `这周末推荐 **${picked.name}**：${picked.highlight || '值得一去'}。要不要更轻松点的？` } }] }) };
  };
  const events = [];
  await runAgent({ messages: [{ role: 'user', content: '想爬山' }], city: 'tianjin', key: 'mock', month: 6, send: (e) => events.push(e) });
  global.fetch = realFetch;
  assert(llmCalls === 2, 'mock 循环恰好 2 轮');
  assert(events.some(e => e.type === 'text'), '有 text 事件');
  const cards = events.find(e => e.type === 'cards');
  assert(cards && cards.items.length >= 1 && cards.items[0].city === 'tianjin', '点名的目的地生成 cards 事件（含城市）');
  assert(events[events.length - 1].type === 'done', '以 done 收尾');

  console.log(`\nagent tests: ${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
})();
