"""SZ retry second pass — 60 empty dests from first harvest.

Strategy:
- Category A (40 dest with city prefix "湛江金沙湾" etc): try {bare_spot} 攻略 first
  (XHS treats pure-city-prefix as a location filter and returns empty).
- Category B (20 generic/edge cases): try {name} (bare), {name} 打卡, {name} 游玩.
- Shuffle queue (seed=42) to avoid tail rate-limit.
- Keep only first non-empty result (up to 3 query variants per dest).
"""
import json, os, re, sys, time, hashlib, urllib.parse, random
from playwright.sync_api import sync_playwright

ROOT = os.path.expanduser("~/weekend-go")
OUT_DIR = f"{ROOT}/xhs-research/sz-harvest"
QUEUE = f"{ROOT}/xhs-research/sz-retry-queue.json"
LOG_PATH = f"{OUT_DIR}/_retry_progress.txt"

UA = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
      'AppleWebKit/537.36 (KHTML, like Gecko) '
      'Chrome/120.0.0.0 Safari/537.36')

PREF_CITIES = ['湛江','茂名','阳江','梅州','河源','清远','韶关','汕尾','汕头','潮州','揭阳',
               '佛山','中山','珠海','东莞','惠州','广州','肇庆','深圳','长沙','泉州']

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

def queries_for(name):
    """Return 2-3 query variants for this destination."""
    city = next((c for c in PREF_CITIES if name.startswith(c)), None)
    if city and len(name) > len(city):
        bare = name[len(city):]
        return [
            f"{bare} 攻略",
            f"{name}",
            f"{city} {bare} 攻略",
        ]
    return [
        f"{name}",
        f"{name} 打卡",
        f"{name} 游玩",
    ]

def harvest(page, query):
    url = f"https://www.xiaohongshu.com/search_result?keyword={urllib.parse.quote(query)}&source=web_explore_feed"
    page.goto(url, wait_until='networkidle', timeout=25_000)
    try:
        page.wait_for_selector('section.note-item', timeout=6_000)
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
    for f in feeds:
        raw = f.get('likes_text', '') or ''
        if '万' in raw:
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
    random.Random(42).shuffle(queue)
    total = len(queue)
    log(f"=== SZ retry start · {total} empties · shuffled ===")

    pw_cookies = json.load(open(os.path.expanduser('~/.mcp/rednote/cookies.json')))
    log(f"cookies injected: {len(pw_cookies)}")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(user_agent=UA, viewport={'width': 1440, 'height': 900}, locale='zh-CN')
        ctx.add_cookies(pw_cookies)
        page = ctx.new_page()

        ok, fail = 0, 0
        for idx, dest in enumerate(queue):
            name = dest['name']
            slug = slugify(name)
            outp = f"{OUT_DIR}/{slug}.json"
            # Skip if existing file has real content (shouldn't happen but defensive)
            if os.path.exists(outp):
                try:
                    existing = json.load(open(outp))
                    if existing.get('count', 0) > 0:
                        log(f"[{idx+1}/{total}] SKIP {name} (already has content)")
                        continue
                except Exception:
                    pass

            variants = queries_for(name)
            success = False
            for qi, q in enumerate(variants):
                try:
                    feeds = harvest(page, q)
                    if feeds:
                        top = feeds[:5]
                        payload = {
                            'id': dest['id'],
                            'name': name,
                            'file': dest['file'],
                            'query': q,
                            'query_variant': qi + 1,
                            'count': len(feeds),
                            'top5': top,
                            'harvested_at': time.strftime('%Y-%m-%dT%H:%M:%S'),
                        }
                        with open(outp, 'w') as fp:
                            json.dump(payload, fp, ensure_ascii=False, indent=2)
                        ok += 1
                        success = True
                        top_sample = top[0]['title'][:30]
                        log(f"[{idx+1}/{total}] ✓ {name} (via '{q}' v{qi+1}) → {len(feeds)} feeds, top: {top_sample} ({top[0]['likes']}赞)")
                        break
                except Exception as e:
                    log(f"[{idx+1}/{total}] ERR {name} q='{q}' {type(e).__name__}: {str(e)[:80]}")
                time.sleep(3.0)
            if not success:
                fail += 1
                log(f"[{idx+1}/{total}] ✗ {name} all {len(variants)} variants empty")
            time.sleep(2.0 if (idx + 1) % 10 else 5.0)

        browser.close()
        log(f"=== retry done · ok={ok} fail={fail} ===")

if __name__ == '__main__':
    main()
