#!/usr/bin/env bash
# Post-codex-batch deploy: bump SW, cachebust, commit, push, verify online
# Usage: bash scripts/deploy-image-batch.sh "round-1: 36 张 P0 5城零Codex 补齐"

set -euo pipefail
cd "$(dirname "$0")/.."

LABEL="${1:-codex image2 batch}"
TODAY=$(date +%Y%m%d)
NEW_V="20260522-codex-${TODAY: -4}"  # e.g. 20260522-codex-0522

# --- 1. SW version bump v26 → v27 + IMAGE_CACHE v3 → v4 ---
echo "▎[1/6] SW bump v26→v27 + IMAGE_CACHE v3→v4"
if grep -q "weekend-go-v26" sw.js; then
  sed -i.bak 's/weekend-go-v26/weekend-go-v27/g; s/weekend-go-images-v3/weekend-go-images-v4/g' sw.js
  rm -f sw.js.bak
  # also bump banner comment
  sed -i.bak "s|Service Worker v26 — .*|Service Worker v27 — codex image2 batch ($(date +%Y-%m-%d))|" sw.js
  rm -f sw.js.bak
fi

# --- 2. Cachebust images.js script tag ---
echo "▎[2/6] cachebust js/images.js + js/app.js"
sed -i.bak "s|js/images.js?v=[^\"]*|js/images.js?v=${NEW_V}|" index.html
sed -i.bak "s|js/app.js?v=[^\"]*|js/app.js?v=${NEW_V}|" index.html
rm -f index.html.bak

# --- 3. Inventory: how many images modified ---
echo "▎[3/6] inventory"
MODIFIED=$(git status --short assets/images/ | wc -l | tr -d ' ')
echo "  modified images: $MODIFIED"

# --- 4. Git add + commit ---
echo "▎[4/6] git commit"
git add assets/images/ sw.js index.html scripts/build-p0-queue.js scripts/build-p1-queue.js scripts/deploy-image-batch.sh 2>/dev/null || true
git status --short

git commit -m "$(cat <<EOF
feat(images): codex image2 ${LABEL}

- ${MODIFIED} dest webp 重出，全部 Codex CLI image2 (Ghibli)
- SW v26→v27 + IMAGE_CACHE v3→v4 触发客户端刷新
- index.html cachebust → ${NEW_V}
- 符合 "全局规则 — Codex image2 only" (feedback_image_gen_codex_only)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"

# --- 5. Push to origin ---
echo "▎[5/6] git push origin main"
git push origin main

# --- 6. Wait for GH Pages deploy + fetch verify ---
echo "▎[6/6] waiting 60s for GH Pages..."
sleep 60
echo "▎    fetching live SW + index"
curl -s 'https://sherconan.github.io/weekend-go/sw.js' | head -3
echo "---"
curl -s 'https://sherconan.github.io/weekend-go/' | grep -oE '\?v=[^"]+' | sort -u | head -5
echo "---"
# Spot-check one new image
curl -s -o /dev/null -w 'http=%{http_code} size=%{size_download}\n' \
  'https://sherconan.github.io/weekend-go/assets/images/dest-qd-%E9%9D%92%E5%B2%9B%E5%95%A4%E9%85%92%E5%8D%9A%E7%89%A9%E9%A6%86.webp'

echo "✅ deploy complete: ${LABEL}"
