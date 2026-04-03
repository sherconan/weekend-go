const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'assets', 'images');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// ============ HELPER DRAWING FUNCTIONS ============

function cloud(cx, cy, scale = 1) {
  const s = scale;
  return `<g transform="translate(${cx},${cy}) scale(${s})">
    <ellipse cx="0" cy="0" rx="40" ry="25" fill="#fff" opacity="0.9"/>
    <ellipse cx="-30" cy="5" rx="25" ry="18" fill="#fff" opacity="0.9"/>
    <ellipse cx="30" cy="5" rx="28" ry="20" fill="#fff" opacity="0.9"/>
    <ellipse cx="15" cy="-10" rx="20" ry="15" fill="#fff" opacity="0.9"/>
  </g>`;
}

function sun(cx, cy) {
  return `<circle cx="${cx}" cy="${cy}" r="30" fill="#FFD93D"/>
    <g stroke="#FFD93D" stroke-width="3" fill="none">
      ${[0,45,90,135,180,225,270,315].map(a => {
        const rad = a * Math.PI / 180;
        return `<line x1="${cx + 38*Math.cos(rad)}" y1="${cy + 38*Math.sin(rad)}" x2="${cx + 50*Math.cos(rad)}" y2="${cy + 50*Math.sin(rad)}"/>`;
      }).join('')}
    </g>`;
}

function cutePerson(cx, cy, opts = {}) {
  const { color = '#FFB6C1', hair = '#333', expression = 'happy', scale = 1, flip = false, armUp = false } = opts;
  const f = flip ? -1 : 1;
  let eyes, mouth;
  if (expression === 'happy') {
    eyes = `<circle cx="${cx - 6*f}" cy="${cy - 5}" r="2.5" fill="#333"/><circle cx="${cx + 6*f}" cy="${cy - 5}" r="2.5" fill="#333"/>`;
    mouth = `<path d="M${cx - 5},${cy + 3} Q${cx},${cy + 9} ${cx + 5},${cy + 3}" fill="none" stroke="#333" stroke-width="1.5"/>`;
  } else if (expression === 'exhausted') {
    eyes = `<line x1="${cx - 8}" y1="${cy - 7}" x2="${cx - 3}" y2="${cy - 3}" stroke="#333" stroke-width="1.5"/>
      <line x1="${cx - 3}" y1="${cy - 7}" x2="${cx - 8}" y2="${cy - 3}" stroke="#333" stroke-width="1.5"/>
      <line x1="${cx + 3}" y1="${cy - 7}" x2="${cx + 8}" y2="${cy - 3}" stroke="#333" stroke-width="1.5"/>
      <line x1="${cx + 8}" y1="${cy - 7}" x2="${cx + 3}" y2="${cy - 3}" stroke="#333" stroke-width="1.5"/>`;
    mouth = `<ellipse cx="${cx}" cy="${cy + 5}" rx="4" ry="5" fill="#333" opacity="0.6"/>`;
  } else if (expression === 'terrified') {
    eyes = `<circle cx="${cx - 6}" cy="${cy - 5}" r="4" fill="#fff" stroke="#333" stroke-width="1.5"/>
      <circle cx="${cx - 6}" cy="${cy - 5}" r="2" fill="#333"/>
      <circle cx="${cx + 6}" cy="${cy - 5}" r="4" fill="#fff" stroke="#333" stroke-width="1.5"/>
      <circle cx="${cx + 6}" cy="${cy - 5}" r="2" fill="#333"/>`;
    mouth = `<ellipse cx="${cx}" cy="${cy + 5}" rx="5" ry="7" fill="#333" opacity="0.7"/>`;
  } else if (expression === 'confused') {
    eyes = `<circle cx="${cx - 6}" cy="${cy - 5}" r="2.5" fill="#333"/><circle cx="${cx + 6}" cy="${cy - 4}" r="2.5" fill="#333"/>`;
    mouth = `<path d="M${cx - 4},${cy + 4} Q${cx},${cy + 2} ${cx + 4},${cy + 5}" fill="none" stroke="#333" stroke-width="1.5"/>`;
  } else if (expression === 'sleeping') {
    eyes = `<path d="M${cx - 9},${cy - 5} Q${cx - 6},${cy - 3} ${cx - 3},${cy - 5}" fill="none" stroke="#333" stroke-width="1.5"/>
      <path d="M${cx + 3},${cy - 5} Q${cx + 6},${cy - 3} ${cx + 9},${cy - 5}" fill="none" stroke="#333" stroke-width="1.5"/>`;
    mouth = `<path d="M${cx - 2},${cy + 4} Q${cx},${cy + 6} ${cx + 2},${cy + 4}" fill="none" stroke="#333" stroke-width="1"/>`;
  } else if (expression === 'screaming') {
    eyes = `<circle cx="${cx - 6}" cy="${cy - 6}" r="3" fill="#fff" stroke="#333" stroke-width="1.5"/>
      <circle cx="${cx - 6}" cy="${cy - 6}" r="1.5" fill="#333"/>
      <circle cx="${cx + 6}" cy="${cy - 6}" r="3" fill="#fff" stroke="#333" stroke-width="1.5"/>
      <circle cx="${cx + 6}" cy="${cy - 6}" r="1.5" fill="#333"/>`;
    mouth = `<ellipse cx="${cx}" cy="${cy + 6}" rx="6" ry="8" fill="#333"/>`;
  } else if (expression === 'smug') {
    eyes = `<path d="M${cx - 9},${cy - 5} Q${cx - 6},${cy - 8} ${cx - 3},${cy - 5}" fill="none" stroke="#333" stroke-width="2"/>
      <path d="M${cx + 3},${cy - 5} Q${cx + 6},${cy - 8} ${cx + 9},${cy - 5}" fill="none" stroke="#333" stroke-width="2"/>`;
    mouth = `<path d="M${cx - 5},${cy + 2} Q${cx},${cy + 7} ${cx + 5},${cy + 2}" fill="none" stroke="#333" stroke-width="1.5"/>`;
  } else if (expression === 'frustrated') {
    eyes = `<line x1="${cx - 9}" y1="${cy - 8}" x2="${cx - 5}" y2="${cy - 6}" stroke="#333" stroke-width="2"/>
      <circle cx="${cx - 6}" cy="${cy - 4}" r="2" fill="#333"/>
      <line x1="${cx + 5}" y1="${cy - 8}" x2="${cx + 9}" y2="${cy - 6}" stroke="#333" stroke-width="2"/>
      <circle cx="${cx + 6}" cy="${cy - 4}" r="2" fill="#333"/>`;
    mouth = `<path d="M${cx - 5},${cy + 5} Q${cx},${cy + 2} ${cx + 5},${cy + 5}" fill="none" stroke="#333" stroke-width="1.5"/>`;
  } else {
    eyes = `<circle cx="${cx - 6}" cy="${cy - 5}" r="2.5" fill="#333"/><circle cx="${cx + 6}" cy="${cy - 5}" r="2.5" fill="#333"/>`;
    mouth = `<path d="M${cx - 4},${cy + 3} L${cx + 4},${cy + 3}" stroke="#333" stroke-width="1.5"/>`;
  }

  const armL = armUp
    ? `<line x1="${cx - 12}" y1="${cy + 25}" x2="${cx - 25}" y2="${cy + 5}" stroke="${color}" stroke-width="5" stroke-linecap="round"/>`
    : `<line x1="${cx - 12}" y1="${cy + 25}" x2="${cx - 18}" y2="${cy + 40}" stroke="${color}" stroke-width="5" stroke-linecap="round"/>`;
  const armR = armUp
    ? `<line x1="${cx + 12}" y1="${cy + 25}" x2="${cx + 25}" y2="${cy + 5}" stroke="${color}" stroke-width="5" stroke-linecap="round"/>`
    : `<line x1="${cx + 12}" y1="${cy + 25}" x2="${cx + 18}" y2="${cy + 40}" stroke="${color}" stroke-width="5" stroke-linecap="round"/>`;

  return `<g transform="scale(${scale})">
    <!-- body -->
    <ellipse cx="${cx}" cy="${cy + 35}" rx="14" ry="20" fill="${color}"/>
    <!-- legs -->
    <line x1="${cx - 7}" y1="${cy + 52}" x2="${cx - 9}" y2="${cy + 68}" stroke="${color}" stroke-width="5" stroke-linecap="round"/>
    <line x1="${cx + 7}" y1="${cy + 52}" x2="${cx + 9}" y2="${cy + 68}" stroke="${color}" stroke-width="5" stroke-linecap="round"/>
    <!-- arms -->
    ${armL}${armR}
    <!-- head -->
    <circle cx="${cx}" cy="${cy}" r="16" fill="#FFEAA7"/>
    <!-- hair -->
    <ellipse cx="${cx}" cy="${cy - 12}" rx="16" ry="8" fill="${hair}"/>
    ${eyes}
    ${mouth}
    <!-- blush -->
    <circle cx="${cx - 10}" cy="${cy + 1}" r="3" fill="#FF9999" opacity="0.4"/>
    <circle cx="${cx + 10}" cy="${cy + 1}" r="3" fill="#FF9999" opacity="0.4"/>
  </g>`;
}

function cuteCat(cx, cy, opts = {}) {
  const { color = '#FF9F43', expression = 'smug', scale = 1 } = opts;
  let eyes, mouth;
  if (expression === 'smug') {
    eyes = `<path d="M${cx-6},${cy-2} Q${cx-4},${cy-5} ${cx-2},${cy-2}" fill="none" stroke="#333" stroke-width="1.5"/>
      <path d="M${cx+2},${cy-2} Q${cx+4},${cy-5} ${cx+6},${cy-2}" fill="none" stroke="#333" stroke-width="1.5"/>`;
    mouth = `<path d="M${cx-3},${cy+3} Q${cx},${cy+1} ${cx+3},${cy+3}" fill="none" stroke="#333" stroke-width="1"/>
      <line x1="${cx}" y1="${cy+1}" x2="${cx}" y2="${cy+4}" stroke="#333" stroke-width="1"/>`;
  } else if (expression === 'sleeping') {
    eyes = `<path d="M${cx-7},${cy-2} Q${cx-4},${cy} ${cx-1},${cy-2}" fill="none" stroke="#333" stroke-width="1.5"/>
      <path d="M${cx+1},${cy-2} Q${cx+4},${cy} ${cx+7},${cy-2}" fill="none" stroke="#333" stroke-width="1.5"/>`;
    mouth = `<path d="M${cx-2},${cy+3} Q${cx},${cy+5} ${cx+2},${cy+3}" fill="none" stroke="#333" stroke-width="1"/>`;
  } else {
    eyes = `<circle cx="${cx-5}" cy="${cy-2}" r="2" fill="#333"/><circle cx="${cx+5}" cy="${cy-2}" r="2" fill="#333"/>`;
    mouth = `<path d="M${cx-3},${cy+3} Q${cx},${cy+5} ${cx+3},${cy+3}" fill="none" stroke="#333" stroke-width="1"/>
      <line x1="${cx}" y1="${cy+3}" x2="${cx}" y2="${cy+5}" stroke="#333" stroke-width="1"/>`;
  }
  return `<g transform="translate(0,0) scale(${scale})">
    <!-- cat body -->
    <ellipse cx="${cx}" cy="${cy+20}" rx="12" ry="15" fill="${color}"/>
    <!-- tail -->
    <path d="M${cx+10},${cy+25} Q${cx+30},${cy+10} ${cx+25},${cy+30}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
    <!-- head -->
    <circle cx="${cx}" cy="${cy}" r="14" fill="${color}"/>
    <!-- ears -->
    <polygon points="${cx-12},${cy-10} ${cx-6},${cy-22} ${cx-2},${cy-8}" fill="${color}"/>
    <polygon points="${cx+12},${cy-10} ${cx+6},${cy-22} ${cx+2},${cy-8}" fill="${color}"/>
    <polygon points="${cx-10},${cy-11} ${cx-6},${cy-19} ${cx-3},${cy-9}" fill="#FFB8B8"/>
    <polygon points="${cx+10},${cy-11} ${cx+6},${cy-19} ${cx+3},${cy-9}" fill="#FFB8B8"/>
    ${eyes}
    ${mouth}
    <!-- whiskers -->
    <line x1="${cx-14}" y1="${cy}" x2="${cx-24}" y2="${cy-3}" stroke="#333" stroke-width="0.8"/>
    <line x1="${cx-14}" y1="${cy+2}" x2="${cx-24}" y2="${cy+4}" stroke="#333" stroke-width="0.8"/>
    <line x1="${cx+14}" y1="${cy}" x2="${cx+24}" y2="${cy-3}" stroke="#333" stroke-width="0.8"/>
    <line x1="${cx+14}" y1="${cy+2}" x2="${cx+24}" y2="${cy+4}" stroke="#333" stroke-width="0.8"/>
  </g>`;
}

function bird(cx, cy, color = '#4ECDC4', scale = 0.6) {
  return `<g transform="translate(${cx},${cy}) scale(${scale})">
    <ellipse cx="0" cy="0" rx="10" ry="8" fill="${color}"/>
    <circle cx="-7" cy="-5" r="6" fill="${color}"/>
    <circle cx="-5" cy="-6" r="1.5" fill="#333"/>
    <polygon points="-13,-5 -18,-3 -13,-2" fill="#FF6B6B"/>
    <path d="M5,-3 Q12,-8 8,2" fill="${color}" stroke="${color}" stroke-width="1"/>
  </g>`;
}

function tree(cx, cy, opts = {}) {
  const { color = '#27AE60', trunk = '#8B4513', height = 60 } = opts;
  return `<rect x="${cx-5}" y="${cy - height}" width="10" height="${height}" fill="${trunk}" rx="2"/>
    <ellipse cx="${cx}" cy="${cy - height - 10}" rx="25" ry="30" fill="${color}"/>
    <ellipse cx="${cx - 15}" cy="${cy - height + 5}" rx="18" ry="22" fill="${color}"/>
    <ellipse cx="${cx + 15}" cy="${cy - height + 5}" rx="18" ry="22" fill="${color}"/>`;
}

function mountain(cx, cy, w, h, color = '#6C9A8B') {
  return `<polygon points="${cx},${cy - h} ${cx - w/2},${cy} ${cx + w/2},${cy}" fill="${color}"/>
    <polygon points="${cx},${cy - h} ${cx - w*0.15},${cy - h*0.7} ${cx + w*0.15},${cy - h*0.7}" fill="#fff" opacity="0.6"/>`;
}

function water(y, width = 800, color = '#74B9FF') {
  return `<rect x="0" y="${y}" width="${width}" height="${500 - y}" fill="${color}"/>
    ${[0,1,2,3,4].map(i => `<path d="M${i*200},${y+15} Q${i*200+50},${y+8} ${i*200+100},${y+15} Q${i*200+150},${y+22} ${i*200+200},${y+15}" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.5"/>`).join('')}`;
}

function lantern(cx, cy, color = '#E74C3C') {
  return `<line x1="${cx}" y1="${cy-15}" x2="${cx}" y2="${cy-5}" stroke="#C0392B" stroke-width="1.5"/>
    <ellipse cx="${cx}" cy="${cy+5}" rx="8" ry="12" fill="${color}" opacity="0.9"/>
    <rect x="${cx-9}" y="${cy-6}" width="18" height="4" rx="1" fill="#C0392B"/>
    <rect x="${cx-9}" y="${cy+14}" width="18" height="4" rx="1" fill="#C0392B"/>
    <line x1="${cx}" y1="${cy+18}" x2="${cx}" y2="${cy+24}" stroke="#FFD700" stroke-width="1"/>`;
}

function duck(cx, cy, opts = {}) {
  const { scale = 1, hat = false } = opts;
  let eyes = `<circle cx="${cx-4}" cy="${cy-5}" r="2" fill="#333"/>`;
  return `<g transform="scale(${scale})">
    <ellipse cx="${cx}" cy="${cy+8}" rx="14" ry="10" fill="#F9CA24"/>
    <circle cx="${cx-2}" cy="${cy-2}" r="10" fill="#F9CA24"/>
    ${eyes}
    <ellipse cx="${cx-12}" cy="${cy}" rx="6" ry="3" fill="#FF9F43"/>
    ${hat ? `<ellipse cx="${cx}" cy="${cy-14}" rx="14" ry="4" fill="#2C3E50"/>
      <rect x="${cx-8}" y="${cy-26}" width="16" height="14" rx="2" fill="#2C3E50"/>
      <rect x="${cx-10}" y="${cy-16}" width="20" height="3" fill="#F1C40F"/>` : ''}
  </g>`;
}

function speechBubble(cx, cy, text, opts = {}) {
  const { width = 80, height = 30, fontSize = 11 } = opts;
  return `<g>
    <rect x="${cx - width/2}" y="${cy - height}" width="${width}" height="${height}" rx="10" fill="#fff" stroke="#333" stroke-width="1.5"/>
    <polygon points="${cx-5},${cy} ${cx+5},${cy} ${cx},${cy+10}" fill="#fff"/>
    <text x="${cx}" y="${cy - height/2 + fontSize/3}" text-anchor="middle" font-size="${fontSize}" font-family="Arial, sans-serif" fill="#333">${text}</text>
  </g>`;
}

function svgWrap(content, bg = '#87CEEB') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <style>
      text { font-family: 'Arial', 'Helvetica', sans-serif; }
    </style>
  </defs>
  <rect width="800" height="500" fill="${bg}"/>
  ${content}
</svg>`;
}

function cherryBlossom(cx, cy, scale = 1) {
  return `<g transform="translate(${cx},${cy}) scale(${scale})">
    <circle cx="0" cy="0" r="3" fill="#FFB7C5" opacity="0.8"/>
    <circle cx="4" cy="-3" r="2.5" fill="#FFB7C5" opacity="0.7"/>
    <circle cx="-3" cy="-4" r="2" fill="#FFCDD2" opacity="0.6"/>
  </g>`;
}

function ginkgoLeaf(cx, cy, rotation = 0) {
  return `<g transform="translate(${cx},${cy}) rotate(${rotation})">
    <path d="M0,0 Q-6,-10 0,-16 Q6,-10 0,0" fill="#F9CA24" opacity="0.8"/>
    <line x1="0" y1="0" x2="0" y2="4" stroke="#8B7355" stroke-width="0.5"/>
  </g>`;
}

function snowflake(cx, cy, size = 4) {
  const lines = [0,60,120].map(a => {
    const rad = a * Math.PI / 180;
    return `<line x1="${cx - size*Math.cos(rad)}" y1="${cy - size*Math.sin(rad)}" x2="${cx + size*Math.cos(rad)}" y2="${cy + size*Math.sin(rad)}" stroke="#fff" stroke-width="1" opacity="0.7"/>`;
  });
  return lines.join('');
}

function greatWallSection(x, y, width, steps = false) {
  let wall = `<rect x="${x}" y="${y}" width="${width}" height="25" fill="#C4A882" stroke="#8B7355" stroke-width="1"/>`;
  for (let i = x; i < x + width; i += 15) {
    wall += `<rect x="${i}" y="${y-10}" width="8" height="12" fill="#C4A882" stroke="#8B7355" stroke-width="0.8"/>`;
  }
  if (steps) {
    for (let i = 0; i < 5; i++) {
      wall += `<rect x="${x + width + i*12}" y="${y - i*8}" width="14" height="8" fill="#C4A882" stroke="#8B7355" stroke-width="0.8"/>`;
    }
  }
  return wall;
}

function phone(cx, cy, selfie = false) {
  return `<g>
    <rect x="${cx-6}" y="${cy-10}" width="12" height="20" rx="2" fill="#333"/>
    <rect x="${cx-5}" y="${cy-8}" width="10" height="16" rx="1" fill="#74B9FF"/>
    ${selfie ? `<circle cx="${cx}" cy="${cy-9}" r="1.5" fill="#555"/>` : ''}
  </g>`;
}

// ============ SCENE GENERATORS ============

const scenes = {
  'dest-gubei.svg': () => {
    let s = '';
    s += `<rect width="800" height="500" fill="#1a1a3e"/>`;
    for (let i = 0; i < 30; i++) {
      s += `<circle cx="${Math.random()*800}" cy="${Math.random()*200}" r="${Math.random()*2+0.5}" fill="#fff" opacity="${Math.random()*0.5+0.3}"/>`;
    }
    s += `<circle cx="680" cy="80" r="35" fill="#F9CA24"/>
      <circle cx="695" cy="70" r="30" fill="#1a1a3e"/>`;
    s += mountain(200, 380, 350, 180, '#2d2d5e');
    s += mountain(500, 380, 400, 200, '#252550');
    s += greatWallSection(0, 350, 350);
    s += greatWallSection(350, 330, 200, true);
    s += greatWallSection(550, 360, 250);
    s += `<rect x="0" y="375" width="800" height="125" fill="#2d2d3e"/>`;
    s += lantern(150, 180);
    s += lantern(350, 140);
    s += lantern(550, 160);
    s += lantern(700, 200);
    s += cuteCat(400, 300, { color: '#FF9F43', expression: 'smug', scale: 1.5 });
    s += `<g transform="translate(400, 300) scale(1.5)">
      <rect x="-10" y="-5" width="8" height="5" rx="2" fill="#333"/>
      <rect x="2" y="-5" width="8" height="5" rx="2" fill="#333"/>
      <line x1="-2" y1="-3" x2="2" y2="-3" stroke="#333" stroke-width="1"/>
      <line x1="-10" y1="-3" x2="-15" y2="-5" stroke="#333" stroke-width="1"/>
      <line x1="10" y1="-3" x2="15" y2="-5" stroke="#333" stroke-width="1"/>
    </g>`;
    s += `<g transform="translate(440, 330)">
      <rect x="0" y="0" width="14" height="25" rx="3" fill="#E8D5B7" opacity="0.8"/>
      <circle cx="4" cy="18" r="2.5" fill="#5D4037"/>
      <circle cx="9" cy="20" r="2" fill="#5D4037"/>
      <circle cx="6" cy="15" r="2" fill="#5D4037"/>
      <line x1="7" y1="-5" x2="7" y2="5" stroke="#E74C3C" stroke-width="2"/>
    </g>`;
    s += speechBubble(400, 260, 'Chill~', { width: 70, height: 25, fontSize: 12 });
    return svgWrap(s, '#1a1a3e');
  },

  'dest-bailihualang.svg': () => {
    let s = '';
    s += cloud(150, 60);
    s += cloud(600, 80, 0.8);
    s += sun(700, 60);
    s += `<ellipse cx="200" cy="460" rx="300" ry="80" fill="#7BC67E"/>`;
    s += `<ellipse cx="600" cy="470" rx="280" ry="70" fill="#6AB06D"/>`;
    s += `<path d="M0,420 Q200,380 400,400 Q600,420 800,380" fill="none" stroke="#888" stroke-width="20"/>`;
    s += `<path d="M0,420 Q200,380 400,400 Q600,420 800,380" fill="none" stroke="#FFD93D" stroke-width="2" stroke-dasharray="10,10"/>`;
    const flowerColors = ['#E74C3C', '#9B59B6', '#F39C12', '#E91E63', '#FF6B6B'];
    for (let i = 0; i < 40; i++) {
      const fx = Math.random() * 800;
      const fy = 430 + Math.random() * 60;
      const fc = flowerColors[Math.floor(Math.random() * flowerColors.length)];
      s += `<circle cx="${fx}" cy="${fy}" r="4" fill="${fc}"/>
        <line x1="${fx}" y1="${fy}" x2="${fx}" y2="${fy+12}" stroke="#27AE60" stroke-width="1.5"/>`;
    }
    s += `<g transform="translate(350, 350)">
      <rect x="0" y="20" width="70" height="30" rx="8" fill="#3498DB"/>
      <rect x="10" y="10" width="25" height="15" rx="3" fill="#85C1E9"/>
      <rect x="38" y="10" width="22" height="15" rx="3" fill="#85C1E9"/>
      <circle cx="15" cy="52" r="8" fill="#333"/>
      <circle cx="55" cy="52" r="8" fill="#333"/>
      <circle cx="15" cy="52" r="3" fill="#888"/>
      <circle cx="55" cy="52" r="3" fill="#888"/>
      <rect x="5" y="-10" width="60" height="22" rx="3" fill="#E74C3C"/>
      <rect x="10" y="-35" width="50" height="28" rx="3" fill="#F39C12"/>
      <rect x="15" y="-60" width="40" height="28" rx="3" fill="#2ECC71"/>
      <rect x="20" y="-80" width="30" height="23" rx="3" fill="#9B59B6"/>
      <rect x="25" y="-95" width="20" height="18" rx="3" fill="#E91E63"/>
      <circle cx="35" cy="-102" r="8" fill="#1ABC9C"/>
      <line x1="10" y1="-95" x2="10" y2="10" stroke="#333" stroke-width="1" stroke-dasharray="3,3"/>
      <line x1="60" y1="-95" x2="60" y2="10" stroke="#333" stroke-width="1" stroke-dasharray="3,3"/>
    </g>`;
    s += `<g transform="translate(370, 350)">
      <circle cx="20" cy="10" r="8" fill="#FFEAA7"/>
      <circle cx="17" cy="8" r="1.5" fill="#333"/>
      <circle cx="23" cy="8" r="1.5" fill="#333"/>
      <path d="M17,13 Q20,16 23,13" fill="none" stroke="#333" stroke-width="1"/>
    </g>`;
    s += phone(405, 345, true);
    s += `<text x="500" y="340" font-size="16" fill="#E74C3C" font-weight="bold">!</text>`;
    s += speechBubble(420, 310, 'Selfie time!', { width: 80, height: 25, fontSize: 10 });
    return svgWrap(s, '#87CEEB');
  },

  'dest-miyun.svg': () => {
    let s = '';
    s += cloud(100, 50, 0.7);
    s += cloud(500, 40);
    s += sun(700, 70);
    s += mountain(150, 350, 300, 150, '#6C9A8B');
    s += mountain(600, 350, 350, 180, '#5D8A7B');
    s += water(300);
    s += `<polygon points="600,250 640,300 560,300" fill="#E74C3C"/>
      <polygon points="600,250 620,300 580,300" fill="#C0392B"/>
      <rect x="595" y="280" width="10" height="20" fill="#2C3E50"/>`;
    s += `<ellipse cx="555" cy="295" rx="6" ry="4" fill="#FFEAA7"/>
      <ellipse cx="545" cy="293" rx="6" ry="4" fill="#FFEAA7"/>`;
    s += `<text x="615" y="240" font-size="14" fill="#333" opacity="0.6" font-weight="bold">Z</text>
      <text x="625" y="225" font-size="18" fill="#333" opacity="0.5" font-weight="bold">Z</text>
      <text x="638" y="208" font-size="22" fill="#333" opacity="0.4" font-weight="bold">Z</text>`;
    s += `<g transform="translate(350, 250)">
      <ellipse cx="0" cy="0" rx="25" ry="15" fill="#F9CA24" transform="rotate(-20)"/>
      <polygon points="20,-5 35,-15 35,5" fill="#F39C12"/>
      <circle cx="-8" cy="-5" r="4" fill="#fff"/>
      <circle cx="-8" cy="-5" r="2" fill="#333"/>
      <path d="M-12,3 Q-5,10 2,3" fill="none" stroke="#333" stroke-width="1.5"/>
      <path d="M5,-10 Q15,-20 10,-5" fill="#F39C12"/>
    </g>`;
    s += phone(330, 238, true);
    s += `<g>
      <path d="M330,270 Q325,260 320,272" fill="none" stroke="#fff" stroke-width="2"/>
      <path d="M370,268 Q375,255 380,270" fill="none" stroke="#fff" stroke-width="2"/>
      <path d="M345,275 Q340,262 338,278" fill="none" stroke="#fff" stroke-width="1.5"/>
      <circle cx="325" cy="265" r="3" fill="#fff" opacity="0.6"/>
      <circle cx="378" cy="263" r="2" fill="#fff" opacity="0.5"/>
    </g>`;
    s += speechBubble(350, 210, '#ReservoirLife', { width: 100, height: 25, fontSize: 10 });
    s += tree(50, 300, { height: 40 });
    s += tree(720, 300, { height: 35 });
    return svgWrap(s, '#87CEEB');
  },

  'dest-mutianyu.svg': () => {
    let s = '';
    s += cloud(100, 40, 0.8);
    s += cloud(600, 60);
    s += mountain(200, 400, 400, 250, '#6C9A8B');
    s += mountain(550, 400, 350, 220, '#5D8A7B');
    s += `<path d="M100,400 L200,350 L300,300 L400,260 L500,230 L600,200 L700,180" fill="none" stroke="#C4A882" stroke-width="25"/>`;
    for (let x = 150; x < 700; x += 40) {
      const y = 400 - (x - 100) * 0.35;
      s += `<rect x="${x}" y="${y - 18}" width="10" height="12" fill="#C4A882" stroke="#8B7355" stroke-width="0.5"/>`;
    }
    for (let x = 150; x < 680; x += 25) {
      const y = 400 - (x - 100) * 0.35;
      s += `<line x1="${x}" y1="${y+10}" x2="${x+25}" y2="${y+10 - 8}" stroke="#8B7355" stroke-width="1"/>`;
    }
    const climbers = [
      { x: 250, expression: 'happy', color: '#E74C3C' },
      { x: 320, expression: 'happy', color: '#3498DB' },
      { x: 390, expression: 'happy', color: '#2ECC71' },
      { x: 460, expression: 'happy', color: '#F39C12' },
    ];
    climbers.forEach(c => {
      const y = 400 - (c.x - 100) * 0.35 - 35;
      s += cutePerson(c.x, y, { color: c.color, expression: c.expression, scale: 0.5 });
    });
    const lastX = 200, lastY = 370;
    s += `<g transform="translate(${lastX}, ${lastY}) rotate(15)">
      <ellipse cx="0" cy="0" rx="12" ry="8" fill="#9B59B6"/>
      <circle cx="-14" cy="-4" r="9" fill="#FFEAA7"/>
      <line x1="-18" y1="-7" x2="-14" y2="-4" stroke="#333" stroke-width="1.2"/>
      <line x1="-14" y1="-7" x2="-18" y2="-4" stroke="#333" stroke-width="1.2"/>
      <line x1="-12" y1="-7" x2="-8" y2="-4" stroke="#333" stroke-width="1.2"/>
      <line x1="-8" y1="-7" x2="-12" y2="-4" stroke="#333" stroke-width="1.2"/>
      <ellipse cx="-14" cy="3" rx="3" ry="4" fill="#E74C3C"/>
      <circle cx="-5" cy="-10" r="2" fill="#74B9FF"/>
      <circle cx="-20" cy="-8" r="1.5" fill="#74B9FF"/>
    </g>`;
    for (let i = 0; i < 20; i++) {
      s += cherryBlossom(Math.random() * 800, Math.random() * 300, Math.random() * 0.6 + 0.4);
    }
    s += speechBubble(200, 320, "Can't...go...on...", { width: 100, height: 25, fontSize: 9 });
    return svgWrap(s, '#87CEEB');
  },

  'dest-jinhaihu.svg': () => {
    let s = '';
    s += cloud(200, 50);
    s += sun(680, 60);
    s += mountain(150, 350, 300, 120, '#6C9A8B');
    s += mountain(650, 350, 250, 100, '#5D8A7B');
    s += water(320, 800, '#5DADE2');
    s += `<g transform="translate(350, 280)">
      <path d="M-40,20 Q-45,40 -30,40 L30,40 Q45,40 40,20 Z" fill="#8B4513"/>
      <line x1="0" y1="-40" x2="0" y2="20" stroke="#5D4037" stroke-width="3"/>
      <polygon points="2,-35 2,15 35,10" fill="#fff" stroke="#ddd" stroke-width="1"/>
    </g>`;
    s += duck(350, 270, { hat: true, scale: 1 });
    s += `<circle cx="370" cy="300" r="8" fill="none" stroke="#5D4037" stroke-width="2"/>
      <line x1="370" y1="292" x2="370" y2="308" stroke="#5D4037" stroke-width="1.5"/>
      <line x1="362" y1="300" x2="378" y2="300" stroke="#5D4037" stroke-width="1.5"/>`;
    s += cutePerson(600, 290, { color: '#3498DB', expression: 'confused' });
    s += speechBubble(600, 250, 'Wait... what?', { width: 90, height: 25, fontSize: 10 });
    s += `<polygon points="350,242 350,250 365,246" fill="#E74C3C"/>`;
    return svgWrap(s, '#87CEEB');
  },

  'dest-shidu.svg': () => {
    let s = '';
    s += `<polygon points="0,0 120,0 80,500 0,500" fill="#8B7355"/>`;
    s += `<polygon points="800,0 680,0 720,500 800,500" fill="#7B6345"/>`;
    s += water(350, 800, '#48C9B0');
    s += `<g transform="translate(400, 340)">
      <rect x="-60" y="0" width="120" height="15" rx="5" fill="#A0522D"/>
      <rect x="-55" y="2" width="10" height="11" rx="2" fill="#8B4513"/>
      <rect x="-40" y="2" width="10" height="11" rx="2" fill="#8B4513"/>
      <rect x="-25" y="2" width="10" height="11" rx="2" fill="#8B4513"/>
      <rect x="-10" y="2" width="10" height="11" rx="2" fill="#8B4513"/>
      <rect x="5" y="2" width="10" height="11" rx="2" fill="#8B4513"/>
      <rect x="20" y="2" width="10" height="11" rx="2" fill="#8B4513"/>
      <rect x="35" y="2" width="10" height="11" rx="2" fill="#8B4513"/>
    </g>`;
    s += cutePerson(360, 270, { color: '#E74C3C', expression: 'screaming', scale: 0.7 });
    s += cutePerson(400, 268, { color: '#3498DB', expression: 'screaming', scale: 0.7 });
    s += `<g transform="translate(450, 310) rotate(130)">
      <ellipse cx="0" cy="8" rx="8" ry="12" fill="#2ECC71"/>
      <circle cx="0" cy="-6" r="9" fill="#FFEAA7"/>
      <circle cx="-3" cy="-8" r="2" fill="#fff" stroke="#333"/>
      <circle cx="-3" cy="-8" r="1" fill="#333"/>
      <circle cx="3" cy="-8" r="2" fill="#fff" stroke="#333"/>
      <circle cx="3" cy="-8" r="1" fill="#333"/>
      <ellipse cx="0" cy="-1" rx="4" ry="5" fill="#333"/>
      <line x1="-8" y1="2" x2="-20" y2="-8" stroke="#2ECC71" stroke-width="3" stroke-linecap="round"/>
      <line x1="8" y1="2" x2="18" y2="-10" stroke="#2ECC71" stroke-width="3" stroke-linecap="round"/>
    </g>`;
    s += `<g opacity="0.8">
      <path d="M430,350 Q440,310 445,355" fill="none" stroke="#fff" stroke-width="3"/>
      <path d="M450,345 Q465,300 470,350" fill="none" stroke="#fff" stroke-width="3"/>
      <path d="M460,355 Q470,325 475,358" fill="none" stroke="#fff" stroke-width="2"/>
      <circle cx="445" cy="340" r="4" fill="#fff" opacity="0.6"/>
      <circle cx="465" cy="330" r="3" fill="#fff" opacity="0.5"/>
      <circle cx="455" cy="320" r="5" fill="#fff" opacity="0.4"/>
      <path d="M440,350 Q430,320 425,355" fill="none" stroke="#fff" stroke-width="2"/>
    </g>`;
    s += `<text x="400" y="250" text-anchor="middle" font-size="20" fill="#E74C3C" font-weight="bold">AHHHHH!</text>`;
    return svgWrap(s, '#87CEEB');
  },

  'dest-mangshan.svg': () => {
    let s = '';
    s += cloud(100, 40);
    s += cloud(550, 55, 0.7);
    s += sun(680, 60);
    s += mountain(400, 420, 600, 300, '#6C9A8B');
    s += mountain(200, 420, 300, 200, '#5D8A7B');
    s += water(420, 800, '#5DADE2');
    s += `<rect x="370" y="120" width="60" height="5" fill="#8B7355"/>`;
    s += cutePerson(400, 70, { color: '#E74C3C', expression: 'happy', armUp: true, scale: 0.8 });
    s += `<line x1="430" y1="50" x2="430" y2="100" stroke="#5D4037" stroke-width="2"/>
      <polygon points="430,50 460,58 430,66" fill="#E74C3C"/>`;
    s += cuteCat(360, 95, { expression: 'sleeping', scale: 1.2 });
    s += `<text x="340" y="80" font-size="10" fill="#333" opacity="0.5" font-weight="bold">z</text>
      <text x="330" y="68" font-size="14" fill="#333" opacity="0.4" font-weight="bold">Z</text>
      <text x="318" y="53" font-size="18" fill="#333" opacity="0.3" font-weight="bold">Z</text>`;
    s += speechBubble(400, 25, "I'm FIRST!...wait", { width: 100, height: 25, fontSize: 9 });
    s += tree(250, 350, { height: 30, color: '#27AE60' });
    s += tree(550, 370, { height: 25, color: '#2ECC71' });
    return svgWrap(s, '#87CEEB');
  },

  'dest-nanshan.svg': () => {
    let s = '';
    s += `<rect width="800" height="500" fill="#B8D4E3"/>`;
    s += mountain(250, 400, 500, 280, '#E8E8E8');
    s += mountain(600, 400, 400, 250, '#F0F0F0');
    s += `<path d="M200,200 Q400,350 700,420" fill="none" stroke="#fff" stroke-width="40" opacity="0.5"/>`;
    s += `<rect x="0" y="400" width="800" height="100" fill="#fff"/>`;
    s += `<g transform="translate(300, 320)">
      <ellipse cx="0" cy="10" rx="20" ry="25" fill="#2C3E50"/>
      <ellipse cx="0" cy="12" rx="13" ry="18" fill="#fff"/>
      <circle cx="0" cy="-12" r="16" fill="#2C3E50"/>
      <circle cx="-5" cy="-14" r="3" fill="#fff"/>
      <circle cx="-5" cy="-14" r="1.5" fill="#333"/>
      <circle cx="5" cy="-14" r="3" fill="#fff"/>
      <circle cx="5" cy="-14" r="1.5" fill="#333"/>
      <polygon points="-3,-8 3,-8 0,-3" fill="#F39C12"/>
      <path d="M-20,5 L-35,-5" stroke="#2C3E50" stroke-width="8" stroke-linecap="round"/>
      <circle cx="8" cy="-3" r="3" fill="#F39C12"/>
      <rect x="-15" y="34" width="30" height="3" rx="1" fill="#E74C3C"/>
    </g>`;
    s += speechBubble(300, 270, 'Bend knees!', { width: 80, height: 25, fontSize: 10 });
    s += `<g transform="translate(450, 350) rotate(30)">
      <ellipse cx="0" cy="5" rx="8" ry="12" fill="#E74C3C"/>
      <circle cx="0" cy="-8" r="8" fill="#FFEAA7"/>
      <circle cx="-3" cy="-9" r="1.5" fill="#333"/>
      <circle cx="3" cy="-9" r="1.5" fill="#333"/>
      <ellipse cx="0" cy="-4" rx="3" ry="4" fill="#333"/>
      <line x1="-8" y1="0" x2="-18" y2="-10" stroke="#E74C3C" stroke-width="3" stroke-linecap="round"/>
      <line x1="8" y1="0" x2="15" y2="12" stroke="#E74C3C" stroke-width="3" stroke-linecap="round"/>
    </g>`;
    s += `<g transform="translate(550, 380) rotate(-90)">
      <ellipse cx="0" cy="5" rx="7" ry="10" fill="#3498DB"/>
      <circle cx="0" cy="-6" r="7" fill="#FFEAA7"/>
      <path d="M-4,-5 Q0,-8 4,-5" fill="none" stroke="#333" stroke-width="1"/>
      <path d="M-4,-3 Q0,-8 4,-3" fill="none" stroke="#333" stroke-width="1"/>
      <line x1="-7" y1="2" x2="-14" y2="-5" stroke="#3498DB" stroke-width="3" stroke-linecap="round"/>
      <line x1="7" y1="2" x2="14" y2="-5" stroke="#3498DB" stroke-width="3" stroke-linecap="round"/>
    </g>`;
    s += `<line x1="470" y1="340" x2="500" y2="380" stroke="#888" stroke-width="2"/>
      <line x1="520" y1="360" x2="540" y2="400" stroke="#888" stroke-width="2"/>`;
    for (let i = 0; i < 25; i++) {
      s += snowflake(Math.random() * 800, Math.random() * 400, Math.random() * 3 + 2);
    }
    return svgWrap(s, '#B8D4E3');
  },

  'dest-hongluosi.svg': () => {
    let s = '';
    s += cloud(100, 40);
    s += sun(680, 55);
    s += `<g transform="translate(400, 250)">
      <path d="M-80,-30 L0,-70 L80,-30" fill="#C0392B" stroke="#922B21" stroke-width="2"/>
      <path d="M-70,-30 L0,-60 L70,-30" fill="#E74C3C"/>
      <path d="M-80,-30 Q-85,-40 -90,-28" fill="#C0392B"/>
      <path d="M80,-30 Q85,-40 90,-28" fill="#C0392B"/>
      <rect x="-60" y="-30" width="120" height="80" fill="#F5E6CC"/>
      <rect x="-15" y="10" width="30" height="40" rx="15" fill="#8B4513"/>
      <rect x="-50" y="-10" width="20" height="20" rx="2" fill="#F9E4B7" stroke="#8B4513" stroke-width="1"/>
      <rect x="30" y="-10" width="20" height="20" rx="2" fill="#F9E4B7" stroke="#8B4513" stroke-width="1"/>
    </g>`;
    s += `<rect x="0" y="330" width="800" height="170" fill="#8B7355" opacity="0.3"/>`;
    s += `<ellipse cx="200" cy="380" rx="100" ry="30" fill="#F9CA24" opacity="0.7"/>`;
    s += `<ellipse cx="400" cy="370" rx="150" ry="40" fill="#F5B041" opacity="0.7"/>`;
    s += `<ellipse cx="600" cy="385" rx="120" ry="35" fill="#F9CA24" opacity="0.6"/>`;
    s += `<ellipse cx="300" cy="400" rx="200" ry="45" fill="#F4D03F" opacity="0.5"/>`;
    for (let i = 0; i < 30; i++) {
      s += ginkgoLeaf(Math.random() * 800, Math.random() * 350, Math.random() * 360);
    }
    s += cutePerson(250, 280, { color: '#F39C12', hair: '#8B4513', expression: 'frustrated', scale: 0.8 });
    s += `<line x1="275" y1="310" x2="290" y2="370" stroke="#8B4513" stroke-width="3"/>
      <path d="M280,365 Q290,375 300,365" fill="none" stroke="#8B4513" stroke-width="4"/>`;
    s += `<ellipse cx="250" cy="300" rx="8" ry="2" fill="#D4AC0D"/>`;
    s += speechBubble(250, 240, 'Not again...', { width: 85, height: 25, fontSize: 10 });
    s += `<line x1="100" y1="200" x2="100" y2="330" stroke="#8B7355" stroke-width="10"/>
      <ellipse cx="100" cy="180" rx="50" ry="60" fill="#F9CA24" opacity="0.8"/>`;
    s += `<line x1="700" y1="210" x2="700" y2="330" stroke="#8B7355" stroke-width="10"/>
      <ellipse cx="700" cy="190" rx="45" ry="55" fill="#F5B041" opacity="0.8"/>`;
    return svgWrap(s, '#87CEEB');
  },

  'dest-wulingshan.svg': () => {
    let s = '';
    s += `<rect width="800" height="500" fill="#2C3E50"/>`;
    s += `<ellipse cx="400" cy="200" rx="400" ry="200" fill="#E67E22" opacity="0.15"/>`;
    s += `<ellipse cx="400" cy="250" rx="300" ry="100" fill="#F39C12" opacity="0.1"/>`;
    for (let i = 0; i < 15; i++) {
      s += `<circle cx="${Math.random()*800}" cy="${Math.random()*150}" r="${Math.random()+0.5}" fill="#fff" opacity="${Math.random()*0.3+0.1}"/>`;
    }
    s += mountain(400, 400, 600, 280, '#1a2a3a');
    s += mountain(200, 400, 300, 200, '#1a2a3a');
    s += `<rect x="350" y="125" width="100" height="5" fill="#2a3a4a"/>`;
    s += `<polygon points="400,80 440,130 360,130" fill="#27AE60"/>
      <polygon points="400,80 420,130 380,130" fill="#229954"/>
      <rect x="393" y="110" width="14" height="20" fill="#1E8449"/>`;
    s += `<g transform="translate(450, 105)">
      <circle cx="0" cy="0" r="12" fill="#E74C3C" stroke="#C0392B" stroke-width="2"/>
      <circle cx="0" cy="0" r="9" fill="#fff"/>
      <line x1="0" y1="0" x2="0" y2="-6" stroke="#333" stroke-width="1.5"/>
      <line x1="0" y1="0" x2="4" y2="2" stroke="#333" stroke-width="1"/>
      <circle cx="0" cy="0" r="1" fill="#333"/>
      <circle cx="-8" cy="-10" r="4" fill="#C0392B"/>
      <circle cx="8" cy="-10" r="4" fill="#C0392B"/>
      <path d="M-15,-12 L-20,-16" stroke="#F39C12" stroke-width="2"/>
      <path d="M15,-12 L20,-16" stroke="#F39C12" stroke-width="2"/>
      <path d="M-18,-8 L-24,-10" stroke="#F39C12" stroke-width="1.5"/>
      <path d="M18,-8 L24,-10" stroke="#F39C12" stroke-width="1.5"/>
    </g>`;
    s += `<g>
      <path d="M393,115 Q380,108 370,100 Q360,95 355,105" fill="none" stroke="#FFEAA7" stroke-width="6" stroke-linecap="round"/>
      <circle cx="355" cy="105" r="5" fill="#FFEAA7"/>
    </g>`;
    s += speechBubble(400, 55, '5 more min...', { width: 90, height: 25, fontSize: 10 });
    s += `<ellipse cx="400" cy="400" rx="200" ry="30" fill="#F39C12" opacity="0.3"/>`;
    return svgWrap(s, '#2C3E50');
  },

  'dest-caoyuantianlu.svg': () => {
    let s = '';
    s += cloud(100, 40);
    s += cloud(500, 55, 0.8);
    s += sun(680, 50);
    s += `<rect x="0" y="300" width="800" height="200" fill="#7BC67E"/>`;
    s += `<rect x="0" y="350" width="800" height="150" fill="#6AB06D"/>`;
    s += `<path d="M0,380 Q200,370 400,380 Q600,390 800,375" fill="none" stroke="#888" stroke-width="15"/>`;
    s += `<g transform="translate(200, 200)">
      <line x1="0" y1="0" x2="0" y2="100" stroke="#ccc" stroke-width="4"/>
      <line x1="0" y1="0" x2="-30" y2="-15" stroke="#ddd" stroke-width="3"/>
      <line x1="0" y1="0" x2="25" y2="-20" stroke="#ddd" stroke-width="3"/>
      <line x1="0" y1="0" x2="5" y2="30" stroke="#ddd" stroke-width="3"/>
      <circle cx="0" cy="0" r="4" fill="#bbb"/>
    </g>`;
    s += `<g transform="translate(600, 210)">
      <line x1="0" y1="0" x2="0" y2="90" stroke="#ccc" stroke-width="4"/>
      <line x1="0" y1="0" x2="-25" y2="-20" stroke="#ddd" stroke-width="3"/>
      <line x1="0" y1="0" x2="28" y2="-12" stroke="#ddd" stroke-width="3"/>
      <line x1="0" y1="0" x2="-3" y2="28" stroke="#ddd" stroke-width="3"/>
      <circle cx="0" cy="0" r="4" fill="#bbb"/>
    </g>`;
    s += cutePerson(380, 300, { color: '#E74C3C', expression: 'happy', scale: 0.7 });
    s += cutePerson(420, 298, { color: '#3498DB', expression: 'happy', scale: 0.7 });
    s += phone(430, 285, true);
    s += `<g transform="translate(400, 330)">
      <ellipse cx="0" cy="10" rx="22" ry="16" fill="#F5F5F5"/>
      <circle cx="-10" cy="5" r="8" fill="#F5F5F5"/>
      <circle cx="10" cy="5" r="8" fill="#F5F5F5"/>
      <circle cx="0" cy="-2" r="8" fill="#F5F5F5"/>
      <ellipse cx="0" cy="-10" rx="10" ry="9" fill="#FFEAA7"/>
      <circle cx="-3" cy="-12" r="2" fill="#333"/>
      <circle cx="5" cy="-12" r="2" fill="#333"/>
      <path d="M-2,-7 Q2,-5 5,-7" fill="none" stroke="#333" stroke-width="1.2"/>
      <line x1="-12" y1="24" x2="-12" y2="36" stroke="#333" stroke-width="3"/>
      <line x1="12" y1="24" x2="12" y2="36" stroke="#333" stroke-width="3"/>
      <line x1="-5" y1="24" x2="-5" y2="36" stroke="#333" stroke-width="3"/>
      <line x1="5" y1="24" x2="5" y2="36" stroke="#333" stroke-width="3"/>
    </g>`;
    for (let i = 0; i < 4; i++) {
      const sx = 550 + i * 50;
      s += `<g transform="translate(${sx}, 360) scale(0.6)">
        <ellipse cx="0" cy="0" rx="15" ry="12" fill="#F5F5F5"/>
        <circle cx="-6" cy="-6" r="5" fill="#F5F5F5"/>
        <circle cx="6" cy="-6" r="5" fill="#F5F5F5"/>
        <ellipse cx="0" cy="-12" rx="7" ry="6" fill="#FFEAA7"/>
        <circle cx="-2" cy="-13" r="1.5" fill="#333"/>
        <circle cx="3" cy="-13" r="1.5" fill="#333"/>
        <line x1="-8" y1="10" x2="-8" y2="18" stroke="#333" stroke-width="2"/>
        <line x1="8" y1="10" x2="8" y2="18" stroke="#333" stroke-width="2"/>
      </g>`;
    }
    s += speechBubble(400, 285, 'My turn!', { width: 75, height: 25, fontSize: 10 });
    return svgWrap(s, '#87CEEB');
  },

  'dest-aranya.svg': () => {
    let s = '';
    s += `<rect x="0" y="350" width="800" height="150" fill="#F5DEB3"/>`;
    s += water(250, 800, '#5DADE2');
    s += `<rect x="0" y="340" width="800" height="20" fill="#EAD8B1"/>`;
    s += `<g transform="translate(400, 260)">
      <rect x="-40" y="-50" width="80" height="80" fill="#ECF0F1" stroke="#BDC3C7" stroke-width="2"/>
      <rect x="-35" y="-45" width="30" height="35" rx="1" fill="#85C1E9"/>
      <rect x="0" y="-45" width="30" height="35" rx="1" fill="#85C1E9"/>
      <rect x="-10" y="0" width="20" height="30" rx="2" fill="#8B4513"/>
      <text x="0" y="-55" text-anchor="middle" font-size="8" fill="#333">LIBRARY</text>
    </g>`;
    s += bird(400, 195, '#ECF0F1', 1);
    s += `<g transform="translate(395, 195)">
      <rect x="5" y="-5" width="12" height="8" rx="1" fill="#E74C3C" transform="rotate(-10)"/>
    </g>`;
    const queuePeople = [
      { x: 350, color: '#E74C3C' },
      { x: 320, color: '#3498DB' },
      { x: 290, color: '#2ECC71' },
      { x: 260, color: '#F39C12' },
      { x: 230, color: '#9B59B6' },
      { x: 200, color: '#E91E63' },
      { x: 170, color: '#1ABC9C' },
      { x: 140, color: '#E74C3C' },
      { x: 110, color: '#3498DB' },
      { x: 80, color: '#2ECC71' },
    ];
    queuePeople.forEach(p => {
      s += cutePerson(p.x, 275, { color: p.color, expression: 'happy', scale: 0.5 });
      s += `<rect x="${p.x + 5}" y="278" width="4" height="7" rx="1" fill="#333"/>`;
    });
    s += `<text x="50" y="310" font-size="10" fill="#333">queue continues...</text>`;
    return svgWrap(s, '#87CEEB');
  },

  'dest-huanghuacheng.svg': () => {
    let s = '';
    s += cloud(100, 40);
    s += sun(680, 55);
    s += mountain(200, 300, 300, 150, '#6C9A8B');
    s += mountain(600, 300, 350, 180, '#5D8A7B');
    s += water(300, 800, '#5DADE2');
    s += `<g opacity="0.6">
      ${greatWallSection(200, 330, 150)}
      ${greatWallSection(400, 350, 200)}
    </g>`;
    s += greatWallSection(100, 280, 180);
    s += `<g transform="translate(300, 370)">
      <ellipse cx="0" cy="0" rx="15" ry="8" fill="#F39C12"/>
      <polygon points="12,0 22,-8 22,8" fill="#E67E22"/>
      <circle cx="-5" cy="-2" r="2.5" fill="#fff"/>
      <circle cx="-5" cy="-2" r="1.2" fill="#333"/>
      <path d="M-8,3 Q-4,6 0,3" fill="none" stroke="#333" stroke-width="1"/>
    </g>`;
    s += `<g transform="translate(420, 380)">
      <ellipse cx="0" cy="0" rx="12" ry="7" fill="#3498DB"/>
      <polygon points="10,0 18,-6 18,6" fill="#2980B9"/>
      <circle cx="-4" cy="-2" r="2" fill="#fff"/>
      <circle cx="-4" cy="-2" r="1" fill="#333"/>
    </g>`;
    s += `<g transform="translate(500, 360)">
      <ellipse cx="0" cy="0" rx="18" ry="10" fill="#E74C3C"/>
      <polygon points="14,0 26,-10 26,10" fill="#C0392B"/>
      <circle cx="-6" cy="-3" r="3" fill="#fff"/>
      <circle cx="-6" cy="-3" r="1.5" fill="#333"/>
      <path d="M-10,4 Q-5,8 0,4" fill="none" stroke="#333" stroke-width="1.2"/>
      <rect x="-12" y="-16" width="18" height="10" rx="2" fill="#F9CA24"/>
      <rect x="-14" y="-8" width="22" height="3" fill="#F39C12"/>
      <polygon points="-10,-16 -7,-22 -4,-16" fill="#F9CA24"/>
      <polygon points="-2,-16 1,-24 4,-16" fill="#F9CA24"/>
      <polygon points="2,-16 5,-20 8,-16" fill="#F9CA24"/>
      <circle cx="1" cy="-22" r="2" fill="#E74C3C"/>
    </g>`;
    for (let i = 0; i < 10; i++) {
      s += `<circle cx="${280 + Math.random()*300}" cy="${320 + Math.random()*100}" r="${Math.random()*4+2}" fill="none" stroke="#fff" stroke-width="1" opacity="0.4"/>`;
    }
    s += speechBubble(500, 310, 'I am Emperor!', { width: 90, height: 25, fontSize: 10 });
    return svgWrap(s, '#87CEEB');
  },

  'dest-qinglongxia.svg': () => {
    let s = '';
    s += `<polygon points="0,0 150,0 100,500 0,500" fill="#8B7355"/>`;
    s += `<polygon points="800,0 650,0 700,500 800,500" fill="#7B6345"/>`;
    s += cloud(400, 40, 0.6);
    s += `<rect x="100" y="80" width="600" height="15" fill="#888" rx="3"/>`;
    s += `<rect x="90" y="60" width="15" height="40" fill="#666"/>`;
    s += `<rect x="695" y="60" width="15" height="40" fill="#666"/>`;
    s += `<path d="M400,95 Q390,250 400,300" fill="none" stroke="#2ECC71" stroke-width="3" stroke-dasharray="5,3"/>`;
    s += `<g transform="translate(400, 280)">
      <ellipse cx="0" cy="8" rx="10" ry="14" fill="#3498DB"/>
      <circle cx="0" cy="-8" r="11" fill="#FFEAA7"/>
      <circle cx="-4" cy="-10" r="3" fill="#fff" stroke="#333" stroke-width="1"/>
      <circle cx="-4" cy="-10" r="1.5" fill="#333"/>
      <circle cx="4" cy="-10" r="3" fill="#fff" stroke="#333" stroke-width="1"/>
      <circle cx="4" cy="-10" r="1.5" fill="#333"/>
      <ellipse cx="0" cy="-1" rx="5" ry="7" fill="#333"/>
      <line x1="-10" y1="2" x2="-25" y2="-10" stroke="#3498DB" stroke-width="4" stroke-linecap="round"/>
      <line x1="10" y1="2" x2="25" y2="-10" stroke="#3498DB" stroke-width="4" stroke-linecap="round"/>
      <line x1="-5" y1="20" x2="-10" y2="35" stroke="#3498DB" stroke-width="4" stroke-linecap="round"/>
      <line x1="5" y1="20" x2="10" y2="35" stroke="#3498DB" stroke-width="4" stroke-linecap="round"/>
    </g>`;
    s += `<g transform="translate(420, 220)">
      <ellipse cx="0" cy="0" rx="14" ry="8" fill="#8B4513"/>
      <path d="M-10,-3 Q-5,-8 0,-3 Q5,-8 10,-3" fill="#8B4513"/>
      <line x1="15" y1="0" x2="25" y2="-5" stroke="#333" stroke-width="1" opacity="0.5"/>
      <line x1="15" y1="3" x2="28" y2="3" stroke="#333" stroke-width="1" opacity="0.5"/>
    </g>`;
    s += cutePerson(250, 400, { color: '#E74C3C', expression: 'happy', scale: 0.6 });
    s += cutePerson(350, 410, { color: '#F39C12', expression: 'happy', scale: 0.6 });
    s += cutePerson(500, 405, { color: '#9B59B6', expression: 'happy', scale: 0.6 });
    s += `<text x="300" y="390" font-size="16" fill="#E74C3C" font-weight="bold">HA HA HA!</text>`;
    s += water(440, 800, '#48C9B0');
    return svgWrap(s, '#87CEEB');
  },

  'dest-shentangyu.svg': () => {
    let s = '';
    s += cloud(150, 50);
    s += sun(680, 55);
    const autumnColors = ['#E74C3C', '#F39C12', '#F9CA24', '#E67E22'];
    for (let i = 0; i < 8; i++) {
      const tx = 50 + i * 100;
      s += `<line x1="${tx}" y1="250" x2="${tx}" y2="350" stroke="#8B4513" stroke-width="6"/>`;
      s += `<ellipse cx="${tx}" cy="230" rx="35" ry="40" fill="${autumnColors[i % 4]}" opacity="0.8"/>`;
    }
    s += `<path d="M50,380 Q200,360 400,370 Q600,380 780,360" fill="none" stroke="#A0522D" stroke-width="12"/>`;
    for (let x = 80; x < 780; x += 30) {
      const y = 380 - Math.sin((x - 50) / 250) * 15;
      s += `<line x1="${x}" y1="${y - 15}" x2="${x}" y2="${y}" stroke="#8B4513" stroke-width="2"/>`;
    }
    s += `<g transform="translate(500, 340)">
      <ellipse cx="0" cy="8" rx="10" ry="12" fill="#D2691E"/>
      <path d="M8,5 Q25,-10 15,-25 Q10,-15 8,5" fill="#CD853F"/>
      <circle cx="0" cy="-6" r="9" fill="#D2691E"/>
      <ellipse cx="-6" cy="-14" rx="3" ry="5" fill="#D2691E"/>
      <ellipse cx="6" cy="-14" rx="3" ry="5" fill="#D2691E"/>
      <circle cx="-3" cy="-7" r="2" fill="#333"/>
      <circle cx="3" cy="-7" r="2" fill="#333"/>
      <circle cx="0" cy="-3" r="1.5" fill="#333"/>
      <line x1="12" y1="-5" x2="12" y2="-25" stroke="#8B4513" stroke-width="1.5"/>
      <polygon points="12,-25 12,-17 22,-21" fill="#E74C3C"/>
      <text x="15" y="-20" font-size="4" fill="#fff">TOUR</text>
    </g>`;
    s += cutePerson(420, 310, { color: '#3498DB', expression: 'happy', scale: 0.55 });
    s += cutePerson(380, 312, { color: '#E74C3C', expression: 'happy', scale: 0.55 });
    s += cutePerson(340, 315, { color: '#2ECC71', expression: 'happy', scale: 0.55 });
    s += cutePerson(300, 318, { color: '#F39C12', expression: 'happy', scale: 0.55 });
    for (let i = 0; i < 15; i++) {
      s += ginkgoLeaf(Math.random() * 800, 100 + Math.random() * 250, Math.random() * 360);
    }
    s += speechBubble(500, 300, 'Follow me!', { width: 75, height: 22, fontSize: 10 });
    return svgWrap(s, '#87CEEB');
  },

  'dest-labagouyuanshi.svg': () => {
    let s = '';
    s += cloud(100, 50, 0.7);
    s += sun(680, 55);
    for (let i = 0; i < 10; i++) {
      const tx = 60 + i * 75;
      s += `<line x1="${tx}" y1="150" x2="${tx}" y2="400" stroke="#F5F5DC" stroke-width="8"/>`;
      for (let j = 0; j < 5; j++) {
        s += `<rect x="${tx - 3}" y="${180 + j * 40}" width="3" height="6" fill="#333" opacity="0.3"/>`;
      }
      s += `<ellipse cx="${tx}" cy="140" rx="30" ry="45" fill="#F9CA24" opacity="0.8"/>`;
    }
    s += `<rect x="0" y="380" width="800" height="120" fill="#8B7355" opacity="0.4"/>`;
    s += `<rect x="0" y="400" width="800" height="100" fill="#6B8E23" opacity="0.3"/>`;
    s += cutePerson(350, 300, { color: '#3498DB', expression: 'happy', scale: 0.7 });
    s += `<g transform="translate(370, 300)">
      <rect x="0" y="-5" width="15" height="10" rx="2" fill="#333"/>
      <circle cx="7" cy="0" r="4" fill="#555"/>
      <circle cx="7" cy="0" r="2" fill="#85C1E9"/>
    </g>`;
    s += `<g transform="translate(500, 260)">
      <ellipse cx="0" cy="25" rx="30" ry="35" fill="#8B4513"/>
      <circle cx="0" cy="-8" r="22" fill="#8B4513"/>
      <circle cx="-18" cy="-22" r="8" fill="#8B4513"/>
      <circle cx="-18" cy="-22" r="5" fill="#A0522D"/>
      <circle cx="18" cy="-22" r="8" fill="#8B4513"/>
      <circle cx="18" cy="-22" r="5" fill="#A0522D"/>
      <ellipse cx="0" cy="0" rx="12" ry="10" fill="#A0522D"/>
      <circle cx="-8" cy="-10" r="3" fill="#333"/>
      <circle cx="8" cy="-10" r="3" fill="#333"/>
      <ellipse cx="0" cy="-2" rx="4" ry="3" fill="#333"/>
      <path d="M-6,5 Q0,10 6,5" fill="none" stroke="#333" stroke-width="1.5"/>
      <path d="M30,15 Q40,0 35,-15" fill="none" stroke="#8B4513" stroke-width="10" stroke-linecap="round"/>
      <circle cx="35" cy="-18" r="8" fill="#8B4513"/>
    </g>`;
    s += speechBubble(500, 205, 'Hiii!', { width: 65, height: 25, fontSize: 10 });
    for (let i = 0; i < 12; i++) {
      s += ginkgoLeaf(Math.random() * 800, 50 + Math.random() * 300, Math.random() * 360);
    }
    return svgWrap(s, '#87CEEB');
  },

  'dest-yanqihu.svg': () => {
    let s = '';
    s += cloud(100, 40);
    s += sun(680, 55);
    s += `<g transform="translate(550, 180)">
      <rect x="-50" y="0" width="100" height="120" fill="#D5DBDB" rx="3"/>
      <rect x="-60" y="-10" width="120" height="15" rx="3" fill="#AEB6BF"/>
      ${Array.from({length: 4}, (_, r) => Array.from({length: 5}, (_, c) =>
        `<rect x="${-40 + c*20}" y="${10 + r*25}" width="12" height="15" rx="1" fill="#85C1E9"/>`
      ).join('')).join('')}
    </g>`;
    s += water(300, 800, '#5DADE2');
    s += `<ellipse cx="200" cy="300" rx="200" ry="50" fill="#6C9A8B"/>`;
    s += `<ellipse cx="700" cy="300" rx="150" ry="40" fill="#5D8A7B"/>`;
    const duckPositions = [
      { x: 200, y: 360 },
      { x: 250, y: 355 },
      { x: 300, y: 360 },
      { x: 350, y: 355 },
      { x: 400, y: 360 },
      { x: 450, y: 355 },
    ];
    duckPositions.forEach(d => {
      s += duck(d.x, d.y, { scale: 0.7 });
    });
    s += `<g transform="translate(350, 400) scale(-0.7, 0.7)">
      <ellipse cx="0" cy="8" rx="14" ry="10" fill="#F9CA24"/>
      <circle cx="-2" cy="-2" r="10" fill="#F9CA24"/>
      <circle cx="-5" cy="-4" r="2" fill="#333"/>
      <ellipse cx="-12" cy="0" rx="6" ry="3" fill="#FF9F43"/>
    </g>`;
    s += speechBubble(350, 370, 'Wait, which way?', { width: 100, height: 22, fontSize: 9 });
    s += `<text x="360" y="385" font-size="18" fill="#E74C3C" font-weight="bold">?</text>`;
    return svgWrap(s, '#87CEEB');
  },

  'dest-tanzhe.svg': () => {
    let s = '';
    s += cloud(100, 40, 0.7);
    s += sun(680, 55);
    s += `<g transform="translate(400, 150)">
      <path d="M-100,-20 L0,-60 L100,-20" fill="#C0392B"/>
      <path d="M-85,-20 L0,-50 L85,-20" fill="#E74C3C"/>
      <rect x="-75" y="-20" width="150" height="70" fill="#F5E6CC"/>
      <rect x="-15" y="10" width="30" height="40" rx="12" fill="#8B4513"/>
    </g>`;
    s += `<line x1="250" y1="100" x2="250" y2="400" stroke="#8B7355" stroke-width="25"/>`;
    s += `<ellipse cx="250" cy="80" rx="100" ry="80" fill="#F9CA24"/>`;
    s += `<ellipse cx="200" cy="110" rx="60" ry="50" fill="#F5B041"/>`;
    s += `<ellipse cx="300" cy="110" rx="60" ry="50" fill="#F5B041"/>`;
    for (let i = 0; i < 60; i++) {
      const lx = 150 + Math.random() * 200;
      const ly = 100 + Math.random() * 300;
      s += ginkgoLeaf(lx, ly, Math.random() * 360);
    }
    s += `<ellipse cx="250" cy="400" rx="150" ry="50" fill="#F9CA24" opacity="0.7"/>`;
    s += `<ellipse cx="250" cy="410" rx="120" ry="40" fill="#F5B041" opacity="0.6"/>`;
    s += `<ellipse cx="250" cy="390" rx="100" ry="35" fill="#F9CA24" opacity="0.8"/>`;
    s += `<g transform="translate(280, 365)">
      <ellipse cx="0" cy="0" rx="8" ry="6" fill="#3498DB" transform="rotate(-20)"/>
      <ellipse cx="15" cy="2" rx="8" ry="6" fill="#3498DB" transform="rotate(-15)"/>
    </g>`;
    s += `<g>
      <rect x="305" y="370" width="80" height="25" rx="10" fill="#fff" stroke="#333" stroke-width="1.5"/>
      <text x="345" y="387" text-anchor="middle" font-size="10" fill="#333">Help...?</text>
    </g>`;
    s += `<text x="250" y="350" text-anchor="middle" font-size="8" fill="#333" opacity="0.5">*was meditating*</text>`;
    return svgWrap(s, '#87CEEB');
  },

  'dest-yesanpo.svg': () => {
    let s = '';
    s += `<polygon points="0,0 200,0 180,500 0,500" fill="#A0522D"/>`;
    s += `<polygon points="800,0 600,0 620,500 800,500" fill="#8B4513"/>`;
    s += `<polygon points="200,0 250,0 230,500 180,500" fill="#8B6914" opacity="0.5"/>`;
    s += `<polygon points="600,0 550,0 570,500 620,500" fill="#8B6914" opacity="0.5"/>`;
    s += cloud(400, 30, 0.5);
    s += `<rect x="180" y="400" width="440" height="100" fill="#C4A882"/>`;
    s += cutePerson(350, 330, { color: '#3498DB', expression: 'happy', scale: 0.6 });
    s += cutePerson(300, 335, { color: '#E74C3C', expression: 'frustrated', scale: 0.6 });
    s += `<g transform="translate(400, 340)">
      <ellipse cx="0" cy="10" rx="8" ry="12" fill="#2ECC71"/>
      <circle cx="0" cy="-5" r="9" fill="#FFEAA7"/>
      <line x1="-6" y1="-9" x2="-2" y2="-7" stroke="#333" stroke-width="1.5"/>
      <circle cx="-4" cy="-5" r="1.5" fill="#333"/>
      <line x1="2" y1="-9" x2="6" y2="-7" stroke="#333" stroke-width="1.5"/>
      <circle cx="4" cy="-5" r="1.5" fill="#333"/>
      <path d="M-3,1 Q0,-1 3,1" fill="none" stroke="#333" stroke-width="1.2"/>
      <rect x="-30" y="-10" width="25" height="30" rx="5" fill="#F39C12"/>
      <rect x="5" y="-10" width="25" height="30" rx="5" fill="#F39C12"/>
      <text x="-35" y="5" font-size="14" fill="#E74C3C">!</text>
      <text x="33" y="5" font-size="14" fill="#E74C3C">!</text>
    </g>`;
    s += `<g transform="translate(450, 345)">
      <circle cx="0" cy="0" r="8" fill="#FFEAA7"/>
      <circle cx="-3" cy="-2" r="1.5" fill="#333"/>
      <circle cx="3" cy="-2" r="1.5" fill="#333"/>
      <ellipse cx="0" cy="4" rx="3" ry="4" fill="#333"/>
      <ellipse cx="0" cy="14" rx="7" ry="10" fill="#F39C12"/>
      <line x1="-7" y1="10" x2="-20" y2="5" stroke="#F39C12" stroke-width="3" stroke-linecap="round"/>
    </g>`;
    s += `<text x="400" y="300" text-anchor="middle" font-size="12" fill="#E74C3C" font-weight="bold">STUCK!</text>`;
    s += `<circle cx="388" cy="325" r="2" fill="#74B9FF"/>
      <circle cx="415" cy="320" r="1.5" fill="#74B9FF"/>`;
    return svgWrap(s, '#87CEEB');
  },

  'dest-baishishan.svg': () => {
    let s = '';
    s += cloud(100, 40);
    s += sun(680, 55);
    s += mountain(200, 350, 400, 250, '#6C9A8B');
    s += mountain(600, 350, 350, 220, '#5D8A7B');
    s += `<rect x="150" y="300" width="500" height="15" fill="#AED6F1" opacity="0.5" stroke="#85C1E9" stroke-width="1"/>`;
    for (let x = 170; x < 650; x += 30) {
      s += `<line x1="${x}" y1="300" x2="${x}" y2="315" stroke="#85C1E9" stroke-width="0.5" opacity="0.5"/>`;
    }
    s += `<line x1="150" y1="285" x2="650" y2="285" stroke="#888" stroke-width="2"/>`;
    for (let x = 170; x < 650; x += 25) {
      s += `<line x1="${x}" y1="285" x2="${x}" y2="300" stroke="#888" stroke-width="1.5"/>`;
    }
    s += `<rect x="150" y="315" width="500" height="185" fill="#E8F6F3" opacity="0.3"/>`;
    for (let i = 0; i < 8; i++) {
      s += `<circle cx="${200 + i * 60}" cy="${440 + Math.random()*30}" r="5" fill="#27AE60" opacity="0.4"/>`;
    }
    s += `<g transform="translate(350, 285)">
      <ellipse cx="0" cy="5" rx="15" ry="6" fill="#3498DB"/>
      <circle cx="-12" cy="0" r="9" fill="#FFEAA7"/>
      <circle cx="-15" cy="-2" r="3" fill="#fff" stroke="#333" stroke-width="1"/>
      <circle cx="-15" cy="-2" r="1.5" fill="#333"/>
      <circle cx="-9" cy="-2" r="3" fill="#fff" stroke="#333" stroke-width="1"/>
      <circle cx="-9" cy="-2" r="1.5" fill="#333"/>
      <ellipse cx="-12" cy="5" rx="3" ry="4" fill="#333"/>
      <circle cx="-20" cy="-5" r="2" fill="#74B9FF"/>
      <circle cx="-5" cy="-8" r="1.5" fill="#74B9FF"/>
      <circle cx="-22" cy="8" r="3" fill="#FFEAA7"/>
      <circle cx="12" cy="8" r="3" fill="#FFEAA7"/>
    </g>`;
    s += `<g transform="translate(500, 250)">
      <ellipse cx="0" cy="25" rx="10" ry="16" fill="#9B59B6"/>
      <line x1="-5" y1="38" x2="-10" y2="50" stroke="#9B59B6" stroke-width="4" stroke-linecap="round"/>
      <line x1="5" y1="38" x2="12" y2="50" stroke="#9B59B6" stroke-width="4" stroke-linecap="round"/>
      <circle cx="0" cy="7" r="10" fill="#FFEAA7"/>
      <circle cx="0" cy="-2" r="6" fill="#C0C0C0"/>
      <circle cx="-3" cy="5" r="1.5" fill="#333"/>
      <circle cx="3" cy="5" r="1.5" fill="#333"/>
      <path d="M-3,9 Q0,12 3,9" fill="none" stroke="#333" stroke-width="1"/>
      <rect x="10" y="2" width="5" height="10" rx="1" fill="#333"/>
      <line x1="8" y1="18" x2="12" y2="7" stroke="#9B59B6" stroke-width="3" stroke-linecap="round"/>
    </g>`;
    s += speechBubble(350, 245, "I'm gonna die!", { width: 90, height: 22, fontSize: 9 });
    s += speechBubble(520, 225, 'Yeah so anyway...', { width: 100, height: 22, fontSize: 9 });
    return svgWrap(s, '#87CEEB');
  },

  'dest-beidaihe.svg': () => {
    let s = '';
    s += `<rect width="800" height="500" fill="#FFD89B"/>`;
    s += `<ellipse cx="200" cy="200" rx="150" ry="100" fill="#FF9A76" opacity="0.3"/>`;
    s += `<circle cx="200" cy="200" r="40" fill="#FF6B6B" opacity="0.6"/>`;
    s += water(280, 800, '#5DADE2');
    s += `<ellipse cx="400" cy="430" rx="450" ry="100" fill="#F5DEB3"/>`;
    s += `<g transform="translate(400, 340)">
      <ellipse cx="0" cy="10" rx="10" ry="14" fill="#E74C3C"/>
      <circle cx="0" cy="-6" r="10" fill="#FFEAA7"/>
      <circle cx="-4" cy="-8" r="2" fill="#333"/>
      <circle cx="4" cy="-8" r="2" fill="#333"/>
      <path d="M-4,-1 Q0,-4 4,-1" fill="none" stroke="#333" stroke-width="1.5"/>
      <line x1="-5" y1="22" x2="-5" y2="40" stroke="#E74C3C" stroke-width="4" stroke-linecap="round"/>
      <line x1="5" y1="22" x2="15" y2="15" stroke="#E74C3C" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="-5" cy="42" rx="6" ry="3" fill="#3498DB"/>
      <circle cx="17" cy="14" r="4" fill="#FFEAA7"/>
      <line x1="-8" y1="5" x2="-25" y2="-5" stroke="#E74C3C" stroke-width="3" stroke-linecap="round"/>
      <line x1="8" y1="5" x2="25" y2="-5" stroke="#E74C3C" stroke-width="3" stroke-linecap="round"/>
    </g>`;
    s += `<g transform="translate(300, 390)">
      <ellipse cx="0" cy="0" rx="15" ry="10" fill="#E74C3C"/>
      <line x1="-5" y1="-8" x2="-5" y2="-15" stroke="#E74C3C" stroke-width="2"/>
      <circle cx="-5" cy="-16" r="3" fill="#E74C3C"/>
      <circle cx="-5" cy="-16" r="1.5" fill="#333"/>
      <line x1="5" y1="-8" x2="5" y2="-15" stroke="#E74C3C" stroke-width="2"/>
      <circle cx="5" cy="-16" r="3" fill="#E74C3C"/>
      <circle cx="5" cy="-16" r="1.5" fill="#333"/>
      <path d="M-15,0 Q-25,-5 -20,-12 Q-15,-8 -15,0" fill="#C0392B"/>
      <path d="M15,0 Q25,-5 20,-12" fill="none" stroke="#C0392B" stroke-width="3"/>
      <ellipse cx="22" cy="-14" rx="8" ry="4" fill="#3498DB" transform="rotate(-20, 22, -14)"/>
      <line x1="-12" y1="5" x2="-18" y2="12" stroke="#C0392B" stroke-width="2"/>
      <line x1="-8" y1="8" x2="-14" y2="15" stroke="#C0392B" stroke-width="2"/>
      <line x1="12" y1="5" x2="18" y2="12" stroke="#C0392B" stroke-width="2"/>
      <line x1="8" y1="8" x2="14" y2="15" stroke="#C0392B" stroke-width="2"/>
      <line x1="-25" y1="0" x2="-35" y2="0" stroke="#333" stroke-width="1" opacity="0.4"/>
      <line x1="-25" y1="5" x2="-33" y2="5" stroke="#333" stroke-width="1" opacity="0.3"/>
    </g>`;
    s += `<text x="350" y="330" text-anchor="middle" font-size="14" fill="#E74C3C" font-weight="bold">COME BACK!!</text>`;
    for (let i = 0; i < 5; i++) {
      s += `<ellipse cx="${330 - i * 20}" cy="${400 + i * 5}" rx="3" ry="5" fill="#D4AC0D" opacity="0.4"/>`;
    }
    return svgWrap(s, '#FFD89B');
  },

  'dest-fenghuangling.svg': () => {
    let s = '';
    s += cloud(100, 40);
    s += sun(680, 55);
    s += mountain(400, 400, 600, 280, '#6C9A8B');
    s += `<rect x="350" y="125" width="100" height="5" fill="#5D8A7B"/>`;
    s += cutePerson(400, 70, { color: '#E74C3C', expression: 'smug', armUp: true, scale: 0.8 });
    s += speechBubble(400, 25, 'BEST VIEW EVER!', { width: 110, height: 25, fontSize: 10 });
    s += `<g transform="translate(440, 100)">
      <rect x="0" y="0" width="20" height="28" rx="5" fill="#F39C12"/>
      <rect x="2" y="3" width="8" height="6" rx="2" fill="#E67E22"/>
    </g>`;
    s += `<g transform="translate(460, 85)">
      <ellipse cx="0" cy="10" rx="10" ry="12" fill="#A0522D"/>
      <circle cx="0" cy="-5" r="10" fill="#D2691E"/>
      <ellipse cx="0" cy="-2" rx="7" ry="6" fill="#FDDCB1"/>
      <circle cx="-3" cy="-5" r="2" fill="#333"/>
      <circle cx="3" cy="-5" r="2" fill="#333"/>
      <path d="M-3,1 Q0,4 3,1" fill="none" stroke="#333" stroke-width="1"/>
      <circle cx="-10" cy="-5" r="4" fill="#D2691E"/>
      <circle cx="-10" cy="-5" r="2.5" fill="#FDDCB1"/>
      <circle cx="10" cy="-5" r="4" fill="#D2691E"/>
      <circle cx="10" cy="-5" r="2.5" fill="#FDDCB1"/>
      <path d="M8,15 Q20,5 18,20 Q15,30 22,25" fill="none" stroke="#A0522D" stroke-width="3" stroke-linecap="round"/>
      <line x1="-8" y1="8" x2="-18" y2="15" stroke="#D2691E" stroke-width="4" stroke-linecap="round"/>
      <rect x="-22" y="12" width="8" height="5" rx="1" fill="#F9CA24"/>
    </g>`;
    s += `<rect x="435" y="118" width="6" height="4" rx="1" fill="#E74C3C" transform="rotate(15)"/>`;
    s += `<circle cx="448" cy="122" r="3" fill="#F39C12"/>`;
    s += tree(200, 350, { height: 40 });
    s += tree(600, 360, { height: 35 });
    return svgWrap(s, '#87CEEB');
  },

  'dest-bashangcaoyuan.svg': () => {
    let s = '';
    s += cloud(100, 40);
    s += cloud(500, 50, 0.7);
    s += sun(680, 55);
    s += `<rect x="0" y="300" width="800" height="200" fill="#7BC67E"/>`;
    s += `<g transform="translate(600, 280)">
      <ellipse cx="0" cy="20" rx="45" ry="15" fill="#F5E6CC"/>
      <path d="M-45,20 Q0,-20 45,20" fill="#fff" stroke="#D4AC0D" stroke-width="2"/>
      <rect x="-8" y="5" width="16" height="25" rx="3" fill="#8B4513"/>
    </g>`;
    s += `<g transform="translate(300, 310)">
      <ellipse cx="0" cy="0" rx="40" ry="22" fill="#8B4513"/>
      <ellipse cx="-45" cy="20" rx="15" ry="10" fill="#A0522D" transform="rotate(-15)"/>
      <polygon points="-48,6 -44,0 -40,6" fill="#A0522D"/>
      <polygon points="-38,6 -34,0 -30,6" fill="#A0522D"/>
      <circle cx="-48" cy="14" r="2" fill="#333"/>
      <path d="M-30,-10 Q-20,-20 -10,-8 Q0,-18 10,-8" fill="#5D4037"/>
      <line x1="-25" y1="20" x2="-25" y2="45" stroke="#8B4513" stroke-width="5"/>
      <line x1="-10" y1="20" x2="-10" y2="45" stroke="#8B4513" stroke-width="5"/>
      <line x1="15" y1="20" x2="15" y2="45" stroke="#8B4513" stroke-width="5"/>
      <line x1="30" y1="20" x2="30" y2="45" stroke="#8B4513" stroke-width="5"/>
      <path d="M38,0 Q50,-5 45,10" fill="none" stroke="#5D4037" stroke-width="4"/>
      <line x1="-55" y1="28" x2="-50" y2="22" stroke="#27AE60" stroke-width="2"/>
      <line x1="-52" y1="28" x2="-48" y2="23" stroke="#27AE60" stroke-width="2"/>
    </g>`;
    s += `<g transform="translate(300, 278)">
      <ellipse cx="0" cy="5" rx="8" ry="10" fill="#3498DB"/>
      <circle cx="0" cy="-7" r="9" fill="#FFEAA7"/>
      <line x1="-6" y1="-11" x2="-2" y2="-9" stroke="#333" stroke-width="1.5"/>
      <circle cx="-4" cy="-7" r="1.5" fill="#333"/>
      <line x1="2" y1="-11" x2="6" y2="-9" stroke="#333" stroke-width="1.5"/>
      <circle cx="4" cy="-7" r="1.5" fill="#333"/>
      <path d="M-3,-1 Q0,-3 3,-1" fill="none" stroke="#333" stroke-width="1.2"/>
      <line x1="-8" y1="2" x2="-20" y2="15" stroke="#3498DB" stroke-width="3" stroke-linecap="round"/>
      <line x1="8" y1="2" x2="20" y2="15" stroke="#3498DB" stroke-width="3" stroke-linecap="round"/>
    </g>`;
    s += `<path d="M280,293 Q270,300 260,310" fill="none" stroke="#333" stroke-width="1.5"/>
      <path d="M320,293 Q310,300 260,310" fill="none" stroke="#333" stroke-width="1.5"/>`;
    s += speechBubble(300, 245, 'MOVE please!', { width: 90, height: 22, fontSize: 10 });
    for (let i = 0; i < 15; i++) {
      const gx = Math.random() * 800;
      const gy = 360 + Math.random() * 100;
      s += `<path d="M${gx},${gy} Q${gx-3},${gy-10} ${gx+2},${gy}" fill="none" stroke="#27AE60" stroke-width="1.5"/>
        <path d="M${gx+2},${gy} Q${gx+5},${gy-8} ${gx+6},${gy}" fill="none" stroke="#2ECC71" stroke-width="1.5"/>`;
    }
    return svgWrap(s, '#87CEEB');
  },

  'dest-dajuesi.svg': () => {
    let s = '';
    s += cloud(500, 40, 0.7);
    s += sun(680, 55);
    s += `<rect x="0" y="350" width="800" height="150" fill="#7BC67E" opacity="0.5"/>`;
    s += `<line x1="400" y1="120" x2="400" y2="350" stroke="#8B7355" stroke-width="20"/>`;
    s += `<path d="M400,160 Q300,100 250,120" fill="none" stroke="#8B7355" stroke-width="8"/>`;
    s += `<path d="M400,160 Q500,100 550,120" fill="none" stroke="#8B7355" stroke-width="8"/>`;
    s += `<path d="M400,200 Q320,170 280,180" fill="none" stroke="#8B7355" stroke-width="6"/>`;
    s += `<path d="M400,200 Q480,170 520,180" fill="none" stroke="#8B7355" stroke-width="6"/>`;
    const flowerPositions = [[250,115],[300,100],[350,130],[450,130],[500,100],[550,115],[280,175],[330,160],[470,160],[520,175]];
    flowerPositions.forEach(([fx, fy]) => {
      s += `<g transform="translate(${fx},${fy})">
        <ellipse cx="0" cy="-5" rx="4" ry="8" fill="#FFB7C5"/>
        <ellipse cx="4" cy="-2" rx="4" ry="7" fill="#FFCDD2" transform="rotate(30)"/>
        <ellipse cx="-4" cy="-2" rx="4" ry="7" fill="#FFCDD2" transform="rotate(-30)"/>
        <circle cx="0" cy="0" r="3" fill="#F9CA24"/>
      </g>`;
    });
    s += `<rect x="340" y="310" width="120" height="8" rx="2" fill="#BDC3C7"/>
      <rect x="360" y="318" width="10" height="25" fill="#95A5A6"/>
      <rect x="430" y="318" width="10" height="25" fill="#95A5A6"/>`;
    s += `<rect x="370" y="302" width="60" height="10" rx="1" fill="#F5DEB3" stroke="#333" stroke-width="0.5"/>`;
    for (let i = 0; i < 12; i++) {
      s += `<ellipse cx="${375 + Math.random()*50}" cy="${302 + Math.random()*10}" rx="3" ry="2" fill="#FFB7C5" opacity="0.8" transform="rotate(${Math.random()*360})"/>`;
    }
    s += `<g transform="translate(360, 275)">
      <ellipse cx="0" cy="12" rx="8" ry="12" fill="#8B7355"/>
      <circle cx="0" cy="-2" r="9" fill="#FFEAA7"/>
      <circle cx="0" cy="-12" r="6" fill="#C0C0C0"/>
      <line x1="-5" y1="-3" x2="-1" y2="-3" stroke="#333" stroke-width="1.5"/>
      <line x1="1" y1="-3" x2="5" y2="-3" stroke="#333" stroke-width="1.5"/>
      <path d="M-3,3 L3,3" stroke="#333" stroke-width="1"/>
      <line x1="6" y1="8" x2="20" y2="3" stroke="#8B7355" stroke-width="3" stroke-linecap="round"/>
    </g>`;
    s += `<g transform="translate(440, 275)">
      <ellipse cx="0" cy="12" rx="8" ry="12" fill="#2C3E50"/>
      <circle cx="0" cy="-2" r="9" fill="#FFEAA7"/>
      <circle cx="0" cy="-12" r="6" fill="#C0C0C0"/>
      <line x1="-5" y1="-3" x2="-1" y2="-3" stroke="#333" stroke-width="1.5"/>
      <line x1="1" y1="-3" x2="5" y2="-3" stroke="#333" stroke-width="1.5"/>
      <path d="M-3,3 Q0,1 3,3" fill="none" stroke="#333" stroke-width="1"/>
      <line x1="-6" y1="8" x2="-10" y2="0" stroke="#2C3E50" stroke-width="3" stroke-linecap="round"/>
    </g>`;
    for (let i = 0; i < 15; i++) {
      s += `<ellipse cx="${300 + Math.random()*200}" cy="${150 + Math.random()*200}" rx="3" ry="2" fill="#FFB7C5" opacity="0.7" transform="rotate(${Math.random()*360})"/>`;
    }
    s += `<text x="400" y="260" text-anchor="middle" font-size="9" fill="#333" opacity="0.6">*have not noticed the petals*</text>`;
    return svgWrap(s, '#87CEEB');
  },

  'dest-miaofengshan.svg': () => {
    let s = '';
    s += cloud(100, 40);
    s += sun(680, 55);
    s += `<ellipse cx="400" cy="450" rx="500" ry="100" fill="#7BC67E"/>`;
    const roseColors = ['#E74C3C', '#FF6B6B', '#FF1493', '#FF69B4', '#C0392B'];
    for (let i = 0; i < 80; i++) {
      const rx = Math.random() * 800;
      const ry = 320 + Math.random() * 150;
      const rc = roseColors[Math.floor(Math.random() * roseColors.length)];
      s += `<circle cx="${rx}" cy="${ry}" r="${Math.random()*4+3}" fill="${rc}"/>
        <line x1="${rx}" y1="${ry+3}" x2="${rx}" y2="${ry+12}" stroke="#27AE60" stroke-width="1.5"/>`;
    }
    s += `<g transform="translate(400, 280)">
      <ellipse cx="0" cy="0" rx="12" ry="8" fill="#F9CA24"/>
      <rect x="-8" y="-3" width="4" height="6" fill="#333"/>
      <rect x="-2" y="-3" width="4" height="6" fill="#333"/>
      <rect x="4" y="-3" width="4" height="6" fill="#333"/>
      <circle cx="-14" cy="0" r="6" fill="#F9CA24"/>
      <circle cx="-17" cy="-2" r="1.5" fill="#333"/>
      <ellipse cx="2" cy="-10" rx="8" ry="5" fill="#fff" opacity="0.6"/>
      <ellipse cx="8" cy="-8" rx="7" ry="4" fill="#fff" opacity="0.5"/>
      <rect x="-19" y="-8" width="12" height="4" rx="1" fill="#F39C12"/>
      <rect x="-17" y="-11" width="8" height="5" rx="2" fill="#FF9F43"/>
      <polygon points="12,0 18,0 15,-3" fill="#333"/>
      <line x1="-10" y1="6" x2="-10" y2="18" stroke="#8B4513" stroke-width="1.5"/>
      <circle cx="-10" cy="20" r="5" fill="#E74C3C"/>
      <text x="-10" y="22" text-anchor="middle" font-size="4" fill="#fff" font-weight="bold">STOP</text>
    </g>`;
    const beePositions = [[250,250],[500,260],[150,300],[600,290],[350,320]];
    beePositions.forEach(([bx, by]) => {
      s += `<g transform="translate(${bx},${by}) scale(0.6)">
        <ellipse cx="0" cy="0" rx="10" ry="6" fill="#F9CA24"/>
        <rect x="-6" y="-2" width="3" height="4" fill="#333"/>
        <rect x="-1" y="-2" width="3" height="4" fill="#333"/>
        <rect x="4" y="-2" width="3" height="4" fill="#333"/>
        <circle cx="-12" cy="0" r="5" fill="#F9CA24"/>
        <circle cx="-14" cy="-1" r="1" fill="#333"/>
        <ellipse cx="0" cy="-7" rx="6" ry="4" fill="#fff" opacity="0.5"/>
        <ellipse cx="0" cy="8" rx="5" ry="4" fill="#F39C12" opacity="0.8"/>
      </g>`;
    });
    s += speechBubble(400, 245, 'Lane 3, GO!', { width: 80, height: 22, fontSize: 10 });
    return svgWrap(s, '#87CEEB');
  },

  'dest-zhoukoudian.svg': () => {
    let s = '';
    s += `<rect width="800" height="500" fill="#D2B48C"/>`;
    s += `<ellipse cx="400" cy="250" rx="350" ry="250" fill="#8B7355"/>`;
    s += `<ellipse cx="400" cy="260" rx="320" ry="230" fill="#A0522D"/>`;
    s += `<rect x="100" y="350" width="600" height="150" fill="#8B6914" opacity="0.5"/>`;
    s += `<g transform="translate(300, 280)">
      <ellipse cx="0" cy="20" rx="16" ry="22" fill="#D2691E"/>
      <path d="M-16,20 L-14,25 L-10,20 L-6,26 L-2,20 L2,26 L6,20 L10,26 L14,20 L16,20" fill="#D2691E"/>
      <circle cx="0" cy="-5" r="16" fill="#FDDCB1"/>
      <path d="M-16,-10 Q-10,-25 0,-20 Q10,-25 16,-10" fill="#5D4037"/>
      <path d="M-12,-15 Q-5,-28 5,-15" fill="#5D4037"/>
      <circle cx="-5" cy="-7" r="3" fill="#fff" stroke="#333" stroke-width="1"/>
      <circle cx="-5" cy="-7" r="1.5" fill="#333"/>
      <circle cx="5" cy="-7" r="3" fill="#fff" stroke="#333" stroke-width="1"/>
      <circle cx="5" cy="-7" r="1.5" fill="#333"/>
      <path d="M-4,3 Q0,0 4,3" fill="none" stroke="#333" stroke-width="1.5"/>
      <rect x="18" y="-10" width="12" height="20" rx="2" fill="#333"/>
      <rect x="19" y="-8" width="10" height="16" rx="1" fill="#74B9FF"/>
      <line x1="12" y1="10" x2="22" y2="0" stroke="#FDDCB1" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="-22" cy="10" rx="8" ry="6" fill="#888"/>
      <line x1="-12" y1="10" x2="-18" y2="10" stroke="#FDDCB1" stroke-width="5" stroke-linecap="round"/>
    </g>`;
    s += `<text x="300" y="240" text-anchor="middle" font-size="30" fill="#333" font-weight="bold">???</text>`;
    s += cutePerson(500, 280, { color: '#3498DB', expression: 'terrified', scale: 0.7 });
    s += speechBubble(500, 240, 'My iPhone!', { width: 80, height: 22, fontSize: 10 });
    s += `<g opacity="0.4">
      <circle cx="150" cy="200" r="8" fill="none" stroke="#5D4037" stroke-width="2"/>
      <line x1="150" y1="208" x2="150" y2="230" stroke="#5D4037" stroke-width="2"/>
      <line x1="140" y1="215" x2="160" y2="215" stroke="#5D4037" stroke-width="2"/>
      <line x1="150" y1="230" x2="140" y2="245" stroke="#5D4037" stroke-width="2"/>
      <line x1="150" y1="230" x2="160" y2="245" stroke="#5D4037" stroke-width="2"/>
    </g>`;
    return svgWrap(s, '#D2B48C');
  },

  'dest-guyaju.svg': () => {
    let s = '';
    s += cloud(100, 30);
    s += sun(680, 50);
    s += `<rect x="200" y="50" width="400" height="400" fill="#C4A882" rx="5"/>`;
    const caves = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        caves.push({ x: 240 + c * 90, y: 100 + r * 110 });
      }
    }
    caves.forEach((cave) => {
      s += `<ellipse cx="${cave.x}" cy="${cave.y}" rx="30" ry="25" fill="#5D4037"/>`;
      s += `<ellipse cx="${cave.x}" cy="${cave.y + 5}" rx="25" ry="20" fill="#3E2723"/>`;
    });
    s += bird(caves[0].x, caves[0].y - 5, '#4ECDC4', 0.8);
    s += bird(caves[1].x - 10, caves[1].y - 5, '#FF6B6B', 0.8);
    s += `<line x1="${caves[1].x + 20}" y1="${caves[1].y - 10}" x2="${caves[2].x - 20}" y2="${caves[2].y - 10}" stroke="#333" stroke-width="1"/>`;
    s += `<rect x="${(caves[1].x + caves[2].x)/2 - 10}" y="${caves[1].y - 15}" width="8" height="10" fill="#3498DB" opacity="0.8"/>`;
    s += `<rect x="${(caves[1].x + caves[2].x)/2 + 5}" y="${caves[1].y - 14}" width="6" height="8" fill="#E74C3C" opacity="0.8"/>`;
    s += `<polygon points="${(caves[1].x + caves[2].x)/2 + 15},${caves[1].y - 15} ${(caves[1].x + caves[2].x)/2 + 22},${caves[1].y - 15} ${(caves[1].x + caves[2].x)/2 + 22},${caves[1].y - 8}" fill="#F9CA24" opacity="0.8"/>`;
    s += `<rect x="${caves[3].x - 8}" y="${caves[3].y - 5}" width="16" height="12" rx="1" fill="#74B9FF" opacity="0.6"/>`;
    s += bird(caves[3].x + 8, caves[3].y, '#9B59B6', 0.6);
    s += bird(caves[4].x - 5, caves[4].y, '#F39C12', 0.7);
    s += bird(caves[4].x + 8, caves[4].y + 2, '#F39C12', 0.4);
    s += bird(caves[4].x + 3, caves[4].y + 5, '#F39C12', 0.3);
    s += bird(caves[5].x, caves[5].y, '#2ECC71', 0.7);
    s += `<rect x="${caves[5].x + 5}" y="${caves[5].y - 8}" width="10" height="12" fill="#F5F5DC" opacity="0.7"/>`;
    s += bird(caves[6].x, caves[6].y, '#E74C3C', 0.7);
    s += bird(caves[7].x, caves[7].y, '#3498DB', 0.7);
    s += bird(caves[8].x, caves[8].y, '#FF6B6B', 0.6);
    s += bird(caves[9].x, caves[9].y, '#1ABC9C', 0.7);
    s += bird(caves[10].x, caves[10].y, '#E67E22', 0.7);
    s += bird(caves[11].x, caves[11].y, '#9B59B6', 0.6);
    s += `<rect x="0" y="430" width="800" height="70" fill="#8B7355" opacity="0.4"/>`;
    s += `<g transform="translate(100, 380)">
      <line x1="0" y1="0" x2="0" y2="50" stroke="#5D4037" stroke-width="3"/>
      <rect x="-30" y="-10" width="60" height="25" rx="3" fill="#F5E6CC" stroke="#8B7355" stroke-width="1"/>
      <text x="0" y="3" text-anchor="middle" font-size="8" fill="#333">Bird Apts.</text>
      <text x="0" y="12" text-anchor="middle" font-size="6" fill="#333">No Vacancy</text>
    </g>`;
    return svgWrap(s, '#87CEEB');
  },

  'dest-longqingxia.svg': () => {
    let s = '';
    s += `<polygon points="0,0 100,0 80,500 0,500" fill="#6C9A8B"/>`;
    s += `<polygon points="800,0 700,0 720,500 800,500" fill="#5D8A7B"/>`;
    s += cloud(400, 35, 0.5);
    s += water(350, 800, '#5DADE2');
    s += `<path d="M80,200 Q120,150 160,200" fill="#27AE60"/>`;
    s += `<path d="M640,180 Q680,130 720,180" fill="#27AE60"/>`;
    s += `<g transform="translate(400, 360)">
      <path d="M-50,0 Q-55,20 -40,20 L40,20 Q55,20 50,0 Z" fill="#C0392B"/>
      <rect x="-35" y="-25" width="70" height="28" rx="3" fill="#fff"/>
      <rect x="-40" y="-30" width="80" height="5" rx="2" fill="#E74C3C"/>
    </g>`;
    s += `<g transform="translate(360, 330)">
      <ellipse cx="0" cy="5" rx="7" ry="10" fill="#F39C12"/>
      <circle cx="0" cy="-6" r="8" fill="#FFEAA7"/>
      <path d="M-4,-7 Q-2,-5 0,-7" fill="none" stroke="#333" stroke-width="1.2"/>
      <path d="M2,-7 Q4,-5 6,-7" fill="none" stroke="#333" stroke-width="1.2"/>
      <path d="M-2,-2 Q0,0 2,-2" fill="none" stroke="#333" stroke-width="1"/>
      <ellipse cx="0" cy="-14" rx="10" ry="3" fill="#2C3E50"/>
      <rect x="-6" y="-22" width="12" height="10" rx="2" fill="#2C3E50"/>
      <g transform="translate(8, 5) rotate(45)">
        <polygon points="0,0 15,-5 15,5" fill="#888"/>
      </g>
    </g>`;
    s += `<text x="345" y="315" font-size="10" fill="#333" opacity="0.5">z</text>
      <text x="335" y="305" font-size="14" fill="#333" opacity="0.4">Z</text>`;
    s += cutePerson(410, 322, { color: '#3498DB', expression: 'screaming', scale: 0.45 });
    s += cutePerson(430, 320, { color: '#E74C3C', expression: 'screaming', scale: 0.45 });
    s += cutePerson(450, 322, { color: '#2ECC71', expression: 'screaming', scale: 0.45 });
    s += `<text x="435" y="310" text-anchor="middle" font-size="10" fill="#E74C3C" font-weight="bold">LOOK! LOOK!</text>`;
    s += `<path d="M700,100 Q695,200 700,300" fill="none" stroke="#85C1E9" stroke-width="5" opacity="0.6"/>`;
    return svgWrap(s, '#87CEEB');
  },

  'dest-baiwangshan.svg': () => {
    let s = '';
    s += cloud(600, 40, 0.7);
    s += sun(680, 55);
    const autumnColors2 = ['#E74C3C', '#F39C12', '#F9CA24', '#E67E22', '#C0392B'];
    for (let i = 0; i < 12; i++) {
      const tx = 50 + i * 65;
      s += `<line x1="${tx}" y1="200" x2="${tx}" y2="330" stroke="#8B4513" stroke-width="5"/>`;
      s += `<ellipse cx="${tx}" cy="185" rx="30" ry="35" fill="${autumnColors2[i % 5]}" opacity="0.8"/>`;
    }
    s += `<rect x="0" y="330" width="800" height="170" fill="#8B7355" opacity="0.3"/>`;
    for (let i = 0; i < 30; i++) {
      s += ginkgoLeaf(Math.random() * 800, 340 + Math.random() * 100, Math.random() * 360);
    }
    s += cutePerson(350, 280, { color: '#3498DB', expression: 'frustrated', scale: 0.7 });
    s += `<g transform="translate(380, 305)">
      <rect x="0" y="-5" width="15" height="12" rx="2" fill="#333"/>
      <circle cx="7" cy="1" r="4" fill="#555"/>
    </g>`;
    s += `<ellipse cx="420" cy="340" rx="12" ry="8" fill="#BDC3C7"/>`;
    s += ginkgoLeaf(420, 335, 15);
    s += `<g transform="translate(250, 340)">
      <ellipse cx="0" cy="0" rx="50" ry="30" fill="#E67E22" opacity="0.6"/>
      <ellipse cx="10" cy="-10" rx="40" ry="25" fill="#F9CA24" opacity="0.7"/>
      <ellipse cx="-5" cy="-15" rx="35" ry="20" fill="#F39C12" opacity="0.6"/>
    </g>`;
    for (let i = 0; i < 8; i++) {
      const dx = 220 + Math.random() * 60;
      const dy = 300 + Math.random() * 30;
      s += ginkgoLeaf(dx, dy, Math.random() * 360);
    }
    s += speechBubble(350, 245, 'Not perfect enough!', { width: 110, height: 22, fontSize: 9 });
    s += `<g transform="translate(200, 295)">
      <rect x="0" y="0" width="50" height="20" rx="5" fill="#E74C3C" opacity="0.8"/>
      <text x="25" y="14" text-anchor="middle" font-size="10" fill="#fff" font-weight="bold">x 247</text>
    </g>`;
    return svgWrap(s, '#87CEEB');
  },

  'dest-chongli.svg': () => {
    let s = '';
    s += `<rect width="800" height="500" fill="#B8D4E3"/>`;
    s += mountain(250, 380, 500, 280, '#E8E8E8');
    s += mountain(600, 380, 400, 250, '#F0F0F0');
    s += `<g transform="translate(400, 60)" opacity="0.3">
      <circle cx="-30" cy="0" r="12" fill="none" stroke="#3498DB" stroke-width="2"/>
      <circle cx="0" cy="0" r="12" fill="none" stroke="#333" stroke-width="2"/>
      <circle cx="30" cy="0" r="12" fill="none" stroke="#E74C3C" stroke-width="2"/>
      <circle cx="-15" cy="12" r="12" fill="none" stroke="#F9CA24" stroke-width="2"/>
      <circle cx="15" cy="12" r="12" fill="none" stroke="#27AE60" stroke-width="2"/>
    </g>`;
    s += `<path d="M200,150 Q400,300 700,380" fill="none" stroke="#fff" stroke-width="30" opacity="0.4"/>`;
    s += `<rect x="0" y="380" width="800" height="120" fill="#fff"/>`;
    s += `<line x1="100" y1="100" x2="700" y2="200" stroke="#888" stroke-width="3"/>`;
    s += `<g transform="translate(300, 138)">
      <line x1="0" y1="0" x2="0" y2="20" stroke="#888" stroke-width="2"/>
      <rect x="-15" y="20" width="30" height="15" rx="3" fill="#3498DB"/>
    </g>`;
    s += `<g transform="translate(450, 150)">
      <line x1="0" y1="0" x2="0" y2="20" stroke="#888" stroke-width="2"/>
      <rect x="-15" y="20" width="30" height="15" rx="3" fill="#3498DB"/>
      <circle cx="0" cy="25" r="12" fill="#fff" stroke="#ddd" stroke-width="1"/>
      <circle cx="0" cy="12" r="9" fill="#fff" stroke="#ddd" stroke-width="1"/>
      <circle cx="0" cy="2" r="7" fill="#fff" stroke="#ddd" stroke-width="1"/>
      <circle cx="-2" cy="0" r="1.5" fill="#333"/>
      <circle cx="3" cy="0" r="1.5" fill="#333"/>
      <polygon points="-1,3 5,2 0,4" fill="#FF9F43"/>
      <rect x="-5" y="-8" width="10" height="8" rx="1" fill="#2C3E50"/>
      <rect x="-7" y="-2" width="14" height="3" fill="#2C3E50"/>
      <path d="M-7,7 Q0,10 7,7" fill="none" stroke="#E74C3C" stroke-width="3"/>
      <line x1="-9" y1="15" x2="-20" y2="8" stroke="#5D4037" stroke-width="2"/>
      <line x1="9" y1="15" x2="20" y2="8" stroke="#5D4037" stroke-width="2"/>
    </g>`;
    s += cutePerson(350, 310, { color: '#E74C3C', expression: 'confused', scale: 0.6 });
    s += cutePerson(500, 315, { color: '#2ECC71', expression: 'confused', scale: 0.6 });
    s += speechBubble(350, 280, 'Is that a...?', { width: 80, height: 22, fontSize: 9 });
    for (let i = 0; i < 20; i++) {
      s += snowflake(Math.random() * 800, Math.random() * 380, Math.random() * 3 + 2);
    }
    return svgWrap(s, '#B8D4E3');
  },

  'dest-shizisi.svg': () => {
    let s = '';
    s += cloud(100, 40);
    s += sun(680, 55);
    s += `<rect x="0" y="350" width="800" height="150" fill="#C4A882" opacity="0.4"/>`;
    s += `<rect x="200" y="250" width="20" height="100" fill="#BDC3C7"/>`;
    s += `<rect x="200" y="240" width="25" height="15" fill="#BDC3C7"/>`;
    s += `<rect x="350" y="270" width="20" height="80" fill="#BDC3C7"/>`;
    s += `<rect x="350" y="260" width="25" height="15" fill="#BDC3C7"/>`;
    s += `<rect x="500" y="260" width="20" height="90" fill="#BDC3C7"/>`;
    s += `<rect x="560" y="330" width="60" height="18" rx="3" fill="#BDC3C7" transform="rotate(-10,590,339)"/>`;
    s += `<rect x="330" y="310" width="80" height="40" rx="3" fill="#95A5A6"/>`;
    s += `<rect x="340" y="300" width="60" height="15" rx="2" fill="#ABB2B9"/>`;
    s += cuteCat(370, 265, { color: '#FF9F43', expression: 'smug', scale: 1.3 });
    s += `<g transform="translate(370, 245) scale(1.3)">
      <polygon points="-8,0 -5,-10 -2,0" fill="#F9CA24"/>
      <polygon points="-2,0 1,-12 4,0" fill="#F9CA24"/>
      <polygon points="4,0 7,-10 10,0" fill="#F9CA24"/>
      <rect x="-9" y="0" width="20" height="4" fill="#F9CA24"/>
      <circle cx="1" cy="-10" r="2" fill="#E74C3C"/>
    </g>`;
    const bowingCats = [250, 450, 550];
    bowingCats.forEach(bx => {
      s += `<g transform="translate(${bx}, 330)">
        <ellipse cx="0" cy="5" rx="10" ry="7" fill="#888"/>
        <circle cx="-8" cy="10" r="7" fill="#888"/>
        <circle cx="-8" cy="12" r="1.5" fill="#333"/>
        <line x1="-14" y1="8" x2="-20" y2="6" stroke="#888" stroke-width="0.6"/>
        <line x1="-14" y1="10" x2="-20" y2="12" stroke="#888" stroke-width="0.6"/>
        <path d="M8,2 Q15,-5 12,8" fill="none" stroke="#888" stroke-width="3"/>
      </g>`;
    });
    s += speechBubble(370, 220, 'Bow, peasants!', { width: 95, height: 22, fontSize: 10 });
    return svgWrap(s, '#87CEEB');
  },

  'dest-lingshan.svg': () => {
    let s = '';
    s += cloud(100, 40, 0.8);
    s += cloud(600, 50, 0.6);
    s += mountain(400, 430, 600, 350, '#6C9A8B');
    s += mountain(200, 430, 300, 250, '#5D8A7B');
    s += `<rect x="385" y="80" width="30" height="5" fill="#5D8A7B"/>`;
    s += `<g transform="translate(400, 40)">
      <circle cx="0" cy="0" r="12" fill="#FFEAA7"/>
      <circle cx="-4" cy="-2" r="2" fill="#333"/>
      <circle cx="4" cy="-2" r="2" fill="#333"/>
      <path d="M-4,4 Q0,7 4,4" fill="none" stroke="#333" stroke-width="1.2"/>
      <ellipse cx="0" cy="18" rx="10" ry="14" fill="#E74C3C"/>
      <line x1="-10" y1="12" x2="-20" y2="0" stroke="#E74C3C" stroke-width="3" stroke-linecap="round"/>
      <line x1="10" y1="12" x2="20" y2="0" stroke="#E74C3C" stroke-width="3" stroke-linecap="round"/>
      <path d="M-5,30 Q-8,36 -5,42 Q-2,48 -5,54" fill="none" stroke="#E74C3C" stroke-width="4" stroke-linecap="round"/>
      <path d="M5,30 Q8,36 5,42 Q2,48 5,54" fill="none" stroke="#E74C3C" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="-5" cy="56" rx="6" ry="3" fill="#333"/>
      <ellipse cx="5" cy="56" rx="6" ry="3" fill="#333"/>
    </g>`;
    s += `<g transform="translate(400, 10)">
      <rect x="-60" y="-12" width="120" height="24" rx="3" fill="#fff" stroke="#333" stroke-width="1.5"/>
      <text x="0" y="3" text-anchor="middle" font-size="9" fill="#333" font-weight="bold">I climbed Beijing highest!</text>
    </g>`;
    s += `<circle cx="385" cy="35" r="2.5" fill="#74B9FF"/>
      <circle cx="418" cy="30" r="2" fill="#74B9FF"/>
      <circle cx="380" cy="50" r="1.5" fill="#74B9FF"/>`;
    s += `<path d="M382,70 L378,75" stroke="#333" stroke-width="1" opacity="0.4"/>
      <path d="M422,70 L426,75" stroke="#333" stroke-width="1" opacity="0.4"/>
      <path d="M380,80 L375,82" stroke="#333" stroke-width="1" opacity="0.3"/>
      <path d="M424,80 L429,82" stroke="#333" stroke-width="1" opacity="0.3"/>`;
    s += `<g transform="translate(450, 75)">
      <rect x="0" y="0" width="60" height="20" rx="3" fill="#F39C12"/>
      <text x="30" y="14" text-anchor="middle" font-size="9" fill="#fff" font-weight="bold">2303m</text>
    </g>`;
    return svgWrap(s, '#87CEEB');
  },

  'dest-cuandixia.svg': () => {
    let s = '';
    s += cloud(100, 40);
    s += sun(680, 55);
    s += `<g transform="translate(500, 200)">
      <rect x="0" y="0" width="80" height="60" fill="#F5E6CC"/>
      <path d="M-5,0 L40,-25 L85,0" fill="#8B4513"/>
      <rect x="15" y="20" width="20" height="30" rx="2" fill="#5D4037"/>
      <rect x="45" y="10" width="15" height="15" rx="1" fill="#85C1E9"/>
    </g>`;
    s += `<g transform="translate(600, 210)">
      <rect x="0" y="0" width="70" height="50" fill="#F5E6CC"/>
      <path d="M-5,0 L35,-20 L75,0" fill="#8B4513"/>
      <rect x="10" y="15" width="15" height="25" rx="2" fill="#5D4037"/>
    </g>`;
    s += `<rect x="0" y="350" width="800" height="150" fill="#C4A882" opacity="0.4"/>`;
    for (let i = 0; i < 10; i++) {
      s += `<ellipse cx="${200 + i * 50}" cy="${380 + (i%2)*5}" rx="15" ry="8" fill="#BDC3C7" opacity="0.5"/>`;
    }
    s += `<g transform="translate(250, 280)">
      <rect x="-30" y="20" width="60" height="5" fill="#8B4513"/>
      <rect x="-25" y="25" width="5" height="20" fill="#8B4513"/>
      <rect x="20" y="25" width="5" height="20" fill="#8B4513"/>
    </g>`;
    s += cutePerson(250, 245, { color: '#3498DB', expression: 'frustrated', scale: 0.65 });
    s += `<rect x="225" y="285" width="50" height="35" fill="#fff" stroke="#ddd" stroke-width="0.5"/>`;
    s += `<g opacity="0.6">
      <text x="250" y="310" text-anchor="middle" font-size="10" fill="#E74C3C">X X X</text>
    </g>`;
    for (let i = 0; i < 6; i++) {
      s += `<circle cx="${200 + Math.random()*100}" cy="${330 + Math.random()*30}" r="${3 + Math.random()*3}" fill="#fff" stroke="#ddd" stroke-width="0.5"/>`;
    }
    s += cutePerson(500, 310, { color: '#F39C12', expression: 'happy', scale: 0.5 });
    s += cutePerson(540, 312, { color: '#E74C3C', expression: 'happy', scale: 0.5 });
    s += cutePerson(575, 310, { color: '#27AE60', expression: 'happy', scale: 0.5 });
    s += `<text x="540" y="300" text-anchor="middle" font-size="10" fill="#333">hahaha!</text>`;
    s += `<g transform="translate(100, 200)">
      <rect x="-40" y="-30" width="80" height="60" rx="3" fill="#F5E6CC" stroke="#8B4513" stroke-width="2"/>
      <text x="0" y="10" text-anchor="middle" font-size="36" fill="#333" font-weight="bold">&#x7228;</text>
    </g>`;
    s += speechBubble(250, 215, 'How do you even...?!', { width: 120, height: 22, fontSize: 9 });
    return svgWrap(s, '#87CEEB');
  },

  'dest-chengde.svg': () => {
    let s = '';
    s += cloud(100, 40);
    s += sun(680, 55);
    s += `<rect x="0" y="350" width="800" height="150" fill="#7BC67E" opacity="0.5"/>`;
    s += `<g transform="translate(400, 150)">
      <path d="M-100,-20 L0,-60 L100,-20" fill="#C0392B"/>
      <rect x="-80" y="-20" width="160" height="80" fill="#F5E6CC"/>
      <rect x="-15" y="20" width="30" height="40" rx="12" fill="#8B4513"/>
      <circle cx="-50" cy="10" r="8" fill="#F9CA24" opacity="0.5"/>
      <circle cx="50" cy="10" r="8" fill="#F9CA24" opacity="0.5"/>
    </g>`;
    s += `<g transform="translate(300, 260)">
      <path d="M-20,15 L-30,60 L30,60 L20,15" fill="#F9CA24"/>
      <path d="M-15,15 L-25,60 L25,60 L15,15" fill="#C0392B"/>
      <path d="M-5,30 Q0,25 5,30 Q10,35 5,40 Q0,35 -5,40 Q-10,35 -5,30" fill="#F9CA24" opacity="0.5"/>
      <circle cx="0" cy="0" r="12" fill="#FFEAA7"/>
      <circle cx="-4" cy="-2" r="2" fill="#333"/>
      <circle cx="4" cy="-2" r="2" fill="#333"/>
      <path d="M-3,4 Q0,7 3,4" fill="none" stroke="#333" stroke-width="1.2"/>
      <rect x="-15" y="-18" width="30" height="12" rx="2" fill="#2C3E50"/>
      <rect x="-20" y="-8" width="40" height="4" fill="#F9CA24"/>
      <line x1="-18" y1="-8" x2="-18" y2="0" stroke="#F9CA24" stroke-width="1"/>
      <circle cx="-18" cy="2" r="2" fill="#E74C3C"/>
      <line x1="18" y1="-8" x2="18" y2="0" stroke="#F9CA24" stroke-width="1"/>
      <circle cx="18" cy="2" r="2" fill="#E74C3C"/>
      <line x1="-15" y1="20" x2="-35" y2="5" stroke="#C0392B" stroke-width="4" stroke-linecap="round"/>
      <line x1="15" y1="20" x2="35" y2="35" stroke="#C0392B" stroke-width="4" stroke-linecap="round"/>
    </g>`;
    s += cutePerson(500, 290, { color: '#3498DB', expression: 'confused', scale: 0.7 });
    s += `<g transform="translate(480, 280) rotate(-45)">
      <rect x="0" y="0" width="10" height="18" rx="2" fill="#333"/>
      <rect x="1" y="2" width="8" height="13" rx="1" fill="#74B9FF"/>
    </g>`;
    s += `<g transform="translate(620, 260)">
      <rect x="0" y="0" width="80" height="60" rx="5" fill="#333"/>
      <rect x="3" y="3" width="74" height="54" rx="3" fill="#74B9FF"/>
      <rect x="3" y="3" width="74" height="40" fill="#87CEEB"/>
      <rect x="3" y="43" width="74" height="14" fill="#7BC67E"/>
      <circle cx="70" cy="50" r="3" fill="#F9CA24"/>
      <text x="40" y="35" text-anchor="middle" font-size="7" fill="#333">actual photo</text>
    </g>`;
    s += speechBubble(300, 220, 'I am EMPEROR!', { width: 95, height: 22, fontSize: 10 });
    s += speechBubble(500, 250, 'Hold still...', { width: 80, height: 22, fontSize: 9 });
    return svgWrap(s, '#87CEEB');
  },

  'dest-yudushan.svg': () => {
    let s = '';
    s += cloud(100, 40, 0.7);
    s += cloud(550, 50);
    s += mountain(200, 350, 300, 180, '#6C9A8B');
    s += mountain(600, 350, 350, 200, '#5D8A7B');
    s += water(350, 800, '#48C9B0');
    s += tree(100, 350, { height: 35, color: '#27AE60' });
    s += tree(700, 345, { height: 40, color: '#2ECC71' });
    s += `<g transform="translate(350, 310)">
      <ellipse cx="0" cy="5" rx="25" ry="15" fill="#D2691E"/>
      <ellipse cx="-25" cy="15" rx="10" ry="8" fill="#C4A882"/>
      <path d="M-28,5 Q-35,-5 -30,-15 M-30,-10 L-36,-15" fill="none" stroke="#8B4513" stroke-width="2"/>
      <path d="M-22,5 Q-15,-5 -20,-15 M-20,-10 L-14,-15" fill="none" stroke="#8B4513" stroke-width="2"/>
      <circle cx="-28" cy="12" r="2.5" fill="#fff" stroke="#333" stroke-width="1"/>
      <circle cx="-28" cy="12" r="1.2" fill="#333"/>
      <ellipse cx="-25" cy="19" rx="2" ry="3" fill="#333"/>
      <line x1="-15" y1="18" x2="-15" y2="40" stroke="#C4A882" stroke-width="4"/>
      <line x1="-5" y1="18" x2="-5" y2="40" stroke="#C4A882" stroke-width="4"/>
      <line x1="10" y1="18" x2="10" y2="40" stroke="#C4A882" stroke-width="4"/>
      <line x1="20" y1="18" x2="20" y2="40" stroke="#C4A882" stroke-width="4"/>
      <circle cx="5" cy="0" r="2" fill="#fff" opacity="0.5"/>
      <circle cx="-10" cy="3" r="1.5" fill="#fff" opacity="0.5"/>
      <circle cx="15" cy="5" r="2" fill="#fff" opacity="0.5"/>
      <ellipse cx="25" cy="0" rx="5" ry="4" fill="#fff"/>
    </g>`;
    s += `<g transform="translate(325, 370) scale(1, -0.6)" opacity="0.4">
      <ellipse cx="0" cy="0" rx="10" ry="8" fill="#C4A882"/>
      <circle cx="-3" cy="-2" r="2" fill="#333"/>
    </g>`;
    s += `<g>
      <path d="M315,355 Q310,340 305,358" fill="none" stroke="#fff" stroke-width="2.5"/>
      <path d="M340,352 Q345,335 350,355" fill="none" stroke="#fff" stroke-width="2.5"/>
      <path d="M325,350 Q322,335 320,352" fill="none" stroke="#fff" stroke-width="2"/>
      <circle cx="310" cy="348" r="3" fill="#fff" opacity="0.5"/>
      <circle cx="345" cy="345" r="4" fill="#fff" opacity="0.4"/>
    </g>`;
    s += `<text x="350" y="290" text-anchor="middle" font-size="18" fill="#E74C3C" font-weight="bold">!!</text>`;
    s += `<line x1="310" y1="300" x2="300" y2="295" stroke="#333" stroke-width="1.5" opacity="0.5"/>
      <line x1="310" y1="310" x2="298" y2="312" stroke="#333" stroke-width="1.5" opacity="0.5"/>
      <line x1="312" y1="320" x2="300" y2="325" stroke="#333" stroke-width="1.5" opacity="0.5"/>`;
    return svgWrap(s, '#87CEEB');
  },

  'dest-xiaotangshan.svg': () => {
    let s = '';
    s += `<rect width="800" height="500" fill="#FDEBD0"/>`;
    for (let i = 0; i < 8; i++) {
      s += `<ellipse cx="${100 + i * 90}" cy="${100 + Math.random()*50}" rx="${30 + Math.random()*20}" ry="${15 + Math.random()*10}" fill="#fff" opacity="${0.2 + Math.random()*0.2}"/>`;
    }
    s += `<ellipse cx="400" cy="350" rx="250" ry="100" fill="#8ED1FC" opacity="0.6"/>`;
    s += `<ellipse cx="400" cy="345" rx="240" ry="95" fill="#6FC3DF" opacity="0.5"/>`;
    s += `<ellipse cx="400" cy="350" rx="260" ry="105" fill="none" stroke="#BDC3C7" stroke-width="8"/>`;
    for (let i = 0; i < 6; i++) {
      const sx = 250 + i * 60;
      s += `<path d="M${sx},300 Q${sx-10},280 ${sx},260 Q${sx+10},240 ${sx},220" fill="none" stroke="#fff" stroke-width="3" opacity="0.4"/>`;
    }
    s += `<g transform="translate(400, 330)">
      <path d="M-60,0 Q-40,-15 -20,0 Q0,15 20,0 Q40,-15 60,0" fill="none" stroke="#FFEAA7" stroke-width="14" stroke-linecap="round"/>
      <circle cx="-65" cy="5" r="14" fill="#FFEAA7"/>
      <path d="M-70,2 Q-68,0 -66,2" fill="none" stroke="#333" stroke-width="1.5"/>
      <path d="M-64,2 Q-62,0 -60,2" fill="none" stroke="#333" stroke-width="1.5"/>
      <path d="M-68,8 Q-65,11 -62,8" fill="none" stroke="#333" stroke-width="1.2"/>
      <circle cx="65" cy="5" r="5" fill="#FFEAA7"/>
      <circle cx="72" cy="3" r="4" fill="#FFEAA7"/>
    </g>`;
    s += duck(300, 310, { scale: 0.6 });
    s += duck(480, 315, { scale: 0.5 });
    s += speechBubble(340, 280, 'I am... noodle...', { width: 100, height: 25, fontSize: 10 });
    s += `<rect x="318" y="315" width="35" height="8" rx="2" fill="#fff"/>`;
    s += `<line x1="50" y1="150" x2="50" y2="400" stroke="#27AE60" stroke-width="6"/>`;
    s += `<path d="M50,180 Q30,170 20,180" fill="none" stroke="#27AE60" stroke-width="3"/>`;
    s += `<path d="M50,220 Q30,210 15,220" fill="none" stroke="#27AE60" stroke-width="3"/>`;
    s += `<line x1="750" y1="160" x2="750" y2="400" stroke="#27AE60" stroke-width="6"/>`;
    s += `<path d="M750,190 Q770,180 780,190" fill="none" stroke="#27AE60" stroke-width="3"/>`;
    return svgWrap(s, '#FDEBD0');
  },

  'dest-nuanquanguzhen.svg': () => {
    let s = '';
    s += `<rect width="800" height="500" fill="#1a1a3e"/>`;
    for (let i = 0; i < 20; i++) {
      s += `<circle cx="${Math.random()*800}" cy="${Math.random()*200}" r="${Math.random()*1.5+0.5}" fill="#fff" opacity="${Math.random()*0.4+0.2}"/>`;
    }
    for (let i = 0; i < 15; i++) {
      const ax = 50 + i * 50;
      s += `<circle cx="${ax}" cy="${410 + (i%2)*5}" r="8" fill="#2C3E50"/>`;
      s += `<ellipse cx="${ax}" cy="${425 + (i%2)*5}" rx="10" ry="12" fill="#2C3E50"/>`;
    }
    s += `<g transform="translate(400, 320)">
      <ellipse cx="0" cy="15" rx="14" ry="18" fill="#5D4037"/>
      <circle cx="0" cy="-5" r="12" fill="#FFEAA7"/>
      <circle cx="-4" cy="-7" r="2" fill="#333"/>
      <circle cx="4" cy="-7" r="2" fill="#333"/>
      <path d="M-3,-1 Q0,2 3,-1" fill="none" stroke="#333" stroke-width="1.2"/>
      <line x1="12" y1="8" x2="35" y2="-20" stroke="#5D4037" stroke-width="5" stroke-linecap="round"/>
      <rect x="-13" y="-12" width="26" height="4" fill="#E74C3C"/>
    </g>`;
    s += `<g>`;
    const heartPoints = [];
    for (let t = 0; t < Math.PI * 2; t += 0.1) {
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
      heartPoints.push([400 + x * 4, 180 + y * 4]);
    }
    heartPoints.forEach(([hx, hy]) => {
      s += `<circle cx="${hx + (Math.random()-0.5)*8}" cy="${hy + (Math.random()-0.5)*8}" r="${Math.random()*2+1}" fill="#FF6B6B" opacity="${Math.random()*0.4+0.6}"/>`;
      s += `<circle cx="${hx + (Math.random()-0.5)*5}" cy="${hy + (Math.random()-0.5)*5}" r="${Math.random()*1.5+0.5}" fill="#F9CA24" opacity="${Math.random()*0.3+0.5}"/>`;
    });
    for (let i = 0; i < 30; i++) {
      const sx = 350 + Math.random() * 100;
      const sy = 120 + Math.random() * 120;
      s += `<circle cx="${sx}" cy="${sy}" r="${Math.random()+0.5}" fill="#fff" opacity="${Math.random()*0.5+0.3}"/>`;
    }
    s += `</g>`;
    s += `<text x="150" y="395" font-size="14" fill="#FF6B6B" opacity="0.8">Oooh!</text>`;
    s += `<text x="400" y="400" text-anchor="middle" font-size="16" fill="#FF6B6B" opacity="0.8">Aaah!</text>`;
    s += `<text x="600" y="395" font-size="14" fill="#FF6B6B" opacity="0.8">Wow!</text>`;
    return svgWrap(s, '#1a1a3e');
  },

  'dest-jietaisi.svg': () => {
    let s = '';
    s += cloud(100, 40);
    s += sun(680, 55);
    s += `<g transform="translate(600, 200)">
      <path d="M-50,-15 L0,-40 L50,-15" fill="#C0392B"/>
      <rect x="-40" y="-15" width="80" height="50" fill="#F5E6CC"/>
      <rect x="-8" y="5" width="16" height="30" rx="6" fill="#8B4513"/>
    </g>`;
    s += `<rect x="0" y="380" width="800" height="120" fill="#7BC67E" opacity="0.5"/>`;
    s += `<g transform="translate(300, 200)">
      <path d="M0,180 Q-20,150 10,120 Q30,90 -10,60 Q-30,30 10,0" fill="none" stroke="#5D4037" stroke-width="15"/>
      <ellipse cx="10" cy="-10" rx="40" ry="30" fill="#27AE60"/>
      <ellipse cx="-10" cy="50" rx="35" ry="25" fill="#2ECC71"/>
      <ellipse cx="20" cy="100" rx="30" ry="20" fill="#27AE60"/>
      <path d="M10,0 Q40,-20 60,-40" fill="none" stroke="#5D4037" stroke-width="6"/>
      <ellipse cx="65" cy="-45" rx="20" ry="15" fill="#27AE60"/>
      <path d="M-10,60 Q-40,80 -60,70" fill="none" stroke="#5D4037" stroke-width="6"/>
      <ellipse cx="-65" cy="68" rx="20" ry="15" fill="#2ECC71"/>
    </g>`;
    s += bird(280, 120+200, '#4ECDC4', 0.8);
    s += bird(340, 100+200, '#FF6B6B', 0.7);
    s += bird(270, 160+200, '#F39C12', 0.6);
    s += `<text x="280" y="${108+200}" font-size="12" fill="#333">?</text>`;
    s += `<text x="345" y="${88+200}" font-size="12" fill="#333">?</text>`;
    s += `<g transform="translate(550, 280)">
      <path d="M0,100 Q20,70 -10,50 Q-25,30 5,10 Q20,-5 0,-15" fill="none" stroke="#5D4037" stroke-width="10"/>
      <ellipse cx="0" cy="-20" rx="25" ry="20" fill="#27AE60"/>
      <ellipse cx="-15" cy="30" rx="20" ry="15" fill="#2ECC71"/>
      <path d="M5,10 Q30,0 45,-10" fill="none" stroke="#5D4037" stroke-width="4"/>
      <ellipse cx="48" cy="-12" rx="12" ry="10" fill="#27AE60"/>
    </g>`;
    s += `<g transform="translate(100, 350)">
      <line x1="0" y1="0" x2="0" y2="40" stroke="#5D4037" stroke-width="3"/>
      <rect x="-40" y="-15" width="80" height="25" rx="3" fill="#F5E6CC" stroke="#8B7355" stroke-width="1"/>
      <text x="0" y="0" text-anchor="middle" font-size="8" fill="#333">1000-year old pines</text>
      <text x="0" y="10" text-anchor="middle" font-size="7" fill="#333">(still dabbing)</text>
    </g>`;
    return svgWrap(s, '#87CEEB');
  }
};

// ============ GENERATE ALL SVGs ============

let count = 0;
for (const [filename, generator] of Object.entries(scenes)) {
  const svg = generator();
  const filepath = path.join(outputDir, filename);
  fs.writeFileSync(filepath, svg, 'utf8');
  count++;
  console.log(`Generated ${filename}`);
}

console.log(`\nDone! Generated ${count} SVG files in ${outputDir}`);
