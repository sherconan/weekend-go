// format-content.js — 详情内容排版：把数据里的三种真实写法统一渲染成卡片条目
//   ① 换行分隔（北京老数据）："1. xxx\n2. xxx"
//   ② 编号分号串（天津等新数据）："1. xxx；2. xxx；…8. xxx。"
//   ③ 顿号纯枚举（美食/住宿短列表）："A（a、b）、B、C" —— 括号内顿号不拆
// 供 index.html 详情弹窗（app.js fmt）与 dest.html 独立页（dest.js）共用。
(function () {
  'use strict';

  // 顶层顿号拆分：忽略中英文括号内的顿号
  function splitTopLevel(text, sep) {
    const out = [];
    let depth = 0;
    let cur = '';
    for (const ch of text) {
      if (ch === '（' || ch === '(') depth++;
      else if (ch === '）' || ch === ')') depth = Math.max(0, depth - 1);
      if (ch === sep && depth === 0) {
        if (cur.trim()) out.push(cur.trim());
        cur = '';
      } else {
        cur += ch;
      }
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  }

  // 交通方式前缀（"自驾：… 大巴：… 火车：…"单段交通攻略）
  var TRANSPORT_RE = /(?=(?:自驾|公交|大巴|高铁|火车|地铁|轻轨|打车|包车|拼车|轮渡|船|航班|飞机|动车|骑行|步行)\s*[：:])/;

  function toItems(text) {
    const t = String(text == null ? '' : text).trim();
    if (!t) return [];
    // ① 换行
    if (t.indexOf('\n') !== -1) {
      return t.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
    }
    // ② 圈数字编号串："①xxx；②xxx…"（成都/恩施写法）
    if ((t.match(/[①-⑳]/g) || []).length >= 2) {
      return t.split(/[；;]?\s*(?=[①-⑳])/).map(function (s) { return s.trim().replace(/^[；;]/, '').trim(); }).filter(Boolean);
    }
    // ③ 阿拉伯编号分号串："1. xxx；2. xxx"（天津写法）；(?!\d) 防止"2.5 小时"小数被误切
    const numbered = t.split(/[；;]\s*(?=\d+\s*[.、](?!\d))/).map(function (s) { return s.trim(); }).filter(Boolean);
    if (numbered.length >= 2) return numbered;
    // ④ 交通方式前缀段（"自驾：…。大巴：…。"）：≥2 个方式词冒号
    const transports = t.split(TRANSPORT_RE).map(function (s) { return s.trim(); }).filter(Boolean);
    if (transports.length >= 2 && transports.every(function (s) { return s.length >= 6; })) return transports;
    // ⑤ 无编号分号多方案："A；B；C。"（青岛美食/恩施交通写法）；过短的尾段并入前段
    const semiRaw = splitTopLevel(t.replace(/[。.]\s*$/, ''), '；');
    if (semiRaw.length >= 2) {
      const semi = [];
      for (const seg of semiRaw) {
        if (seg.length < 6 && semi.length) semi[semi.length - 1] += '；' + seg;
        else semi.push(seg);
      }
      if (semi.length >= 2) return semi;
    }
    // ⑥ 顿号纯枚举：去掉收尾句号后，内部无句号/分号，且顶层顿号 ≥2
    const body = t.replace(/[。.]\s*$/, '');
    if (!/[。；;]/.test(body)) {
      const parts = splitTopLevel(body, '、');
      if (parts.length >= 3) return parts;
    }
    return [t];
  }

  // 真叙述长段：按句号分段成段落组（保叙事、给呼吸感），不转条目
  // 不用 lookbehind（老 iOS Safari 解析直接报错会炸掉整个文件）
  function toParas(text) {
    const parts = text.split(/([。！？])/);
    const sentences = [];
    for (let i = 0; i < parts.length; i += 2) {
      const s = (parts[i] || '').trim();
      if (s) sentences.push(s + (parts[i + 1] || ''));
    }
    if (sentences.length < 2) return [text];
    // 每 2 句一段，避免碎成渣
    const paras = [];
    for (let i = 0; i < sentences.length; i += 2) {
      paras.push(sentences.slice(i, i + 2).join(''));
    }
    return paras;
  }

  // 圈数字 ①-⑳ → 1-20（条目徽标统一用阿拉伯数字）
  function circledToDigit(ch) {
    const code = ch.charCodeAt(0);
    return code >= 0x2460 && code <= 0x2473 ? String(code - 0x2460 + 1) : ch;
  }

  function esc(line) {
    // 数据是本仓库受信内容，这里仅兜底防御意外的尖括号
    return line.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function formatDestContent(text, opts) {
    const pre = opts && opts.preEscaped; // dest.js 已 escapeHtml 过则跳过转义
    const items = toItems(text);
    if (!items.length) return '';
    if (items.length === 1) {
      // 真叙述长段：句号分段成多个 <p>，不糊成一坨
      const one = items[0];
      if (one.length > 120 && (one.match(/[。！？]/g) || []).length >= 2) {
        return toParas(one).map(function (p) {
          return '<p>' + (pre ? p : esc(p)) + '</p>';
        }).join('');
      }
      return '<p>' + (pre ? one : esc(one)) + '</p>';
    }
    return items.map(function (line) {
      const safe = pre ? line : esc(line);
      // 阿拉伯编号 / 圈数字编号 → 统一数字徽标
      const m = safe.match(/^(\d+)\s*[.、]\s*(.+)$/s);
      if (m) {
        return '<div class="content-item"><span class="content-item-num">' + m[1] + '</span><span class="content-item-text">' + m[2] + '</span></div>';
      }
      const mc = safe.match(/^([①-⑳])\s*(.+)$/s);
      if (mc) {
        return '<div class="content-item"><span class="content-item-num">' + circledToDigit(mc[1]) + '</span><span class="content-item-text">' + mc[2] + '</span></div>';
      }
      return '<div class="content-item content-item--bullet"><span class="content-item-text">' + safe + '</span></div>';
    }).join('');
  }

  if (typeof window !== 'undefined') window.formatDestContent = formatDestContent;
  if (typeof module !== 'undefined' && module.exports) module.exports = { formatDestContent, toItems, splitTopLevel };
})();
