#!/usr/bin/env python3
"""Harvest XHS notes for a batch of destinations and prepare xhsVoices entries."""
import json, subprocess, os, sys, time, urllib.request, ssl, re

ROOT = os.path.expanduser("~/weekend-go")
XHS_SKILLS = os.path.expanduser("~/xiaohongshu-skills")
OUT_DIR = os.environ.get("OUT_DIR", f"{ROOT}/xhs-research/batch1")
COVER_DIR = f"{ROOT}/assets/xhs"
os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(COVER_DIR, exist_ok=True)

queue_file = sys.argv[1] if len(sys.argv) > 1 else "/tmp/xhs-voices-queue.json"
limit = int(sys.argv[2]) if len(sys.argv) > 2 else 30
queue = json.load(open(queue_file))[:limit]

ctx = ssl.create_default_context(); ctx.check_hostname = False; ctx.verify_mode = ssl.CERT_NONE

def slugify(name):
    # Use pinyin-less fallback: short hash + ascii-safe chars
    import hashlib
    h = hashlib.md5(name.encode()).hexdigest()[:8]
    ascii_part = re.sub(r'[^a-zA-Z0-9]+', '', name)[:12]
    return f"{ascii_part}-{h}" if ascii_part else h

def search(keyword):
    proc = subprocess.run(
        ["python3", "scripts/cli.py", "search-feeds", "--keyword", keyword],
        cwd=XHS_SKILLS, capture_output=True, text=True, timeout=60
    )
    # Strip non-JSON lines
    lines = proc.stdout.splitlines()
    json_start = next((i for i, l in enumerate(lines) if l.strip().startswith('{')), None)
    if json_start is None:
        return None
    return json.loads("\n".join(lines[json_start:]))

def download(url, out):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx, timeout=15) as r:
            open(out, 'wb').write(r.read())
        return True
    except Exception as e:
        print(f"  ✗ download fail: {e}", file=sys.stderr)
        return False

out_entries = {}
failed = []
for idx, item in enumerate(queue):
    name = item["name"]
    slug = slugify(name)
    print(f"[{idx+1}/{len(queue)}] {name} ({slug}) ...", flush=True)
    try:
        raw = search(f"{name}攻略")
        if not raw:
            raw = search(name)
        if not raw:
            failed.append(name); print("  ✗ search fail"); continue
        open(f"{OUT_DIR}/{slug}.json", "w").write(json.dumps(raw, ensure_ascii=False, indent=2))
        feeds_arr = raw.get("data", {}).get("feeds") if isinstance(raw.get("data"), dict) else raw.get("feeds") or raw.get("data")
        if not isinstance(feeds_arr, list):
            failed.append(name); print("  ✗ no feeds"); continue
        parsed = []
        for f in feeds_arr:
            if not f.get("displayTitle") or not f.get("cover"): continue
            likes_raw = (f.get("interactInfo") or {}).get("likedCount", "0")
            likes = int(re.sub(r"[^\d]", "", likes_raw) or 0)
            parsed.append({
                "id": f["id"],
                "xsec": f.get("xsecToken", ""),
                "title": f["displayTitle"],
                "cover": f["cover"],
                "author": (f.get("user") or {}).get("nickname", ""),
                "likes": likes,
            })
        parsed.sort(key=lambda x: -x["likes"])
        top3 = parsed[:3]
        if len(top3) < 3:
            failed.append(name); print(f"  ✗ only {len(top3)} usable feeds"); continue
        voices = []
        ok_covers = 0
        for i, v in enumerate(top3):
            cover_out = f"{COVER_DIR}/{slug}-{i+1}.webp"
            if download(v["cover"], cover_out):
                ok_covers += 1
                voices.append({
                    "title": v["title"],
                    "author": v["author"],
                    "likes": v["likes"],
                    "cover": f"assets/xhs/{slug}-{i+1}.webp",
                    "url": f"https://www.xiaohongshu.com/explore/{v['id']}?xsec_token={v['xsec']}&xsec_source=pc_feed",
                })
        if ok_covers == 3:
            out_entries[name] = voices
            print(f"  ✅ saved 3 voices ({', '.join(str(v['likes']) for v in voices)} likes)")
        else:
            failed.append(name); print(f"  ✗ only {ok_covers}/3 covers")
        time.sleep(1)
    except Exception as e:
        failed.append(name); print(f"  ✗ exception: {e}", file=sys.stderr)

open(f"{OUT_DIR}/entries.json", "w").write(json.dumps(out_entries, ensure_ascii=False, indent=2))
open(f"{OUT_DIR}/failed.json", "w").write(json.dumps(failed, ensure_ascii=False, indent=2))
print(f"\nDone. ok={len(out_entries)} fail={len(failed)}")
print(f"Entries → {OUT_DIR}/entries.json")
