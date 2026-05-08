#!/usr/bin/env python3
"""Run Codex CLI image2 over a queue JSON, convert PNG → WebP.

Replaces ChatGPT/Gemini Web pipelines per global rule:
  "All image gen goes through Codex CLI image2 only."

Usage:
  python3.12 scripts/run-codex-regen.py --queue retry-queue.json [--limit N] [--start-from N] [--dry-run]

Queue JSON item shape (same as run-chatgpt-regen.py):
  {"id": "su-1003", "name": "狮子林", "city": "suzhou",
   "prompt": "...", "outPath": "assets/images/dest-su-1003.webp"}
"""
import argparse, json, os, subprocess, sys, time, shutil
from PIL import Image

CODEX_BIN = '/Applications/Codex.app/Contents/Resources/codex'
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

    prompt = (
        f"请用 image2 工具生成一张图片，主题是：{item['prompt']} "
        f"把生成的 PNG 保存到 {tmp_png}（必须是这个绝对路径）。"
        f"完成后只回复保存的文件路径，不要其他内容。"
    )

    cmd = [CODEX_BIN, 'exec', '--skip-git-repo-check', '--full-auto',
           '--add-dir', REPO, prompt]
    t0 = time.time()
    try:
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=300, cwd=REPO)
    except subprocess.TimeoutExpired:
        return False, 'timeout 300s'
    elapsed = time.time() - t0

    if not os.path.exists(tmp_png) or os.path.getsize(tmp_png) < 50000:
        tail = (res.stderr or res.stdout)[-300:].strip().replace('\n', ' | ')
        return False, f'no-png exit={res.returncode} elapsed={elapsed:.0f}s tail={tail}'

    img = Image.open(tmp_png).convert('RGB')
    img.save(out_webp, 'WEBP', quality=85, method=6)
    os.remove(tmp_png)
    return True, f'ok {os.path.getsize(out_webp)//1024}KB {img.size[0]}×{img.size[1]} {elapsed:.0f}s'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--queue', required=True)
    ap.add_argument('--limit', type=int, default=0)
    ap.add_argument('--start-from', type=int, default=0)
    ap.add_argument('--dry-run', action='store_true')
    args = ap.parse_args()

    queue = json.load(open(args.queue, encoding='utf-8'))
    if args.start_from:
        queue = queue[args.start_from:]
    if args.limit:
        queue = queue[:args.limit]

    print(f'queue: {len(queue)} items via Codex CLI')
    failed = []
    for i, item in enumerate(queue, 1):
        prefix = f'[{i}/{len(queue)}] {item["id"]:<10} {item["name"]:<22}'
        if args.dry_run:
            print(f'{prefix} DRY: {item["prompt"][:60]}...')
            continue
        ok, msg = run_one(item)
        status = '✅' if ok else '❌'
        print(f'{prefix} {status} {msg}', flush=True)
        if not ok:
            failed.append(item)
        time.sleep(2)

    if failed and not args.dry_run:
        fp = args.queue.replace('.json', '.codex-failed.json')
        json.dump(failed, open(fp, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
        print(f'\n{len(failed)} failures -> {fp}')
        sys.exit(2)
    print('\nDONE')


if __name__ == '__main__':
    main()
