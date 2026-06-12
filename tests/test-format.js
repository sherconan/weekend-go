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

// 7. 圈数字编号串（成都/恩施写法）→ 条目 + 数字徽标
const CD = loadVar('js/data-chengdu.js', 'DESTINATIONS_CD');
const cdItems = toItems(CD[0].whatToDo);
assert(cdItems.length >= 6, `成都圈数字串应拆成多条（实际 ${cdItems.length}）`);
const cdHtml = formatDestContent(CD[0].whatToDo);
assert(cdHtml.includes('content-item-num">1<') && cdHtml.includes('content-item-num">2<'), '圈数字①②转成数字徽标 1 2');

// 8. 交通方式前缀段（天津写法："自驾：…大巴：…火车：…"）
const liItems = toItems(TJ.find(d => d.name.includes('梨木台')).howToGet);
assert(liItems.length >= 3, `交通前缀段应拆成 ≥3 条（实际 ${liItems.length}）`);
assert(liItems.some(s => s.startsWith('自驾')) && liItems.some(s => s.startsWith('火车')), '按自驾/大巴/火车边界拆分');

// 9. 无编号分号多方案（恩施交通/青岛美食写法）
const ES = loadVar('js/data-enshi.js', 'DESTINATIONS_ES');
const fh = ES.find(d => d.name.includes('凤凰古城'));
assert(toItems(fh.howToGet).length >= 3, '恩施分号多方案拆成 ≥3 条');

// 10. 真叙述长段：句号分段为多 <p>，不转条目（保叙事）
const longNarr = '这是第一句介绍，讲述这个地方的历史渊源和文化背景，内容比较充实。这是第二句，详细描述建筑风格和园林布局的独到之处与匠心细节。这是第三句，讲游览动线和不同时段的光线变化带来的体验差异。这是第四句，补充周边配套、交通方式与门票概况，以及四季景色的变化，确保段落总长明确超过一百五十字以稳定触发分段逻辑。';
const narrHtml = formatDestContent(longNarr);
assert((narrHtml.match(/<p>/g) || []).length >= 2 && !narrHtml.includes('content-item'), '长叙述分段为多个段落而非条目');

// 11. 北京住宿类真段落（短句+顿号混写）保持整段不误拆
assert(toItems('半日游为主。日出东方酒店（奢）、周边民宿（200-500元）。').length === 1, '短真段落不拆');

// 12. 全库冒烟：957 卡 × 5 字段，零"该拆没拆"（含编号特征却渲染成单段 = 失败）
const BJ_FILES = [['js/data.js','DESTINATIONS'],['js/data-extra.js','DESTINATIONS_EXTRA'],['js/data-extra2.js','DESTINATIONS_EXTRA2'],['js/data-beijing-500.js','DESTINATIONS_BJ500'],['js/data-beijing-expand.js','DESTINATIONS_BJ_EXPAND'],['js/data-beijing-hidden.js','DESTINATIONS_BJ_HIDDEN'],['js/data-beijing-tales.js','DESTINATIONS_BJ_TALES'],['js/data-beijing-new2026.js','DESTINATIONS_BJ_2026']];
const ONE_FILE = { shenzhen:['js/data-shenzhen.js','DESTINATIONS_SZ'], weihai:['js/data-weihai.js','DESTINATIONS_WH'], suzhou:['js/data-suzhou.js','DESTINATIONS_SU'], tianjin:['js/data-tianjin.js','DESTINATIONS_TJ'], qingdao:['js/data-qingdao.js','DESTINATIONS_QD'], chengdu:['js/data-chengdu.js','DESTINATIONS_CD'], hangzhou:['js/data-hangzhou.js','DESTINATIONS_HZ'], chongqing:['js/data-chongqing.js','DESTINATIONS_CQ'], enshi:['js/data-enshi.js','DESTINATIONS_ES'] };
function loadMerged(files) {
  const sb = { console }; vm.createContext(sb);
  for (const [f] of files) { try { vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sb, { filename: f }); } catch (e) {} }
  const out = [], seen = new Set();
  for (const [, v] of files) { let a; try { a = vm.runInContext(v, sb); } catch (e) { a = null; }
    if (Array.isArray(a)) for (const d of a) { if (d && d.id != null && !seen.has(d.id)) { seen.add(d.id); out.push(d); } } }
  return out;
}
const ALL_CITIES = { beijing: loadMerged(BJ_FILES) };
for (const k in ONE_FILE) ALL_CITIES[k] = loadMerged([ONE_FILE[k]]);
const FIELDS = ['whatToDo', 'whereToEat', 'whereToStay', 'howToGet', 'tips'];
let total = 0; const stuck = [];
for (const [city, arr] of Object.entries(ALL_CITIES)) {
  for (const d of arr) for (const f of FIELDS) {
    const t = String(d[f] == null ? '' : d[f]).trim();
    if (!t) continue;
    total++;
    const n = toItems(t).length;
    const numHits = (t.match(/(?:^|[；;。\s（(])\d{1,2}\s*[.、]\s*(?!\d)\S/g) || []).length + (t.match(/[①-⑳]/g) || []).length;
    if (n === 1 && numHits >= 2) stuck.push(`${city}/${d.name}/${f}`);
  }
}
assert(stuck.length === 0, `全库零"该拆没拆"（违规 ${stuck.length}：${stuck.slice(0, 5).join(' | ')}）`);
console.log(`   全库冒烟扫描：${total} 个非空字段`);

console.log(`\nformat tests: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
