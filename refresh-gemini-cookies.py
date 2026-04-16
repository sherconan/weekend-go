#!/usr/bin/env python3
"""Refresh baoyu-danger-gemini-web skill cookies from user's main Chrome."""
import json, os, sys, time
try:
    from pycookiecheat import chrome_cookies
except ImportError:
    print("ERR: pycookiecheat not installed", file=sys.stderr)
    sys.exit(2)

c = chrome_cookies('https://gemini.google.com')
ca = chrome_cookies('https://accounts.google.com')
for k, v in ca.items():
    if k not in c:
        c[k] = v
cm = {k: v for k, v in c.items() if isinstance(v, str) and v}
if not cm.get('__Secure-1PSID'):
    print("ERR: no 1PSID in main Chrome — user not signed in to Gemini?", file=sys.stderr)
    sys.exit(3)
out = {
    "version": 1,
    "updatedAt": time.strftime("%Y-%m-%dT%H:%M:%S.000Z", time.gmtime()),
    "source": "cdp",
    "cookieMap": cm,
}
base = os.path.expanduser("~/Library/Application Support/baoyu-skills/gemini-web")
with open(os.path.join(base, "cookies.json"), "w") as f:
    json.dump(out, f, indent=2)
# Clear rotate cache
for fn in os.listdir(base):
    if fn.startswith(".cached_1psidts_"):
        os.unlink(os.path.join(base, fn))
print(f"OK refreshed {len(cm)} cookies, 1PSID={cm['__Secure-1PSID'][:20]}...")
