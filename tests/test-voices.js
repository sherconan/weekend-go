// node tests/test-voices.js — 多城小红书笔记库结构 + getXhsVoices 路由
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const sb = { console };
vm.createContext(sb);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/xhs-voices-extra.js'), 'utf8'), sb, { filename: 'xhs-voices-extra.js' });
vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/xhs-voices.js'), 'utf8'), sb, { filename: 'xhs-voices.js' });

let passed = 0, failed = 0;
const assert = (c, msg) => { if (c) passed++; else { failed++; console.error('  ✗ ' + msg); } };

const EXTRA = vm.runInContext('XHS_VOICES_EXTRA', sb);
const keys = Object.keys(EXTRA);

// 1. 结构校验：键格式 city|name；每卡 1-3 条；字段齐全且真实可溯（url 指向小红书）
assert(keys.length >= 40, `多城笔记库应覆盖 ≥40 卡（实际 ${keys.length}）`);
assert(keys.every(k => /^[a-z]+\|.+$/.test(k)), '键格式均为 city|目的地名');
let badNote = 0;
for (const k of keys) {
  const arr = EXTRA[k];
  if (!Array.isArray(arr) || arr.length < 1 || arr.length > 3) { badNote++; continue; }
  for (const v of arr) {
    if (!v.title || typeof v.likes !== 'number' || !/^https:\/\/www\.xiaohongshu\.com\//.test(v.url || '')) badNote++;
  }
}
assert(badNote === 0, `所有笔记字段齐全且 url 真实指向小红书（违规 ${badNote}）`);
// 每卡内按 likes 降序
assert(keys.every(k => EXTRA[k].every((v, i, a) => i === 0 || a[i - 1].likes >= v.likes)), '每卡笔记按点赞降序');

// 2. 城市覆盖：天津、青岛核心卡在库
assert(keys.filter(k => k.startsWith('tianjin|')).length >= 20, '天津覆盖 ≥20 卡');
assert(keys.filter(k => k.startsWith('qingdao|')).length >= 20, '青岛覆盖 ≥20 卡');

// 3. getXhsVoices 路由：城市键优先 → shared 回落 → 北京老库回落
const get = (n, c) => vm.runInContext(`getXhsVoices(${JSON.stringify(n)}, ${JSON.stringify(c)})`, sb);
const tjKey = keys.find(k => k.startsWith('tianjin|'));
if (tjKey) {
  const name = tjKey.split('|')[1];
  assert(get(name, 'tianjin').length >= 1, '天津卡按城市键命中');
}
assert(get('北京环球影城', 'beijing').length === 3, '北京老库按名回落仍可用');
assert(get('不存在的地方', 'tianjin').length === 0, '未收录返回空数组');

console.log(`\nvoices tests: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
