#!/bin/bash
# Smoke test 2 CD/HZ images via Gemini Web skill — no Chrome driving, just cookies API.
set -u
ROOT=/Users/sherconan/weekend-go
SKILL=/Users/sherconan/.claude/skills/baoyu-danger-gemini-web/scripts/main.ts
TMPDIR=/tmp/cdhz-smoke
mkdir -p "$TMPDIR"

cd "$ROOT"
# Extract 2 items: 宽窄巷子 (1300) + 西湖 (1400)
PROMPT1=$(python3 -c "
import json
q=json.load(open('cdhz-regen-queue.json'))
for x in q:
    if x['id']==1300: print(x['prompt']); break
")
PROMPT2=$(python3 -c "
import json
q=json.load(open('cdhz-regen-queue.json'))
for x in q:
    if x['id']==1400: print(x['prompt']); break
")

echo "=== [1/2] 宽窄巷子 (Chengdu) ==="
bun "$SKILL" --prompt "$PROMPT1" --image "$TMPDIR/1300-kuanzhai.png" --model gemini-3-pro 2>&1 | tail -5
ls -la "$TMPDIR/1300-kuanzhai.png" 2>/dev/null

echo ""
echo "=== [2/2] 西湖 (Hangzhou) ==="
bun "$SKILL" --prompt "$PROMPT2" --image "$TMPDIR/1400-westlake.png" --model gemini-3-pro 2>&1 | tail -5
ls -la "$TMPDIR/1400-westlake.png" 2>/dev/null

echo ""
echo "=== outputs ==="
ls -la "$TMPDIR/"
