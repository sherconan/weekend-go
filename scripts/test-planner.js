#!/usr/bin/env node
// Smoke test the planner algorithm outside the browser
const fs = require('fs');
const { runInNewContext } = require('vm');

const sb = { window:{}, module:{exports:{}}, console, globalThis:{} };
const files = ['config/cities.js','js/data.js','js/data-extra.js','js/data-extra2.js',
  'js/data-beijing-500.js','js/data-beijing-expand.js','js/data-beijing-hidden.js',
  'js/data-beijing-tales.js','js/data-beijing-new2026.js',
  'js/data-shenzhen.js','js/data-weihai.js','js/data-suzhou.js',
  'js/data-tianjin.js','js/data-qingdao.js','js/data-chengdu.js','js/data-hangzhou.js',
  'js/data-shared-cross-city.js'];
for (const f of files) {
  const src = fs.readFileSync(f,'utf-8').replace(/\bconst\s+(\w+)\s*=/g,'var $1 =');
  try { runInNewContext(src, sb, {timeout:5000}); } catch(e) { /* skip */ }
}

// Load planner.js with a small transform (strip IIFE + expose)
let plSrc = fs.readFileSync('js/planner.js','utf-8');
// Replace IIFE with exposure
plSrc = plSrc.replace(/\(function\(\)\{/, '(function(){')
  .replace(/if \(document\.readyState === 'loading'\)[\s\S]*?init\(\);\s*\}/, '')
  .replace(/\}\)\(\);\s*$/, '\nmodule.exports={generatePlan,generateMultiCityPlan,loadCityDests,scoreDest,durationHours,allocateDays,assignTimeSlots,THEME_FAMILIES,budgetOk,haversineKm};\n})();');
// Strip document references inside exposed fns
const browserGuard = `
var document = { readyState:'complete', addEventListener:()=>{}, getElementById:()=>({style:{},addEventListener:()=>{},innerHTML:'',querySelectorAll:()=>[],insertAdjacentHTML:()=>{},scrollIntoView:()=>{}}), querySelectorAll:()=>[], createElement:()=>({getContext:()=>({}),width:0,height:0,toBlob:()=>{}}), body:{appendChild:()=>{},removeChild:()=>{}} };
var localStorage = { _s:{}, getItem(k){return this._s[k]||null;}, setItem(k,v){this._s[k]=v;}, removeItem(k){delete this._s[k];} };
var navigator = { clipboard:{ writeText:()=>Promise.resolve() } };
`;
plSrc = browserGuard + plSrc;

runInNewContext(plSrc, sb, {timeout:5000});
const api = sb.module.exports;
if (!api || !api.generatePlan) { console.error('✗ API not exposed'); process.exit(1); }

// Run tests
const testCases = [
  { city:'beijing', days:2, themes:['历史文化'], budget:'200-500', label:'BJ 2日历史' },
  { city:'beijing', days:3, themes:['自然户外','摄影打卡'], budget:'500-1000', label:'BJ 3日自然+摄影' },
  { city:'shenzhen', days:1, themes:['美食吃喝'], budget:'200-500', label:'SZ 1日美食' },
  { city:'hangzhou', days:2, themes:[], budget:'200-500', label:'HZ 2日全主题' },
  { city:'qingdao', days:2, themes:['度假慢游'], budget:'500-1000', label:'QD 2日度假' },
  { city:'tianjin', days:1, themes:['历史文化','美食吃喝'], budget:'200以下', label:'TJ 1日紧预算' },
  // Multi-city test cases
  { city:'beijing', city2:'tianjin', days:2, themes:['历史文化'], budget:'500-1000', label:'BJ+TJ 2日联程' },
  { city:'suzhou', city2:'hangzhou', days:3, themes:['历史文化'], budget:'500-1000', label:'SU+HZ 3日江南' },
  { city:'qingdao', city2:'weihai', days:2, themes:['度假慢游'], budget:'500-1000', label:'QD+WH 2日海滨' },
];

let pass = 0, fail = 0;
for (const tc of testCases) {
  const p = api.generatePlan(tc.city, tc.days, tc.themes, tc.budget, tc.city2);
  if (p.error) {
    console.log(`✗ ${tc.label}: ${p.error}`);
    fail++;
    continue;
  }
  // Multi-city: filter out transit markers
  const dayObjs = p.days.filter(d => !d.isTransit);
  const expectedDays = tc.days;
  const ok = dayObjs.length === expectedDays && dayObjs.every(d => d.slots.length >= 1);
  if (ok) {
    const extra = p.isMultiCity ? ` [multi: transit ¥${p.transit.cost} · ${p.transit.km}km · ${p.transit.hours}h]` : '';
    console.log(`✓ ${tc.label}: ${p.totalDests} dests, ¥${p.totalBudget}${extra}`);
    for (const day of p.days) {
      if (day.isTransit) {
        console.log(`  🚄 ${day.fromLabel} → ${day.toLabel} (${day.km}km, ${day.hours}h, ¥${day.cost})`);
        continue;
      }
      const label = day.cityLabel ? ` [${day.cityLabel}]` : '';
      const names = day.slots.map(s => `${s.startText} ${s.dest.name}`).join(' → ');
      console.log(`  D${day.idx}${label} (${day.hours}h): ${names}`);
    }
    pass++;
  } else {
    console.log(`✗ ${tc.label}: days=${dayObjs.length}/${expectedDays}, slots=${dayObjs.map(d=>d.slots.length).join(',')}`);
    fail++;
  }
}

console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail ? 1 : 0);
