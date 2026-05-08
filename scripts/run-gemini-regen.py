#!/usr/bin/env python3
"""Run Gemini Web image gen over a queue JSON, convert PNG → WebP.

Fallback when ChatGPT Web returns 403. Shares queue shape with run-chatgpt-regen.py.
"""
import argparse, json, os, subprocess, sys, time, shutil
from PIL import Image

SKILL = os.path.expanduser('~/.claude/skills/baoyu-danger-gemini-web/scripts/main.ts')
REPO = os.path.expanduser('~/weekend-go')

def run_one(item):
    out_webp = os.path.join(REPO, item['outPath'])
    tmp_png = out_webp.replace('.webp', '.png')
    backup_dir = os.path.join(REPO, 'assets/images-primitive-backup')
    os.makedirs(backup_dir, exist_ok=True)
    if os.path.exists(out_webp):
        backup_path = os.path.join(backup_dir, os.path.basename(out_webp))
        if not os.path.exists(backup_path):
            shutil.copy2(out_webp, backup_path)
    prompt = item['prompt']
    if not prompt.lower().startswith(('generate an image', '生成一张', 'create an image')):
        prompt = 'Generate an image: ' + prompt
    cmd = ['bun', SKILL, '--prompt', prompt, '--image', tmp_png, '--model', 'gemini-3-pro']
    t0 = time.time()
    try:
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=240, cwd='/tmp')
    except subprocess.TimeoutExpired:
        return False, 'timeout 240s'
    elapsed = time.time() - t0
    if res.returncode != 0 or not os.path.exists(tmp_png) or os.path.getsize(tmp_png) < 10000:
        return False, f'exit={res.returncode} stderr={res.stderr[-200:].strip()} elapsed={elapsed:.0f}s'
    img = Image.open(tmp_png).convert('RGB')
    img.save(out_webp, 'WEBP', quality=85, method=6)
    os.remove(tmp_png)
    return True, f'ok {os.path.getsize(out_webp)//1024}KB {elapsed:.0f}s'

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--queue', required=True)
    ap.add_argument('--limit', type=int, default=0)
    ap.add_argument('--start-from', type=int, default=0)
    ap.add_argument('--dry-run', action='store_true')
    args = ap.parse_args()
    queue = json.load(open(args.queue, encoding='utf-8'))
    if args.start_from: queue = queue[args.start_from:]
    if args.limit: queue = queue[:args.limit]
    print(f'queue: {len(queue)} items')
    failed = []
    for i, item in enumerate(queue, 1):
        prefix = f'[{i}/{len(queue)}] {item["id"]:<10} {item["name"][:15]:<15}'
        if args.dry_run:
            print(f'{prefix} DRY: {item["prompt"][:60]}'); continue
        ok, msg = run_one(item)
        print(f'{prefix} {"✅" if ok else "❌"} {msg}', flush=True)
        if not ok: failed.append(item)
        time.sleep(2)
    if failed and not args.dry_run:
        fp = args.queue.replace('.json', '.gemini-failed.json')
        json.dump(failed, open(fp, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
        print(f'\n{len(failed)} failures -> {fp}')
        sys.exit(2)
    print('\nDONE')

if __name__ == '__main__':
    main()
