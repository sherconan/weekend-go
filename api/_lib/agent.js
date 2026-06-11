// Agent 循环：DeepSeek V4（Bocha，OpenAI 兼容 function calling）× 目的地数据库工具
// 设计：工具轮非流式（≤4 轮），最终回答整体拿到后分句下发（UI 仍是打字机体验）；
//       回答里被点名的目的地 → 以 cards 事件下发可点击卡片。
const { DATA, searchDestinations, getDestinationDetail, normCity } = require('./tools');

const LLM_BASE = (process.env.LLM_BASE_URL || 'https://api.bochaai.com/v1').replace(/\/$/, '');
const LLM_MODEL = process.env.LLM_MODEL || 'deepseek-v4-pro';

const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'search_destinations',
      description: '在「周末去哪儿」真实目的地数据库中按条件检索。推荐任何目的地前必须先调用本工具，只允许推荐返回结果中的目的地。',
      parameters: {
        type: 'object',
        properties: {
          city: { type: 'string', description: '出发城市 key：beijing/shenzhen/weihai/suzhou/tianjin/qingdao/chengdu/hangzhou/chongqing/enshi' },
          keywords: { type: 'string', description: '关键词，空格分隔，匹配名称/亮点/主题，如"古镇 水乡"' },
          themes: { type: 'array', items: { type: 'string' }, description: '主题精确过滤，如 ["爬山","亲子","温泉","海边","古镇","赏花","露营","历史","美食","摄影"]' },
          duration: { type: 'string', description: '时长档位：半日游 / 一日往返 / 两日一夜 / 三日两夜' },
          budget_max: { type: 'string', description: '人均预算上限档位：200以下 / 200-500 / 500-1000 / 1000以上' },
          max_distance_km: { type: 'number', description: '最大距离（公里）' },
          limit: { type: 'number', description: '返回条数，默认 6，最大 8' },
        },
        required: ['city'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_destination_detail',
      description: '查询某个目的地的完整攻略（怎么玩/怎么去/吃什么/住哪/贴士）。用户追问具体某地、或最终推荐前想给出实用细节时调用。',
      parameters: {
        type: 'object',
        properties: {
          city: { type: 'string', description: '城市 key' },
          id: { type: 'number', description: 'search_destinations 返回的目的地 id（优先用 id）' },
          name: { type: 'string', description: '目的地名称（没有 id 时用）' },
        },
        required: ['city'],
      },
    },
  },
];

function systemPrompt(city, month) {
  const label = DATA.cities[city].label;
  const cityList = Object.entries(DATA.cities).map(([k, v]) => `${v.label}(${k})`).join('、');
  return `你是「周末去哪儿」的出行顾问，帮用户决定这个周末去哪玩。

当前上下文：用户正在看【${label}】站，现在是 ${month} 月。支持的城市：${cityList}。

铁律：
1. 推荐任何目的地前，必须先用 search_destinations 检索；只能推荐工具返回的真实目的地，绝不编造地名或信息
2. 工具结果里 seasonNote 标注"当前反季"的（如冬季停航的游船），不要作为主推荐，如要提及必须说明反季原因
3. 用户没说城市就默认当前城市；用户提到别的城市就检索那个城市
4. 信息不足时（比如完全不知道偏好），先给出基于当季的默认推荐，再附带问一个最关键的偏好问题——不要光问不答
5. 推荐 2-3 个目的地：**目的地名**加粗，每个配一句有信息量的理由（用工具返回的距离/时长/人均/亮点）
6. 用户问"怎么去/怎么玩/吃什么"这类细节时，用 get_destination_detail 查了再答
7. 中文口语化、像懂行的朋友，不用 markdown 标题，不超过 250 字
8. 你不知道实时天气/票价变动/临时闭园，不要假装知道；必要时提醒"出发前确认"即可`;
}

async function callLLM(messages, key, withTools) {
  const res = await fetch(`${LLM_BASE}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: LLM_MODEL,
      messages,
      tools: withTools ? TOOLS : undefined,
      tool_choice: withTools ? 'auto' : undefined,
      temperature: 0.7,
      max_tokens: withTools ? 500 : 700,
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`LLM HTTP ${res.status}: ${t.slice(0, 200)}`);
  }
  const json = await res.json();
  const choice = json.choices && json.choices[0];
  if (!choice) throw new Error('LLM 返回无 choices');
  return choice;
}

function execTool(name, args, month) {
  try {
    if (name === 'search_destinations') return searchDestinations(args, month);
    if (name === 'get_destination_detail') return getDestinationDetail(args);
    return { error: `未知工具 ${name}` };
  } catch (e) {
    return { error: String(e.message || e).slice(0, 200) };
  }
}

// 把最终文本里点名的目的地变成卡片（来源=本次工具检索结果，保证不编造）
function extractCards(finalText, seenDests, city) {
  const cards = [];
  const used = new Set();
  for (const d of seenDests.values()) {
    if (used.has(d.id)) continue;
    if (finalText.includes(d.name)) {
      used.add(d.id);
      cards.push({
        id: d.id, name: d.name, subtitle: d.subtitle || '',
        distanceText: d.distanceText || '', rating: d.rating || null,
        city: d._city || city,
      });
    }
  }
  cards.sort((a, b) => finalText.indexOf(a.name) - finalText.indexOf(b.name));
  return cards.slice(0, 4);
}

// 主入口。send(event) 负责把 {type,...} 发给客户端。返回 usage 统计。
async function runAgent({ messages, city, key, month, send, maxRounds = 4 }) {
  const m = month || (new Date().getMonth() + 1);
  const c = normCity(city);
  const convo = [{ role: 'system', content: systemPrompt(c, m) }, ...messages];
  const seenDests = new Map(); // id -> 卡片摘要（含来源城市）
  let totalTokens = 0;

  send({ type: 'status', text: '正在想…' });
  for (let round = 0; round < maxRounds; round++) {
    const choice = await callLLM(convo, key, true);
    const msg = choice.message || {};

    if (msg.tool_calls && msg.tool_calls.length) {
      send({ type: 'status', text: round === 0 ? '正在翻目的地库…' : '再核对一下细节…' });
      convo.push({ role: 'assistant', content: msg.content || '', tool_calls: msg.tool_calls });
      for (const tc of msg.tool_calls) {
        let args = {};
        try { args = JSON.parse(tc.function.arguments || '{}'); } catch (e) {}
        const result = execTool(tc.function.name, args, m);
        if (tc.function.name === 'search_destinations' && result.results) {
          for (const r of result.results) seenDests.set(r.id, { ...r, _city: result.city });
        }
        if (tc.function.name === 'get_destination_detail' && result.id != null) {
          seenDests.set(result.id, { id: result.id, name: result.name, subtitle: result.subtitle, distanceText: result.distanceText, rating: result.rating, _city: normCity(args.city) });
        }
        convo.push({ role: 'tool', tool_call_id: tc.id, content: JSON.stringify(result) });
      }
      send({ type: 'status', text: '在写推荐…' });
      continue;
    }

    // 无工具调用 = 最终回答
    const finalText = String(msg.content || '').trim();
    if (!finalText) throw new Error('LLM 返回空回答');
    // 分句下发，保留打字机体验
    const chunks = finalText.match(/[^。！？\n]+[。！？\n]?/g) || [finalText];
    for (const ch of chunks) send({ type: 'text', text: ch });
    const cards = extractCards(finalText, seenDests, c);
    if (cards.length) send({ type: 'cards', items: cards });
    send({ type: 'done' });
    return { ok: true, rounds: round + 1, tokens: totalTokens };
  }

  // 轮数耗尽：强制无工具收尾
  convo.push({ role: 'user', content: '请基于以上工具结果直接给出最终推荐，不要再调用工具。' });
  const finalChoice = await callLLM(convo, key, false);
  const finalText = String((finalChoice.message || {}).content || '').trim() || '这周末的选择有点多，告诉我你想要的时长和预算，我帮你锁定？';
  const chunks = finalText.match(/[^。！？\n]+[。！？\n]?/g) || [finalText];
  for (const ch of chunks) send({ type: 'text', text: ch });
  const cards = extractCards(finalText, seenDests, c);
  if (cards.length) send({ type: 'cards', items: cards });
  send({ type: 'done' });
  return { ok: true, rounds: maxRounds + 1, tokens: totalTokens };
}

module.exports = { runAgent, TOOLS, systemPrompt };
