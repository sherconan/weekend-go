#!/usr/bin/env python3
"""Identify non-kawaii images using color/style heuristics.
Benchmark: the 106 new primitive kawaii images (known-good).
Flag: images whose color signature diverges from the kawaii baseline."""
import os, json, numpy as np
from PIL import Image
from collections import Counter

SRC = '/Users/sherconan/weekend-go/assets/images'
PB = '/Users/sherconan/weekend-go/assets/images-primitive-backup'
OUT = '/Users/sherconan/weekend-go/style-audit-results.json'

def features(path):
    """Extract style fingerprint: color count + saturation stats."""
    img = Image.open(path).convert('RGB')
    # Downsample for speed
    img = img.resize((200, int(200 * img.size[1] / img.size[0])), Image.LANCZOS)
    arr = np.array(img)
    # 1. Unique colors after quantization to 5-bit (32 levels per channel → 32k palette)
    quantized = (arr >> 3).astype(np.int32)
    q_flat = quantized[..., 0] * 1024 + quantized[..., 1] * 32 + quantized[..., 2]
    unique_colors = len(np.unique(q_flat))
    # 2. HSV stats
    hsv = np.array(img.convert('HSV'))
    s = hsv[..., 1].astype(np.float32)
    v = hsv[..., 2].astype(np.float32)
    s_mean = float(s.mean())
    s_std = float(s.std())
    v_mean = float(v.mean())
    # 3. Dominant color coverage: % pixels belonging to top-32 quantized colors
    counts = Counter(q_flat.flatten())
    top32 = sum(c for _, c in counts.most_common(32))
    total = q_flat.size
    top32_coverage = top32 / total
    # 4. Edge density (Laplacian-like simple measure)
    gray = np.array(img.convert('L')).astype(np.float32)
    dx = np.abs(gray[:, 1:] - gray[:, :-1]).mean()
    dy = np.abs(gray[1:, :] - gray[:-1, :]).mean()
    edge_density = float((dx + dy) / 2)
    return {
        'unique_colors_5bit': unique_colors,
        'sat_mean': s_mean,
        'sat_std': s_std,
        'val_mean': v_mean,
        'top32_coverage': top32_coverage,
        'edge_density': edge_density,
    }

# Step 1: Build baseline from known-kawaii (the 106 new primitive replacements)
pb_files = set(os.listdir(PB)) if os.path.isdir(PB) else set()
kawaii_baseline = {}
for f in pb_files:
    src_p = os.path.join(SRC, f)
    pb_p = os.path.join(PB, f)
    # "new primitive" = size differs from backup
    if os.path.exists(src_p) and os.path.exists(pb_p):
        if os.path.getsize(src_p) != os.path.getsize(pb_p):
            try:
                kawaii_baseline[f] = features(src_p)
            except Exception as e:
                print(f'  baseline err {f}: {e}')

print(f'Kawaii baseline size: {len(kawaii_baseline)}')

# Baseline stats
def stats(feats, key):
    vals = [v[key] for v in feats.values()]
    return np.mean(vals), np.std(vals)

bl_stats = {k: stats(kawaii_baseline, k) for k in [
    'unique_colors_5bit', 'sat_mean', 'sat_std', 'val_mean',
    'top32_coverage', 'edge_density']}
print('Baseline stats (mean±std):')
for k, (m, s) in bl_stats.items():
    print(f'  {k}: {m:.2f} ± {s:.2f}')

# Step 2: Score all dest-*.webp against baseline
all_files = sorted(f for f in os.listdir(SRC) if f.startswith('dest-') and f.endswith('.webp'))
scored = []
for f in all_files:
    try:
        ft = features(os.path.join(SRC, f))
    except Exception as e:
        print(f'  err {f}: {e}')
        continue
    # Z-score distance from baseline for each feature
    z = {}
    for k, (m, s) in bl_stats.items():
        if s > 0:
            z[k] = abs((ft[k] - m) / s)
        else:
            z[k] = 0
    # Composite suspicion score — weight features that differ between kawaii and photo
    # High edge density, high unique colors = photo-like
    # Low top32 coverage = photo-like (too many unique colors to fit in 32)
    # Low saturation variance = uniform sky/solid scene (could be empty)
    suspicion = (
        z['edge_density'] * 1.0 +
        z['unique_colors_5bit'] * 1.5 +
        z['top32_coverage'] * 2.0 +  # most discriminative
        z['sat_mean'] * 0.5 +
        z['val_mean'] * 0.3
    )
    scored.append({'file': f, 'suspicion': suspicion, **ft, 'z': z})

scored.sort(key=lambda x: -x['suspicion'])

# Save and report
with open(OUT, 'w') as f:
    json.dump(scored, f, indent=2)

print(f'\nTotal audited: {len(scored)}')
print(f'\n=== Top 30 most suspicious (likely non-kawaii) ===')
for s in scored[:30]:
    print(f'  {s["suspicion"]:5.1f}  {s["file"]}  uc={int(s["unique_colors_5bit"])}  top32={s["top32_coverage"]:.2f}  edge={s["edge_density"]:.1f}')

# Manual test: where do the user's 3 flagged files rank?
print(f'\n=== User-flagged files ranking ===')
for target in ['dest-bj-337.webp', 'dest-bj-481.webp', 'dest-bj-482.webp', 'dest-bj-468.webp', 'dest-bj-335.webp']:
    for i, s in enumerate(scored):
        if s['file'] == target:
            print(f'  #{i+1:4} {target}: suspicion={s["suspicion"]:.1f}')
            break
