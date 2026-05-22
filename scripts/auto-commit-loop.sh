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

  # Collect modified + untracked webps. Use -c core.quotepath=false to keep
  # non-ASCII filenames as raw UTF-8 (avoid the \NNN octal escape decoding bug
  # that lost 8 qd webps in Round 2 auto-commit).
  CANDIDATES=$(git -c core.quotepath=false status --porcelain assets/images/ \
                 | awk '{print substr($0, 4)}' \
                 | grep '\.webp$' || true)

  COMMIT_LIST=()
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    [ ! -f "$f" ] && continue
    sz=$(stat -f '%z' "$f" 2>/dev/null || echo 0)
    mt=$(stat -f '%m' "$f" 2>/dev/null || echo 0)
    age=$(( $(date +%s) - mt ))
    if [ "$sz" -gt 150000 ] && [ "$age" -gt 20 ]; then
      COMMIT_LIST+=("$f")
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
    REMAINING=$(git -c core.quotepath=false status --porcelain assets/images/ \
                  | awk '{print substr($0, 4)}' \
                  | grep '\.webp$' || true)
    NF=0
    while IFS= read -r f; do
      [ -z "$f" ] && continue
      [ ! -f "$f" ] && continue
      sz=$(stat -f '%z' "$f" 2>/dev/null || echo 0)
      if [ "$sz" -gt 150000 ]; then
        git add "$f"
        NF=$((NF + 1))
      fi
    done <<< "$REMAINING"
    if [ "$NF" -gt 0 ]; then
      git commit -m "feat(images): codex image2 P0 final · +$NF webps (batch complete)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>" 2>&1 | tail -2
      git push origin main 2>&1 | tail -2
    fi
    # SW + IMAGE_CACHE auto-bump + cachebust (idempotent: always bumps to next version)
    TODAY=$(date +%Y%m%d-%H%M)
    NEW_V="codex-${TODAY}"
    # Parse current IMAGE_CACHE version (e.g. v5) and bump +1
    cur_img=$(grep -oE "weekend-go-images-v[0-9]+" sw.js | head -1 | grep -oE "v[0-9]+")
    if [ -n "$cur_img" ]; then
      next_n=$(( ${cur_img#v} + 1 ))
      next_img="v${next_n}"
      echo "[loop $LOOP] IMAGE_CACHE ${cur_img}→${next_img} + cachebust ${NEW_V}"
      sed -i.bak "s/weekend-go-images-${cur_img}/weekend-go-images-${next_img}/g" sw.js
      rm -f sw.js.bak
    fi
    # Parse current SW CACHE_NAME version (e.g. v27) and bump +1 only if first batch
    cur_sw=$(grep -oE "weekend-go-v[0-9]+" sw.js | head -1 | grep -oE "v[0-9]+")
    # only bump SW version if we're at v26 (first batch ever); otherwise IMAGE_CACHE bump alone is enough
    if [ "$cur_sw" = "v26" ]; then
      sed -i.bak 's/weekend-go-v26/weekend-go-v27/g' sw.js
      sed -i.bak "s|Service Worker v26 — .*|Service Worker v27 — codex image2 batch ($(date +%Y-%m-%d))|" sw.js
      rm -f sw.js.bak
    fi
    # Always bump cachebust
    sed -i.bak "s|js/images.js?v=[^\"]*|js/images.js?v=${NEW_V}|" index.html
    sed -i.bak "s|js/app.js?v=[^\"]*|js/app.js?v=${NEW_V}|" index.html
    rm -f index.html.bak
    if ! git diff --quiet sw.js index.html; then
      git add sw.js index.html
      git commit -m "chore(cache): IMAGE_CACHE bump + cachebust ${NEW_V} (codex batch close)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>" 2>&1 | tail -2
      git push origin main 2>&1 | tail -2
    fi
    break
  fi

  sleep 60
done

echo "auto-commit-loop exited after $LOOP loops"
