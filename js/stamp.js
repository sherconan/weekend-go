// ========== Stamp Collection System ==========
// localStorage-based "visited" tracking with unique artistic stamps

const STAMP_KEY = 'weekendgo_visited';
const STAMP_MIGRATION_FLAG = 'weekendgo_visited_migrated_v2';

// Phase 2 migration: old entries keyed by city-scoped IDs (e.g. 1200 for QD 栈桥) should now
// map to shared dest IDs (5001 for 栈桥 in shared facet). Runs once per browser.
function _migrateVisitedToShared() {
  try {
    if (localStorage.getItem(STAMP_MIGRATION_FLAG) === '1') return;
    if (typeof SHARED_CROSS_CITY_DESTS === 'undefined') return;
    const visited = JSON.parse(localStorage.getItem(STAMP_KEY) || '{}');
    let migrated = 0;
    for (const shared of SHARED_CROSS_CITY_DESTS) {
      // Find any visited entry whose name matches shared.name
      for (const [oldKey, info] of Object.entries(visited)) {
        if (info && info.name === shared.name && String(oldKey) !== String(shared.id)) {
          visited[shared.id] = { name: shared.name, date: info.date, _migratedFrom: oldKey };
          delete visited[oldKey];
          migrated++;
        }
      }
    }
    if (migrated > 0) {
      localStorage.setItem(STAMP_KEY, JSON.stringify(visited));
      console.log('[stamp] migrated', migrated, 'visited entries to shared IDs');
    }
    localStorage.setItem(STAMP_MIGRATION_FLAG, '1');
  } catch (e) {
    console.warn('[stamp] migration failed:', e.message);
  }
}

// Run migration on script load (once per browser)
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _migrateVisitedToShared);
  } else {
    _migrateVisitedToShared();
  }
}

// Load visited destinations from localStorage
function getVisited() {
  try {
    return JSON.parse(localStorage.getItem(STAMP_KEY) || '{}');
  } catch { return {}; }
}

function saveVisited(visited) {
  localStorage.setItem(STAMP_KEY, JSON.stringify(visited));
}

function isVisited(destId) {
  return !!getVisited()[destId];
}

function getVisitedCount() {
  return Object.keys(getVisited()).length;
}

// Mark a destination as visited with timestamp
function markVisited(destId, destName) {
  const visited = getVisited();
  visited[destId] = { name: destName, date: new Date().toISOString() };
  saveVisited(visited);
  updateStampUI();
  updateCollectionProgress();
}

// Unmark a destination
function unmarkVisited(destId) {
  const visited = getVisited();
  delete visited[destId];
  saveVisited(visited);
  updateStampUI();
  updateCollectionProgress();
}

// ========== Stamp Confirmation Modal ==========
function showStampConfirm(destId, destName) {
  const existing = document.querySelector('.stamp-confirm-overlay');
  if (existing) existing.remove();

  // Find dest object for stamp preview
  const dest = typeof ACTIVE_DESTINATIONS !== 'undefined' ? ACTIVE_DESTINATIONS.find(d => d.id === destId) : null;
  const previewHTML = dest && typeof generateLargeStampHTML === 'function'
    ? `<div class="stamp-preview">${generateLargeStampHTML(dest)}</div>`
    : '';

  const overlay = document.createElement('div');
  overlay.className = 'stamp-confirm-overlay';
  overlay.innerHTML = `
    <div class="stamp-confirm-modal">
      ${previewHTML}
      <h3>确认盖章</h3>
      <p>你去过 <strong>${destName}</strong> 吗？</p>
      <p class="stamp-confirm-hint">盖章后会记录在你的旅行图鉴中</p>
      <div class="stamp-confirm-actions">
        <button class="btn btn--secondary btn--small stamp-confirm-cancel">还没去过</button>
        <button class="btn btn--primary btn--small stamp-confirm-ok">盖章！去过了 &#x2714;</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('active'));

  overlay.querySelector('.stamp-confirm-cancel').onclick = () => {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 300);
  };

  overlay.querySelector('.stamp-confirm-ok').onclick = () => {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 300);
    markVisited(destId, destName);
    playStampAnimation(destId, destName);
  };

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 300);
    }
  });
}

// Show "undo" confirmation for already-visited destinations
function showUnstampConfirm(destId, destName) {
  const existing = document.querySelector('.stamp-confirm-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'stamp-confirm-overlay';
  overlay.innerHTML = `
    <div class="stamp-confirm-modal">
      <div class="stamp-confirm-icon">&#x1F914;</div>
      <h3>取消盖章？</h3>
      <p>确定要移除 <strong>${destName}</strong> 的盖章吗？</p>
      <div class="stamp-confirm-actions">
        <button class="btn btn--secondary btn--small stamp-confirm-cancel">保留</button>
        <button class="btn btn--primary btn--small stamp-confirm-ok" style="background: #E53935;">移除盖章</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('active'));

  overlay.querySelector('.stamp-confirm-cancel').onclick = () => {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 300);
  };

  overlay.querySelector('.stamp-confirm-ok').onclick = () => {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 300);
    unmarkVisited(destId);
  };

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 300);
    }
  });
}

// ========== Stamp Animation ==========
function playStampAnimation(destId, destName) {
  const existing = document.querySelector('.stamp-animation-overlay');
  if (existing) existing.remove();

  const dest = typeof ACTIVE_DESTINATIONS !== 'undefined' ? ACTIVE_DESTINATIONS.find(d => d.id === destId) : null;
  const stampHTML = dest && typeof generateLargeStampHTML === 'function'
    ? generateLargeStampHTML(dest)
    : `<div style="font-size:64px">&#x1F3AB;</div>`;

  const overlay = document.createElement('div');
  overlay.className = 'stamp-animation-overlay';
  overlay.innerHTML = `
    <div class="stamp-animation-content">
      <div class="stamp-seal">
        ${stampHTML}
      </div>
      <div class="stamp-particles"></div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Generate confetti particles with destination's palette color
  const design = dest && typeof getStampDesign === 'function' ? getStampDesign(dest) : null;
  const mainColor = design ? design.palette.main : '#4CAF50';
  const particlesEl = overlay.querySelector('.stamp-particles');
  const colors = [mainColor, '#FF7043', '#66BB6A', '#5DADE2', '#FFB74D', '#AB47BC'];
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'stamp-particle';
    const angle = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 200;
    p.style.setProperty('--x', `${Math.cos(angle) * dist}px`);
    p.style.setProperty('--y', `${Math.sin(angle) * dist}px`);
    p.style.setProperty('--r', `${Math.random() * 720}deg`);
    p.style.setProperty('--delay', `${Math.random() * 0.3}s`);
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    // Varied sizes
    const sz = 4 + Math.random() * 8;
    p.style.width = sz + 'px';
    p.style.height = sz + 'px';
    p.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    particlesEl.appendChild(p);
  }

  requestAnimationFrame(() => {
    overlay.classList.add('active');
    setTimeout(() => overlay.querySelector('.stamp-seal').classList.add('stamped'), 100);
  });

  // Auto dismiss
  setTimeout(() => {
    overlay.classList.add('fade-out');
    setTimeout(() => overlay.remove(), 500);
  }, 2200);

  overlay.addEventListener('click', () => {
    overlay.classList.add('fade-out');
    setTimeout(() => overlay.remove(), 500);
  });
}

// ========== UI Updates ==========
function updateStampUI() {
  if (typeof applyFilters === 'function') {
    applyFilters();
  }
}

function updateCollectionProgress() {
  const progressEl = document.querySelector('.collection-progress');
  if (!progressEl) return;
  const total = typeof ACTIVE_DESTINATIONS !== 'undefined' ? ACTIVE_DESTINATIONS.length : 150;
  const visited = getVisitedCount();
  const pct = Math.round((visited / total) * 100);
  progressEl.innerHTML = `
    <div class="collection-progress-bar">
      <div class="collection-progress-fill" style="width: ${pct}%"></div>
    </div>
    <span class="collection-progress-text">&#x1F4D6; 图鉴 ${visited}/${total} (${pct}%)</span>
  `;
}

// Handle stamp button click on cards
function handleStampClick(e, destId, destName) {
  e.stopPropagation();
  if (isVisited(destId)) {
    showUnstampConfirm(destId, destName);
  } else {
    showStampConfirm(destId, destName);
  }
}
