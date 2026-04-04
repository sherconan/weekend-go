// ========== Unique Stamp Designs for Each Destination ==========
// AI-generated stamp images where available, fallback to SVG

// AI-generated stamp image mapping (destination name → stamp image path)
const STAMP_IMAGES = {
  "古北水镇": "assets/stamps/stamp-1.webp",
  "雾灵山": "assets/stamps/stamp-10.webp",
  "延庆龙庆峡冰灯节": "assets/stamps/stamp-100.webp",
  "密云司马台长城": "assets/stamps/stamp-101.webp",
  "恋乡太行水镇": "assets/stamps/stamp-102.webp",
  "张北草原天路": "assets/stamps/stamp-11.webp",
  "阿那亚": "assets/stamps/stamp-12.webp",
  "黄花城水长城": "assets/stamps/stamp-13.webp",
  "青龙峡": "assets/stamps/stamp-14.webp",
  "神堂峪": "assets/stamps/stamp-15.webp",
  "喇叭沟原始森林": "assets/stamps/stamp-16.webp",
  "雁栖湖": "assets/stamps/stamp-17.webp",
  "潭柘寺": "assets/stamps/stamp-18.webp",
  "野三坡": "assets/stamps/stamp-19.webp",
  "延庆百里画廊": "assets/stamps/stamp-2.webp",
  "白石山": "assets/stamps/stamp-20.webp",
  "白河峡谷": "assets/stamps/stamp-200.webp",
  "幽谷神潭": "assets/stamps/stamp-201.webp",
  "云蒙山": "assets/stamps/stamp-202.webp",
  "海坨山": "assets/stamps/stamp-203.webp",
  "百花山": "assets/stamps/stamp-204.webp",
  "官厅水库": "assets/stamps/stamp-205.webp",
  "桃源仙谷": "assets/stamps/stamp-206.webp",
  "云蒙峡": "assets/stamps/stamp-207.webp",
  "798艺术区": "assets/stamps/stamp-208.webp",
  "首钢园": "assets/stamps/stamp-209.webp",
  "北戴河": "assets/stamps/stamp-21.webp",
  "前门大栅栏": "assets/stamps/stamp-210.webp",
  "鸟巢水立方": "assets/stamps/stamp-211.webp",
  "凤凰岭": "assets/stamps/stamp-22.webp",
  "坝上草原": "assets/stamps/stamp-23.webp",
  "大觉寺": "assets/stamps/stamp-24.webp",
  "妙峰山": "assets/stamps/stamp-25.webp",
  "周口店遗址": "assets/stamps/stamp-26.webp",
  "古崖居": "assets/stamps/stamp-27.webp",
  "龙庆峡": "assets/stamps/stamp-28.webp",
  "百望山": "assets/stamps/stamp-29.webp",
  "密云水库": "assets/stamps/stamp-3.webp",
  "崇礼": "assets/stamps/stamp-30.webp",
  "房山十字寺": "assets/stamps/stamp-31.webp",
  "灵山": "assets/stamps/stamp-32.webp",
  "爨底下村": "assets/stamps/stamp-33.webp",
  "承德避暑山庄": "assets/stamps/stamp-34.webp",
  "玉渡山": "assets/stamps/stamp-35.webp",
  "小汤山温泉": "assets/stamps/stamp-36.webp",
  "蔚县暖泉古镇": "assets/stamps/stamp-37.webp",
  "戒台寺": "assets/stamps/stamp-38.webp",
  "奥林匹克森林公园": "assets/stamps/stamp-39.webp",
  "慕田峪长城": "assets/stamps/stamp-4.webp",
  "香山公园": "assets/stamps/stamp-40.webp",
  "国家植物园": "assets/stamps/stamp-41.webp",
  "十三陵": "assets/stamps/stamp-42.webp",
  "居庸关长城": "assets/stamps/stamp-43.webp",
  "房山石花洞": "assets/stamps/stamp-45.webp",
  "天津五大道": "assets/stamps/stamp-46.webp",
  "天津之眼摩天轮": "assets/stamps/stamp-47.webp",
  "蓟州盘山": "assets/stamps/stamp-48.webp",
  "保定直隶总督署": "assets/stamps/stamp-49.webp",
  "金海湖": "assets/stamps/stamp-5.webp",
  "清西陵": "assets/stamps/stamp-50.webp",
  "易水湖": "assets/stamps/stamp-51.webp",
  "张裕爱斐堡酒庄": "assets/stamps/stamp-52.webp",
  "渔阳滑雪场": "assets/stamps/stamp-53.webp",
  "延庆世园公园": "assets/stamps/stamp-54.webp",
  "平谷桃花海": "assets/stamps/stamp-55.webp",
  "门头沟双龙峡": "assets/stamps/stamp-56.webp",
  "京西古道": "assets/stamps/stamp-57.webp",
  "昌平碓臼峪": "assets/stamps/stamp-58.webp",
  "大兴野生动物园": "assets/stamps/stamp-59.webp",
  "十渡风景区": "assets/stamps/stamp-6.webp",
  "通州大运河森林公园": "assets/stamps/stamp-60.webp",
  "顺义奥林匹克水上公园": "assets/stamps/stamp-61.webp",
  "焦庄户地道战遗址": "assets/stamps/stamp-62.webp",
  "秦皇岛山海关": "assets/stamps/stamp-63.webp",
  "张家口暖泉古镇": "assets/stamps/stamp-64.webp",
  "丫髻山": "assets/stamps/stamp-65.webp",
  "南海子公园": "assets/stamps/stamp-66.webp",
  "箭扣长城": "assets/stamps/stamp-67.webp",
  "怀柔虹鳟鱼一条沟": "assets/stamps/stamp-68.webp",
  "松山自然保护区": "assets/stamps/stamp-69.webp",
  "蟒山国家森林公园": "assets/stamps/stamp-7.webp",
  "白洋淀": "assets/stamps/stamp-70.webp",
  "中国科学技术馆": "assets/stamps/stamp-71.webp",
  "房山世界地质公园": "assets/stamps/stamp-72.webp",
  "颐和园昆明湖": "assets/stamps/stamp-73.webp",
  "八达岭野生动物园": "assets/stamps/stamp-74.webp",
  "怀柔影视城": "assets/stamps/stamp-75.webp",
  "延庆万亩杏花": "assets/stamps/stamp-76.webp",
  "银山塔林": "assets/stamps/stamp-77.webp",
  "涞水野三坡百里峡": "assets/stamps/stamp-78.webp",
  "崇礼万龙滑雪场": "assets/stamps/stamp-79.webp",
  "南山滑雪场": "assets/stamps/stamp-8.webp",
  "密云古北口": "assets/stamps/stamp-80.webp",
  "圣莲山": "assets/stamps/stamp-81.webp",
  "上方山国家森林公园": "assets/stamps/stamp-82.webp",
  "雄安新区容东片区": "assets/stamps/stamp-83.webp",
  "石景山游乐园": "assets/stamps/stamp-84.webp",
  "永定河生态走廊": "assets/stamps/stamp-85.webp",
  "古北水镇附近司马台水库": "assets/stamps/stamp-86.webp",
  "北京植物园（原北植）": "assets/stamps/stamp-87.webp",
  "张家口大境门": "assets/stamps/stamp-88.webp",
  "北京欢乐谷": "assets/stamps/stamp-89.webp",
  "红螺寺": "assets/stamps/stamp-9.webp",
  "北京环球影城": "assets/stamps/stamp-90.webp",
  "坝上围场御道口": "assets/stamps/stamp-91.webp",
  "北戴河蔚蓝海岸": "assets/stamps/stamp-92.webp",
  "唐山南湖公园": "assets/stamps/stamp-93.webp",
  "灵山天池": "assets/stamps/stamp-94.webp",
  "黑龙潭": "assets/stamps/stamp-95.webp",
  "拒马河天然浴场": "assets/stamps/stamp-96.webp",
  "延庆硅化木地质公园": "assets/stamps/stamp-97.webp",
  "承德外八庙": "assets/stamps/stamp-98.webp",
  "北京明城墙遗址公园": "assets/stamps/stamp-99.webp",
};

// Check if destination has an AI-generated stamp image
function hasStampImage(dest) {
  return !!STAMP_IMAGES[dest.name];
}

function getStampImagePath(dest) {
  return STAMP_IMAGES[dest.name] || null;
}

// ========== SVG Fallback System ==========

const STAMP_PALETTES = [
  { main: '#8B4513' },
  { main: '#C62828' },
  { main: '#AD1457' },
  { main: '#6A1B9A' },
  { main: '#283593' },
  { main: '#0277BD' },
  { main: '#00695C' },
  { main: '#2E7D32' },
  { main: '#F57F17' },
  { main: '#BF360C' },
  { main: '#4E342E' },
  { main: '#37474F' },
];

function getDestIcon(dest) {
  var name = dest.name;
  if (name.indexOf('长城') >= 0 || name.indexOf('慕田峪') >= 0 || name.indexOf('居庸关') >= 0 || name.indexOf('箭扣') >= 0 || name.indexOf('司马台') >= 0) return '\u{1F3EF}';
  if (name.indexOf('滑雪') >= 0 || name.indexOf('雪场') >= 0) return '\u26F7';
  if (name.indexOf('温泉') >= 0) return '\u2668';
  if (name.indexOf('水库') >= 0 || name.indexOf('湖') >= 0) return '\u{1F3DE}';
  if (name.indexOf('峡') >= 0 || name.indexOf('谷') >= 0) return '\u{1F3D4}';
  if (name.indexOf('山') >= 0 || name.indexOf('岭') >= 0 || name.indexOf('峰') >= 0) return '\u26F0';
  if (name.indexOf('寺') >= 0 || name.indexOf('庙') >= 0 || name.indexOf('陵') >= 0) return '\u{1F6D5}';
  if (name.indexOf('村') >= 0 || name.indexOf('镇') >= 0 || name.indexOf('古') >= 0) return '\u{1F3D8}';
  if (name.indexOf('公园') >= 0 || name.indexOf('森林') >= 0) return '\u{1F333}';
  if (name.indexOf('动物') >= 0 || name.indexOf('野生') >= 0) return '\u{1F43E}';
  if (name.indexOf('湿地') >= 0 || name.indexOf('鸭') >= 0) return '\u{1F986}';
  if (name.indexOf('花') >= 0 || name.indexOf('桃') >= 0) return '\u{1F338}';
  if (name.indexOf('艺术') >= 0 || name.indexOf('798') >= 0) return '\u{1F3A8}';
  if (name.indexOf('草原') >= 0 || name.indexOf('坝上') >= 0) return '\u{1F40E}';
  if (name.indexOf('海') >= 0 || name.indexOf('河') >= 0) return '\u{1F30A}';
  if (name.indexOf('街') >= 0 || name.indexOf('巷') >= 0) return '\u{1F3EE}';
  if (name.indexOf('酒') >= 0 || name.indexOf('葡萄') >= 0) return '\u{1F377}';
  if (name.indexOf('冰') >= 0 || name.indexOf('雪') >= 0) return '\u2744';
  var themes = dest.themes || [];
  if (themes.indexOf('露营') >= 0) return '\u26FA';
  if (themes.indexOf('美食') >= 0) return '\u{1F35C}';
  if (themes.indexOf('赏花') >= 0) return '\u{1F338}';
  if (themes.indexOf('历史') >= 0) return '\u{1F4DC}';
  if (themes.indexOf('爬山') >= 0) return '\u26F0';
  return '\u{1F4CD}';
}

function getStampDesign(dest) {
  var id = dest.id;
  var palette = STAMP_PALETTES[id % STAMP_PALETTES.length];
  var icon = getDestIcon(dest);
  var rotation = ((id * 17 + 7) % 30) - 15;
  return { palette: palette, icon: icon, rotation: rotation, name: dest.name.slice(0, 6) };
}

function _svgShape(size, stroke, type) {
  var c = size / 2, r = size / 2 - 4;
  switch (type) {
    case 0: return '<circle cx="' + c + '" cy="' + c + '" r="' + r + '" fill="none" stroke="' + stroke + '" stroke-width="3" stroke-dasharray="6 3"/>';
    case 1: return '<circle cx="' + c + '" cy="' + c + '" r="' + r + '" fill="none" stroke="' + stroke + '" stroke-width="2.5"/><circle cx="' + c + '" cy="' + c + '" r="' + (r - 5) + '" fill="none" stroke="' + stroke + '" stroke-width="1.5"/>';
    case 2: {
      var pts = [];
      for (var i = 0; i < 8; i++) { var a = Math.PI / 8 + i * Math.PI / 4; pts.push((c + r * Math.cos(a)) + ',' + (c + r * Math.sin(a))); }
      return '<polygon points="' + pts.join(' ') + '" fill="none" stroke="' + stroke + '" stroke-width="2.5"/>';
    }
    case 3: return '<rect x="4" y="4" width="' + (size - 8) + '" height="' + (size - 8) + '" rx="12" fill="none" stroke="' + stroke + '" stroke-width="2.5"/>';
    case 4: {
      var pts2 = [];
      for (var j = 0; j < 6; j++) { var a2 = -Math.PI / 2 + j * Math.PI / 3; pts2.push((c + r * Math.cos(a2)) + ',' + (c + r * Math.sin(a2))); }
      return '<polygon points="' + pts2.join(' ') + '" fill="none" stroke="' + stroke + '" stroke-width="2.5"/>';
    }
    default: return '<circle cx="' + c + '" cy="' + c + '" r="' + r + '" fill="none" stroke="' + stroke + '" stroke-width="3" stroke-dasharray="6 3"/>';
  }
}

function generateStampSVG(dest, size) {
  size = size || 64;
  var design = getStampDesign(dest);
  var stroke = design.palette.main;
  var shapeType = dest.id % 5;
  var shapeEl = _svgShape(size, stroke, shapeType);
  var cx = size / 2;
  var displayName = design.name.length > 4 ? design.name.slice(0, 4) : design.name;
  var fontSize = displayName.length > 3 ? 7 : 8;

  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + size + ' ' + size + '">' +
    shapeEl +
    '<text x="' + cx + '" y="' + (size * 0.28) + '" text-anchor="middle" font-size="6" font-weight="bold" fill="' + stroke + '" font-family="PingFang SC,sans-serif">\u5DF2\u6253\u5361</text>' +
    '<text x="' + cx + '" y="' + (size * 0.52) + '" text-anchor="middle" font-size="16">' + design.icon + '</text>' +
    '<text x="' + cx + '" y="' + (size * 0.76) + '" text-anchor="middle" font-size="' + fontSize + '" font-weight="bold" fill="' + stroke + '" font-family="PingFang SC,sans-serif">' + displayName + '</text>' +
    '</svg>';
}

function getStampDataURL(dest) {
  if (hasStampImage(dest)) return getStampImagePath(dest);
  return 'data:image/svg+xml,' + encodeURIComponent(generateStampSVG(dest, 64));
}

function generateLargeStampHTML(dest) {
  if (hasStampImage(dest)) {
    var design = getStampDesign(dest);
    return '<img src="' + getStampImagePath(dest) + '" alt="' + dest.name + ' stamp" style="width:280px;height:auto;transform:rotate(' + design.rotation + 'deg);border-radius:8px;">';
  }

  var d = getStampDesign(dest);
  var stroke = d.palette.main;
  var size = 200;
  var shapeType = dest.id % 5;
  var shapeEl = _svgShape(size, stroke, shapeType);
  var cx = size / 2;
  var displayName = d.name;
  var fontSize = displayName.length > 4 ? 16 : 20;
  var dateStr = new Date().toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });

  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + size + ' ' + size + '" style="width:200px;height:200px;transform:rotate(' + d.rotation + 'deg)">' +
    shapeEl +
    '<text x="' + cx + '" y="' + (size * 0.22) + '" text-anchor="middle" font-size="14" font-weight="800" fill="' + stroke + '" font-family="PingFang SC,sans-serif" letter-spacing="4">\u2605 \u5DF2\u6253\u5361 \u2605</text>' +
    '<text x="' + cx + '" y="' + (size * 0.48) + '" text-anchor="middle" font-size="32">' + d.icon + '</text>' +
    '<text x="' + cx + '" y="' + (size * 0.68) + '" text-anchor="middle" font-size="' + fontSize + '" font-weight="800" fill="' + stroke + '" font-family="PingFang SC,sans-serif">' + displayName + '</text>' +
    '<text x="' + cx + '" y="' + (size * 0.82) + '" text-anchor="middle" font-size="11" fill="' + stroke + '" font-family="PingFang SC,sans-serif" opacity="0.6">' + dateStr + '</text>' +
    '</svg>';
}
