// Generates the original SOS poster artwork as standalone SVG files in art-src/.
// Run: node art-src/compose.mjs && node art-src/render.mjs
// Everything here is drawn from scratch: woodtype lettering (Archivo, SIL OFL),
// geometric shapes, and procedural ink grain. No photos, people, or third-party imagery.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

const C = {
  ink: "#1b1c1a", paper: "#f4f6f1", cream: "#dfe8df", warm: "#ece6d6", green: "#0d6844",
  emerald: "#16845a", forest: "#063f2c", acid: "#acd0b9", red: "#a84a42",
};

// Seeded PRNG so every render is identical.
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
const f = n => Math.round(n * 10) / 10;

function defs(seed = 3) {
  return `<style>
    @font-face{font-family:"Archivo";font-weight:100 900;src:url(fonts/Archivo.woff2) format("woff2")}
    @font-face{font-family:"Archivo Black";src:url(fonts/ArchivoBlack.woff2) format("woff2")}
    .wood{font-family:"Archivo Black","Archivo",sans-serif;text-transform:uppercase}
    .label{font-family:"Archivo",sans-serif;font-weight:800;text-transform:uppercase;letter-spacing:.16em}
  </style>
  <defs>
    <!-- Letterpress ink: sparse specks + soft vertical pressure, applied to printed layers. -->
    <filter id="ink" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="2" seed="${seed}" result="n1"/>
      <feColorMatrix in="n1" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -9 0 0 0 7.1" result="g1"/>
      <feComponentTransfer in="g1" result="grain"><feFuncA type="linear" slope=".75" intercept=".25"/></feComponentTransfer>
      <feTurbulence type="fractalNoise" baseFrequency=".035 .004" numOctaves="3" seed="${seed + 8}" result="n2"/>
      <feColorMatrix in="n2" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1.2 0 0 0 1.5" result="w1"/>
      <feComponentTransfer in="w1" result="wear"><feFuncA type="linear" slope=".2" intercept=".8"/></feComponentTransfer>
      <feComposite in="grain" in2="wear" operator="arithmetic" k1="1" result="mask"/>
      <feComposite in="SourceGraphic" in2="mask" operator="in"/>
    </filter>
    <!-- Paper tooth: faint mottling over the whole sheet. -->
    <filter id="tooth" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".012" numOctaves="3" seed="${seed + 21}"/>
      <feColorMatrix values="0 0 0 0 .1  0 0 0 0 .1  0 0 0 0 .09  0 0 0 -1.4 .8"/>
    </filter>
    ${Object.entries({ ...C, shade: "#933f38" }).map(([name, col]) => `
    <pattern id="dots-l-${name}" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="4.5" cy="4.5" r="2.2" fill="${col}"/></pattern>
    <pattern id="dots-m-${name}" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="4.5" cy="4.5" r="3.3" fill="${col}"/></pattern>
    <pattern id="lines-${name}" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)"><rect width="10" height="3.2" fill="${col}"/></pattern>`).join("")}
  </defs>`;
}

const tooth = (w, h, o = .14) => `<rect width="${w}" height="${h}" filter="url(#tooth)" opacity="${o}"/>`;

function svg(w, h, body, seed) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${defs(seed)}${body}</svg>\n`;
}

// Four-point sparkle star.
const sparkle = (x, y, r, fill) => `<path d="M${x} ${y - r}C${x + r * .14} ${y - r * .14} ${x + r * .14} ${y - r * .14} ${x + r} ${y}C${x + r * .14} ${y + r * .14} ${x + r * .14} ${y + r * .14} ${x} ${y + r}C${x - r * .14} ${y + r * .14} ${x - r * .14} ${y + r * .14} ${x - r} ${y}C${x - r * .14} ${y - r * .14} ${x - r * .14} ${y - r * .14} ${x} ${y - r}Z" fill="${fill}"/>`;

// Five-point star.
function star5(x, y, r, fill, rot = -90) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = (rot + i * 36) * Math.PI / 180, rr = i % 2 ? r * .42 : r;
    pts.push(`${f(x + rr * Math.cos(a))},${f(y + rr * Math.sin(a))}`);
  }
  return `<polygon points="${pts.join(" ")}" fill="${fill}"/>`;
}

// Abstract figure: round head + shoulder arch. Not a depiction of anyone.
const figure = (x, y, s) => `<circle cx="${f(x)}" cy="${f(y - 78 * s)}" r="${f(27 * s)}"/><path d="M${f(x - 48 * s)} ${f(y + 60 * s)}V${f(y - 10 * s)}Q${f(x - 48 * s)} ${f(y - 42 * s)} ${f(x - 16 * s)} ${f(y - 42 * s)}H${f(x + 16 * s)}Q${f(x + 48 * s)} ${f(y - 42 * s)} ${f(x + 48 * s)} ${f(y - 10 * s)}V${f(y + 60 * s)}Z"/>`;

function crowd({ y, w, s, gap, offset = 0, seed = 1 }) {
  const r = rng(seed); let out = "";
  for (let x = -40 + offset; x < w + 60; x += gap * s) out += figure(x + r() * 14 - 7, y + r() * 16 - 8, s * (.92 + r() * .16));
  return out;
}

// Torn paper strip polygon.
function torn(x, y, w, h, seed, jag = 9) {
  const r = rng(seed); const top = [], bottom = [];
  for (let i = 0; i <= w; i += 18) top.push(`${f(x + i)},${f(y + r() * jag)}`);
  for (let i = w; i >= 0; i -= 18) bottom.push(`${f(x + i)},${f(y + h - r() * jag)}`);
  return [...top, ...bottom].join(" ");
}

/* 1. Movement poster — replaces horses.jpg (homepage hero, media gallery). */
function movementPoster() {
  const W = 1000, H = 1500;
  let rays = "";
  for (let i = 0; i < 26; i++) {
    const a = (-180 + i * (180 / 25)) * Math.PI / 180;
    rays += `<line x1="${f(500 + 300 * Math.cos(a))}" y1="${f(640 + 300 * Math.sin(a))}" x2="${f(500 + 900 * Math.cos(a))}" y2="${f(640 + 900 * Math.sin(a))}"/>`;
  }
  const body = `
  <rect width="${W}" height="${H}" fill="${C.paper}"/>
  <g filter="url(#ink)">
    <g stroke="${C.acid}" stroke-width="7">${rays}</g>
    <circle cx="500" cy="640" r="280" fill="${C.acid}"/>
    <circle cx="500" cy="640" r="280" fill="url(#dots-l-emerald)" opacity=".35"/>
    <!-- No wordmark here: this art sits behind the homepage headline. -->
    ${sparkle(150, 520, 46, C.red)}${sparkle(860, 470, 30, C.red)}${sparkle(300, 230, 26, C.forest)}${sparkle(720, 180, 36, C.red)}${sparkle(800, 860, 22, C.forest)}
    <!-- Banners on poles -->
    <g transform="rotate(-5 330 760)">
      <rect x="318" y="700" width="10" height="420" fill="${C.ink}"/><rect x="560" y="690" width="10" height="430" fill="${C.ink}"/>
      <polygon points="${torn(300, 690, 290, 150, 7, 7)}" fill="${C.red}"/>
      <text class="wood" x="445" y="802" text-anchor="middle" font-size="96" textLength="240" lengthAdjust="spacingAndGlyphs" fill="${C.paper}">SOS</text>
    </g>
    <g transform="rotate(6 720 780)">
      <rect x="640" y="760" width="9" height="380" fill="${C.ink}"/>
      <polygon points="${torn(600, 745, 260, 110, 11, 6)}" fill="${C.ink}"/>
      <text class="wood" x="730" y="821" text-anchor="middle" font-size="50" textLength="215" lengthAdjust="spacingAndGlyphs" fill="${C.acid}">TOGETHER</text>
    </g>
    <!-- Crowd as halftone silhouettes, back to front -->
    <g fill="url(#dots-l-emerald)">${crowd({ y: 1010, w: W, s: .72, gap: 92, seed: 4 })}</g>
    <g fill="url(#dots-m-green)">${crowd({ y: 1130, w: W, s: .9, gap: 96, offset: 40, seed: 9 })}</g>
    <g fill="${C.forest}">${crowd({ y: 1290, w: W, s: 1.15, gap: 100, offset: 10, seed: 15 })}</g>
    <rect y="1340" width="${W}" height="160" fill="${C.forest}"/>
  </g>
  ${tooth(W, H)}`;
  return svg(W, H, body, 3);
}

/* 2. Voices poster — replaces art-speaks.jpg (media gallery). */
function voicesPoster() {
  const W = 1000, H = 1500;
  let arcs = "";
  for (let i = 1; i <= 6; i++) arcs += `<path d="M${640 + i * 52} ${560 - i * 70}Q${700 + i * 80} 700 ${640 + i * 52} ${840 + i * 70}" fill="none" stroke="${i % 2 ? C.acid : C.paper}" stroke-width="${14 - i}" stroke-linecap="round"/>`;
  const body = `
  <rect width="${W}" height="${H}" fill="${C.red}"/>
  <g filter="url(#ink)">
    <rect x="0" y="560" width="${W}" height="440" fill="url(#dots-l-shade)"/>
    <!-- Megaphone: plain geometric shapes -->
    <g transform="rotate(-12 420 700)">
      <polygon points="260,640 600,520 600,880 260,760" fill="${C.ink}"/>
      <rect x="180" y="640" width="90" height="120" rx="14" fill="${C.ink}"/>
      <rect x="230" y="760" width="40" height="120" rx="10" fill="${C.ink}"/>
      <ellipse cx="600" cy="700" rx="34" ry="180" fill="${C.paper}"/>
    </g>
    <g transform="rotate(-12 420 700)">${arcs}</g>
    <polygon points="${torn(-20, 120, 1040, 210, 3, 12)}" fill="${C.paper}" transform="rotate(-3 500 220)"/>
    <text class="wood" x="500" y="290" text-anchor="middle" font-size="190" textLength="860" lengthAdjust="spacingAndGlyphs" fill="${C.ink}" transform="rotate(-3 500 220)">OUR VOICE</text>
    <polygon points="${torn(60, 1060, 900, 170, 5, 12)}" fill="${C.ink}" transform="rotate(2 500 1140)"/>
    <text class="wood" x="510" y="1195" text-anchor="middle" font-size="150" textLength="800" lengthAdjust="spacingAndGlyphs" fill="${C.acid}" transform="rotate(2 500 1140)">CARRIES</text>
    <polygon points="${torn(180, 1250, 640, 120, 8, 10)}" fill="${C.paper}" transform="rotate(-2 500 1310)"/>
    <text class="wood" x="500" y="1340" text-anchor="middle" font-size="96" textLength="560" lengthAdjust="spacingAndGlyphs" fill="${C.red}" transform="rotate(-2 500 1310)">FURTHER</text>
    ${sparkle(130, 470, 40, C.paper)}${sparkle(880, 1000, 34, C.acid)}
  </g>
  ${tooth(W, H)}`;
  return svg(W, H, body, 5);
}

/* 3. Olive branch print — replaces dragonfly.jpg (media gallery, chapter-page fallback). */
function oliveBranch() {
  const W = 1000, H = 1500;
  const r = rng(12);
  let leaves = "";
  // Main stem as a gentle curve; leaves alternate along it.
  const stem = t => ({ x: 170 + 660 * t, y: 1020 - 520 * t + 140 * Math.sin(t * Math.PI) * -1 });
  for (let i = 1; i < 15; i++) {
    const t = i / 15, p = stem(t), q = stem(t + .01);
    const ang = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
    const side = i % 2 ? -1 : 1, len = 120 - t * 40 + r() * 20;
    const a = ang + side * (48 + r() * 14);
    leaves += `<g transform="translate(${f(p.x)} ${f(p.y)}) rotate(${f(a)})"><path d="M0 0Q${f(len * .5)} ${f(-len * .2)} ${f(len)} 0Q${f(len * .5)} ${f(len * .2)} 0 0Z" fill="${i % 3 ? C.acid : C.paper}"/><path d="M6 0H${f(len * .82)}" stroke="${C.forest}" stroke-width="3"/></g>`;
    if (i % 4 === 2) leaves += `<ellipse cx="${f(p.x - side * 30)}" cy="${f(p.y + 34)}" rx="15" ry="20" fill="${C.red}"/>`;
  }
  let stemPath = "M";
  for (let i = 0; i <= 40; i++) { const p = stem(i / 40); stemPath += `${f(p.x)} ${f(p.y)} `; }
  const body = `
  <rect width="${W}" height="${H}" fill="${C.warm}"/>
  <g filter="url(#ink)">
    <circle cx="500" cy="720" r="420" fill="${C.forest}"/>
    <circle cx="500" cy="720" r="420" fill="url(#lines-green)" opacity=".5"/>
    <circle cx="500" cy="720" r="455" fill="none" stroke="${C.forest}" stroke-width="4" stroke-dasharray="2 14" stroke-linecap="round"/>
    <path d="${stemPath}" fill="none" stroke="${C.paper}" stroke-width="9" stroke-linecap="round"/>
    ${leaves}
    ${sparkle(250, 420, 34, C.acid)}${sparkle(760, 980, 26, C.acid)}${sparkle(820, 300, 44, C.red)}
    <text class="label" x="500" y="1290" text-anchor="middle" font-size="30" fill="${C.forest}">Rooted in memory</text>
    <text class="wood" x="500" y="1395" text-anchor="middle" font-size="96" textLength="640" lengthAdjust="spacingAndGlyphs" fill="${C.red}">GROWING FORWARD</text>
  </g>
  ${tooth(W, H)}`;
  return svg(W, H, body, 7);
}

/* 4. Gathering plan — replaces editorial-plan.jpg (conferences, media gallery). */
function gatheringPlan() {
  const W = 1000, H = 1500;
  let grid = "";
  for (let x = 40; x < W; x += 40) grid += `<line x1="${x}" y1="0" x2="${x}" y2="${H}"/>`;
  for (let y = 40; y < H; y += 40) grid += `<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`;
  const ring = (cx, cy, rad, n, rr) => { let o = ""; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; o += `<circle cx="${f(cx + rad * Math.cos(a))}" cy="${f(cy + rad * Math.sin(a))}" r="${rr}"/>`; } return o; };
  let rows = "";
  for (let rI = 0; rI < 5; rI++) for (let c = 0; c < 9; c++) rows += `<rect x="${250 + c * 56}" y="${1040 + rI * 50}" width="34" height="26" rx="5"/>`;
  const body = `
  <rect width="${W}" height="${H}" fill="${C.warm}"/>
  <g stroke="${C.red}" stroke-opacity=".18" stroke-width="1.5">${grid}</g>
  <g filter="url(#ink)">
    <rect x="90" y="140" width="820" height="1240" fill="none" stroke="${C.red}" stroke-width="10"/>
    <path d="M90 780H330M670 780H910" stroke="${C.red}" stroke-width="6"/>
    <path d="M440 1380v-60M560 1380v-60" stroke="${C.warm}" stroke-width="14"/>
    <!-- Round tables -->
    <g fill="${C.red}">
      <circle cx="300" cy="440" r="80"/><circle cx="700" cy="440" r="80"/><circle cx="500" cy="640" r="70"/>
    </g>
    <g fill="${C.forest}">${ring(300, 440, 122, 12, 15)}${ring(700, 440, 122, 12, 15)}${ring(500, 640, 108, 10, 14)}</g>
    <!-- Stage + rows -->
    <rect x="300" y="900" width="400" height="80" fill="${C.forest}"/>
    <g fill="${C.red}">${rows}</g>
    <!-- Dimension lines + arrows -->
    <g stroke="${C.forest}" stroke-width="3" fill="none"><path d="M90 100H910M90 88v24M910 88v24"/><path d="M50 140V1380M38 140h24M38 1380h24"/><path d="M500 1450V1300" marker-end="url(#a)"/></g>
    <path d="M488 1305l12 -24l12 24z" fill="${C.forest}"/>
    <g class="label" font-size="20" fill="${C.forest}">
      <text x="300" y="447" text-anchor="middle" fill="${C.warm}">CIRCLE A</text>
      <text x="700" y="447" text-anchor="middle" fill="${C.warm}">CIRCLE B</text>
      <text x="500" y="647" text-anchor="middle" fill="${C.warm}">PLAN</text>
      <text x="500" y="947" text-anchor="middle" fill="${C.acid}">STAGE</text>
      <text x="530" y="1440">ENTRY</text>
      <text x="500" y="84" text-anchor="middle">STUDENT GATHERING · LAYOUT 01</text>
    </g>
    ${star5(830, 230, 34, C.forest)}${star5(170, 1300, 24, C.forest, -60)}
    <text class="wood" x="160" y="250" font-size="70" fill="${C.red}">IDEAS</text>
    <text class="wood" x="160" y="315" font-size="70" fill="${C.forest}">GATHER</text>
  </g>
  ${tooth(W, H)}`;
  return svg(W, H, body, 9);
}

/* 5. Archive pattern — replaces archive-frame.jpg (About archive band, media gallery). */
function archivePattern() {
  const W = 1000, H = 1500, S = 125;
  // Repeating eight-point star tile built from two overlapping squares.
  const tile = (x, y) => {
    const c = S / 2, r = S * .34;
    const sq = rot => { const p = []; for (let i = 0; i < 4; i++) { const a = (rot + i * 90) * Math.PI / 180; p.push(`${f(x + c + r * Math.cos(a))},${f(y + c + r * Math.sin(a))}`); } return p.join(" "); };
    return `<polygon points="${sq(0)}"/><polygon points="${sq(45)}"/><circle cx="${x + c}" cy="${y + c}" r="${f(r * .38)}" fill="${C.acid}" stroke="none"/><path d="M${x} ${y + c}H${x + c - r}M${x + c + r} ${y + c}H${x + S}M${x + c} ${y}V${y + c - r}M${x + c} ${y + c + r}V${y + S}" />`;
  };
  let pat = "";
  for (let y = 0; y < H; y += S) for (let x = 0; x < W; x += S) pat += tile(x, y);
  const body = `
  <rect width="${W}" height="${H}" fill="${C.forest}"/>
  <g filter="url(#ink)">
    <g fill="none" stroke="${C.acid}" stroke-width="5" stroke-linejoin="round">${pat}</g>
    <!-- Arched panel -->
    <path d="M230 1290V600Q230 330 500 250Q770 330 770 600V1290Z" fill="${C.warm}"/>
    <path d="M270 1250V610Q270 370 500 300Q730 370 730 610V1250Z" fill="none" stroke="${C.red}" stroke-width="6"/>
    <path d="M300 640V620Q300 400 500 340Q700 400 700 620V640Z" fill="url(#lines-cream)"/>
    ${star5(500, 520, 70, C.red)}
    <text class="wood" x="500" y="760" text-anchor="middle" font-size="120" textLength="360" lengthAdjust="spacingAndGlyphs" fill="${C.forest}">SOS</text>
    <text class="label" x="500" y="820" text-anchor="middle" font-size="22" fill="${C.forest}">Archive</text>
    <path d="M330 880H670" stroke="${C.forest}" stroke-width="4"/>
    <text class="wood" x="500" y="960" text-anchor="middle" font-size="62" textLength="340" lengthAdjust="spacingAndGlyphs" fill="${C.red}">ROOTED IN</text>
    <text class="wood" x="500" y="1035" text-anchor="middle" font-size="62" textLength="340" lengthAdjust="spacingAndGlyphs" fill="${C.red}">HISTORY</text>
    ${sparkle(400, 1130, 22, C.forest)}${sparkle(500, 1150, 30, C.forest)}${sparkle(600, 1130, 22, C.forest)}
  </g>
  ${tooth(W, H)}`;
  return svg(W, H, body, 11);
}

/* 6. Window print — replaces paint-window.jpg (campaign card texture, media gallery). */
function windowPrint() {
  const W = 1000, H = 1500;
  const r = rng(21);
  let strokes = "";
  const colors = [C.emerald, C.red, C.acid, C.forest, C.acid, C.red];
  for (let i = 0; i < 9; i++) {
    const y = 180 + i * 140 + r() * 40, x0 = -40 + r() * 120, x1 = 760 + r() * 280, bend = r() * 120 - 60;
    strokes += `<path d="M${f(x0)} ${f(y)}Q${f((x0 + x1) / 2)} ${f(y + bend)} ${f(x1)} ${f(y - bend * .4)}" stroke="${colors[i % colors.length]}" stroke-width="${f(60 + r() * 50)}" stroke-linecap="round" fill="none" opacity=".88"/>`;
    if (i % 3 === 1) strokes += `<rect x="${f(x0 + 160 + r() * 300)}" y="${f(y + 20)}" width="14" height="${f(80 + r() * 140)}" rx="7" fill="${colors[i % colors.length]}" opacity=".85"/>`;
  }
  const body = `
  <rect width="${W}" height="${H}" fill="${C.paper}"/>
  <g filter="url(#ink)">
    ${strokes}
    <!-- Window frame drawn over the paint -->
    <g fill="none" stroke="${C.ink}" stroke-width="22">
      <rect x="120" y="140" width="760" height="1220"/>
      <path d="M500 140V1360M120 547H880M120 954H880"/>
    </g>
    <rect x="80" y="1360" width="840" height="40" fill="${C.ink}"/>
    ${sparkle(310, 350, 50, C.paper)}${sparkle(690, 760, 38, C.paper)}${sparkle(300, 1160, 30, C.paper)}
  </g>
  ${tooth(W, H)}`;
  return svg(W, H, body, 13);
}

/* 7. Social share image (Open Graph, 1200x630). */
function ogImage() {
  const W = 1200, H = 630;
  const body = `
  <rect width="${W}" height="${H}" fill="${C.paper}"/>
  <g><!-- flat print (no grain) keeps the PNG small and crisp in link previews -->
    <circle cx="1010" cy="170" r="250" fill="${C.acid}"/>
    <circle cx="1010" cy="170" r="250" fill="url(#dots-l-emerald)" opacity=".3"/>
    <text class="wood" x="60" y="370" font-size="330" textLength="640" lengthAdjust="spacingAndGlyphs" fill="${C.ink}">SOS</text>
    <text class="wood" x="745" y="270" font-size="58" fill="${C.forest}">STUDENTS</text>
    <text class="wood" x="745" y="335" font-size="58" fill="${C.forest}">ORGANIZE</text>
    <text class="wood" x="745" y="400" font-size="58" fill="${C.green}">FOR SYRIA</text>
    ${sparkle(700, 120, 40, C.red)}
    <g fill="url(#dots-m-emerald)">${crowd({ y: 560, w: W, s: .62, gap: 100, seed: 3 })}</g>
    <g fill="${C.forest}">${crowd({ y: 640, w: W, s: .8, gap: 104, offset: 30, seed: 8 })}</g>
    <rect y="575" width="${W}" height="55" fill="${C.forest}"/>
    <text class="label" x="60" y="611" font-size="22" fill="${C.acid}">Shaping what comes next</text>
    <text class="label" x="1140" y="611" text-anchor="end" font-size="22" fill="${C.paper}">organize4syria.com</text>
  </g>`;
  return svg(W, H, body, 17);
}

const out = {
  "movement-poster.svg": movementPoster(),
  "voices-poster.svg": voicesPoster(),
  "olive-branch.svg": oliveBranch(),
  "gathering-plan.svg": gatheringPlan(),
  "archive-pattern.svg": archivePattern(),
  "window-print.svg": windowPrint(),
  "og.svg": ogImage(),
};
for (const [name, content] of Object.entries(out)) writeFileSync(join(here, name), content);
console.log(`wrote ${Object.keys(out).length} SVGs to ${here}`);
