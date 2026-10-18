// Builds the downloadable SOS brand kit into public/toolkit/brand/.
// Run: node art-src/toolkit/build.mjs
// - Logo SVGs use outlined text (glyph paths from Archivo, SIL OFL), so they need no font.
// - Palette sheet and social templates are SVG sources in art-src/toolkit/, rendered to PNG
//   with Playwright + Chromium (override with PLAYWRIGHT_MODULE / CHROMIUM_PATH).
// All artwork is original: type, geometric shapes and abstract silhouettes only.
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadFont } from "./ttf-paths.mjs";

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "..", "..", "public", "toolkit", "brand");
for (const d of ["", "logo", "colors", "templates"]) mkdirSync(join(out, d), { recursive: true });

// Brand colors — mirror :root in app/globals.css.
export const COLORS = [
  ["Ink", "#1b1c1a", "Text, dark backgrounds"],
  ["Paper", "#f4f6f1", "Main light background"],
  ["Cream", "#dfe8df", "Soft panels, cards"],
  ["Green", "#0d6844", "Primary brand color, buttons"],
  ["Emerald", "#16845a", "Gradients, highlights"],
  ["Forest", "#063f2c", "Deep backgrounds, footers"],
  ["Acid", "#acd0b9", "Accents on dark green"],
  ["Red", "#a84a42", "Calls to action, emphasis"],
];
const C = Object.fromEntries(COLORS.map(([n, h]) => [n.toLowerCase(), h]));

const sosFont = loadFont(join(here, "fonts", "Archivo-700.ttf"));
const labelFont = loadFont(join(here, "fonts", "Archivo-800.ttf"));
const r1 = n => Math.round(n * 100) / 100;

/* ---------- Logo lock-up (mirrors the site header: "SOS" | STUDENTS / ORGANIZE / FOR SYRIA) ---------- */
// Proportions from the header CSS: SOS 39px, tracking -.08em; gap 11px; 1px rule; 12px padding; label 8px/1.15, weight 800.
function lockup(color, { F = 400, x = 0, y = 0 } = {}) {
  const k = F / 39;
  const capH = sosFont.capHeight() * F;
  const sos = sosFont.textPath("SOS", { x, y: y + capH, size: F, tracking: -0.08 });
  const L = 8 * k, lh = 1.15 * L, labelCap = labelFont.capHeight() * L;
  const mid = y + capH / 2;
  const inkTop = mid - (2 * lh + labelCap) / 2;
  const ruleX = x + sos.width + 11 * k, ruleW = Math.max(1, k);
  const textX = ruleX + ruleW + 12 * k;
  const lines = ["STUDENTS", "ORGANIZE", "FOR SYRIA"].map((t, i) => labelFont.textPath(t, { x: textX, y: inkTop + labelCap + i * lh, size: L }));
  const boxH = 3 * lh;
  const width = textX - x + Math.max(...lines.map(l => l.width));
  const body = `<g fill="${color}"><path d="${sos.d}"/><rect x="${r1(ruleX)}" y="${r1(mid - boxH / 2)}" width="${r1(ruleW)}" height="${r1(boxH)}"/>${lines.map(l => `<path d="${l.d}"/>`).join("")}</g>`;
  return { body, width, height: capH };
}

function logoSvg(color, bgNote) {
  const F = 400, pad = 120; // clear space ≈ half the letter height on every side
  const probe = lockup(color, { F });
  const W = Math.ceil(probe.width + pad * 2), H = Math.ceil(probe.height + pad * 2);
  const { body } = lockup(color, { F, x: pad, y: pad });
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><title>Students Organize For Syria (SOS) logo — ${bgNote}</title>${body}</svg>\n`, W, H };
}

function markSvg() {
  const S = 1000, F = 360;
  const capH = sosFont.capHeight() * F;
  const probe = sosFont.textPath("SOS", { size: F, tracking: -0.08 });
  const sos = sosFont.textPath("SOS", { x: (S - probe.width) / 2, y: (S + capH) / 2, size: F, tracking: -0.08 });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${S}" height="${S}"><title>SOS mark — profile picture</title><rect width="${S}" height="${S}" fill="${C.green}"/><path d="${sos.d}" fill="${C.paper}"/></svg>\n`;
}

/* ---------- Shared poster pieces ---------- */
const fontCss = `<style>
  @font-face{font-family:"Archivo";font-weight:700;src:url(fonts/Archivo-700.ttf)}
  @font-face{font-family:"Archivo";font-weight:800;src:url(fonts/Archivo-800.ttf)}
  @font-face{font-family:"Archivo";font-weight:900;src:url(fonts/Archivo-900.ttf)}
  @font-face{font-family:"Archivo Black";src:url(fonts/ArchivoBlack.ttf)}
  .wood{font-family:"Archivo Black",sans-serif;text-transform:uppercase}
  .body{font-family:"Archivo",sans-serif;font-weight:800}
  .label{font-family:"Archivo",sans-serif;font-weight:800;text-transform:uppercase;letter-spacing:.16em}
</style>`;
const defs = `<defs>
  <filter id="ink" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="2" seed="4" result="n1"/>
    <feColorMatrix in="n1" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -9 0 0 0 7.3" result="g1"/>
    <feComponentTransfer in="g1" result="grain"><feFuncA type="linear" slope=".7" intercept=".3"/></feComponentTransfer>
    <feComposite in="SourceGraphic" in2="grain" operator="in"/>
  </filter>
  ${Object.entries(C).map(([n, h]) => `<pattern id="dots-${n}" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="5" cy="5" r="2.6" fill="${h}"/></pattern>`).join("")}
</defs>`;

function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const figure = (x, y, s) => `<circle cx="${r1(x)}" cy="${r1(y - 78 * s)}" r="${r1(27 * s)}"/><path d="M${r1(x - 48 * s)} ${r1(y + 70 * s)}V${r1(y - 10 * s)}Q${r1(x - 48 * s)} ${r1(y - 42 * s)} ${r1(x - 16 * s)} ${r1(y - 42 * s)}H${r1(x + 16 * s)}Q${r1(x + 48 * s)} ${r1(y - 42 * s)} ${r1(x + 48 * s)} ${r1(y - 10 * s)}V${r1(y + 70 * s)}Z"/>`;
function crowd(y, w, s, gap, seed, offset = 0) { const r = rng(seed); let o = ""; for (let x = -30 + offset; x < w + 60; x += gap * s) o += figure(x + r() * 12 - 6, y + r() * 14 - 7, s * (.92 + r() * .16)); return o; }
function torn(x, y, w, h, seed, jag = 8) {
  const r = rng(seed), top = [], bot = [];
  for (let i = 0; i <= w; i += 16) top.push(`${r1(x + i)},${r1(y + r() * jag)}`);
  for (let i = w; i >= 0; i -= 16) bot.push(`${r1(x + i)},${r1(y + h - r() * jag)}`);
  return [...top, ...bot].join(" ");
}
const sparkle = (x, y, r, fill) => `<path d="M${x} ${y - r}Q${x + r * .14} ${y - r * .14} ${x + r} ${y}Q${x + r * .14} ${y + r * .14} ${x} ${y + r}Q${x - r * .14} ${y + r * .14} ${x - r} ${y}Q${x - r * .14} ${y - r * .14} ${x} ${y - r}Z" fill="${fill}"/>`;
const placed = (color, x, y, F) => lockup(color, { F, x, y }).body;
const page = (W, H, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${fontCss}${defs}${body}</svg>\n`;

/* ---------- Template 1: event announcement (forest) ---------- */
function eventTemplate(H, blank = false) {
  const ph = s => blank ? "" : s; // placeholder text is left out of the blank versions
  const W = 1080, story = H > W, t = story ? 520 : 330;
  let rays = "";
  for (let i = 0; i < 14; i++) { const a = (100 + i * 12) * Math.PI / 180; rays += `<line x1="${r1(930 + 260 * Math.cos(a))}" y1="${r1(150 + 260 * Math.sin(a))}" x2="${r1(930 + 700 * Math.cos(a))}" y2="${r1(150 + 700 * Math.sin(a))}"/>`; }
  const detailsY = story ? 1180 : 690;
  return page(W, H, `
  <rect width="${W}" height="${H}" fill="${C.forest}"/>
  <g stroke="${C.green}" stroke-width="6">${rays}</g>
  <circle cx="930" cy="150" r="240" fill="${C.acid}"/><circle cx="930" cy="150" r="240" fill="url(#dots-emerald)" opacity=".35"/>
  ${placed(C.paper, 70, 72, 56)}
  ${sparkle(150, t - 70, 26, C.red)}
  <rect x="70" y="${t - 30}" width="210" height="46" rx="23" fill="${C.red}"/>
  <text class="label" x="175" y="${t + 1}" font-size="18" text-anchor="middle" fill="${C.paper}">EVENT</text>
  ${ph(`<g filter="url(#ink)">
    <text class="wood" x="66" y="${t + 150}" font-size="${story ? 150 : 128}" textLength="${story ? 900 : 860}" lengthAdjust="spacingAndGlyphs" fill="${C.paper}">EVENT TITLE</text>
    <text class="wood" x="66" y="${t + (story ? 300 : 270)}" font-size="${story ? 150 : 128}" textLength="${story ? 900 : 860}" lengthAdjust="spacingAndGlyphs" fill="${C.acid}">GOES HERE</text>
  </g>`)}
  <rect x="70" y="${detailsY - 40}" width="940" height="4" fill="${C.acid}"/>
  ${ph(`<g class="body" font-size="${story ? 44 : 36}" fill="${C.paper}">
    <text x="70" y="${detailsY + 20}">DAY, DATE · TIME</text>
    <text x="70" y="${detailsY + (story ? 90 : 75)}">LOCATION / ROOM</text>
    <text x="70" y="${detailsY + (story ? 160 : 130)}" fill="${C.acid}">RSVP LINK OR @HANDLE</text>
  </g>`)}
  <g fill="url(#dots-emerald)">${crowd(H - 150, W, .7, 100, 3)}</g>
  <g fill="${C.green}">${crowd(H - 60, W, .9, 104, 9, 40)}</g>
  <rect y="${H - 40}" width="${W}" height="40" fill="${C.green}"/>`);
}

/* ---------- Template 2: chapter meeting (paper) ---------- */
function meetingTemplate(H, blank = false) {
  const ph = s => blank ? "" : s;
  const W = 1080, story = H > W, top = story ? 420 : 190;
  const ring = (cx, cy, rad, n, rr) => { let o = ""; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; o += `<circle cx="${r1(cx + rad * Math.cos(a))}" cy="${r1(cy + rad * Math.sin(a))}" r="${rr}"/>`; } return o; };
  const rowY = story ? 1340 : 700, gap = story ? 160 : 105;
  const row = (i, k, v) => `<text class="label" x="70" y="${rowY + i * gap}" font-size="20" fill="${C.green}">${k}</text>${ph(`<text class="body" x="300" y="${rowY + i * gap + 4}" font-size="${story ? 40 : 34}" fill="${C.ink}">${v}</text>`)}<rect x="70" y="${rowY + i * gap + 34}" width="940" height="2" fill="${C.ink}" opacity=".25"/>`;
  return page(W, H, `
  <rect width="${W}" height="${H}" fill="${C.paper}"/>
  ${placed(C.ink, 70, 72, 56)}
  <g transform="translate(${story ? 880 : 880} ${story ? 290 : 330})"><circle r="${story ? 95 : 80}" fill="${C.red}"/><g fill="${C.forest}">${ring(0, 0, story ? 140 : 120, 12, story ? 18 : 15)}</g></g>
  <polygon points="${torn(50, top, 620, 92, 7)}" fill="${C.red}" transform="rotate(-2 360 ${top + 46})"/>
  <text class="wood" x="80" y="${top + 66}" font-size="52" textLength="560" lengthAdjust="spacingAndGlyphs" fill="${C.paper}" transform="rotate(-2 360 ${top + 46})">CHAPTER MEETING</text>
  ${ph(`<g filter="url(#ink)">
    <text class="wood" x="66" y="${top + (story ? 330 : 250)}" font-size="${story ? 150 : 118}" fill="${C.ink}">CAMPUS</text>
    <text class="wood" x="66" y="${top + (story ? 470 : 370)}" font-size="${story ? 150 : 118}" fill="${C.green}">NAME SOS</text>
  </g>`)}
  ${row(0, "When", "Day, date · time")}${row(1, "Where", "Building, room")}${row(2, "Agenda", "One line on what we’ll do")}
  <rect y="${H - 70}" width="${W}" height="70" fill="${C.forest}"/>
  <text class="label" x="70" y="${H - 28}" font-size="18" fill="${C.acid}">Students Organize For Syria</text>
  <text class="label" x="1010" y="${H - 28}" font-size="18" text-anchor="end" fill="${C.paper}">${ph("@YOURCHAPTER")}</text>`);
}

/* ---------- Template 3: statement / quote (red) ---------- */
function statementTemplate(H, blank = false) {
  const ph = s => blank ? "" : s;
  const W = 1080, story = H > W, qTop = story ? 820 : 330, fs = story ? 64 : 54, lh = fs * 1.18;
  const quote = ["Your statement or quote", "goes here. Keep it short,", "clear, and true to", "the source."];
  return page(W, H, `
  <rect width="${W}" height="${H}" fill="${C.red}"/>
  ${placed(C.paper, 70, 72, 56)}
  ${sparkle(980, 110, 30, C.acid)}
  <g filter="url(#ink)"><text class="wood" x="56" y="${qTop}" font-size="${story ? 340 : 250}" fill="${C.acid}">“</text></g>
  ${ph(`<g class="body" font-size="${fs}" fill="${C.paper}">${quote.map((l, i) => `<text x="70" y="${qTop + 40 + i * lh}">${l}</text>`).join("")}</g>`)}
  <rect x="70" y="${qTop + 40 + quote.length * lh}" width="120" height="6" fill="${C.acid}"/>
  <text class="label" x="70" y="${qTop + 100 + quote.length * lh}" font-size="24" fill="${C.acid}">${ph("— Name, role or chapter")}</text>
  <text class="label" x="70" y="${qTop + 145 + quote.length * lh}" font-size="20" fill="${C.paper}" opacity=".8">${ph("Date")}</text>
  <polygon points="${torn(-20, H - (story ? 260 : 190), 760, 110, 5, 10)}" fill="${C.paper}" transform="rotate(-2 360 ${H - 140})"/>
  <text class="wood" x="60" y="${H - (story ? 183 : 113)}" font-size="58" textLength="600" lengthAdjust="spacingAndGlyphs" fill="${C.ink}" transform="rotate(-2 360 ${H - 140})">OFFICIAL STATEMENT</text>`);
}

/* ---------- Palette sheet ---------- */
function paletteSheet() {
  const W = 2000, H = 1300, cw = 440, ch = 420, gx = 40;
  const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)).join(", ");
  const light = h => ["#f4f6f1", "#dfe8df", "#acd0b9"].includes(h);
  const cards = COLORS.map(([name, hex, use], i) => {
    const x = 80 + (i % 4) * (cw + gx), y = 250 + Math.floor(i / 4) * (ch + 40), fg = light(hex) ? C.ink : C.paper;
    return `<rect x="${x}" y="${y}" width="${cw}" height="${ch}" fill="${hex}" stroke="${C.ink}" stroke-opacity=".15" stroke-width="2"/>
      <text class="wood" x="${x + 30}" y="${y + 80}" font-size="54" fill="${fg}">${name}</text>
      <text class="body" x="${x + 30}" y="${y + ch - 110}" font-size="40" fill="${fg}">${hex.toUpperCase()}</text>
      <text class="label" x="${x + 30}" y="${y + ch - 65}" font-size="18" fill="${fg}">RGB ${rgb(hex)}</text>
      <text class="body" x="${x + 30}" y="${y + ch - 30}" font-size="22" font-weight="700" fill="${fg}" opacity=".85">${use}</text>`;
  }).join("");
  return page(W, H, `
  <rect width="${W}" height="${H}" fill="${C.paper}"/>
  ${placed(C.ink, 80, 70, 60)}
  <text class="wood" x="1920" y="140" font-size="64" text-anchor="end" fill="${C.green}">BRAND COLORS</text>
  ${cards}
  <text class="label" x="80" y="1230" font-size="20" fill="${C.ink}">Type: Archivo + Archivo Black — free under the SIL Open Font License · fonts.google.com/specimen/Archivo</text>`);
}

/* ---------- Write sources ---------- */
const logos = [
  ["sos-logo-dark", C.ink, "dark, for light backgrounds"],
  ["sos-logo-light", C.paper, "light, for dark backgrounds"],
  ["sos-logo-green", C.green, "green, for light backgrounds"],
];
const jobs = [];
for (const [name, color, note] of logos) {
  const { svg, W, H } = logoSvg(color, note);
  writeFileSync(join(out, "logo", `${name}.svg`), svg);
  jobs.push({ src: join(out, "logo", `${name}.svg`), dest: join(out, "logo", `${name}.png`), w: W, h: H, scale: 2000 / W, transparent: true });
}
writeFileSync(join(out, "logo", "sos-mark-green.svg"), markSvg());
jobs.push({ src: join(out, "logo", "sos-mark-green.svg"), dest: join(out, "logo", "sos-mark-green.png"), w: 1000, h: 1000, scale: 1 });

const sources = { "palette.svg": [paletteSheet(), "colors/sos-color-palette.png", 2000, 1300] };
for (const [name, fn] of [["event", eventTemplate], ["meeting", meetingTemplate], ["statement", statementTemplate]]) {
  for (const [kind, h] of [["post", 1080], ["story", 1920]]) {
    sources[`${name}-${kind}.svg`] = [fn(h), `templates/sos-${name}-${kind}.png`, 1080, h];
    sources[`${name}-${kind}-blank.svg`] = [fn(h, true), `templates/sos-${name}-${kind}-blank.png`, 1080, h];
  }
}
for (const [file, [content, dest, w, h]] of Object.entries(sources)) {
  writeFileSync(join(here, file), content);
  jobs.push({ src: join(here, file), dest: join(out, dest), w, h, scale: 1 });
}

/* ---------- Render ---------- */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE ?? "/opt/node22/lib/node_modules/playwright");
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium" });
for (const job of jobs) {
  const pg = await browser.newPage({ viewport: { width: job.w, height: job.h }, deviceScaleFactor: job.scale });
  await pg.goto(pathToFileURL(job.src).href);
  await pg.evaluate(() => document.fonts.ready);
  await pg.waitForTimeout(200);
  await pg.screenshot({ path: job.dest, omitBackground: !!job.transparent, clip: { x: 0, y: 0, width: job.w, height: job.h } });
  await pg.close();
  console.log(`${job.dest.slice(out.length + 1)}  ${Math.round(statSync(job.dest).size / 1024)} KB`);
}
await browser.close();
