"""
BJ 348 dest XHS batch harvest via playwright headless + main Chrome cookies.

Zero visible browser. Idempotent (skip if {slug}.json exists). Single browser
context for entire run to keep cookies warm.

Writes:
  - xhs-research/bj-harvest/{slug}.json : per-dest top 5 feeds
  - xhs-research/bj-harvest/_progress.txt : tail-able log
"""
import json, os, re, sys, time, hashlib, urllib.parse
from pycookiecheat import chrome_cookies
from playwright.sync_api import sync_playwright

ROOT = os.path.expanduser("~/weekend-go")
OUT_DIR = f"{ROOT}/xhs-research/bj-harvest"
QUEUE = f"{ROOT}/xhs-research/bj-queue.json"
os.makedirs(OUT_DIR, exist_ok=True)
LOG_PATH = f"{OUT_DIR}/_progress.txt"

UA = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
      'AppleWebKit/537.36 (KHTML, like Gecko) '
      'Chrome/120.0.0.0 Safari/537.36')

def log(msg):
    ts = time.strftime("%H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line, flush=True)
    with open(LOG_PATH, "a") as fp:
        fp.write(line + "\n")

def slugify(name):
    h = hashlib.md5(name.encode()).hexdigest()[:8]
    ascii_part = re.sub(r'[^a-zA-Z0-9\u4e00-\u9fff]+', '', name)[:20]
    return f"{ascii_part}-{h}" if ascii_part else h

def harvest_one(page, name):
    kw = f"{name} 攻略"
    url = f"https://www.xiaohongshu.com/search_result?keyword={urllib.parse.quote(kw)}&source=web_explore_feed"
    page.goto(url, wait_until='networkidle', timeout=25_000)
    try:
        page.wait_for_selector('section.note-item', timeout=8_000)
    except Exception:
        pass
    feeds = page.evaluate("""() => {
        const out = [];
        document.querySelectorAll('section.note-item').forEach(sec => {
            const t = sec.querySelector('a.title span, .title, .footer .title');
            const l = sec.querySelector('a.cover, a[href*="/explore/"]');
            const a = sec.querySelector('.author .name, .author-wrapper .name');
            const k = sec.querySelector('.like-wrapper .count, span.count, .like-count');
            const c = sec.querySelector('img');
            out.push({
                title: t ? t.textContent.trim() : '',
                href: l ? l.href : '',
                author: a ? a.textContent.trim() : '',
                likes_text: k ? k.textContent.trim() : '',
                cover: c ? c.src : '',
            });
        });
        return out;
    }""")
    # normalize likes
    for f in feeds:
        raw = f.get('likes_text', '') or ''
        if '万' in raw:
            # "3.2万" -> 32000
            num = re.sub(r'[^\d.]', '', raw)
            try:
                f['likes'] = int(float(num) * 10_000)
            except Exception:
                f['likes'] = 0
        else:
            digits = re.sub(r'[^\d]', '', raw)
            f['likes'] = int(digits) if digits else 0
    feeds.sort(key=lambda x: -x['likes'])
    return feeds

def main():
    queue = json.load(open(QUEUE))
    total = len(queue)
    log(f"=== BJ batch start · {total} dests ===")

    cookies_raw = chrome_cookies('https://www.xiaohongshu.com/')
    pw_cookies = [{'name': k, 'value': v, 'domain': '.xiaohongshu.com', 'path': '/'} for k, v in cookies_raw.items()]
    log(f"cookies injected: {len(pw_cookies)}")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(user_agent=UA, viewport={'width': 1440, 'height': 900})
        ctx.add_cookies(pw_cookies)
        page = ctx.new_page()

        ok, skip, fail = 0, 0, 0
        for idx, dest in enumerate(queue):
            name = dest['name']
            slug = slugify(name)
            outp = f"{OUT_DIR}/{slug}.json"
            if os.path.exists(outp):
                skip += 1
                log(f"[{idx+1}/{total}] SKIP {name} (cached)")
                continue
            try:
                feeds = harvest_one(page, name)
                top = feeds[:5]
                payload = {
                    'id': dest['id'],
                    'name': name,
                    'file': dest['file'],
                    'query': f"{name} 攻略",
                    'count': len(feeds),
                    'top5': top,
                    'harvested_at': time.strftime('%Y-%m-%dT%H:%M:%S'),
                }
                with open(outp, 'w') as fp:
                    json.dump(payload, fp, ensure_ascii=False, indent=2)
                ok += 1
                top_sample = top[0]['title'][:30] if top else '(none)'
                top_likes = top[0]['likes'] if top else 0
                log(f"[{idx+1}/{total}] ✓ {name} → {len(feeds)} feeds, top: {top_sample} ({top_likes}赞)")
            except Exception as e:
                fail += 1
                log(f"[{idx+1}/{total}] ✗ {name} err: {type(e).__name__}: {str(e)[:120]}")
            # polite pacing
            time.sleep(2.0 if (idx + 1) % 10 else 5.0)

        browser.close()
        log(f"=== done · ok={ok} skip={skip} fail={fail} ===")

if __name__ == '__main__':
    main()
