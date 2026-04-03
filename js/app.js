// ========== Merge Destinations ==========
if (typeof DESTINATIONS_EXTRA !== 'undefined') {
  DESTINATIONS.push(...DESTINATIONS_EXTRA);
}

// ========== State ==========
const state = {
  filters: {
    duration: [],
    transport: [],
    themes: [],
    budget: []
  },
  compareList: [],
  chatOpen: false,
  detailOpen: null
};

// ========== DOM Refs ==========
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ========== Initialize ==========
document.addEventListener('DOMContentLoaded', () => {
  renderDestinations(DESTINATIONS);
  bindFilterEvents();
  bindChatEvents();
  bindCompareEvents();
  initScrollAnimations();
});

// ========== Filtering ==========
function bindFilterEvents() {
  $$('.filter-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const category = tag.dataset.category;
      const value = tag.dataset.value;

      tag.classList.toggle('active');

      if (state.filters[category].includes(value)) {
        state.filters[category] = state.filters[category].filter(v => v !== value);
      } else {
        state.filters[category].push(value);
      }

      applyFilters();
    });
  });

  const clearBtn = $('.filter-clear');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearFilters);
  }
}

function clearFilters() {
  state.filters = { duration: [], transport: [], themes: [], budget: [] };
  $$('.filter-tag').forEach(tag => tag.classList.remove('active'));
  applyFilters();
}

function applyFilters() {
  const filtered = DESTINATIONS.filter(dest => {
    // Duration filter
    if (state.filters.duration.length > 0) {
      if (!dest.duration.some(d => state.filters.duration.includes(d))) return false;
    }

    // Transport filter
    if (state.filters.transport.length > 0) {
      if (!dest.transport.some(t => state.filters.transport.includes(t))) return false;
    }

    // Themes filter
    if (state.filters.themes.length > 0) {
      if (!dest.themes.some(t => state.filters.themes.includes(t))) return false;
    }

    // Budget filter
    if (state.filters.budget.length > 0) {
      if (!state.filters.budget.includes(dest.budget)) return false;
    }

    return true;
  });

  renderDestinations(filtered);
  updateFilterActiveTags();

  // Update count
  const countEl = $('.filter-count');
  if (countEl) {
    const total = Object.values(state.filters).flat().length;
    if (total === 0) {
      countEl.innerHTML = `共 <strong>${DESTINATIONS.length}</strong> 个目的地`;
    } else {
      countEl.innerHTML = `筛选出 <strong>${filtered.length}</strong> 个目的地`;
    }
  }
}

// ========== Filter Toggle ==========
function toggleFilters() {
  const body = $('.filter-body');
  const icon = $('.filter-toggle-icon');
  if (!body) return;
  body.classList.toggle('collapsed');
  icon.textContent = body.classList.contains('collapsed') ? '\u25BC' : '\u25B2';
}

function updateFilterActiveTags() {
  const el = $('.filter-active-tags');
  if (!el) return;
  const active = Object.values(state.filters).flat();
  if (active.length === 0) {
    el.innerHTML = '';
  } else {
    el.innerHTML = active.map(v => `<span class="filter-active-pill">${v}</span>`).join('');
  }
}

// ========== Render Destinations ==========
function renderDestinations(destinations) {
  const grid = $('.destinations-grid');
  if (!grid) return;

  if (destinations.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">&#x1F50D;</div>
        <h3>没有找到匹配的目的地</h3>
        <p>试试调整筛选条件，或者问问 AI 顾问</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = destinations.map((dest, i) => {
    const imgPath = typeof getDestImage === 'function' ? getDestImage(dest) : null;
    const sceneURL = typeof getSceneDataURL === 'function' ? getSceneDataURL(dest) : '';
    const hasImage = imgPath || sceneURL;
    const fallbackStyle = !hasImage ? `background: ${dest.gradient};` : '';
    const imgSrc = imgPath || sceneURL || '';
    const coverStyle = hasImage ? '' : fallbackStyle;

    return `
    <div class="dest-card fade-up" data-id="${dest.id}" style="transition-delay: ${Math.min(i, 8) * 60}ms">
      <div class="dest-card-cover" style="${fallbackStyle}">
        ${hasImage ? `<img class="dest-card-img" src="${imgSrc}" alt="${dest.name}" loading="lazy" decoding="async" onerror="this.remove();this.parentElement.style.background='${dest.gradient}'">` : ''}
        <div class="dest-card-cover-overlay"></div>
        <div class="dest-card-cover-content">
          <span class="dest-card-source">${dest.source}</span>
          <h3 class="dest-card-name">${dest.name}</h3>
          <p class="dest-card-subtitle">${dest.subtitle}</p>
        </div>
        <div class="dest-card-badges">
          <span class="dest-card-badge">${dest.distanceText}</span>
          <span class="dest-card-badge">${dest.duration[0]}</span>
          <span class="dest-card-badge badge-rating">&#9733; ${dest.rating}</span>
        </div>
      </div>
      <div class="dest-card-body">
        <div class="dest-card-desc">${dest.description}</div>
        <div class="dest-card-tags">
          ${dest.transport.map(t => `<span class="dest-card-tag tag-transport">${t}</span>`).join('')}
          ${dest.themes.map(t => `<span class="dest-card-tag tag-theme">${t}</span>`).join('')}
        </div>
        <div class="dest-card-footer">
          <span class="dest-card-budget">${dest.budgetText}</span>
          <button class="dest-card-compare-btn" data-id="${dest.id}" title="加入对比" onclick="event.stopPropagation(); toggleCompare(${dest.id})">
            <span class="compare-icon">&#x2B;</span> 对比
          </button>
        </div>
      </div>
    </div>`;
  }).join('');

  // Bind card click
  grid.querySelectorAll('.dest-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.dest-card-compare')) return;
      const id = parseInt(card.dataset.id);
      openDetail(id);
    });
  });

  // Update compare button states
  updateCompareButtons();

  // Trigger scroll animations
  requestAnimationFrame(() => {
    grid.querySelectorAll('.fade-up').forEach(el => {
      el.classList.add('visible');
    });
  });
}

// ========== Detail Modal ==========
function openDetail(id) {
  const dest = DESTINATIONS.find(d => d.id === id);
  if (!dest) return;

  const overlay = $('.modal-overlay');
  const modal = overlay.querySelector('.modal');

  modal.innerHTML = `
    <div class="modal-cover">
      <div class="modal-cover-bg" style="background: ${dest.gradient}"></div>
      <div class="modal-cover-overlay"></div>
      <div class="modal-cover-content">
        <h2>${dest.name}</h2>
        <p>${dest.subtitle}</p>
      </div>
      <button class="modal-close" onclick="closeDetail()">&#x2715;</button>
    </div>
    <div class="modal-meta">
      <div class="modal-meta-item">
        <span class="icon">&#x1F4CD;</span>
        距北京 ${dest.distanceText}
      </div>
      <div class="modal-meta-item">
        <span class="icon">&#x23F1;</span>
        ${dest.duration.join(' / ')}
      </div>
      <div class="modal-meta-item">
        <span class="icon">&#x1F698;</span>
        ${dest.transport.join(' / ')}
      </div>
      <div class="modal-meta-item">
        <span class="icon">&#x1F4B0;</span>
        ${dest.budgetText}
      </div>
      <div class="modal-meta-item">
        <span class="icon">&#x2B50;</span>
        ${dest.rating} 分
      </div>
    </div>
    <div class="modal-body">
      <div class="modal-tags">
        ${dest.themes.map(t => `<span class="modal-tag">${t}</span>`).join('')}
        <span class="modal-tag">${dest.bestSeason}</span>
        <span class="modal-tag">${dest.highlight}</span>
      </div>

      <div class="modal-section">
        <h3><span class="section-icon" style="background: var(--green-50); color: var(--green-600)">&#x1F30D;</span> 概览</h3>
        <p>${dest.overview}</p>
      </div>

      <div class="modal-section">
        <h3><span class="section-icon" style="background: var(--blue-50); color: var(--blue-500)">&#x1F697;</span> 怎么去</h3>
        <div class="content">${dest.howToGet}</div>
      </div>

      <div class="modal-section">
        <h3><span class="section-icon" style="background: var(--coral-light); color: var(--coral)">&#x1F3AF;</span> 玩什么</h3>
        <div class="content">${dest.whatToDo}</div>
      </div>

      <div class="modal-section">
        <h3><span class="section-icon" style="background: #FFF3E0; color: #FB8C00">&#x1F37D;</span> 吃什么</h3>
        <div class="content">${dest.whereToEat}</div>
      </div>

      <div class="modal-section">
        <h3><span class="section-icon" style="background: #F3E5F5; color: #AB47BC">&#x1F3E8;</span> 住哪里</h3>
        <div class="content">${dest.whereToStay}</div>
      </div>

      <div class="modal-section">
        <h3><span class="section-icon" style="background: #FFF8E1; color: #FFA000">&#x1F4A1;</span> 小贴士</h3>
        <div class="content">${dest.tips}</div>
      </div>
    </div>
    <div class="modal-cta">
      <button class="btn btn--primary" onclick="toggleCompare(${dest.id}); closeDetail();">
        &#x2B; 加入对比
      </button>
      <button class="btn btn--secondary" onclick="openChatWithDest('${dest.name}')">
        &#x1F4AC; 聊一聊
      </button>
      <button class="btn btn--secondary" onclick="shareDest(DESTINATIONS.find(d=>d.id===${dest.id}))">
        &#x1F4E4; 分享
      </button>
    </div>
  `;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeDetail() {
  const overlay = $('.modal-overlay');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    closeDetail();
  }
  if (e.target.classList.contains('compare-modal')) {
    closeCompareModal();
  }
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDetail();
    closeCompareModal();
    closeChat();
  }
});

// ========== Compare ==========
function bindCompareEvents() {
  // Compare bar actions are handled inline
}

function toggleCompare(id) {
  const idx = state.compareList.indexOf(id);
  if (idx > -1) {
    state.compareList.splice(idx, 1);
  } else {
    if (state.compareList.length >= 3) {
      // Remove first, add new
      state.compareList.shift();
    }
    state.compareList.push(id);
  }
  updateCompareBar();
  updateCompareButtons();
}

function updateCompareButtons() {
  $$('.dest-card-compare-btn').forEach(btn => {
    const id = parseInt(btn.dataset.id);
    if (state.compareList.includes(id)) {
      btn.classList.add('active');
      btn.innerHTML = '<span class="compare-icon">&#x2713;</span> 已选';
    } else {
      btn.classList.remove('active');
      btn.innerHTML = '<span class="compare-icon">&#x2B;</span> 对比';
    }
  });
}

function updateCompareBar() {
  const bar = $('.compare-bar');
  const itemsEl = $('.compare-bar-items');

  if (state.compareList.length === 0) {
    bar.classList.remove('active');
    return;
  }

  bar.classList.add('active');

  itemsEl.innerHTML = state.compareList.map(id => {
    const dest = DESTINATIONS.find(d => d.id === id);
    return `
      <div class="compare-bar-item">
        ${dest.name}
        <span class="remove" onclick="toggleCompare(${id})">&#x2715;</span>
      </div>
    `;
  }).join('');
}

function openCompareModal() {
  if (state.compareList.length < 2) return;

  const dests = state.compareList.map(id => DESTINATIONS.find(d => d.id === id));
  const modal = $('.compare-modal');

  const rows = [
    { label: '距离', key: d => d.distanceText },
    { label: '时长', key: d => d.duration.join(' / ') },
    { label: '交通', key: d => d.transport.join(' / ') },
    { label: '预算', key: d => d.budgetText },
    { label: '评分', key: d => `${d.rating} 分` },
    { label: '主题', key: d => d.themes.join('、') },
    { label: '最佳季节', key: d => d.bestSeason },
    { label: '亮点', key: d => d.highlight },
    { label: '简介', key: d => d.description },
  ];

  modal.querySelector('.compare-content').innerHTML = `
    <div class="compare-header">
      <h2>目的地对比</h2>
      <button class="compare-close" onclick="closeCompareModal()">&#x2715;</button>
    </div>
    <div style="overflow-x: auto;">
      <table class="compare-table">
        <thead>
          <tr>
            <th class="row-label"></th>
            ${dests.map(d => `<th class="dest-name">${d.name}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map(row => `
            <tr>
              <td class="row-label">${row.label}</td>
              ${dests.map(d => `<td>${row.key(d)}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCompareModal() {
  const modal = $('.compare-modal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function clearCompare() {
  state.compareList = [];
  updateCompareBar();
  updateCompareButtons();
}

// ========== Chat ==========
function bindChatEvents() {
  const fab = $('.chat-fab');
  const input = $('.chat-input');
  const sendBtn = $('.chat-send');

  fab.addEventListener('click', openChat);

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Suggestion clicks
  $$('.chat-suggestion').forEach(btn => {
    btn.addEventListener('click', () => {
      input.value = btn.textContent;
      sendMessage();
    });
  });
}

function openChat() {
  state.chatOpen = true;
  $('.chat-panel').classList.add('active');
  $('.chat-fab').classList.add('hidden');
  $('.chat-input').focus();
}

function closeChat() {
  state.chatOpen = false;
  $('.chat-panel').classList.remove('active');
  $('.chat-fab').classList.remove('hidden');
}

function openChatWithDest(name) {
  closeDetail();
  openChat();
  const input = $('.chat-input');
  input.value = `${name}怎么样？值得去吗？`;
  setTimeout(() => sendMessage(), 300);
}

// Chat history for multi-turn conversation
const chatHistory = [];

function sendMessage() {
  const input = $('.chat-input');
  const text = input.value.trim();
  if (!text) return;

  addChatMessage(text, 'user');
  input.value = '';

  chatHistory.push({ role: 'user', content: text });

  // Typing indicator
  const typing = addChatMessage('...', 'ai');
  typing.querySelector('.chat-bubble').classList.add('skeleton');
  typing.querySelector('.chat-bubble').style.width = '60px';
  typing.querySelector('.chat-bubble').style.height = '24px';

  sendToAPI(text, typing);
}

async function sendToAPI(text, typingEl) {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: chatHistory }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    // Remove typing indicator, create streaming message
    typingEl.remove();
    const msgEl = addChatMessage('', 'ai');
    const bubble = msgEl.querySelector('.chat-bubble');
    let fullText = '';

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep incomplete line in buffer

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const json = line.slice(6);
        try {
          const event = JSON.parse(json);
          if (event.type === 'text') {
            fullText += event.text;
            bubble.innerHTML = formatChat(fullText);
            scrollChatToBottom();
          } else if (event.type === 'error') {
            throw new Error(event.error);
          }
        } catch (e) {
          if (e.message && !e.message.includes('JSON')) throw e;
        }
      }
    }

    // Save assistant response to history
    if (fullText) {
      chatHistory.push({ role: 'assistant', content: fullText });
    }

  } catch (err) {
    console.warn('AI API failed, falling back to keyword matching:', err.message);
    typingEl.remove();
    const response = matchAIResponse(text);
    chatHistory.push({ role: 'assistant', content: response });
    addChatMessage(response, 'ai');
  }
}

function formatChat(text) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
}

function scrollChatToBottom() {
  const messages = $('.chat-messages');
  messages.scrollTop = messages.scrollHeight;
}

function addChatMessage(text, type) {
  const messages = $('.chat-messages');
  const div = document.createElement('div');
  div.className = `chat-message chat-message--${type}`;

  // Convert markdown bold to HTML
  const html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');

  div.innerHTML = `<div class="chat-bubble">${html}</div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return div;
}

// ========== Scroll Animations ==========
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  $$('.fade-up').forEach(el => observer.observe(el));
}

// ========== Smooth scroll to section ==========
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ========== PWA Service Worker ==========
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// ========== Share ==========
function shareDest(dest) {
  const text = `${dest.name} - ${dest.subtitle}\n距离北京${dest.distanceText}，${dest.duration[0]}，人均${dest.budgetText}\n⭐ ${dest.rating} | ${dest.themes.join('·')}\n\n来自「周末去哪儿」`;

  if (navigator.share) {
    navigator.share({ title: `周末去哪儿 | ${dest.name}`, text, url: window.location.href }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text).then(() => {
      showToast('已复制到剪贴板，去分享吧！');
    }).catch(() => {
      showToast('分享失败，请手动复制');
    });
  }
}

function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 2500);
}
