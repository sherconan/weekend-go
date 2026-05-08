#!/usr/bin/env python3
"""Run ChatGPT Web image gen over a queue JSON, convert PNG → WebP.

Usage:
  python3 scripts/run-chatgpt-regen.py --queue top30-chatgpt-regen-queue.json [--project "周末去哪儿玩"] [--limit N] [--dry-run]

Queue JSON item shape:
  {"id": "cd-1301", "name": "大熊猫繁育研究基地", "city": "chengdu",
   "prompt": "...", "outPath": "assets/images/dest-cd-1301.webp"}
"""
import argparse, json, os, subprocess, sys, time
from pathlib import Path
from PIL import Image

SKILL_CLI = os.path.expanduser('~/.claude/skills/chatgpt-web-imagegen/chatgpt-web-imagegen.py')
REPO = os.path.expanduser('~/weekend-go')

def run_one(item, project):
    out_webp = os.path.join(REPO, item['outPath'])
    tmp_png = out_webp.replace('.webp', '.png')
    # backup existing webp if present
    backup_dir = os.path.join(REPO, 'assets/images-primitive-backup')
    os.makedirs(backup_dir, exist_ok=True)
    if os.path.exists(out_webp):
        backup_path = os.path.join(backup_dir, os.path.basename(out_webp))
        if not os.path.exists(backup_path):
            import shutil
            shutil.copy2(out_webp, backup_path)
    # call the skill
    cmd = ['python3', SKILL_CLI, '-p', item['prompt'], '-o', tmp_png]
    if project:
        cmd.extend(['--project', project])
    t0 = time.time()
    res = subprocess.run(cmd, capture_output=True, text=True, timeout=180)
    elapsed = time.time() - t0
    if res.returncode != 0 or not os.path.exists(tmp_png) or os.path.getsize(tmp_png) < 10000:
        return False, f"exit={res.returncode}, stderr={res.stderr[-200:]}, elapsed={elapsed:.1f}s"
    # convert png → webp
    img = Image.open(tmp_png).convert('RGB')
    img.save(out_webp, 'WEBP', quality=85, method=6)
    os.remove(tmp_png)
    return True, f"ok {os.path.getsize(out_webp)//1024}KB, {elapsed:.1f}s"

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--queue', required=True)
    ap.add_argument('--project', default='周末去哪儿玩')
    ap.add_argument('--limit', type=int, default=0)
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--start-from', type=int, default=0, help='skip first N items')
    args = ap.parse_args()

    queue = json.load(open(args.queue, encoding='utf-8'))
    if args.start_from:
        queue = queue[args.start_from:]
    if args.limit:
        queue = queue[:args.limit]

    print(f'queue: {len(queue)} items; project={args.project!r}; dry_run={args.dry_run}')
    failed = []
    for i, item in enumerate(queue, 1):
        prefix = f'[{i}/{len(queue)}] {item["id"]:<10} {item["name"]:<20}'
        if args.dry_run:
            print(f'{prefix} DRY: {item["prompt"][:60]}...')
            continue
        ok, msg = run_one(item, args.project)
        status = '✅' if ok else '❌'
        print(f'{prefix} {status} {msg}', flush=True)
        if not ok:
            failed.append(item)
        # pace to avoid rapid-fire rate limiting (ChatGPT throttles)
        time.sleep(3)

    if failed and not args.dry_run:
        fp = args.queue.replace('.json', '.chatgpt-failed.json')
        json.dump(failed, open(fp, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
        print(f'\n{len(failed)} failures -> {fp}')
        sys.exit(2)
    print('\nDONE')

if __name__ == '__main__':
    main()
