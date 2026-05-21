#!/usr/bin/env bash
# Auto-commit loop: every 60s, commit any settled new/modified webps + push.
# Settled = mtime > 20s ago AND size > 150KB (Codex output indicator).
# Exits when no codex chunks remain running.

cd "$(dirname "$0")/.."
LOOP=0
NOW=$(date +%s)

while true; do
  LOOP=$((LOOP + 1))
  echo "=== loop $LOOP @ $(date +%H:%M:%S) ==="

  # Collect modified + untracked webps from git status
  CANDIDATES=$(git status --porcelain assets/images/ | awk '{print substr($0, 4)}' | grep '\.webp$' || true)

  COMMIT_LIST=()
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    # Strip quotes (git may quote non-ASCII filenames)
    f="${f#\"}"; f="${f%\"}"
    # Decode \xxx git-escaped octal sequences via printf
    f_decoded=$(printf '%b' "$f")
    [ ! -f "$f_decoded" ] && continue
    sz=$(stat -f '%z' "$f_decoded" 2>/dev/null || echo 0)
    mt=$(stat -f '%m' "$f_decoded" 2>/dev/null || echo 0)
    age=$(( $(date +%s) - mt ))
    if [ "$sz" -gt 150000 ] && [ "$age" -gt 20 ]; then
      COMMIT_LIST+=("$f_decoded")
    fi
  done <<< "$CANDIDATES"

  N=${#COMMIT_LIST[@]}
  if [ "$N" -ge 3 ]; then
    echo "[loop $LOOP] committing $N webps"
    for f in "${COMMIT_LIST[@]}"; do
      git add "$f"
    done
    git commit -m "feat(images): codex image2 P0 auto-increment · +$N webps

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>" 2>&1 | tail -2
    git push origin main 2>&1 | tail -2
  else
    echo "[loop $LOOP] $N settled webps (need ≥3); skip"
  fi

  RUNNING=$(ps aux | grep -E "run-codex-regen.py" | grep -v grep | wc -l | tr -d ' ')
  echo "[loop $LOOP] running codex chunks: $RUNNING"
  if [ "$RUNNING" -eq 0 ] && [ "$LOOP" -gt 1 ]; then
    echo "[loop $LOOP] all chunks done — final commit pass"
    # final pass: commit anything settled with smaller threshold
    REMAINING=$(git status --porcelain assets/images/ | awk '{print substr($0, 4)}' | grep '\.webp$' || true)
    NF=0
    while IFS= read -r f; do
      [ -z "$f" ] && continue
      f="${f#\"}"; f="${f%\"}"
      f_decoded=$(printf '%b' "$f")
      [ ! -f "$f_decoded" ] && continue
      sz=$(stat -f '%z' "$f_decoded" 2>/dev/null || echo 0)
      if [ "$sz" -gt 150000 ]; then
        git add "$f_decoded"
        NF=$((NF + 1))
      fi
    done <<< "$REMAINING"
    if [ "$NF" -gt 0 ]; then
      git commit -m "feat(images): codex image2 P0 final · +$NF webps (batch complete)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>" 2>&1 | tail -2
      git push origin main 2>&1 | tail -2
    fi
    # SW + cachebust bump
    echo "[loop $LOOP] final SW v26→v27 + IMAGE_CACHE v3→v4 + cachebust"
    TODAY=$(date +%Y%m%d)
    NEW_V="${TODAY}-codex-batch"
    if grep -q "weekend-go-v26" sw.js; then
      sed -i.bak 's/weekend-go-v26/weekend-go-v27/g; s/weekend-go-images-v3/weekend-go-images-v4/g' sw.js
      sed -i.bak "s|Service Worker v26 — .*|Service Worker v27 — codex image2 batch ($(date +%Y-%m-%d))|" sw.js
      rm -f sw.js.bak
    fi
    sed -i.bak "s|js/images.js?v=[^\"]*|js/images.js?v=${NEW_V}|" index.html
    sed -i.bak "s|js/app.js?v=[^\"]*|js/app.js?v=${NEW_V}|" index.html
    rm -f index.html.bak
    if ! git diff --quiet sw.js index.html; then
      git add sw.js index.html
      git commit -m "chore(cache): SW v27 + IMAGE_CACHE v4 + cachebust ${NEW_V} (codex batch close)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>" 2>&1 | tail -2
      git push origin main 2>&1 | tail -2
    fi
    break
  fi

  sleep 60
done

echo "auto-commit-loop exited after $LOOP loops"
