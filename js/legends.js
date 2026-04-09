// 另一面 — 都市传说 Web Version
// Renders legend cards with flip interaction into #otherside-grid

const LEGENDS_DATA = [
  {
    id: 'l-bj-001',
    name: '北新桥锁龙井',
    subtitle: '铁链入井深无底，龙影潜藏千年间',
    address: '东城区北新桥',
    vibe: '都市传说',
    vibeIcon: '⛓️',
    storyBrief: '一口封印着龙的古井，铁链入井深不见底，触碰者皆遭怪异',
    story: '传说大禹治水时将作乱的海眼之龙锁在此井中，铁链入井深不见底。清末日寇入侵时，士兵试图拔起铁链，井中突然黑水喷涌、怪声鬼叫，吓得落荒而逃。文革期间红卫兵再次尝试，同样遭遇黑水与异响而放弃。此后封井至今，北新桥地铁站建设时特意绕行，无人敢触碰那口古井。',
    themes: ['都市传说', '封印', '龙'],
    rating: 4.9,
    image: 'https://sherconan.github.io/weekend-go/assets/legends/l-bj-001.webp',
    linkedDestId: null
  },
  {
    id: 'l-bj-002',
    name: '菜市口刑场旧址',
    subtitle: '千年行刑地，冤魂诉长夜',
    address: '西城区菜市口',
    vibe: '历史秘辛',
    vibeIcon: '🩸',
    storyBrief: '清代最大的刑场，无数冤魂在此留存，夜行者常闻哀号',
    story: '菜市口是清代北京最重要的刑场，名臣谭嗣同、大盗曾格林沁皆在此伏法。「菜杀五埋」之说流传至今——凡死于此地者，尸骨埋于五道口方向，七魄不散。老北京人传说夜间经过此地，常闻隐隐哀号，旧时人力车夫遇上「打特车」（载鬼客），到了菜市口必然抬轿折返。',
    themes: ['历史秘辛', '刑场', '冤魂'],
    rating: 4.7,
    image: 'https://sherconan.github.io/weekend-go/assets/legends/l-bj-002.webp',
    linkedDestId: null
  },
  {
    id: 'l-bj-003',
    name: '圆明园夜晚的回声',
    subtitle: '废墟之上，宫乐犹闻',
    address: '海淀区圆明园遗址公园',
    vibe: '历史秘辛',
    vibeIcon: '🌙',
    storyBrief: '废墟之上的月圆之夜，隐约的宫乐声与宫女魅影久久不散',
    story: '英法联军烧毁圆明园已逾百年，然而每逢月圆之夜，守园人偶尔会在废墟区域听到隐约的丝竹宫乐声，有时还伴有女子低语与香烛气味。流传最广的说法是：乾隆最宠爱的香妃魂魄不愿离去，在石柱之间永久徘徊，偶尔向有缘人展示圆明园昔日的繁华盛景。',
    themes: ['历史秘辛', '废墟', '宫廷'],
    rating: 4.8,
    image: 'https://sherconan.github.io/weekend-go/assets/legends/l-bj-003.webp',
    linkedDestId: 585
  },
  {
    id: 'l-bj-004',
    name: '大柳树鬼市',
    subtitle: '鸡鸣而散，半夜开市',
    address: '朝阳区东五环大柳树市场',
    vibe: '都市传说',
    vibeIcon: '👻',
    storyBrief: '凌晨两点才开市，买卖不可言说，老玩家的离奇收藏故事',
    story: '北京鬼市的历史可追溯至清代，「半夜而合，鸡鸣而散」是老规矩。大柳树鬼市在北京古玩圈名气最大，每周三凌晨两三点才开始真正的买卖——据说最好的古董都在黑暗中低价成交，而买者事后往往说不清楚到底买到了什么。有老玩家说，他曾在鬼市买到一个民国的鼻烟壶，回家后听到里面有极细微的声音……',
    themes: ['都市传说', '鬼市', '古玩'],
    rating: 4.6,
    image: 'https://sherconan.github.io/weekend-go/assets/legends/l-bj-004.webp',
    linkedDestId: null
  },
  {
    id: 'l-bj-005',
    name: '故宫宫女魅影',
    subtitle: '红墙之内，御花园深处',
    address: '东城区故宫博物院',
    vibe: '灵异目击',
    vibeIcon: '🏯',
    storyBrief: '故宫夜间巡逻人员多次目击红衣宫女身影，监控画面捕捉到异常',
    story: '故宫六百年历史中，有关宫女魅影的传说从未中断。御花园、延禧宫、冷宫一带是目击最多的地点。有前故宫工作人员回忆，某次夜间安保巡逻时，在御花园古井附近看到一名身着红色宫装的女子，回头的瞬间人影消失。故宫至今不对外公开全部监控录像，据说其中有几段「异常」画面被列为内部资料。',
    themes: ['灵异目击', '故宫', '宫廷'],
    rating: 4.9,
    image: 'https://sherconan.github.io/weekend-go/assets/legends/l-bj-005.webp',
    linkedDestId: null
  },
  {
    id: 'l-bj-006',
    name: '恭王府的风水诅咒',
    subtitle: '三代皇亲同此府，家道中落皆有因',
    address: '西城区恭王府',
    vibe: '风水秘闻',
    vibeIcon: '🏚️',
    storyBrief: '和珅、庆王、恭亲王三代主人相继衰败，风水师说此地「聚气不散财」',
    story: '恭王府曾是清代最权贵的私宅，先后属于大贪官和珅、庆王、恭亲王奕訢。三位主人无一善终：和珅被赐死，庆王家族覆灭，恭亲王晚年被慈禧剥夺权力抑郁而终。民间风水先生说，此地虽有「天下第一府」美誉，但地气太旺会反噬主人，历代以来「住得越久，败得越快」。府内后花园的藏字碑，据说摸了会带走运气。',
    themes: ['风水秘闻', '历史', '诅咒'],
    rating: 4.5,
    image: 'https://sherconan.github.io/weekend-go/assets/legends/l-bj-006.webp',
    linkedDestId: null
  },
  {
    id: 'l-bj-007',
    name: '北京地下城',
    subtitle: '地表之下五十米，另一个北京',
    address: '北京城区地下，入口散布全市',
    vibe: '城市秘境',
    vibeIcon: '🕳️',
    storyBrief: '冷战时期挖掘的地下城网络，全长数百公里，至今未全部探明',
    story: '1969年，毛泽东下令在北京建造防核战争的地下工程，数十万北京市民参与挖掘。地下城最深处达地下五十米，有学校、医院、工厂、粮仓，据说可容纳全市三分之一人口生存六个月。部分隧道与故宫地宫、颐和园、天安门广场相连。1990年代部分区域曾短暂对外开放，随后再次封闭。至今仍有「城市探险者」宣称发现新的入口。',
    themes: ['城市秘境', '冷战', '地下'],
    rating: 4.8,
    image: 'https://sherconan.github.io/weekend-go/assets/legends/l-bj-007.webp',
    linkedDestId: null
  },
  {
    id: 'l-bj-008',
    name: '明十三陵定陵诅咒',
    subtitle: '开棺之日，连串厄运接踵而至',
    address: '昌平区十三陵景区',
    vibe: '历史秘辛',
    vibeIcon: '⚰️',
    storyBrief: '1956年定陵发掘后，参与者相继遭遇不幸，文物损毁，主导者含冤',
    story: '1956年，考古学家郭沫若主持发掘明万历帝定陵，这是中国第一次主动发掘帝王陵寝。打开地宫当日，棺内发现万历帝和两位皇后尸骨保存完好，随后在阳光下迅速腐化。此后接连发生怪事：主导发掘的考古学家相继去世、精神异常；文革中红卫兵将三具尸骨批斗焚毁；出土的大量丝织品无法保存变成碎片。此后中国再未主动发掘帝陵，定陵成为考古史上不愿提及的禁区。',
    themes: ['历史秘辛', '帝陵', '诅咒'],
    rating: 4.7,
    image: 'https://sherconan.github.io/weekend-go/assets/legends/l-bj-008.webp',
    linkedDestId: 42
  },
  {
    id: 'l-bj-009',
    name: '白云观的道士预言',
    subtitle: '三百年前留下的签文，至今未解',
    address: '西城区白云观',
    vibe: '神秘预言',
    vibeIcon: '🌫️',
    storyBrief: '观内藏有全真教掌教留下的封印预言，据说每百年打开一签',
    story: '白云观是北京道教祖庭，供奉邱处机真人。观内设有「签筒」，但老道士中流传一说：在地宫最深处，有邱处机亲手书写的百年封印预言，以铜函密封，每逢天下大变之年，函盖自开一签。上世纪初、建国之年、文革结束，都有老道私下记录「铜函有异动」。签文内容从未公开，但据说与「龙脉转移、水旺金衰」有关。',
    themes: ['神秘预言', '道教', '命运'],
    rating: 4.5,
    image: 'https://sherconan.github.io/weekend-go/assets/legends/l-bj-009.webp',
    linkedDestId: null
  },
  {
    id: 'l-bj-010',
    name: '东直门的午夜列车',
    subtitle: '凌晨零点后的那班车，没有终点站',
    address: '东城区东直门',
    vibe: '都市传说',
    vibeIcon: '🚇',
    storyBrief: '深夜地铁13号线上，曾有乘客记录到多出来的「第13节车厢」',
    story: '这是北京地铁圈流传最广的都市传说。据说地铁13号线每周三深夜零点前后，末班车过后会有一列「幽灵列车」短暂进站——车厢内灯光昏黄，乘客面目模糊，报站声播报的是早已废弃的旧站名。曾有夜班工作人员拍到站台监控异常，显示「多出一列编组」，上报后记录被删除，当事人调岗。东直门换乘站因为是两线交汇处，成为传说的核心地点。',
    themes: ['都市传说', '地铁', '幽灵'],
    rating: 4.8,
    image: 'https://sherconan.github.io/weekend-go/assets/legends/l-bj-010.webp',
    linkedDestId: null
  }
];

// Render legend cards — same structure as day dest-card, story goes first
let _legendsRendered = false;
function renderLegends() {
  const grid = document.getElementById('otherside-grid');
  if (!grid || _legendsRendered) return;
  _legendsRendered = true;

  grid.innerHTML = LEGENDS_DATA.map((l, i) => `
    <div class="dest-card legend-dest-card fade-up" data-legend-id="${l.id}"
         style="transition-delay: ${Math.min(i, 8) * 60}ms"
         onclick="openLegendStory('${l.id}', event)">

      <!-- Cover (same as dest-card-cover) -->
      <div class="dest-card-cover legend-cover" style="background: linear-gradient(135deg, #1C1040, #0F1D2F);">
        <img class="dest-card-img legend-card-img" src="${l.image}"
             onerror="this.style.display='none'"
             loading="lazy" alt="${l.name}">
        <div class="dest-card-cover-overlay legend-cover-overlay"></div>
        <div class="dest-card-cover-content">
          <span class="dest-card-source legend-vibe-source">${l.vibeIcon} ${l.vibe}</span>
          <h3 class="dest-card-name legend-card-name">${l.name}</h3>
          <p class="dest-card-subtitle legend-card-subtitle">${l.subtitle}</p>
        </div>
        <div class="dest-card-badges">
          <span class="dest-card-badge">📍 ${l.address}</span>
          <span class="dest-card-badge badge-rating">★ ${l.rating} 神秘指数</span>
          ${l.linkedDestId ? '<span class="dest-card-badge legend-badge-easter">✨ 彩蛋</span>' : ''}
        </div>
      </div>

      <!-- Body (same as dest-card-body) -->
      <div class="dest-card-body legend-card-body">
        <!-- Story first, prominent -->
        <div class="legend-story-block">
          <div class="legend-story-label">📖 传说</div>
          <div class="dest-card-desc legend-story-text">${l.storyBrief}</div>
        </div>

        <!-- Theme tags (same as dest-card-tags) -->
        <div class="dest-card-tags">
          ${l.themes.map(t => `<span class="dest-card-tag tag-theme legend-theme-tag">${t}</span>`).join('')}
        </div>

        <!-- Footer -->
        <div class="dest-card-footer legend-card-footer">
          <span class="dest-card-budget legend-rating-display">🌑 神秘指数 ${l.rating}</span>
          <div class="dest-card-footer-actions">
            <button class="legend-read-btn" onclick="openLegendStory('${l.id}', event)">读完整故事</button>
            ${l.linkedDestId ? `<button class="legend-day-btn" onclick="goToLinkedDest(${l.linkedDestId}, event)">✨ 日间</button>` : ''}
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function openLegendStory(id, e) {
  e.stopPropagation();
  const legend = LEGENDS_DATA.find(l => l.id === id);
  if (!legend) return;

  const overlay = document.querySelector('.legend-modal-overlay');
  const content = document.getElementById('legend-modal-content');
  if (!overlay || !content) return;

  content.innerHTML = `
    <button class="legend-modal-close" onclick="closeLegendModal()">✕</button>
    <div class="legend-modal-vibe">${legend.vibeIcon} ${legend.vibe}</div>
    <h2 class="legend-modal-name">${legend.name}</h2>
    <div class="legend-modal-addr">📍 ${legend.address}</div>
    <img class="legend-modal-img" src="${legend.image}" onerror="this.style.display='none'" alt="${legend.name}">
    <p class="legend-modal-text">${legend.story}</p>
    <div class="legend-modal-themes">${legend.themes.map(t => `<span class="legend-theme-chip">${t}</span>`).join('')}</div>
    ${legend.linkedDestId ? `
      <div class="legend-easter-egg">
        <div class="easter-hint">✨ 这个地方在白天模式也有记录</div>
        <button class="easter-btn" onclick="goToLinkedDest(${legend.linkedDestId}, event)">查看日间版本 →</button>
      </div>
    ` : ''}
  `;
  overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeLegendModal() {
  document.querySelector('.legend-modal-overlay')?.classList.remove('is-open');
  document.body.style.overflow = '';
}

function goToLinkedDest(destId, e) {
  e && e.stopPropagation();
  closeLegendModal();
  // Find and open the destination in the main app
  if (typeof openDetail === 'function') {
    const dest = (window.allDestinations || []).find(d => d.id === destId);
    if (dest) { openDetail(dest); return; }
  }
  // Fallback: scroll to destinations section
  document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' });
}

// ===== World Flip =====
let _nightMode = false;

function flipWorld() {
  _nightMode = !_nightMode;
  const nightWorld = document.getElementById('night-world');
  const flipBtn = document.getElementById('world-flip-btn');
  const body = document.body;

  if (_nightMode) {
    // Entering night mode
    nightWorld.classList.add('is-visible');
    // Force reflow then animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        nightWorld.classList.add('is-active');
        body.classList.add('night-mode');
      });
    });
    if (flipBtn) flipBtn.textContent = '☀️ 白天';
    nightWorld.scrollTop = 0;
    // Render legends if not yet done
    renderLegends();
  } else {
    // Exiting night mode
    nightWorld.classList.remove('is-active');
    body.classList.remove('night-mode');
    if (flipBtn) flipBtn.textContent = '🌑 另一面';
    setTimeout(() => {
      nightWorld.classList.remove('is-visible');
    }, 400);
  }
}

// Hide the night world on city switch if not beijing
const _origSwitchCity = window.switchCity;
window.switchCity = function(city) {
  _origSwitchCity && _origSwitchCity(city);
  if (city !== 'beijing' && _nightMode) {
    flipWorld(); // exit night mode for non-BJ cities
  }
  // Hide flip btn for non-BJ cities
  const btn = document.getElementById('world-flip-btn');
  if (btn) btn.style.display = city === 'beijing' ? '' : 'none';
};

// Init
function initLegends() {
  // Hide flip btn for non-BJ default city
  const currentCity = window.currentCity || 'beijing';
  const btn = document.getElementById('world-flip-btn');
  if (btn && currentCity !== 'beijing') btn.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', initLegends);
if (document.readyState !== 'loading') initLegends();
