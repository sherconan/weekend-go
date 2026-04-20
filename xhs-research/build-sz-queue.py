"""Extract SZ dest list from data-shenzhen.js → sz-queue.json (name, id, file)."""
import re, json, os
ROOT = os.path.expanduser("~/weekend-go")
FILES = ["js/data-shenzhen.js"]
queue = []
for rel in FILES:
    txt = open(f"{ROOT}/{rel}").read()
    pattern = re.compile(r'(?:"?id"?\s*:\s*(\d+))[^{}]*?(?:"?name"?\s*:\s*"([^"]+)")', re.DOTALL)
    for m in pattern.finditer(txt):
        queue.append({"id": int(m.group(1)), "name": m.group(2), "file": rel})
print(f"total: {len(queue)}")
with open(f"{ROOT}/xhs-research/sz-queue.json", "w") as fp:
    json.dump(queue, fp, ensure_ascii=False, indent=2)
print("saved → xhs-research/sz-queue.json")
