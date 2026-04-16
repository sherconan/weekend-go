#!/usr/bin/env python3
"""Compress all dest-*.webp >500KB to real WebP 1376x768 q90.
Some "webp" files are actually JPEG mislabeled — PIL handles both."""
import os, shutil
from PIL import Image

ROOT = '/Users/sherconan/weekend-go'
src_dir = f'{ROOT}/assets/images'
bak_dir = f'{ROOT}/assets/images-oversize-backup'
os.makedirs(bak_dir, exist_ok=True)

TARGET_W, TARGET_H = 1376, 768
TARGET_ASPECT = TARGET_W / TARGET_H
THRESHOLD = 500 * 1024

count = 0
saved = 0
failed = []

files = sorted(f for f in os.listdir(src_dir) if f.startswith('dest-') and f.endswith('.webp'))
for fname in files:
    path = os.path.join(src_dir, fname)
    sz = os.path.getsize(path)
    if sz < THRESHOLD:
        continue

    bak = os.path.join(bak_dir, fname)
    if not os.path.exists(bak):
        shutil.copy2(path, bak)

    try:
        img = Image.open(path).convert('RGB')
        w, h = img.size
        current_aspect = w / h
        # Crop to 16:9 if needed
        if abs(current_aspect - TARGET_ASPECT) > 0.02:
            if current_aspect > TARGET_ASPECT:
                new_w = int(h * TARGET_ASPECT)
                left = (w - new_w) // 2
                img = img.crop((left, 0, left + new_w, h))
            else:
                new_h = int(w / TARGET_ASPECT)
                top = (h - new_h) // 2
                img = img.crop((0, top, w, top + new_h))
        # Resize
        img = img.resize((TARGET_W, TARGET_H), Image.LANCZOS)
        img.save(path, 'WEBP', quality=90, method=6)
        new_sz = os.path.getsize(path)
        saved += sz - new_sz
        count += 1
        print(f'[{count}] {fname}  {sz//1024}KB → {new_sz//1024}KB  (−{(sz-new_sz)//1024}KB)', flush=True)
    except Exception as e:
        failed.append((fname, str(e)))
        print(f'FAIL {fname}: {e}', flush=True)

print()
print(f'Done: compressed {count} files, saved {saved/1024/1024:.1f}MB')
if failed:
    print(f'Failed: {len(failed)}')
    for f, e in failed[:10]:
        print(f'  {f}: {e}')
