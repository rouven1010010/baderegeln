// Gezeichnete Szenen (SVG, Seitenansicht 400×300) und das Maskottchen Sepp.
// Alles ist aus kleinen Bausteinen zusammengesetzt: Hintergrund, Kinder, Requisiten, Wasser.

const W = 400, H = 300;
const DECK_Y = 170;   // Oberkante Beckenrand / Ufer
const WATER_Y = 186;  // Wasseroberfläche

const SKIN = ['#f6c9a0', '#e0a77a', '#a86f47', '#f3d2b5'];
const HAIR = ['#5a3b1e', '#f0c35a', '#2b2220', '#b5562b'];
const SUIT = ['#ff6f91', '#4c7cf0', '#ffb400', '#22b07d', '#9b5de5', '#ff7b3a'];

// Feste Kinder, damit „Ben“ immer gleich aussieht
const KIDS = {
  ben:  { skin: SKIN[0], hair: HAIR[0], suit: SUIT[1], style: 'short', girl: false },
  mia:  { skin: SKIN[1], hair: HAIR[2], suit: SUIT[0], style: 'pony', girl: true },
  lina: { skin: SKIN[3], hair: HAIR[1], suit: SUIT[4], style: 'pony', girl: true },
  tom:  { skin: SKIN[2], hair: HAIR[2], suit: SUIT[3], style: 'short', girl: false },
  emil: { skin: SKIN[0], hair: HAIR[3], suit: SUIT[5], style: 'short', girl: false },
  lea:  { skin: SKIN[1], hair: HAIR[0], suit: SUIT[2], style: 'pony', girl: true },
  kind: { skin: SKIN[3], hair: HAIR[1], suit: SUIT[1], style: 'short', girl: false },
};

// Arm- und Beinwinkel in Grad (0 = nach unten, positiv = nach vorne/rechts)
const POSES = {
  stand: { arms: [-12, 12], legs: [-6, 6] },
  walk:  { arms: [-28, 28], legs: [-20, 20] },
  run:   { arms: [-70, 75], legs: [-55, 50], lean: 14 },
  jump:  { arms: [-160, 160], legs: [-14, 22] },
  push:  { arms: [95, 100], legs: [-22, 14], lean: 10 },
  wave:  { arms: [-12, 155], legs: [-6, 6] },
  help:  { arms: [-150, 150], legs: [-10, 10] },
  hold:  { arms: [-12, 70], legs: [-6, 6] },
  ball:  { arms: [140, 150], legs: [-8, 8] },
  hug:   { arms: [35, -35], legs: [-4, 4] },
  point: { arms: [-12, 100], legs: [-18, 18] },
  fall:  { arms: [-130, 150], legs: [-40, 30], lean: -38 },
  swim:  { arms: [-120, 120], legs: [-10, 10] },
};

const limb = (x, y, a, len, color, w) => {
  const r = (a * Math.PI) / 180;
  const ex = x + len * Math.sin(r), ey = y + len * Math.cos(r);
  return { svg: `<line x1="${x}" y1="${y}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`, ex, ey };
};

const MOUTH = {
  happy: '<path d="M-7 -91 q7 7 14 0" stroke="#7a2e1c" stroke-width="2.4" fill="none" stroke-linecap="round"/>',
  laugh: '<path d="M-8 -92 q8 11 16 0 z" fill="#8c2a1a"/>',
  sad: '<path d="M-7 -87 q7 -6 14 0" stroke="#7a2e1c" stroke-width="2.4" fill="none" stroke-linecap="round"/>',
  scared: '<ellipse cx="0" cy="-89" rx="3.6" ry="4.6" fill="#8c2a1a"/>',
  cold: '<path d="M-8 -89 l4 -2.5 l4 2.5 l4 -2.5 l4 2.5" stroke="#3a3a6a" stroke-width="2" fill="none" stroke-linecap="round"/>',
};

// Ein Kind (oder Erwachsener). Füße bei (x, y).
function kid(name, o = {}) {
  const k = { ...KIDS[name] || KIDS.kind, ...o };
  const p = POSES[k.pose || 'stand'];
  const s = k.s || 1.35;
  const skin = k.cold ? '#c9d9f2' : k.sunburn ? '#ff8f7a' : k.skin;
  const out = [];
  const shY = -76, hipY = -38;
  const back = limb(-11, shY, p.arms[0], 32, skin, 9);
  const front = limb(11, shY, p.arms[1], 32, skin, 9);
  const legB = limb(-7, hipY, p.legs[0], 38, skin, 11);
  const legF = limb(7, hipY, p.legs[1], 38, skin, 11);

  out.push(back.svg, `<circle cx="${back.ex.toFixed(1)}" cy="${back.ey.toFixed(1)}" r="5.5" fill="${skin}"/>`);
  out.push(legB.svg, legF.svg);
  // Rumpf
  out.push(`<rect x="-16" y="${shY - 6}" width="32" height="46" rx="13" fill="${skin}"/>`);
  if (k.belly) out.push(`<ellipse cx="9" cy="-52" rx="17" ry="15" fill="${skin}"/>`);
  if (k.adult) {
    out.push(`<rect x="-17" y="${shY - 7}" width="34" height="50" rx="12" fill="${k.suit}"/>`);
    if (k.lifeguard) out.push('<rect x="-17" y="-66" width="34" height="7" fill="#fff" opacity=".9"/><path d="M-6 -48 h12 M0 -54 v12" stroke="#fff" stroke-width="4"/>');
  } else if (k.girl) {
    out.push(`<path d="M-15 ${shY} h30 v30 q0 12 -15 12 q-15 0 -15 -12 z" fill="${k.suit}"/>`);
  } else {
    out.push(`<rect x="-16" y="-48" width="32" height="16" rx="5" fill="${k.suit}"/>`);
  }
  if (k.shirt) out.push(`<path d="M-17 ${shY - 6} h34 l8 14 l-8 4 v30 h-34 v-30 l-8 -4 z" fill="#fff" stroke="#d8e2ea" stroke-width="2"/><circle cx="0" cy="-60" r="6" fill="#ffb400"/>`);
  if (k.towel) out.push(`<path d="M-21 ${shY - 6} h42 l4 64 h-50 z" fill="#ff6f91"/><path d="M-21 -66 h42 M-22 -50 h44 M-23 -34 h46" stroke="#fff" stroke-width="4" opacity=".8"/>`);
  if (!k.towel) out.push(front.svg, `<circle cx="${front.ex.toFixed(1)}" cy="${front.ey.toFixed(1)}" r="5.5" fill="${skin}"/>`);
  // Kopf
  out.push(`<circle cx="0" cy="-100" r="20" fill="${skin}"/>`);
  out.push(`<path d="M-21 -100 a21 21 0 0 1 42 0 q-6 -9 -21 -8 q-15 -1 -21 8 z" fill="${k.hair}"/>`);
  if (k.style === 'pony') out.push(`<circle cx="-21" cy="-108" r="8" fill="${k.hair}"/>`);
  if (k.hat) out.push('<path d="M-21 -106 a21 19 0 0 1 42 0 z" fill="#ff4d4d"/><path d="M14 -108 h18 q4 0 4 4 h-22 z" fill="#d83a3a"/>');
  out.push('<circle cx="-7" cy="-101" r="2.8" fill="#2a1d14"/><circle cx="7" cy="-101" r="2.8" fill="#2a1d14"/>');
  out.push(`<circle cx="-12" cy="-93" r="3.6" fill="#ff7a8a" opacity=".45"/><circle cx="12" cy="-93" r="3.6" fill="#ff7a8a" opacity=".45"/>`);
  out.push(MOUTH[k.mood || 'happy']);
  if (k.whistle) out.push('<rect x="4" y="-91" width="12" height="6" rx="2" fill="#9aa7b2"/><path d="M22 -96 l8 -4 M22 -88 l9 0 M22 -80 l8 4" stroke="#ffb400" stroke-width="3" stroke-linecap="round"/>');
  if (k.cold) out.push('<path d="M-30 -110 q-4 4 0 8 q4 4 0 8 M30 -110 q4 4 0 8 q-4 4 0 8 M-32 -70 q-4 4 0 8 q4 4 0 8 M32 -70 q4 4 0 8 q-4 4 0 8" stroke="#6f9ad8" stroke-width="2.5" fill="none" stroke-linecap="round"/>');
  if (k.sweat) out.push('<path d="M-26 -116 q-4 7 0 9 q4 -2 0 -9 z M26 -112 q-4 7 0 9 q4 -2 0 -9 z M-28 -92 q-4 7 0 9 q4 -2 0 -9 z" fill="#5ab8f0"/>');

  const hand = { x: front.ex, y: front.ey };
  if (k.item) out.push(k.item(hand.x, hand.y));

  const flip = k.flip ? -1 : 1;
  const ty = k.wy !== undefined ? WATER_Y + k.wy * s : (k.y || 0);
  const tr = `translate(${k.x || 0} ${ty}) scale(${s * flip} ${s}) rotate(${p.lean || 0} 0 -40)${k.rot ? ` rotate(${k.rot} 0 -60)` : ''}`;
  const g = `<g transform="${tr}">${out.join('')}</g>`;
  return k.anim ? `<g class="${k.anim}">${g}</g>` : g;
}

// ---------- Hintergründe ----------
const sky = (dark) => `<rect width="${W}" height="${H}" fill="${dark ? '#7d8ca3' : '#bfe9ff'}"/>`;
const hedge = (y = DECK_Y) => `<path d="M0 ${y} V${y - 22} q20 -14 40 0 q20 -14 40 0 q20 -14 40 0 q20 -14 40 0 q20 -14 40 0 q20 -14 40 0 q20 -14 40 0 q20 -14 40 0 q20 -14 40 0 q20 -14 40 0 V${y} z" fill="#7cc66a"/>`;

function poolBack({ px = 170, floor = 'flat', dark = false } = {}) {
  const tiles = [];
  for (let x = 20; x < px; x += 22) tiles.push(`M${x} ${DECK_Y + 10} V${H}`);
  for (let y = DECK_Y + 32; y < H; y += 24) tiles.push(`M0 ${y} H${px}`);
  const floorPath = floor === 'slope'
    ? `M${px} 240 L${px + 70} 240 L${W} 298 V${H} H${px} z`
    : floor === 'shallow' ? `M${px} 262 H${W} V${H} H${px} z` : `M${px} 288 H${W} V${H} H${px} z`;
  return sky(dark) + hedge() +
    `<rect x="0" y="${DECK_Y}" width="${px}" height="${H - DECK_Y}" fill="#e3e9ee"/>` +
    `<path d="${tiles.join(' ')}" stroke="#cbd5dc" stroke-width="2"/>` +
    `<rect x="0" y="${DECK_Y}" width="${px}" height="10" fill="#b6c6d1"/>` +
    `<rect x="${px}" y="${DECK_Y}" width="${W - px}" height="${H - DECK_Y}" fill="#bfe6f5"/>` +
    `<path d="${floorPath}" fill="#9fd3ea"/>`;
}

function waterFront(x0 = 170, y = WATER_Y, x1 = W) {
  let d = `M${x0} ${y}`;
  for (let x = x0; x < x1; x += 30) d += ` q7.5 -7 15 0 t15 0`;
  d += ` V${H} H${x0} z`;
  return `<path d="${d}" fill="#2aa5dc" opacity=".72"/>` +
    `<path d="M${x0 + 20} ${y + 22} h30 M${x0 + 110} ${y + 40} h40 M${x0 + 60} ${y + 70} h26" stroke="#fff" stroke-width="3" opacity=".5" stroke-linecap="round"/>`;
}

function lakeBack({ dark = false, shore = 150 } = {}) {
  return sky(dark) +
    `<ellipse cx="90" cy="186" rx="150" ry="50" fill="#9ad27f"/><ellipse cx="330" cy="190" rx="140" ry="40" fill="#8cc873"/>` +
    tree(40, 160) + tree(330, 168, 0.8) +
    `<rect x="0" y="${WATER_Y}" width="${W}" height="${H - WATER_Y}" fill="#5fb6d8"/>` +
    `<path d="M0 ${DECK_Y} H${shore} Q${shore + 40} ${DECK_Y + 6} ${shore + 90} ${H} H0 z" fill="#f2d79b"/>`;
}

// ---------- Requisiten ----------
const tree = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-5" y="-10" width="10" height="30" fill="#8a5a2b"/><circle cx="0" cy="-28" r="24" fill="#4fae4a"/><circle cx="-14" cy="-16" r="16" fill="#5cbd55"/><circle cx="14" cy="-16" r="16" fill="#5cbd55"/></g>`;
const sun = (x = 340, y = 50, r = 26, hot = false) => {
  const rays = [];
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    rays.push(`M${(x + Math.cos(a) * (r + 6)).toFixed(1)} ${(y + Math.sin(a) * (r + 6)).toFixed(1)} L${(x + Math.cos(a) * (r + (hot ? 22 : 15))).toFixed(1)} ${(y + Math.sin(a) * (r + (hot ? 22 : 15))).toFixed(1)}`);
  }
  return `<g class="spin-slow" style="transform-origin:${x}px ${y}px"><path d="${rays.join(' ')}" stroke="#ffb400" stroke-width="5" stroke-linecap="round"/></g><circle cx="${x}" cy="${y}" r="${r}" fill="${hot ? '#ff9d00' : '#ffd23f'}"/>`;
};
const cloud = (x, y, s = 1, dark = false) => `<g transform="translate(${x} ${y}) scale(${s})" fill="${dark ? '#56606f' : '#fff'}"><ellipse cx="0" cy="0" rx="34" ry="20"/><ellipse cx="-28" cy="8" rx="24" ry="16"/><ellipse cx="30" cy="8" rx="26" ry="16"/><ellipse cx="2" cy="12" rx="40" ry="14"/></g>`;
const lightning = (x, y) => `<path class="flash" d="M${x} ${y} l-16 38 h14 l-10 34 l30 -46 h-15 l12 -26 z" fill="#ffe14d" stroke="#e0a800" stroke-width="2"/>`;
const rain = (x0, x1, y) => { let d = ''; for (let x = x0; x < x1; x += 22) d += `M${x} ${y + (x % 3) * 8} l-5 12 `; return `<path d="${d}" stroke="#3a6fb0" stroke-width="3" stroke-linecap="round" opacity=".7"/>`; };
const shower = (x) => `<rect x="${x}" y="10" width="8" height="${DECK_Y - 10}" fill="#9aa7b2"/><path d="M${x + 4} 14 h34 v8" stroke="#9aa7b2" stroke-width="7" fill="none"/><ellipse cx="${x + 38}" cy="26" rx="14" ry="6" fill="#7c8a96"/>` +
  `<g class="drip"><path d="M${x + 28} 36 l-3 12 M${x + 38} 38 l0 14 M${x + 48} 36 l3 12 M${x + 26} 58 l-3 12 M${x + 50} 60 l3 12" stroke="#4fb3ea" stroke-width="3.5" stroke-linecap="round"/></g>`;
const puddle = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="26" ry="4" fill="#8fd4f3"/>`;
const speed = (x, y) => `<path d="M${x} ${y} h-30 M${x + 4} ${y + 16} h-38 M${x} ${y + 32} h-26" stroke="#7d8ca3" stroke-width="4" stroke-linecap="round" opacity=".7"/>`;
const ball = (x, y, r = 16) => `<g class="bob"><circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/><path d="M${x - r} ${y} a${r} ${r} 0 0 1 ${r} ${-r} v${r} z" fill="#ff4d4d"/><path d="M${x} ${y} v${r} a${r} ${r} 0 0 0 ${r} ${-r} z" fill="#4c7cf0"/><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#c9d3db" stroke-width="2"/></g>`;
const apple = (x, y) => `<circle cx="${x}" cy="${y}" r="8" fill="#ff4d4d"/><path d="M${x} ${y - 7} q2 -6 6 -7" stroke="#5a3b1e" stroke-width="2" fill="none"/><ellipse cx="${x + 5}" cy="${y - 11}" rx="4" ry="2" fill="#4fae4a"/>`;
const plate = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="26" ry="6" fill="#fff" stroke="#c9d3db" stroke-width="2"/><path d="M${x - 16} ${y - 4} q16 -18 32 0 z" fill="#d9893b"/><rect x="${x - 17}" y="${y - 6}" width="34" height="4" rx="2" fill="#5a9e3a"/><path d="M${x + 22} ${y - 10} l10 -14 M${x + 28} ${y - 6} l12 -10" stroke="#e8b45a" stroke-width="5" stroke-linecap="round"/>`;
const duck = (x, y, s = 1) => `<g class="bob"><g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="22" ry="13" fill="#ffd23f"/><circle cx="14" cy="-14" r="10" fill="#ffd23f"/><path d="M22 -14 l10 3 l-10 3 z" fill="#ff8a3d"/><circle cx="16" cy="-16" r="2" fill="#222"/></g></g>`;
const mattress = (x, y, w = 90) => `<g class="bob"><rect x="${x}" y="${y}" width="${w}" height="14" rx="7" fill="#ff5a5a"/><path d="M${x + 15} ${y + 2} v10 M${x + 35} ${y + 2} v10 M${x + 55} ${y + 2} v10 M${x + 75} ${y + 2} v10" stroke="#ffd0d0" stroke-width="3"/></g>`;
const bubble = (x, y, txt) => `<g class="bob"><path d="M${x - 34} ${y - 22} h68 a10 10 0 0 1 10 10 v24 a10 10 0 0 1 -10 10 h-46 l-12 12 v-12 h-10 a10 10 0 0 1 -10 -10 v-24 a10 10 0 0 1 10 -10 z" fill="#fff" stroke="#3a4a5a" stroke-width="2.5"/><text x="${x}" y="${y + 11}" text-anchor="middle" font-size="28" font-weight="800" fill="#e23b3b" font-family="Arial Rounded MT Bold, Arial, sans-serif">${txt}</text></g>`;
const towelOnFloor = (x, y) => `<rect x="${x}" y="${y - 6}" width="60" height="8" rx="3" fill="#4c7cf0"/>`;
const bin = (x, y) => `<path d="M${x - 18} ${y - 46} h36 l-4 46 h-28 z" fill="#3aa35a"/><rect x="${x - 21}" y="${y - 52}" width="42" height="8" rx="3" fill="#2c8a48"/><path d="M${x - 8} ${y - 38} v30 M${x} ${y - 38} v30 M${x + 8} ${y - 38} v30" stroke="#2c8a48" stroke-width="3"/>`;
const paper = (x, y) => `<path d="M${x - 9} ${y} l3 -10 l7 3 l6 -6 l5 8 l-3 5 z" fill="#fff" stroke="#9aa7b2" stroke-width="1.5"/>`;
const boat = (x, y) => `<g class="bob"><path d="M${x - 50} ${y} h100 l-16 22 h-68 z" fill="#b5562b"/><rect x="${x - 2}" y="${y - 70}" width="4" height="70" fill="#5a3b1e"/><path d="M${x + 4} ${y - 66} l40 56 h-40 z" fill="#fff"/><path d="M${x - 4} ${y - 56} l-30 48 h30 z" fill="#ffd23f"/></g>`;
const buoyLine = (x0, x1, y) => { let s = `<path d="M${x0} ${y} H${x1}" stroke="#fff" stroke-width="2"/>`; for (let x = x0; x <= x1; x += 26) s += `<circle cx="${x}" cy="${y}" r="7" fill="${(x / 26) % 2 < 1 ? '#ff4d4d' : '#fff'}" stroke="#d83a3a" stroke-width="1.5"/>`; return `<g class="bob">${s}</g>`; };
const reeds = (x0, x1, top) => { let d = ''; for (let x = x0; x < x1; x += 9) d += `M${x} ${H} Q${x + 6} ${top + 40} ${x + ((x % 2) ? 8 : -6)} ${top + (x % 4) * 6} `; return `<path d="${d}" stroke="#4f8f3a" stroke-width="4" fill="none" stroke-linecap="round"/>` + `<path d="${d.replace(/M(\d+)/g, (m, n) => `M${Number(n) + 4}`)}" stroke="#6fb04f" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>`; };
const rock = (x, y) => `<path d="M${x - 40} ${y} q6 -30 30 -34 q24 -6 40 14 q14 14 6 20 z" fill="#7d7d86"/><path d="M${x - 20} ${y - 22} q10 -6 20 -4" stroke="#a0a0aa" stroke-width="4" fill="none" stroke-linecap="round"/>`;
const greenFlag = (x, y) => `<rect x="${x}" y="${y - 70}" width="5" height="70" fill="#8a5a2b"/><path class="wave-flag" d="M${x + 5} ${y - 70} h34 l-8 12 l8 12 h-34 z" fill="#2fbf5b"/>`;
const sunCream = (x, y) => `<rect x="${x - 5}" y="${y - 20}" width="11" height="22" rx="3" fill="#fff" stroke="#ff8a3d" stroke-width="2"/><rect x="${x - 3}" y="${y - 25}" width="7" height="6" fill="#ff8a3d"/>`;
const currentArrows = (y) => `<g class="flow"><path d="M190 ${y} h50 l-10 -8 M190 ${y} h50 l-10 8 M260 ${y + 40} h50 l-10 -8 M260 ${y + 40} h50 l-10 8 M210 ${y + 80} h50 l-10 -8 M210 ${y + 80} h50 l-10 8" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".85"/></g>`;
const helpSwimmer = (x) => kid('kind', { x, wy: 62, pose: 'help', mood: 'scared', anim: 'shake' });

// ---------- Szenen ----------
// Reihenfolge entspricht RULES[*].scenes in rules.js
const SCENES = {
  essen: [
    () => poolBack() + sun() + plate(50, DECK_Y - 2) + kid('ben', { x: 140, y: DECK_Y, pose: 'jump', belly: true, mood: 'laugh', rot: 10 }) + waterFront(),
    () => poolBack() + sun() + towelOnFloor(30, DECK_Y) + kid('mia', { x: 70, y: DECK_Y, pose: 'hold', item: (x, y) => apple(x + 2, y - 4) }) + waterFront(),
  ],
  duschen: [
    () => poolBack() + shower(42) + kid('lina', { x: 80, y: DECK_Y, s: 1.15, pose: 'wave', mood: 'laugh' }) + waterFront(),
    () => poolBack() + sun(330, 50, 30, true) + kid('tom', { x: 140, y: DECK_Y, pose: 'jump', sweat: true, mood: 'laugh', rot: 12 }) + waterFront(),
  ],
  rennen: [
    () => poolBack() + puddle(70, DECK_Y + 1) + puddle(150, DECK_Y + 1) + speed(70, DECK_Y - 90) + kid('emil', { x: 110, y: DECK_Y, pose: 'run', mood: 'laugh', anim: 'bob-fast' }) + waterFront(),
    () => poolBack() + puddle(70, DECK_Y + 1) + kid('lea', { x: 100, y: DECK_Y, pose: 'walk' }) + waterFront(),
  ],
  schubsen: [
    () => poolBack() + kid('ben', { x: 100, y: DECK_Y, pose: 'push', mood: 'laugh' }) + kid('mia', { x: 168, y: DECK_Y + 4, pose: 'fall', mood: 'scared', flip: true }) + waterFront(),
    () => poolBack() + kid('ben', { x: 60, y: DECK_Y, pose: 'ball', mood: 'laugh' }) + ball(110, 70) + kid('mia', { x: 150, y: DECK_Y, pose: 'ball', mood: 'laugh', flip: true }) + waterFront(),
  ],
  springen: [
    () => poolBack() + kid('lina', { x: 150, y: 150, s: 1.15, pose: 'jump', mood: 'laugh', rot: 15 }) + kid('kind', { x: 228, wy: 72, pose: 'swim', mood: 'scared' }) + waterFront(),
    () => poolBack() + kid('tom', { x: 130, y: DECK_Y, pose: 'point', mood: 'happy' }) + waterFront(),
  ],
  tiefe: [
    () => poolBack({ floor: 'shallow' }) + kid('emil', { x: 260, y: 262, pose: 'wave', mood: 'laugh' }) + waterFront(),
    () => poolBack({ floor: 'slope' }) + kid('lea', { x: 330, wy: 86, pose: 'help', mood: 'scared', anim: 'shake' }) + waterFront(),
  ],
  hilfe: [
    () => poolBack() + kid('kind', { x: 70, y: DECK_Y, pose: 'run', adult: true, lifeguard: true, suit: '#e23b3b', s: 1.75, mood: 'scared' }) + kid('tom', { x: 270, wy: 62, pose: 'help', mood: 'laugh' }) + bubble(300, 50, 'Hilfe!') + waterFront(),
    () => poolBack() + kid('kind', { x: 50, y: DECK_Y, adult: true, lifeguard: true, suit: '#e23b3b', s: 1.3 }) + kid('mia', { x: 120, y: DECK_Y, pose: 'point', mood: 'scared' }) + helpSwimmer(300) + waterFront(),
  ],
  luftmatratze: [
    () => poolBack({ floor: 'slope' }) + `<g class="drift">${mattress(260, WATER_Y - 10)}${kid('ben', { x: 305, y: WATER_Y - 6, pose: 'help', mood: 'scared', s: 1.1 })}</g>` + waterFront(),
    () => poolBack({ floor: 'shallow' }) + duck(220, WATER_Y) + kid('lina', { x: 280, y: 262, pose: 'wave', mood: 'laugh' }) + waterFront(),
  ],
  frieren: [
    () => poolBack() + cloud(300, 50) + kid('emil', { x: 270, wy: 62, pose: 'hug', cold: true, mood: 'cold', anim: 'shake' }) + waterFront(),
    () => poolBack() + cloud(300, 50) + kid('lea', { x: 90, y: DECK_Y, towel: true, mood: 'happy' }) + waterFront(),
  ],
  gewitter: [
    () => poolBack({ dark: true }) + cloud(280, 46, 1.2, true) + lightning(285, 70) + rain(170, 400, 80) + kid('tom', { x: 280, wy: 66, pose: 'swim', mood: 'happy' }) + waterFront(),
    () => poolBack({ dark: true }) + cloud(280, 46, 1.2, true) + lightning(285, 70) + kid('kind', { x: 50, y: DECK_Y, adult: true, lifeguard: true, suit: '#e23b3b', s: 1.75, whistle: true, pose: 'point' }) + kid('mia', { x: 130, y: DECK_Y, pose: 'walk', flip: true }) + waterFront(),
  ],
  sonne: [
    () => lakeBack() + sun() + kid('ben', { x: 90, y: DECK_Y, hat: true, shirt: true, pose: 'hold', item: (x, y) => sunCream(x + 3, y + 2) }) + waterFront(240),
    () => lakeBack() + sun(330, 50, 32, true) + kid('lina', { x: 90, y: DECK_Y, sunburn: true, mood: 'sad' }) + waterFront(240),
  ],
  allein: [
    () => lakeBack() + kid('tom', { x: 210, y: 228, pose: 'walk' }) + waterFront(180),
    () => lakeBack() + kid('kind', { x: 80, y: DECK_Y, adult: true, suit: '#22b07d', s: 1.75, pose: 'wave', girl: true, style: 'pony', hair: HAIR[2], skin: SKIN[1] }) + kid('mia', { x: 260, y: 262, pose: 'wave', mood: 'laugh' }) + waterFront(180),
  ],
  unbekannt: [
    () => lakeBack() + rock(300, H) + kid('emil', { x: 215, y: 152, s: 1.15, pose: 'jump', mood: 'laugh', rot: 18 }) + waterFront(180),
    () => lakeBack() + greenFlag(130, DECK_Y) + buoyLine(240, 400, WATER_Y + 4) + kid('lea', { x: 230, y: 262, pose: 'wave', mood: 'laugh' }) + waterFront(180),
  ],
  boote: [
    () => lakeBack() + boat(320, WATER_Y - 4) + kid('ben', { x: 250, wy: 66, pose: 'swim', mood: 'happy' }) + waterFront(180),
    () => lakeBack() + `<g transform="translate(345 ${WATER_Y - 4}) scale(.55) translate(-345 ${-(WATER_Y - 4)})">${boat(345, WATER_Y - 4)}</g>` + kid('lina', { x: 210, y: 240, pose: 'wave', mood: 'laugh' }) + waterFront(180),
  ],
  muell: [
    () => poolBack() + paper(60, DECK_Y) + paper(100, DECK_Y) + kid('tom', { x: 130, y: DECK_Y, pose: 'walk', flip: false }) + waterFront(),
    () => poolBack() + bin(50, DECK_Y) + kid('mia', { x: 100, y: DECK_Y, pose: 'hold', flip: true, item: (x, y) => paper(x, y + 4) }) + waterFront(),
  ],
  schilf: [
    () => lakeBack() + kid('emil', { x: 300, wy: 66, pose: 'help', mood: 'scared', anim: 'shake' }) + reeds(250, 400, 120) + waterFront(180),
    () => lakeBack() + sun() + kid('lea', { x: 220, y: 236, pose: 'wave', mood: 'laugh' }) + waterFront(180),
  ],
};

const wrap = (inner, cls = '') => `<svg class="scene ${cls}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" preserveAspectRatio="xMidYMid meet">${inner}</svg>`;

export function sceneSVG(ruleId, i) {
  const fn = SCENES[ruleId] && SCENES[ruleId][i];
  return wrap(fn ? fn() : sky());
}

// ---------- Sepp, das Seepferdchen ----------
export function seppSVG(cls = '') {
  return `<svg class="sepp ${cls}" viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g class="sepp-body">
    <path d="M92 196 C88 236 138 248 142 218 C145 196 118 192 117 210 C116 220 128 222 130 214" stroke="#ff9f1c" stroke-width="20" fill="none" stroke-linecap="round"/>
    <path class="sepp-fin" d="M58 118 q-34 4 -40 30 q22 6 44 -6 z" fill="#ffe08a" stroke="#ffb43b" stroke-width="3"/>
    <ellipse cx="94" cy="140" rx="40" ry="60" transform="rotate(-8 94 140)" fill="#ffb03b"/>
    <ellipse cx="108" cy="148" rx="22" ry="44" transform="rotate(-8 108 148)" fill="#ffe08a"/>
    <path d="M92 116 q16 4 30 0 M90 136 q18 5 34 0 M90 156 q16 5 32 0 M94 176 q12 4 24 0" stroke="#ffc65c" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M60 60 l-14 4 l10 10 l-16 6 l14 8 l-14 10 l16 4 l-10 12 l18 0" fill="#ff8a3d" stroke="#ff8a3d" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="104" cy="66" r="36" fill="#ffb03b"/>
    <path d="M86 32 l4 -16 l10 14 l8 -16 l6 18 l10 -12 l0 18 z" fill="#ff8a3d" stroke="#ff8a3d" stroke-width="3" stroke-linejoin="round"/>
    <rect x="124" y="60" width="50" height="22" rx="11" fill="#ffb03b"/>
    <circle cx="172" cy="71" r="9" fill="#ff9f1c"/>
    <path d="M136 88 q12 8 24 0" stroke="#8c3a12" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <circle cx="112" cy="58" r="14" fill="#fff"/>
    <circle class="sepp-pupil" cx="116" cy="59" r="8" fill="#2a1d14"/>
    <circle cx="119" cy="55" r="3" fill="#fff"/>
    <circle cx="96" cy="80" r="7" fill="#ff7a8a" opacity=".55"/>
  </g>
</svg>`;
}
