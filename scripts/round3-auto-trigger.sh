#!/usr/bin/env bash
# Round 3 auto-trigger: poll Codex quota every 5 min. The moment it's back
# (probe returns "OK" without "usage limit"), launch Round 3 chunks +
# auto-commit-loop.
#
# Self-cleans on success: writes ROUND-3-STARTED.flag and exits.
# If Round 3 has already started (scheduled-task fired), this is a no-op.

cd "$(dirname "$0")/.."
FLAG=ROUND-3-STARTED.flag

if [ -f "$FLAG" ]; then
  echo "Round 3 already started (flag present). Exiting."
  exit 0
fi

POLL=0
while true; do
  POLL=$((POLL + 1))
  echo "[poll $POLL @ $(date +%H:%M:%S)] probing codex..."
  PROBE=$(echo 'OK' | /Applications/Codex.app/Contents/Resources/codex exec \
    --skip-git-repo-check --full-auto "回 OK 一字" 2>&1 | tail -10)
  if echo "$PROBE" | grep -q "usage limit"; then
    echo "[poll $POLL] still capped; sleep 300s"
    sleep 300
    continue
  fi
  if echo "$PROBE" | grep -q "^OK$"; then
    echo "[poll $POLL] ✅ quota restored! launching Round 3"
    break
  fi
  echo "[poll $POLL] ambiguous response; sleep 60s"
  sleep 60
done

# Generate round3 queue (filter out already-completed)
python3 << 'EOF'
import json, os, time
items = json.load(open('codex-queue-round2.json'))
remaining = []
for it in items:
    p = it.get('outPath', '')
    if not p or not os.path.exists(p):
        remaining.append(it)
        continue
    sz = os.path.getsize(p)
    mt = os.path.getmtime(p)
    if sz > 200000 and (time.time() - mt) < 86400:
        continue
    remaining.append(it)
json.dump(remaining, open('codex-queue-round3.json', 'w'), indent=2, ensure_ascii=False)
print(f'round3: {len(remaining)} items')
EOF

N=$(python3 -c "import json; print(len(json.load(open('codex-queue-round3.json'))))")
Q=$(( N / 4 ))
echo "Launching 4 chunks: A=0..$Q B=$Q..$((Q*2)) C=$((Q*2))..$((Q*3)) D=$((Q*3))..$N"

mkdir -p logs
python3.12 scripts/run-codex-regen.py --queue codex-queue-round3.json --start-from 0       --limit $Q             > logs/r3-chunkA.log 2>&1 &
python3.12 scripts/run-codex-regen.py --queue codex-queue-round3.json --start-from $Q      --limit $Q             > logs/r3-chunkB.log 2>&1 &
python3.12 scripts/run-codex-regen.py --queue codex-queue-round3.json --start-from $((Q*2)) --limit $Q             > logs/r3-chunkC.log 2>&1 &
python3.12 scripts/run-codex-regen.py --queue codex-queue-round3.json --start-from $((Q*3)) --limit $((N-Q*3))    > logs/r3-chunkD.log 2>&1 &
bash scripts/auto-commit-loop.sh > logs/r3-autocommit.log 2>&1 &

touch "$FLAG"
echo "[round3-auto-trigger] launched at $(date +%H:%M:%S). Flag written: $FLAG"
echo "Tail logs: tail -F logs/r3-chunk*.log"
