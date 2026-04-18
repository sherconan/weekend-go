#!/usr/bin/env python3
"""Batch image regen via ChatGPT Web (AppleScript → Chrome UI automation).
Processes remaining Pollinations queue items that Gemini hasn't done yet."""
import json, os, sys, time, subprocess, base64, argparse
from PIL import Image

ROOT = '/Users/sherconan/weekend-go'
QUEUE = f'{ROOT}/pollinations-regen-queue.json'
ASSETS = f'{ROOT}/assets/images'
BACKUP = f'{ROOT}/assets/images-pollinations-backup'
TARGET_W, TARGET_H = 1376, 768

def chrome_js_file(js_path, timeout=30):
    """Execute JS from file in Chrome's chatgpt.com tab."""
    applescript = f'''
    set jsCode to read POSIX file "{js_path}" as «class utf8»
    tell application "Google Chrome"
        set theTab to missing value
        repeat with w in windows
            repeat with t in tabs of w
                if URL of t starts with "https://chatgpt.com" then
                    set theTab to t
                    exit repeat
                end if
            end repeat
            if theTab is not missing value then exit repeat
        end repeat
        if theTab is missing value then return "ERR:no_chatgpt_tab"
        return execute theTab javascript jsCode
    end tell
    '''
    r = subprocess.run(['osascript', '-e', applescript], capture_output=True, text=True, timeout=timeout)
    if r.returncode != 0:
        return f"ERR:applescript:{r.stderr[:200]}"
    return r.stdout.strip()


def chrome_js(code, timeout=30):
    """Execute inline JS."""
    tmp = '/tmp/_cg_batch_cmd.js'
    with open(tmp, 'w') as f:
        f.write(code)
    result = chrome_js_file(tmp, timeout)
    return result


def get_remaining():
    """Get list of items not yet regenerated."""
    with open(QUEUE) as f:
        queue = json.load(f)
    remaining = []
    for item in queue:
        src = os.path.join(ASSETS, item['file'])
        bak = os.path.join(BACKUP, item['file'])
        if os.path.exists(src) and os.path.exists(bak):
            if os.path.getsize(src) != os.path.getsize(bak):
                continue  # already regenerated
        remaining.append(item)
    return remaining


def generate_one(item, idx, total):
    """Generate one image via ChatGPT Web UI automation."""
    name = item['name']
    fname = item['file']
    prompt = item['prompt']
    out_path = os.path.join(ASSETS, fname)

    # Step 1: Set prompt in input and send
    input_js = f'''(function() {{
        var input = document.querySelector('#prompt-textarea') || document.querySelector('[contenteditable="true"]');
        if (!input) return 'ERR:no_input';
        input.focus();
        input.textContent = {json.dumps(prompt)};
        input.dispatchEvent(new Event('input', {{ bubbles: true }}));
        return 'OK';
    }})()'''

    r = chrome_js(input_js)
    if r != 'OK':
        print(f'[{idx}/{total}] ERR input: {r}', flush=True)
        return False

    time.sleep(2.5)

    # Click send — poll up to 10s for send button to render (React re-render after input)
    r2 = 'ERR:no_btn'
    for _ in range(10):
        r2 = chrome_js('''(function() {
            var btn = document.querySelector('button[data-testid="send-button"]');
            if (btn && !btn.disabled) { btn.click(); return 'OK'; }
            return btn ? 'ERR:btn_disabled' : 'ERR:no_btn';
        })()''')
        if r2 == 'OK':
            break
        time.sleep(1)
    if r2 != 'OK':
        print(f'[{idx}/{total}] ERR send: {r2}', flush=True)
        return False

    # Step 2: Poll for image (max 120s)
    for wait in range(60):
        time.sleep(3)
        check = chrome_js('''(function() {
            var imgs = document.querySelectorAll('img');
            for (var i = imgs.length - 1; i >= 0; i--) {
                if (imgs[i].naturalWidth > 1000 && imgs[i].src.indexOf('estuary/content') >= 0) {
                    return 'FOUND:' + imgs[i].src;
                }
            }
            // Check if still generating
            var spinners = document.querySelectorAll('[data-testid="streaming"], .result-streaming, .animate-spin');
            if (spinners.length > 0) return 'GENERATING';
            return 'WAITING';
        })()''')

        if check.startswith('FOUND:'):
            img_url = check[6:]
            break
        if check == 'WAITING' and wait > 20:
            # Might be done but no image (text-only response)
            print(f'[{idx}/{total}] WARN: no image after {wait*3}s for {name}', flush=True)
            if wait > 40:
                print(f'[{idx}/{total}] ❌ {name} — timeout no image', flush=True)
                return False
    else:
        print(f'[{idx}/{total}] ❌ {name} — timeout 180s', flush=True)
        return False

    # Step 3: Download image via curl
    token = chrome_js('''(function() {
        var x = new XMLHttpRequest();
        x.open('GET', '/api/auth/session', false);
        x.send();
        return JSON.parse(x.responseText).accessToken || 'ERR';
    })()''')

    if token.startswith('ERR'):
        print(f'[{idx}/{total}] ERR token: {token}', flush=True)
        return False

    from pycookiecheat import chrome_cookies
    cookies = chrome_cookies('https://chatgpt.com')
    cookie_str = '; '.join(f'{k}={v}' for k, v in cookies.items())

    tmp_png = f'/tmp/cg-{fname.replace(".webp", "")}.png'
    dl = subprocess.run([
        'curl', '-s', '-o', tmp_png,
        '-H', f'Authorization: Bearer {token}',
        '-H', 'User-Agent: Mozilla/5.0',
        '-b', cookie_str,
        img_url,
    ], timeout=60)

    if dl.returncode != 0 or not os.path.exists(tmp_png) or os.path.getsize(tmp_png) < 50000:
        print(f'[{idx}/{total}] ❌ {name} — download failed', flush=True)
        return False

    # Step 4: Resize to 1376x768 + convert to webp
    img = Image.open(tmp_png).convert('RGB')
    w, h = img.size
    target_aspect = TARGET_W / TARGET_H
    current_aspect = w / h
    if abs(current_aspect - target_aspect) > 0.02:
        if current_aspect > target_aspect:
            new_w = int(h * target_aspect)
            left = (w - new_w) // 2
            img = img.crop((left, 0, left + new_w, h))
        else:
            new_h = int(w / target_aspect)
            top = (h - new_h) // 2
            img = img.crop((0, top, w, top + new_h))
    img = img.resize((TARGET_W, TARGET_H), Image.LANCZOS)
    img.save(out_path, 'WEBP', quality=90, method=6)
    os.unlink(tmp_png)

    final_size = os.path.getsize(out_path)
    print(f'[{idx}/{total}] ✅ {name} → {fname} {w}x{h}→{TARGET_W}x{TARGET_H} ({final_size//1024}KB) [ChatGPT]', flush=True)

    # Step 5: Start new chat to avoid context buildup
    chrome_js('''(function() {
        var newChat = document.querySelector('a[data-testid="create-new-chat-button"]') || document.querySelector('nav a[href="/"]');
        if (newChat) newChat.click();
        return 'OK';
    })()''')
    time.sleep(2)

    return True


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--limit', type=int, default=0, help='Max images to generate (0=all)')
    parser.add_argument('--delay', type=int, default=5, help='Delay between images (seconds)')
    args = parser.parse_args()

    remaining = get_remaining()
    print(f'Remaining: {len(remaining)} images')

    if args.limit > 0:
        remaining = remaining[:args.limit]
        print(f'Limited to: {len(remaining)}')

    ok = fail = 0
    for i, item in enumerate(remaining):
        success = generate_one(item, i + 1, len(remaining))
        if success:
            ok += 1
        else:
            fail += 1
        if i < len(remaining) - 1:
            time.sleep(args.delay)

    print(f'\n=== DONE === ok={ok} fail={fail}')


if __name__ == '__main__':
    main()
