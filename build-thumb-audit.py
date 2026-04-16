#!/usr/bin/env python3
"""Build an HTML grid of ALL dest-*.webp thumbnails for visual audit.
User eyes the grid and marks which ones are NOT kawaii Gemini (photos,
SVG placeholders, external sources)."""
import os
from PIL import Image
from html import escape

SRC = '/Users/sherconan/weekend-go/assets/images'
OUT_HTML = '/Users/sherconan/weekend-go/thumb-audit.html'
OUT_THUMB_DIR = '/Users/sherconan/weekend-go/thumb-audit-thumbs'

os.makedirs(OUT_THUMB_DIR, exist_ok=True)

files = sorted(f for f in os.listdir(SRC) if f.startswith('dest-') and f.endswith('.webp'))

# Generate 200x112 thumbnails
entries = []
for f in files:
    src_p = os.path.join(SRC, f)
    thumb_p = os.path.join(OUT_THUMB_DIR, f.replace('.webp', '.jpg'))
    if not os.path.exists(thumb_p):
        img = Image.open(src_p).convert('RGB')
        w, h = img.size
        target = (200, int(200 * h / w))
        img.thumbnail(target, Image.LANCZOS)
        img.save(thumb_p, 'JPEG', quality=75)
    entries.append((f, f.replace('.webp', '.jpg'), img.size if 'img' in dir() else (0,0)))

# Get original dims for each
orig_dims = {}
for f in files:
    with Image.open(os.path.join(SRC, f)) as im:
        orig_dims[f] = im.size

html = ['<!DOCTYPE html><html><head><meta charset="utf-8">']
html.append('<title>WeekendGo Image Audit</title>')
html.append('<style>')
html.append('body{margin:0;background:#111;color:#eee;font-family:-apple-system,sans-serif;padding:20px}')
html.append('h1{margin:0 0 16px}')
html.append('.filter{margin-bottom:16px}')
html.append('.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px}')
html.append('.cell{background:#1e1e1e;border-radius:8px;padding:8px;border:2px solid transparent;cursor:pointer}')
html.append('.cell.flagged{border-color:#ff4444;background:#3a1818}')
html.append('.cell img{width:200px;height:auto;display:block;border-radius:4px}')
html.append('.cell .name{font-size:11px;margin-top:6px;word-break:break-all;color:#aaa}')
html.append('.cell .dim{font-size:10px;color:#888}')
html.append('#flagged-list{position:fixed;right:10px;top:10px;width:320px;background:#222;padding:12px;border-radius:8px;max-height:90vh;overflow-y:auto;font-size:11px;border:1px solid #444}')
html.append('#flagged-list h3{margin:0 0 8px;font-size:13px;color:#ff6666}')
html.append('#flagged-list .item{padding:3px 0;border-bottom:1px solid #333;display:flex;justify-content:space-between}')
html.append('#flagged-list button{background:#c33;color:#fff;border:none;padding:6px 10px;border-radius:4px;cursor:pointer;width:100%;margin-top:8px}')
html.append('</style></head><body>')
html.append(f'<h1>WeekendGo 图片审计（共 {len(entries)} 张）— 点击异类图片标记</h1>')
html.append('<div class="filter">点缩略图把<b>非 kawaii Gemini 图</b>（照片/SVG/外部源）标红。右上角是已标记列表。</div>')
html.append('<div class="grid">')

for f, thumb, _ in entries:
    w, h = orig_dims[f]
    html.append(f'<div class="cell" data-name="{escape(f)}" onclick="toggle(this)">')
    html.append(f'  <img src="thumb-audit-thumbs/{escape(thumb)}" loading="lazy">')
    html.append(f'  <div class="name">{escape(f)}</div>')
    html.append(f'  <div class="dim">{w}×{h}</div>')
    html.append('</div>')

html.append('</div>')
html.append('<div id="flagged-list"><h3>已标记（0）</h3><div id="flagged-items"></div>')
html.append('<button onclick="exportList()">复制文件名列表</button></div>')

html.append('''
<script>
const flagged = new Set();
function toggle(el) {
  const name = el.dataset.name;
  if (flagged.has(name)) { flagged.delete(name); el.classList.remove('flagged'); }
  else { flagged.add(name); el.classList.add('flagged'); }
  render();
}
function render() {
  const list = document.getElementById('flagged-items');
  const h3 = document.querySelector('#flagged-list h3');
  h3.textContent = `已标记（${flagged.size}）`;
  list.innerHTML = [...flagged].sort().map(n=>`<div class="item">${n}</div>`).join('');
}
function exportList() {
  const text = [...flagged].sort().join('\\n');
  navigator.clipboard.writeText(text);
  alert(`已复制 ${flagged.size} 个文件名到剪贴板`);
}
</script></body></html>
''')

with open(OUT_HTML, 'w', encoding='utf-8') as f:
    f.write('\n'.join(html))
print(f'Built: {OUT_HTML}')
print(f'Thumbnails: {len(entries)} in {OUT_THUMB_DIR}')
