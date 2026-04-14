#!/usr/bin/env bash
# Harvest top XHS notes for pilot destinations.
# Output: xhs-research/pilot/<slug>.json
set -e
cd ~/xiaohongshu-skills
OUT=~/weekend-go/xhs-research/pilot
mkdir -p "$OUT"
for pair in "universal-studios|北京环球影城攻略" "gubei|古北水镇攻略" "mutianyu|慕田峪长城攻略"; do
  slug="${pair%%|*}"
  kw="${pair##*|}"
  echo "=== harvesting $slug ($kw) ==="
  python3 scripts/cli.py search-feeds --keyword "$kw" 2>/dev/null > "$OUT/$slug.json" || echo "fail $slug"
  sleep 2
done
echo "done"
ls -la "$OUT/"
