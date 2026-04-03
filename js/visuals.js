// Landscape-inspired SVG backgrounds for each destination type
// Each creates a unique, artistic scene rather than a plain gradient

const VISUAL_SCENES = {
  // Water town / ancient town
  '古镇': (colors) => `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${colors[0]}"/>
          <stop offset="100%" stop-color="${colors[1]}"/>
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#sky)"/>
      <rect y="160" width="400" height="80" fill="${colors[2]}" opacity="0.3"/>
      <!-- Buildings silhouette -->
      <path d="M0,140 L20,140 L20,110 L30,100 L40,110 L40,130 L60,130 L60,105 L65,95 L70,105 L70,120 L90,120 L90,100 L100,90 L110,100 L110,135 L130,135 L130,115 L140,105 L150,115 L150,140 L170,140 L170,110 L175,95 L180,110 L180,125 L200,125 L200,100 L210,85 L220,100 L220,130 L240,130 L240,108 L250,98 L260,108 L260,140 L280,140 L280,118 L285,108 L290,118 L290,135 L320,135 L320,105 L330,92 L340,105 L340,130 L360,130 L360,115 L370,105 L380,115 L380,140 L400,140 L400,240 L0,240Z" fill="${colors[3]}" opacity="0.6"/>
      <!-- Water reflection -->
      <rect y="170" width="400" height="70" fill="${colors[2]}" opacity="0.15"/>
      <line x1="30" y1="185" x2="120" y2="185" stroke="white" stroke-width="0.5" opacity="0.3"/>
      <line x1="180" y1="195" x2="300" y2="195" stroke="white" stroke-width="0.5" opacity="0.3"/>
      <line x1="80" y1="210" x2="220" y2="210" stroke="white" stroke-width="0.5" opacity="0.2"/>
    </svg>`,

  // Mountains / hiking
  '爬山': (colors) => `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
      <defs>
        <linearGradient id="msky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${colors[0]}"/>
          <stop offset="60%" stop-color="${colors[1]}"/>
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#msky)"/>
      <!-- Far mountains -->
      <path d="M-20,180 L60,100 L100,130 L160,70 L220,120 L280,80 L340,110 L420,60 L420,240 L-20,240Z" fill="${colors[2]}" opacity="0.3"/>
      <!-- Mid mountains -->
      <path d="M-20,200 L40,130 L80,155 L140,100 L180,140 L240,110 L300,145 L360,120 L420,150 L420,240 L-20,240Z" fill="${colors[2]}" opacity="0.5"/>
      <!-- Near mountains -->
      <path d="M-20,220 L60,160 L120,185 L180,150 L240,175 L300,155 L360,170 L420,160 L420,240 L-20,240Z" fill="${colors[3]}" opacity="0.6"/>
      <!-- Sun/moon -->
      <circle cx="320" cy="60" r="25" fill="white" opacity="0.2"/>
    </svg>`,

  // Camping / lake
  '露营': (colors) => `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
      <defs>
        <linearGradient id="lsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${colors[0]}"/>
          <stop offset="100%" stop-color="${colors[1]}"/>
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#lsky)"/>
      <!-- Hills -->
      <path d="M-20,180 L80,120 L160,160 L260,110 L360,140 L420,120 L420,240 L-20,240Z" fill="${colors[2]}" opacity="0.4"/>
      <!-- Lake -->
      <ellipse cx="200" cy="200" rx="180" ry="30" fill="${colors[3]}" opacity="0.25"/>
      <!-- Tent -->
      <path d="M170,185 L190,155 L210,185Z" fill="white" opacity="0.5"/>
      <path d="M190,185 L190,155" stroke="white" stroke-width="1" opacity="0.6"/>
      <!-- Trees -->
      <path d="M100,185 L105,160 L110,185Z" fill="${colors[2]}" opacity="0.5"/>
      <path d="M115,185 L120,165 L125,185Z" fill="${colors[2]}" opacity="0.4"/>
      <path d="M280,185 L285,162 L290,185Z" fill="${colors[2]}" opacity="0.5"/>
      <path d="M295,185 L300,168 L305,185Z" fill="${colors[2]}" opacity="0.4"/>
      <!-- Stars -->
      <circle cx="80" cy="40" r="1.5" fill="white" opacity="0.6"/>
      <circle cx="150" cy="25" r="1" fill="white" opacity="0.5"/>
      <circle cx="250" cy="35" r="1.5" fill="white" opacity="0.7"/>
      <circle cx="340" cy="50" r="1" fill="white" opacity="0.4"/>
      <circle cx="50" cy="70" r="1" fill="white" opacity="0.5"/>
    </svg>`,

  // Hot spring / spa
  '温泉': (colors) => `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
      <rect width="400" height="240" fill="${colors[0]}"/>
      <!-- Warm glow -->
      <circle cx="200" cy="180" r="120" fill="${colors[1]}" opacity="0.3"/>
      <circle cx="200" cy="180" r="80" fill="${colors[1]}" opacity="0.2"/>
      <!-- Steam curves -->
      <path d="M150,140 Q155,120 150,100 Q145,80 150,60" stroke="white" stroke-width="2" fill="none" opacity="0.2"/>
      <path d="M200,130 Q205,110 200,90 Q195,70 200,50" stroke="white" stroke-width="2" fill="none" opacity="0.25"/>
      <path d="M250,140 Q255,120 250,100 Q245,80 250,60" stroke="white" stroke-width="2" fill="none" opacity="0.2"/>
      <!-- Pool edge -->
      <ellipse cx="200" cy="195" rx="140" ry="35" fill="${colors[2]}" opacity="0.3"/>
      <ellipse cx="200" cy="195" rx="120" ry="28" fill="${colors[3]}" opacity="0.2"/>
    </svg>`,

  // Flowers / scenic
  '赏花': (colors) => `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
      <defs>
        <linearGradient id="fsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${colors[0]}"/>
          <stop offset="100%" stop-color="${colors[1]}"/>
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#fsky)"/>
      <!-- Rolling hills -->
      <path d="M-20,200 Q100,150 200,180 Q300,210 420,170 L420,240 L-20,240Z" fill="${colors[2]}" opacity="0.5"/>
      <path d="M-20,220 Q80,190 180,210 Q280,230 420,200 L420,240 L-20,240Z" fill="${colors[2]}" opacity="0.3"/>
      <!-- Flowers (circles) -->
      <circle cx="60" cy="195" r="4" fill="${colors[3]}" opacity="0.7"/>
      <circle cx="90" cy="190" r="3" fill="white" opacity="0.6"/>
      <circle cx="120" cy="198" r="5" fill="${colors[3]}" opacity="0.6"/>
      <circle cx="160" cy="185" r="3" fill="white" opacity="0.5"/>
      <circle cx="200" cy="192" r="4" fill="${colors[3]}" opacity="0.7"/>
      <circle cx="240" cy="188" r="3" fill="white" opacity="0.6"/>
      <circle cx="270" cy="195" r="5" fill="${colors[3]}" opacity="0.5"/>
      <circle cx="310" cy="182" r="4" fill="white" opacity="0.5"/>
      <circle cx="350" cy="190" r="3" fill="${colors[3]}" opacity="0.6"/>
      <circle cx="75" cy="205" r="3" fill="white" opacity="0.4"/>
      <circle cx="145" cy="200" r="4" fill="${colors[3]}" opacity="0.5"/>
      <circle cx="225" cy="202" r="3" fill="white" opacity="0.5"/>
      <circle cx="300" cy="198" r="4" fill="${colors[3]}" opacity="0.6"/>
    </svg>`,

  // Beach / seaside
  '度假': (colors) => `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
      <defs>
        <linearGradient id="ssky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${colors[0]}"/>
          <stop offset="60%" stop-color="${colors[1]}"/>
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#ssky)"/>
      <!-- Sun -->
      <circle cx="320" cy="70" r="35" fill="#FFD54F" opacity="0.3"/>
      <circle cx="320" cy="70" r="25" fill="#FFD54F" opacity="0.2"/>
      <!-- Sea -->
      <path d="M0,150 Q50,140 100,150 Q150,160 200,150 Q250,140 300,150 Q350,160 400,150 L400,240 L0,240Z" fill="${colors[2]}" opacity="0.3"/>
      <path d="M0,170 Q50,160 100,170 Q150,180 200,170 Q250,160 300,170 Q350,180 400,170 L400,240 L0,240Z" fill="${colors[2]}" opacity="0.2"/>
      <!-- Beach -->
      <path d="M0,200 Q200,185 400,200 L400,240 L0,240Z" fill="${colors[3]}" opacity="0.3"/>
    </svg>`,

  // Forest / nature
  '美食': (colors) => `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
      <rect width="400" height="240" fill="${colors[0]}"/>
      <rect y="120" width="400" height="120" fill="${colors[1]}" opacity="0.3"/>
      <!-- Abstract food/market pattern -->
      <circle cx="60" cy="100" r="20" fill="${colors[2]}" opacity="0.2"/>
      <circle cx="140" cy="80" r="25" fill="${colors[3]}" opacity="0.15"/>
      <circle cx="240" cy="90" r="18" fill="${colors[2]}" opacity="0.2"/>
      <circle cx="330" cy="100" r="22" fill="${colors[3]}" opacity="0.15"/>
      <circle cx="100" cy="150" r="15" fill="white" opacity="0.08"/>
      <circle cx="200" cy="140" r="20" fill="white" opacity="0.06"/>
      <circle cx="300" cy="155" r="18" fill="white" opacity="0.08"/>
      <!-- Decorative lines -->
      <line x1="40" y1="200" x2="360" y2="200" stroke="white" stroke-width="0.5" opacity="0.15"/>
      <line x1="40" y1="210" x2="360" y2="210" stroke="white" stroke-width="0.5" opacity="0.1"/>
    </svg>`,

  // Kids / family
  '亲子': (colors) => `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
      <defs>
        <linearGradient id="ksky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${colors[0]}"/>
          <stop offset="100%" stop-color="${colors[1]}"/>
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#ksky)"/>
      <!-- Playful hills -->
      <ellipse cx="100" cy="220" rx="120" ry="50" fill="${colors[2]}" opacity="0.3"/>
      <ellipse cx="300" cy="230" rx="150" ry="45" fill="${colors[2]}" opacity="0.25"/>
      <!-- Balloons -->
      <circle cx="120" cy="80" r="15" fill="${colors[3]}" opacity="0.4"/>
      <line x1="120" y1="95" x2="125" y2="140" stroke="${colors[3]}" stroke-width="1" opacity="0.3"/>
      <circle cx="260" cy="60" r="12" fill="white" opacity="0.3"/>
      <line x1="260" y1="72" x2="255" y2="120" stroke="white" stroke-width="1" opacity="0.2"/>
      <circle cx="340" cy="90" r="14" fill="${colors[3]}" opacity="0.3"/>
      <line x1="340" y1="104" x2="335" y2="150" stroke="${colors[3]}" stroke-width="1" opacity="0.2"/>
    </svg>`,

  // Winter / skiing
  '滑雪': (colors) => `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
      <rect width="400" height="240" fill="${colors[0]}"/>
      <!-- Snow mountains -->
      <path d="M-20,200 L80,80 L120,120 L200,60 L280,100 L340,70 L420,130 L420,240 L-20,240Z" fill="white" opacity="0.2"/>
      <path d="M-20,220 L60,140 L140,170 L200,130 L260,160 L340,140 L420,170 L420,240 L-20,240Z" fill="white" opacity="0.3"/>
      <!-- Snowflakes -->
      <circle cx="50" cy="40" r="2" fill="white" opacity="0.5"/>
      <circle cx="120" cy="60" r="1.5" fill="white" opacity="0.4"/>
      <circle cx="200" cy="30" r="2" fill="white" opacity="0.6"/>
      <circle cx="280" cy="50" r="1.5" fill="white" opacity="0.4"/>
      <circle cx="350" cy="35" r="2" fill="white" opacity="0.5"/>
      <circle cx="90" cy="90" r="1.5" fill="white" opacity="0.3"/>
      <circle cx="320" cy="80" r="2" fill="white" opacity="0.4"/>
    </svg>`,

  // History / temple
  '历史': (colors) => `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
      <rect width="400" height="240" fill="${colors[0]}"/>
      <!-- Temple/pagoda silhouette -->
      <path d="M170,180 L175,160 L165,160 L170,140 L160,140 L170,120 L155,120 L170,95 L180,95 L195,60 L210,95 L220,95 L235,120 L220,120 L230,140 L220,140 L225,160 L215,160 L220,180Z" fill="${colors[2]}" opacity="0.4"/>
      <!-- Ground -->
      <rect y="180" width="400" height="60" fill="${colors[1]}" opacity="0.2"/>
      <!-- Trees -->
      <path d="M60,180 L70,140 L80,180Z" fill="${colors[2]}" opacity="0.25"/>
      <path d="M320,180 L330,145 L340,180Z" fill="${colors[2]}" opacity="0.25"/>
      <!-- Path -->
      <path d="M150,240 Q195,200 240,240" stroke="white" stroke-width="1" fill="none" opacity="0.15"/>
    </svg>`,

  // Default
  'default': (colors) => `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
      <defs>
        <linearGradient id="dg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${colors[0]}"/>
          <stop offset="100%" stop-color="${colors[1]}"/>
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#dg)"/>
      <path d="M-20,200 Q100,160 200,180 Q300,200 420,170 L420,240 L-20,240Z" fill="${colors[2]}" opacity="0.3"/>
      <circle cx="320" cy="60" r="30" fill="white" opacity="0.1"/>
    </svg>`
};

// Color palettes for each destination - inspired by real landscape colors
const DEST_PALETTES = {
  "古北水镇": ["#2C3E50", "#4A6FA5", "#1B2838", "#2C3E50"],
  "延庆百里画廊": ["#FF9A76", "#FFECD2", "#2D6A4F", "#FF6B6B"],
  "密云水库": ["#74B9FF", "#0984E3", "#2D6A4F", "#81ECEC"],
  "慕田峪长城": ["#A8E6CF", "#FFD3B6", "#4A7C59", "#2D6A4F"],
  "金海湖": ["#48C9B0", "#1ABC9C", "#2471A3", "#76D7C4"],
  "十渡风景区": ["#85C1E9", "#2E86C1", "#2D6A4F", "#A2D9CE"],
  "蟒山国家森林公园": ["#82E0AA", "#27AE60", "#1E8449", "#2D6A4F"],
  "南山滑雪场": ["#AEB6BF", "#5D6D7E", "#2C3E50", "#D5DBDB"],
  "红螺寺": ["#F5CBA7", "#E59866", "#873600", "#DC7633"],
  "雾灵山": ["#1B4F72", "#2E86C1", "#1A5276", "#154360"],
  "张北草原天路": ["#82E0AA", "#F9E79F", "#2D6A4F", "#F4D03F"],
  "阿那亚": ["#AED6F1", "#5DADE2", "#D4AC0D", "#F0B27A"],
  "黄花城水长城": ["#56ab2f", "#a8e063", "#2D6A4F", "#81C784"],
  "青龙峡": ["#2980b9", "#6dd5fa", "#1B4F72", "#5DADE2"],
  "神堂峪": ["#11998e", "#38ef7d", "#1E8449", "#2D6A4F"],
  "喇叭沟原始森林": ["#134e5e", "#71b280", "#0B3D0B", "#2D6A4F"],
  "雁栖湖": ["#2193b0", "#6dd5ed", "#1B4F72", "#48C9B0"],
  "潭柘寺": ["#c0392b", "#e74c3c", "#873600", "#DC7633"],
  "野三坡": ["#1e3c72", "#2a5298", "#1B2838", "#2E86C1"],
  "白石山": ["#4b6cb7", "#182848", "#5D6D7E", "#AEB6BF"],
  "北戴河": ["#0052D4", "#65C7F7", "#1B4F72", "#F9E79F"],
  "凤凰岭": ["#43cea2", "#185a9d", "#1E8449", "#76D7C4"],
  "坝上草原": ["#56ab2f", "#a8e063", "#2D6A4F", "#F7DC6F"],
  "大觉寺": ["#DAA520", "#B8860B", "#873600", "#F5CBA7"],
  "妙峰山": ["#F2994A", "#F2C94C", "#2D6A4F", "#FF6B6B"],
  "周口店遗址": ["#8B4513", "#D2691E", "#5D4037", "#A1887F"],
  "古崖居": ["#6B4226", "#A0785A", "#4E342E", "#8D6E63"],
  "龙庆峡": ["#00b09b", "#96c93d", "#1B4F72", "#48C9B0"],
  "百望山": ["#76b852", "#8DC26F", "#2D6A4F", "#A9DFBF"],
  "崇礼": ["#2c3e50", "#3498db", "#5D6D7E", "#D5DBDB"],
  "房山十字寺": ["#757F9A", "#D7DDE8", "#515A5A", "#ABB2B9"],
  "灵山": ["#2C5364", "#203A43", "#1B2838", "#5D6D7E"],
  "爨底下村": ["#8B7355", "#CD853F", "#5D4037", "#A1887F"],
  "承德避暑山庄": ["#B8860B", "#DAA520", "#228B22", "#F5CBA7"],
  "玉渡山": ["#2E8B57", "#98FB98", "#1E8449", "#76D7C4"],
  "小汤山温泉": ["#FF9966", "#FF5E62", "#C0392B", "#FADBD8"],
  "蔚县暖泉古镇": ["#C0392B", "#E74C3C", "#873600", "#F39C12"],
  "戒台寺": ["#8E6F3E", "#BDB76B", "#5D4037", "#D4AC0D"],
};

function getSceneSVG(dest) {
  const palette = DEST_PALETTES[dest.name] || [dest.gradient.match(/#[0-9a-f]{6}/gi)?.[0] || "#667eea", "#764ba2", "#2D3436", "#1a1a2e"];

  // Pick the best scene type based on the destination's primary theme
  const themeOrder = ['滑雪', '历史', '古镇', '爬山', '露营', '温泉', '赏花', '度假', '亲子', '美食'];
  let sceneType = 'default';
  for (const theme of themeOrder) {
    if (dest.themes.includes(theme)) {
      sceneType = theme;
      break;
    }
  }

  const generator = VISUAL_SCENES[sceneType] || VISUAL_SCENES['default'];
  return generator(palette);
}

function getSceneDataURL(dest) {
  const svg = getSceneSVG(dest);
  return 'data:image/svg+xml,' + encodeURIComponent(svg.trim());
}
