"""
Retry the 55 BJ dests that had timeout or 0-feed in first batch.
Tactics: use bare name (no "攻略"), 60s timeout, 8s between requests.
"""
import json, os, re, time, hashlib, urllib.parse
from pycookiecheat import chrome_cookies
from playwright.sync_api import sync_playwright

ROOT = os.path.expanduser("~/weekend-go")
HARVEST = f"{ROOT}/xhs-research/bj-harvest"
QUEUE = f"{ROOT}/xhs-research/bj-queue.json"
LOG = f"{HARVEST}/_retry.txt"

UA = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
      'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

def log(msg):
    line = f"[{time.strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    open(LOG, 'a').write(line + "\n")

def slugify(name):
    h = hashlib.md5(name.encode()).hexdigest()[:8]
    ascii_part = re.sub(r'[^a-zA-Z0-9\u4e00-\u9fff]+', '', name)[:20]
    return f"{ascii_part}-{h}" if ascii_part else h

def gap_list():
    queue = json.load(open(QUEUE))
    gaps = []
    for d in queue:
        slug = slugify(d['name'])
        p = f"{HARVEST}/{slug}.json"
        needs_retry = True
        if os.path.exists(p):
            try:
                data = json.load(open(p))
                if data.get('top5') and len(data['top5']) > 0 and data['top5'][0].get('title'):
                    needs_retry = False
            except Exception:
                pass
        if needs_retry:
            gaps.append(d)
    return gaps

def harvest_one(page, name, query):
    url = f"https://www.xiaohongshu.com/search_result?keyword={urllib.parse.quote(query)}&source=web_explore_feed"
    page.goto(url, wait_until='networkidle', timeout=60_000)
    try:
        page.wait_for_selector('section.note-item', timeout=12_000)
    except Exception:
        pass
    feeds = page.evaluate("""() => {
        const out = [];
        document.querySelectorAll('section.note-item').forEach(sec => {
            const t = sec.querySelector('a.title span, .title');
            const l = sec.querySelector('a.cover, a[href*="/explore/"]');
            const a = sec.querySelector('.author .name, .author-wrapper .name');
            const k = sec.querySelector('.like-wrapper .count, span.count');
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
    for f in feeds:
        raw = f.get('likes_text', '') or ''
        if '万' in raw:
            num = re.sub(r'[^\d.]', '', raw)
            try: f['likes'] = int(float(num) * 10_000)
            except: f['likes'] = 0
        else:
            digits = re.sub(r'[^\d]', '', raw)
            f['likes'] = int(digits) if digits else 0
    feeds.sort(key=lambda x: -x['likes'])
    return feeds

def main():
    gaps = gap_list()
    log(f"=== retry start · {len(gaps)} gaps ===")
    cookies_raw = chrome_cookies('https://www.xiaohongshu.com/')
    pw_cookies = [{'name': k, 'value': v, 'domain': '.xiaohongshu.com', 'path': '/'} for k, v in cookies_raw.items()]
    log(f"cookies: {len(pw_cookies)}")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(user_agent=UA, viewport={'width': 1440, 'height': 900})
        ctx.add_cookies(pw_cookies)
        page = ctx.new_page()

        ok, fail = 0, 0
        for idx, dest in enumerate(gaps):
            name = dest['name']
            slug = slugify(name)
            outp = f"{HARVEST}/{slug}.json"
            # Try 3 query variants
            variants = [name, f"北京 {name}", f"{name} 北京"]
            feeds = None
            used_query = None
            last_err = None
            for q in variants:
                try:
                    feeds = harvest_one(page, name, q)
                    if feeds and feeds[0].get('title'):
                        used_query = q
                        break
                except Exception as e:
                    last_err = e
                    time.sleep(3)
            if not feeds or not feeds[0].get('title'):
                fail += 1
                err = f"{type(last_err).__name__}: {str(last_err)[:80]}" if last_err else "empty-feed"
                log(f"[{idx+1}/{len(gaps)}] ✗ {name} · tried {len(variants)} queries · {err}")
            else:
                top = feeds[:5]
                payload = {
                    'id': dest['id'],
                    'name': name,
                    'file': dest['file'],
                    'query': used_query,
                    'count': len(feeds),
                    'top5': top,
                    'harvested_at': time.strftime('%Y-%m-%dT%H:%M:%S'),
                    'retry': True,
                }
                open(outp, 'w').write(json.dumps(payload, ensure_ascii=False, indent=2))
                ok += 1
                log(f"[{idx+1}/{len(gaps)}] ✓ {name} [{used_query}] → {len(feeds)}, top: {top[0]['title'][:30]} ({top[0]['likes']}赞)")
            time.sleep(8)
        browser.close()
        log(f"=== retry done · ok={ok} fail={fail} ===")

if __name__ == '__main__':
    main()
