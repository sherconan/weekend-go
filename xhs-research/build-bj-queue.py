"""Extract BJ dest list from 4 data files → queue.json (name, id, file)."""
import re, json, os
ROOT = os.path.expanduser("~/weekend-go")
FILES = [
    "js/data-beijing-500.js",
    "js/data-beijing-hidden.js",
    "js/data-beijing-tales.js",
    "js/data-beijing-new2026.js",
]
queue = []
for rel in FILES:
    txt = open(f"{ROOT}/{rel}").read()
    # Match BOTH bare (id: 430) and JSON-quoted ("id": 300) + name
    pattern = re.compile(r'(?:"?id"?\s*:\s*(\d+))[^{}]*?(?:"?name"?\s*:\s*"([^"]+)")', re.DOTALL)
    for m in pattern.finditer(txt):
        queue.append({"id": int(m.group(1)), "name": m.group(2), "file": rel})
print(f"total: {len(queue)}")
by_file = {}
for q in queue:
    by_file.setdefault(q["file"], 0)
    by_file[q["file"]] += 1
for f, n in by_file.items():
    print(f"  {f}: {n}")
with open(f"{ROOT}/xhs-research/bj-queue.json", "w") as fp:
    json.dump(queue, fp, ensure_ascii=False, indent=2)
print(f"saved → xhs-research/bj-queue.json")
