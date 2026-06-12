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

  function toItems(text) {
    const t = String(text == null ? '' : text).trim();
    if (!t) return [];
    // ① 换行
    if (t.indexOf('\n') !== -1) {
      return t.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
    }
    // ② 编号分号串：在"；+ 数字."边界切开
    const numbered = t.split(/[；;]\s*(?=\d+\s*[.、])/).map(function (s) { return s.trim(); }).filter(Boolean);
    if (numbered.length >= 2) return numbered;
    // ③ 顿号纯枚举：去掉收尾句号后，内部无句号/分号，且顶层顿号 ≥2
    const body = t.replace(/[。.]\s*$/, '');
    if (!/[。；;]/.test(body)) {
      const parts = splitTopLevel(body, '、');
      if (parts.length >= 3) return parts;
    }
    return [t];
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
      const one = pre ? items[0] : esc(items[0]);
      return '<p>' + one + '</p>';
    }
    return items.map(function (line) {
      const safe = pre ? line : esc(line);
      const m = safe.match(/^(\d+)\s*[.、]\s*(.+)$/s);
      if (m) {
        return '<div class="content-item"><span class="content-item-num">' + m[1] + '</span><span class="content-item-text">' + m[2] + '</span></div>';
      }
      return '<div class="content-item content-item--bullet"><span class="content-item-text">' + safe + '</span></div>';
    }).join('');
  }

  if (typeof window !== 'undefined') window.formatDestContent = formatDestContent;
  if (typeof module !== 'undefined' && module.exports) module.exports = { formatDestContent, toItems, splitTopLevel };
})();
