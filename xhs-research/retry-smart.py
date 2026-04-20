"""
Smart retry for 55 BJ gaps using category-aware query variants.

City-outside-BJ type (like 青岛/曲阜/大同): try "{name} 旅游攻略", "{name} 两日游", "{name} 一日游"
Beijing-inside type (like 景山公园/法源寺): try "北京 {name}", "{name} 打卡", "{name} 攻略"

Shuffle queue to avoid putting single-category dests at tail (rate-limit risk).
"""
import json, os, re, time, hashlib, urllib.parse, random
from pycookiecheat import chrome_cookies
from playwright.sync_api import sync_playwright

ROOT = os.path.expanduser("~/weekend-go")
HARVEST = f"{ROOT}/xhs-research/bj-harvest"
QUEUE = f"{ROOT}/xhs-research/bj-gaps-queue.json"
LOG = f"{HARVEST}/_retry2.txt"

UA = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
      'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

CITIES_OUTSIDE_BJ = {'青岛','曲阜','大同','天津','塘沽','邯郸','邢台','朝阳','承德',
                     '秦皇岛','唐山','沧州','石家庄','济南','烟台','威海','日照','临沂',
                     '莱州','蓬莱','荣成','栖霞','枣庄','东营','潍坊','济宁','林州',
                     '营口','铁岭','锦州','大悦'}

def log(msg):
    line = f"[{time.strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    open(LOG, 'a').write(line + "\n")

def slugify(name):
    h = hashlib.md5(name.encode()).hexdigest()[:8]
    ascii_part = re.sub(r'[^a-zA-Z0-9\u4e00-\u9fff]+', '', name)[:20]
    return f"{ascii_part}-{h}" if ascii_part else h

def is_outside_city(name):
    for c in CITIES_OUTSIDE_BJ:
        if name == c or name.startswith(c):
            return True
    return False

def queries_for(name):
    if is_outside_city(name):
        return [f"{name} 旅游攻略", f"{name} 两日游", f"{name} 一日游", f"{name}周边游"]
    # beijing-inside / small site
    return [f"北京 {name} 打卡", f"{name} 打卡", f"北京 {name}", f"{name} 攻略"]

def harvest(page, query):
    url = f"https://www.xiaohongshu.com/search_result?keyword={urllib.parse.quote(query)}&source=web_explore_feed"
    page.goto(url, wait_until='networkidle', timeout=45_000)
    try:
        page.wait_for_selector('section.note-item', timeout=10_000)
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
    queue = json.load(open(QUEUE))
    random.seed(42)
    random.shuffle(queue)  # avoid category tailing
    log(f"=== retry-smart · {len(queue)} gaps (shuffled) ===")

    cookies_raw = chrome_cookies('https://www.xiaohongshu.com/')
    pw = [{'name':k,'value':v,'domain':'.xiaohongshu.com','path':'/'} for k,v in cookies_raw.items()]
    log(f"cookies: {len(pw)}")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(user_agent=UA, viewport={'width':1440,'height':900})
        ctx.add_cookies(pw)
        page = ctx.new_page()

        ok, fail = 0, 0
        for idx, dest in enumerate(queue):
            name = dest['name']
            slug = slugify(name)
            outp = f"{HARVEST}/{slug}.json"
            # Skip if already filled successfully by prior runs
            if os.path.exists(outp):
                try:
                    j = json.load(open(outp))
                    if j.get('top5') and j['top5'][0].get('title'):
                        log(f"[{idx+1}/{len(queue)}] SKIP {name} (already has data)")
                        continue
                except: pass

            variants = queries_for(name)
            feeds = None
            used_q = None
            last_err = None
            for q in variants:
                try:
                    f = harvest(page, q)
                    if f and f[0].get('title'):
                        feeds = f
                        used_q = q
                        break
                except Exception as e:
                    last_err = e
                    time.sleep(4)
            if not feeds:
                fail += 1
                err = f"{type(last_err).__name__}: {str(last_err)[:80]}" if last_err else "empty-all-variants"
                log(f"[{idx+1}/{len(queue)}] ✗ {name} · {len(variants)} queries · {err}")
            else:
                payload = {
                    'id': dest['id'], 'name': name, 'file': dest['file'],
                    'query': used_q, 'count': len(feeds), 'top5': feeds[:5],
                    'harvested_at': time.strftime('%Y-%m-%dT%H:%M:%S'),
                    'retry_smart': True,
                }
                open(outp, 'w').write(json.dumps(payload, ensure_ascii=False, indent=2))
                ok += 1
                t = feeds[0]['title'][:30]
                log(f"[{idx+1}/{len(queue)}] ✓ {name} [{used_q}] → {len(feeds)}, top: {t} ({feeds[0]['likes']}赞)")
            time.sleep(6)
        browser.close()
        log(f"=== retry-smart done · ok={ok} fail={fail} ===")

if __name__ == '__main__':
    main()
