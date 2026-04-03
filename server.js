const http = require('http');
const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

const PORT = 3456;
const ROOT = __dirname;

// MIME types for static files
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.webmanifest': 'application/manifest+json',
};

// Load destination data from data.js for system prompt
let destinationSummary = '';
let destCount = 0;
try {
  const code = fs.readFileSync(path.join(ROOT, 'js', 'data.js'), 'utf-8');
  const fn = new Function(code + '; return DESTINATIONS;');
  const destinations = fn();
  destCount = destinations.length;
  destinationSummary = destinations.map(d =>
    `${d.name}（${d.distanceText}，${d.duration.join('/')}，${d.transport.join('/')}，${d.budgetText}，主题：${d.themes.join('·')}，评分${d.rating}，亮点：${d.highlight}，最佳季节：${d.bestSeason}）`
  ).join('\n');
} catch (e) {
  console.warn('Warning: Could not load destination data:', e.message);
}

const SYSTEM_PROMPT = `你是「周末去哪儿」的AI旅行顾问，专门推荐北京周边的周末出行目的地。

你熟悉以下${destCount || ''}个目的地的详细信息：

${destinationSummary || '（目的地数据暂时不可用，请基于你对北京周边的了解来回答）'}

回答要求：
1. 简洁实用，像朋友聊天一样自然
2. 推荐时列出2-3个目的地，用 **加粗** 标注目的地名称
3. 每个推荐附上一句话亮点说明
4. 主动追问偏好（预算、时间、人数、交通方式）以便给出更精准推荐
5. 如果用户问的目的地在你的数据里，优先用数据里的信息回答
6. 回复用中文，保持轻松专业的语气
7. 不要使用 markdown 标题（#），直接用加粗和换行组织内容`;

// Initialize Anthropic client
function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }
  return new Anthropic({ apiKey });
}

// Serve static files
function serveStatic(req, res) {
  let filePath = path.join(ROOT, req.url === '/' ? 'index.html' : req.url);

  // Security: prevent directory traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('Not Found');
      } else {
        res.writeHead(500);
        res.end('Internal Server Error');
      }
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

// Handle chat API with SSE streaming
async function handleChat(req, res) {
  // Parse request body
  let body = '';
  for await (const chunk of req) {
    body += chunk;
  }

  let messages;
  try {
    const parsed = JSON.parse(body);
    messages = parsed.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error('messages array is required');
    }
  } catch (e) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: e.message }));
    return;
  }

  // Set up SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  try {
    const client = getClient();

    const stream = client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages,
    });

    stream.on('text', (text) => {
      res.write(`data: ${JSON.stringify({ type: 'text', text })}\n\n`);
    });

    stream.on('error', (err) => {
      console.error('Stream error:', err.message);
      res.write(`data: ${JSON.stringify({ type: 'error', error: err.message })}\n\n`);
      res.end();
    });

    stream.on('end', () => {
      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      res.end();
    });

    // Handle client disconnect
    req.on('close', () => {
      stream.abort();
    });

  } catch (e) {
    console.error('Chat error:', e.message);
    res.write(`data: ${JSON.stringify({ type: 'error', error: e.message })}\n\n`);
    res.end();
  }
}

// Create server
const server = http.createServer((req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/chat') {
    handleChat(req, res);
  } else {
    serveStatic(req, res);
  }
});

server.listen(PORT, () => {
  console.log(`\n  🚀 周末去哪儿 server running at http://localhost:${PORT}`);
  console.log(`  📡 Chat API: POST http://localhost:${PORT}/api/chat`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log(`\n  ⚠️  ANTHROPIC_API_KEY not set — chat will fall back to keyword matching`);
  }
  console.log('');
});
