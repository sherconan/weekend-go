#!/usr/bin/env node
// Generate sitemap.xml for all destinations across 8 cities
const fs = require('fs');
const path = require('path');
const { runInNewContext } = require('vm');

const BASE = 'https://sherconan.github.io/weekend-go/';
const STATIC = ['', 'stats.html', 'planner.html', 'compare.html', 'achievements.html'];

const sources = {
  beijing: ['data.js','data-extra.js','data-extra2.js','data-beijing-500.js','data-beijing-expand.js','data-beijing-hidden.js','data-beijing-tales.js','data-beijing-new2026.js'],
  shenzhen: ['data-shenzhen.js'],
  weihai: ['data-weihai.js'],
  suzhou: ['data-suzhou.js'],
  tianjin: ['data-tianjin.js'],
  qingdao: ['data-qingdao.js'],
  chengdu: ['data-chengdu.js'],
  hangzhou: ['data-hangzhou.js']
};

const urls = [];
for (const s of STATIC) {
  urls.push({ loc: BASE + s, priority: s === '' ? '1.0' : '0.8' });
}

const seen = new Set();
for (const [city, files] of Object.entries(sources)) {
  for (const f of files) {
    const p = path.join(__dirname, '..', 'js', f);
    if (!fs.existsSync(p)) continue;
    const src = fs.readFileSync(p, 'utf-8').replace(/\bconst\s+(\w+)\s*=/g, 'var $1 =');
    const sb = { window:{}, module:{exports:{}}, console:{} };
    try { runInNewContext(src, sb, {timeout:5000}); } catch {}
    const arr = Object.values(sb).find(v => Array.isArray(v));
    if (!arr) continue;
    for (const d of arr) {
      if (!d || !d.id || seen.has(d.id)) continue;
      seen.add(d.id);
      urls.push({
        loc: `${BASE}dest.html?id=${d.id}&city=${city}`,
        priority: '0.6'
      });
    }
  }
}

// Shared cross-city
const sharedPath = path.join(__dirname,'..','js','data-shared-cross-city.js');
if (fs.existsSync(sharedPath)) {
  const src = fs.readFileSync(sharedPath,'utf-8').replace(/\bconst\s+(\w+)\s*=/g,'var $1 =');
  const sb = { window:{}, module:{exports:{}}, console:{} };
  try { runInNewContext(src, sb, {timeout:5000}); } catch {}
  const arr = Object.values(sb).find(v => Array.isArray(v));
  if (arr) {
    for (const s of arr) {
      if (!s.cities) continue;
      for (const city of Object.keys(s.cities)) {
        urls.push({
          loc: `${BASE}dest.html?id=${s.id}&city=${city}`,
          priority: '0.5'
        });
      }
    }
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(__dirname,'..','sitemap.xml'), xml);
console.log(`✓ sitemap.xml written — ${urls.length} URLs (${seen.size} unique dests)`);
