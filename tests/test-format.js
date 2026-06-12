// node tests/test-format.js — 详情排版函数单测（用真实数据：盘山/古北水镇）
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { formatDestContent, toItems } = require('../js/format-content.js');

const ROOT = path.join(__dirname, '..');
function loadVar(file, varName) {
  const sb = { console };
  vm.createContext(sb);
  vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), sb, { filename: file });
  return vm.runInContext(varName, sb);
}

let passed = 0, failed = 0;
const assert = (c, msg) => { if (c) passed++; else { failed++; console.error('  ✗ ' + msg); } };

// 1. 真实数据：盘山（编号分号串，无换行）→ 8 个条目
const TJ = loadVar('js/data-tianjin.js', 'DESTINATIONS_TJ');
const panshan = TJ.find(d => d.name.includes('盘山'));
const psItems = toItems(panshan.whatToDo);
assert(psItems.length === 8, `盘山玩法应拆成 8 条（实际 ${psItems.length}）`);
assert(psItems[0].startsWith('1.') && psItems[7].startsWith('8.'), '条目保留编号且有序');
const psHtml = formatDestContent(panshan.whatToDo);
assert((psHtml.match(/content-item-num/g) || []).length === 8, '渲染出 8 个序号徽标');
assert(psHtml.includes('>导航盘山风景名胜区'), '编号从正文剥离（徽标+正文分离）');

// 2. 真实数据：盘山美食（顿号枚举 + 括号内顿号保护）
const eatItems = toItems(panshan.whereToEat);
assert(eatItems.length === 3, `盘山美食应拆成 3 条（实际 ${eatItems.length}：${JSON.stringify(eatItems)}）`);
assert(eatItems.some(x => x.includes('铁锅炖水库鱼、千层肉饼')), '括号内顿号不被误拆');
const eatHtml = formatDestContent(panshan.whereToEat);
assert((eatHtml.match(/content-item--bullet/g) || []).length === 3, '无编号枚举渲染为 bullet 条目');

// 3. 真实数据：古北水镇（换行格式）→ 行为回归不变
const BJ = loadVar('js/data.js', 'DESTINATIONS');
const gubei = BJ.find(d => d.name === '古北水镇');
const gbLines = gubei.whatToDo.split('\n').map(s => s.trim()).filter(Boolean).length;
assert(toItems(gubei.whatToDo).length === gbLines, `换行格式条目数与行数一致（${gbLines}）`);

// 4. 普通句子（含句号）不被拆
const para = toItems('这是一段正常的介绍，有逗号、也有顿号，但它是句子。还有第二句。');
assert(para.length === 1, '含句号的叙述保持整段');
assert(formatDestContent('单句无结构').startsWith('<p>'), '单条渲染为段落');

// 5. 空值与转义
assert(formatDestContent('') === '' && formatDestContent(null) === '', '空值返回空串');
assert(formatDestContent('1. a<b；2. c').includes('&lt;'), '尖括号被转义');

// 6. 收尾句号的枚举仍可拆
const tail = toItems('张记包子、李记炸糕、王记面茶。');
assert(tail.length === 3, '带收尾句号的顿号枚举可拆');

console.log(`\nformat tests: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
