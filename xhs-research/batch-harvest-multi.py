"""
多城 XHS batch harvest（天津/青岛/跨城卡）— 复用 batch-harvest-playwright.py 管线。
headless + 主 Chrome cookie，零弹窗；幂等（{slug}.json 存在即跳过）。

用法: /tmp/xhs-harvest-venv/bin/python batch-harvest-multi.py <queue.json> <out_subdir>
输出: xhs-research/<out_subdir>/{slug}.json + _progress.txt
"""
import json, os, re, sys, time, hashlib, urllib.parse
from pycookiecheat import chrome_cookies
from playwright.sync_api import sync_playwright

ROOT = os.path.expanduser("~/weekend-go")
QUEUE = sys.argv[1] if len(sys.argv) > 1 else f"{ROOT}/xhs-research/tjqd-queue.json"
OUT_DIR = f"{ROOT}/xhs-research/{sys.argv[2] if len(sys.argv) > 2 else 'tjqd-harvest'}"
os.makedirs(OUT_DIR, exist_ok=True)
LOG_PATH = f"{OUT_DIR}/_progress.txt"

UA = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
      'AppleWebKit/537.36 (KHTML, like Gecko) '
      'Chrome/120.0.0.0 Safari/537.36')


def log(msg):
    line = f"[{time.strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    with open(LOG_PATH, "a") as fp:
        fp.write(line + "\n")


def slugify(name):
    h = hashlib.md5(name.encode()).hexdigest()[:8]
    ascii_part = re.sub(r'[^a-zA-Z0-9一-鿿]+', '', name)[:20]
    return f"{ascii_part}-{h}" if ascii_part else h


def harvest_one(page, name, city):
    # 城市词缀提升命中（"五四广场 攻略"会混入别城同名地标）
    city_word = {'tianjin': '天津', 'qingdao': '青岛'}.get(city, '')
    kw = f"{city_word}{name} 攻略" if city_word and city_word not in name else f"{name} 攻略"
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
    return [f for f in feeds if f['title']][:5]


def main():
    queue = json.load(open(QUEUE))
    total = len(queue)
    log(f"queue={total} out={OUT_DIR}")
    ck = chrome_cookies('https://www.xiaohongshu.com/')
    pw_cookies = [{'name': k, 'value': v, 'domain': '.xiaohongshu.com', 'path': '/'} for k, v in ck.items()]
    ok = fail = skip = 0
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(user_agent=UA, viewport={'width': 1440, 'height': 900})
        ctx.add_cookies(pw_cookies)
        page = ctx.new_page()
        for idx, item in enumerate(queue):
            name, city = item['name'], item.get('city', '')
            slug = slugify(f"{city}-{name}")
            path = f"{OUT_DIR}/{slug}.json"
            if os.path.exists(path):
                skip += 1
                log(f"[{idx+1}/{total}] SKIP {name} (cached)")
                continue
            try:
                feeds = harvest_one(page, name, city)
                payload = {'id': item.get('id'), 'name': name, 'city': city, 'feeds': feeds}
                with open(path, 'w') as fp:
                    json.dump(payload, fp, ensure_ascii=False, indent=2)
                ok += 1
                log(f"[{idx+1}/{total}] OK {name} feeds={len(feeds)}")
            except Exception as e:
                fail += 1
                log(f"[{idx+1}/{total}] FAIL {name}: {str(e)[:80]}")
            time.sleep(2.5 + (idx % 3))  # 2.5-4.5s 节流
        browser.close()
    log(f"DONE ok={ok} fail={fail} skip={skip}")


if __name__ == '__main__':
    main()
