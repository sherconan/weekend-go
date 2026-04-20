"""Apply sz-harvest/{slug}.json → data-shenzhen.js xhsQuote + xhsHeat.

Idempotent: skips dests that already have xhsQuote (keeps the 3 existing ones).
Usage: python3 apply-sz-enrichment.py [--dry-run]
"""
import json, os, re, sys, hashlib
ROOT = os.path.expanduser("~/weekend-go")
HARVEST = f"{ROOT}/xhs-research/sz-harvest"
DRY = '--dry-run' in sys.argv

def slugify(name):
    h = hashlib.md5(name.encode()).hexdigest()[:8]
    ascii_part = re.sub(r'[^a-zA-Z0-9\u4e00-\u9fff]+', '', name)[:20]
    return f"{ascii_part}-{h}" if ascii_part else h

def heat_tier(top_likes):
    if top_likes >= 10_000: return '顶流'
    if top_likes >= 3_000:  return '高热'
    if top_likes >= 1_000:  return '中高热'
    if top_likes >= 300:    return '中热'
    if top_likes >= 100:    return '中低热'
    return '低热'

def shorten(s, n=14):
    s = (s or '').strip()
    return s[:n] + ('…' if len(s) > n else '')

def build_fields(data):
    top = data.get('top5') or []
    if not top:
        return None
    t1 = top[0]
    title = (t1.get('title') or '').strip()
    author = (t1.get('author') or '').strip()
    likes = t1.get('likes') or 0
    if not title or not author:
        return None
    xhs_quote = f'「{title}」— {author} @小红书（{likes}赞）'
    notes_parts = []
    for f in top[:3]:
        n = f.get('likes') or 0
        t = shorten(f.get('title') or '')
        if t:
            notes_parts.append(f'{n}赞{t}')
    notes = ' / '.join(notes_parts) if notes_parts else ''
    return {
        'xhsQuote': xhs_quote,
        'xhsHeat': {'heat': heat_tier(likes), 'notes': notes, 'trending': ''},
    }

def is_bare_syntax(text):
    return bool(re.search(r'^\s{4}id:\s+\d+', text, re.MULTILINE))

def format_bare(fields):
    q = fields['xhsQuote'].replace('"', '\\"')
    h = fields['xhsHeat']
    notes = h['notes'].replace('"', '\\"')
    trending = h['trending'].replace('"', '\\"')
    return (
        f'    xhsQuote: "{q}",\n'
        f'    xhsHeat: {{\n'
        f'      heat: "{h["heat"]}",\n'
        f'      notes: "{notes}",\n'
        f'      trending: "{trending}"\n'
        f'    }}'
    )

def format_quoted(fields):
    q = fields['xhsQuote'].replace('"', '\\"')
    h = fields['xhsHeat']
    notes = h['notes'].replace('"', '\\"')
    trending = h['trending'].replace('"', '\\"')
    return (
        f'    "xhsQuote": "{q}",\n'
        f'    "xhsHeat": {{\n'
        f'      "heat": "{h["heat"]}",\n'
        f'      "notes": "{notes}",\n'
        f'      "trending": "{trending}"\n'
        f'    }}'
    )

def patch_file(rel_path):
    full = f"{ROOT}/{rel_path}"
    src = open(full).read()
    bare = is_bare_syntax(src)
    print(f"== {rel_path} · bare={bare} ==")

    dest_blocks = []
    depth = 0
    start = None
    for i, ch in enumerate(src):
        if ch == '{':
            if depth == 0:
                start = i
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0 and start is not None:
                dest_blocks.append((start, i + 1))
                start = None

    modified = 0
    skipped = 0
    not_found = 0
    out = src
    for (bstart, bend) in sorted(dest_blocks, key=lambda x: -x[0]):
        block = out[bstart:bend]
        if '"xhsQuote"' in block or 'xhsQuote:' in block:
            skipped += 1
            continue
        mname = re.search(r'(?:"?name"?\s*:\s*)"([^"]+)"', block)
        if not mname:
            continue
        name = mname.group(1)
        slug = slugify(name)
        harvest_p = f"{HARVEST}/{slug}.json"
        if not os.path.exists(harvest_p):
            not_found += 1
            continue
        try:
            data = json.load(open(harvest_p))
        except Exception:
            not_found += 1
            continue
        fields = build_fields(data)
        if not fields:
            not_found += 1
            continue
        addition = format_bare(fields) if bare else format_quoted(fields)
        j = bend - 2
        while j > bstart and out[j] in ' \n\t\r':
            j -= 1
        insert_str = ',\n' + addition + '\n  '
        out = out[:j+1] + insert_str + out[j+1:]
        modified += 1

    print(f"  modified={modified} skipped(has-xhs)={skipped} no-harvest={not_found}")
    if not DRY and modified > 0:
        open(full, 'w').write(out)
        print(f"  wrote {full}")
    return modified, skipped, not_found

def main():
    patch_file("js/data-shenzhen.js")

if __name__ == '__main__':
    main()
