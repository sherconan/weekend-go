// theme.js — 全站 Dark mode theme toggle (独立于"另一面 world flip")
// 作用范围：planner.html / dest.html / stats.html / compare.html / offline.html 和 主 index.html
(function(){
  'use strict';

  const THEME_KEY = 'wg_theme_v1';
  const VALID = ['light', 'dark', 'auto'];

  function getStored() {
    const v = localStorage.getItem(THEME_KEY);
    return VALID.includes(v) ? v : 'auto';
  }
  function store(v) { localStorage.setItem(THEME_KEY, v); }

  function applyTheme(mode) {
    const root = document.documentElement;
    const resolved = (mode === 'auto')
      ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : mode;
    root.setAttribute('data-theme', resolved);
    root.setAttribute('data-theme-setting', mode);
    // Dispatch event for any listener
    window.dispatchEvent(new CustomEvent('wg-theme-change', { detail: { mode, resolved } }));
  }

  function cycle() {
    const cur = getStored();
    const next = cur === 'light' ? 'dark' : (cur === 'dark' ? 'auto' : 'light');
    store(next);
    applyTheme(next);
    return next;
  }

  function icon(mode) {
    return mode === 'light' ? '☀️' : mode === 'dark' ? '🌙' : '🌓';
  }
  function label(mode) {
    return mode === 'light' ? 'Light' : mode === 'dark' ? 'Dark' : 'Auto';
  }

  function mountToggleButton() {
    if (document.getElementById('wg-theme-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'wg-theme-btn';
    btn.setAttribute('aria-label', '切换主题');
    btn.title = '切换主题 (Light / Dark / Auto)';
    btn.style.cssText = 'position:fixed;bottom:20px;right:20px;width:44px;height:44px;border-radius:50%;border:none;background:var(--surface,#fff);box-shadow:0 4px 12px rgba(0,0,0,.15);font-size:20px;cursor:pointer;z-index:9998;display:flex;align-items:center;justify-content:center;transition:transform .15s;';
    btn.textContent = icon(getStored());
    btn.addEventListener('click', () => {
      const next = cycle();
      btn.textContent = icon(next);
      btn.title = '已切换到 ' + label(next);
      btn.style.transform = 'rotate(20deg) scale(1.1)';
      setTimeout(() => { btn.style.transform = ''; }, 180);
    });
    document.body.appendChild(btn);
  }

  // Initial apply — ASAP, before DOM paints to avoid flash
  applyTheme(getStored());

  // Listen to system theme changes when in auto
  if (window.matchMedia) {
    try {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (getStored() === 'auto') applyTheme('auto');
      });
    } catch(e) { /* older Safari: addListener fallback omitted */ }
  }

  function init() {
    mountToggleButton();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose tiny API
  window.WG_Theme = { get: getStored, set: (m) => { store(m); applyTheme(m); }, cycle };
})();
