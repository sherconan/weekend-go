// Vercel Serverless Function: /api/chat —「周末去哪儿」推荐 Agent（SSE）
// 事件协议（与前端 sendToAPI 兼容）：{type:'text'|'cards'|'error'|'done'}
const { runAgent } = require('./_lib/agent');
const { normCity } = require('./_lib/tools');

const ALLOW_ORIGINS = new Set([
  'https://sherconan.github.io',
  'http://localhost:3411',
  'http://127.0.0.1:3411',
  'http://localhost:3456',
]);

// 成本护栏（serverless 实例内存级，尽力而为）：单 IP 30 次/天，全局 800 次/天
const ipHits = new Map();
let globalDay = '';
let globalCount = 0;
function rateLimited(ip) {
  const day = new Date().toISOString().slice(0, 10);
  if (day !== globalDay) { globalDay = day; globalCount = 0; ipHits.clear(); }
  globalCount++;
  if (globalCount > 800) return '今天聊得太火爆，额度用完了，明天再来～';
  const k = `${day}:${ip}`;
  const n = (ipHits.get(k) || 0) + 1;
  ipHits.set(k, n);
  if (n > 30) return '你今天问得够多啦，明天再来或直接逛逛目的地列表～';
  return null;
}

function setCors(req, res) {
  const origin = req.headers.origin || '';
  res.setHeader('Access-Control-Allow-Origin', ALLOW_ORIGINS.has(origin) ? origin : 'https://sherconan.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async function handler(req, res) {
  setCors(req, res);
  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return; }
  if (req.method !== 'POST') { res.statusCode = 405; res.end(JSON.stringify({ error: 'POST only' })); return; }

  // SSE 头先行：之后所有错误都走 event，前端会优雅降级
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': res.getHeader('Access-Control-Allow-Origin'),
  });
  const send = (ev) => res.write(`data: ${JSON.stringify(ev)}\n\n`);

  try {
    const key = process.env.LLM_API_KEY || process.env.BOCHA_API_KEY || '';
    if (!key) throw new Error('服务端未配置模型密钥');

    const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
    const limitMsg = rateLimited(ip);
    if (limitMsg) { send({ type: 'text', text: limitMsg }); send({ type: 'done' }); res.end(); return; }

    const body = typeof req.body === 'object' && req.body ? req.body : JSON.parse(await readBody(req));
    let messages = Array.isArray(body.messages) ? body.messages : [];
    // 输入护栏：只留 user/assistant、最近 8 条、单条截断
    messages = messages
      .filter((x) => x && (x.role === 'user' || x.role === 'assistant') && typeof x.content === 'string')
      .slice(-8)
      .map((x) => ({ role: x.role, content: x.content.slice(0, 600) }));
    if (!messages.length || messages[messages.length - 1].role !== 'user') {
      throw new Error('messages 需以 user 消息结尾');
    }
    const city = normCity(String(body.city || 'beijing'));

    await runAgent({ messages, city, key, send });
    res.end();
  } catch (e) {
    send({ type: 'error', error: String(e.message || e).slice(0, 300) });
    res.end();
  }
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    let s = '';
    req.on('data', (c) => { s += c; if (s.length > 64 * 1024) { reject(new Error('body too large')); req.destroy(); } });
    req.on('end', () => resolve(s || '{}'));
    req.on('error', reject);
  });
}

// 必须显式开启，否则 Vercel 把 SSE 缓冲成一次性响应（用户白屏等全程）。
// 注意：要在 module.exports = handler 之后再挂，否则会被覆盖。
module.exports.config = { supportsResponseStreaming: true };
