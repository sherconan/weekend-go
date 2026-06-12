// harvest JSON → js/xhs-voices-extra.js（多城小红书笔记，复合键 city|name）
// 用法: node build-voices-extra.js <harvest_dir> [more_dirs...]
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const dirs = process.argv.slice(2).map((d) => path.join(__dirname, d));
if (!dirs.length) { console.error('用法: node build-voices-extra.js <harvest_dir>...'); process.exit(1); }

// "1.2万" → 12000；"3456" → 3456；其他 → 0
function parseLikes(t) {
  const s = String(t || '').trim();
  const wan = s.match(/^([\d.]+)\s*万/);
  if (wan) return Math.round(parseFloat(wan[1]) * 10000);
  const n = parseInt(s.replace(/[^\d]/g, ''), 10);
  return Number.isFinite(n) ? n : 0;
}

const out = {};
let cards = 0, notes = 0, skipped = 0;
for (const dir of dirs) {
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json')) continue;
    const j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    if (!j.name || !j.city || j.city === 'shared') {
      // 跨城卡（泰山）城市归属多个——按 shared 单独键，渲染层兜底用
      if (j.city === 'shared' && j.feeds) j.city = 'shared';
      else { skipped++; continue; }
    }
    const feeds = (j.feeds || [])
      .filter((x) => x.title && x.href)
      .map((x) => ({ title: x.title.slice(0, 60), author: (x.author || '').slice(0, 24), likes: parseLikes(x.likes_text), url: x.href }))
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 3);
    if (!feeds.length) { skipped++; continue; }
    out[`${j.city}|${j.name}`] = feeds;
    cards++; notes += feeds.length;
  }
}

const header = `// xhs-voices-extra.js — 多城小红书真实笔记（pycookiecheat+playwright headless 采集）
// 生成: xhs-research/build-voices-extra.js  采集: batch-harvest-multi.py  ${new Date().toISOString().slice(0, 10)}
// 键: "city|目的地名"；字段: title/author/likes/url（封面图待补，渲染走无图卡样式）
`;
fs.writeFileSync(path.join(ROOT, 'js', 'xhs-voices-extra.js'),
  header + 'const XHS_VOICES_EXTRA = ' + JSON.stringify(out, null, 1) + ';\n');
console.log(`写入 js/xhs-voices-extra.js: ${cards} 卡 / ${notes} 条笔记（跳过 ${skipped} 空卡）`);
