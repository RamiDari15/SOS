// Minimal TrueType reader: turns a string into SVG path data using the font's glyph outlines,
// so logo files don't depend on the font being installed. Supports cmap format 4, simple and
// composite (offset-only) glyphs. No kerning: tracking is applied explicitly by the caller.
import { readFileSync } from "node:fs";

export function loadFont(file) {
  const buf = readFileSync(file);
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const tables = {};
  const numTables = dv.getUint16(4);
  for (let i = 0; i < numTables; i++) {
    const o = 12 + i * 16;
    const tag = String.fromCharCode(buf[o], buf[o + 1], buf[o + 2], buf[o + 3]);
    tables[tag] = { offset: dv.getUint32(o + 8), length: dv.getUint32(o + 12) };
  }
  const head = tables.head.offset;
  const unitsPerEm = dv.getUint16(head + 18);
  const longLoca = dv.getInt16(head + 50) === 1;
  const numHMetrics = dv.getUint16(tables.hhea.offset + 34);
  const ascender = dv.getInt16(tables.hhea.offset + 4);
  const numGlyphs = dv.getUint16(tables.maxp.offset + 4);

  // cmap format 4 (Windows Unicode BMP)
  const cmap = tables.cmap.offset;
  let sub = -1;
  for (let i = 0; i < dv.getUint16(cmap + 2); i++) {
    const p = dv.getUint16(cmap + 4 + i * 8), e = dv.getUint16(cmap + 6 + i * 8);
    const off = cmap + dv.getUint32(cmap + 8 + i * 8);
    if (dv.getUint16(off) === 4 && ((p === 3 && e === 1) || p === 0)) { sub = off; break; }
  }
  const segX2 = dv.getUint16(sub + 6), ends = sub + 14, starts = ends + segX2 + 2, deltas = starts + segX2, ranges = deltas + segX2;
  function glyphIndex(code) {
    for (let s = 0; s < segX2; s += 2) {
      const end = dv.getUint16(ends + s);
      if (code > end) continue;
      const start = dv.getUint16(starts + s);
      if (code < start) return 0;
      const delta = dv.getInt16(deltas + s), ro = dv.getUint16(ranges + s);
      if (ro === 0) return (code + delta) & 0xffff;
      const g = dv.getUint16(ranges + s + ro + (code - start) * 2);
      return g ? (g + delta) & 0xffff : 0;
    }
    return 0;
  }
  const advance = g => dv.getUint16(tables.hmtx.offset + 4 * Math.min(g, numHMetrics - 1));
  const loca = g => longLoca ? dv.getUint32(tables.loca.offset + g * 4) : dv.getUint16(tables.loca.offset + g * 2) * 2;

  // Returns contours: arrays of {x, y, on}
  function contours(g) {
    if (g >= numGlyphs) return [];
    const start = loca(g), end = loca(g + 1);
    if (start === end) return [];
    let p = tables.glyf.offset + start;
    const n = dv.getInt16(p);
    if (n < 0) { // composite
      let out = [], flags;
      p += 10;
      do {
        flags = dv.getUint16(p); const gi = dv.getUint16(p + 2); p += 4;
        let dx, dy;
        if (flags & 1) { dx = dv.getInt16(p); dy = dv.getInt16(p + 2); p += 4; } else { dx = dv.getInt8(p); dy = dv.getInt8(p + 1); p += 2; }
        if (flags & 8) p += 2; else if (flags & 0x40) p += 4; else if (flags & 0x80) p += 8;
        out = out.concat(contours(gi).map(c => c.map(pt => ({ ...pt, x: pt.x + dx, y: pt.y + dy }))));
      } while (flags & 0x20);
      return out;
    }
    p += 10;
    const endPts = []; for (let i = 0; i < n; i++) endPts.push(dv.getUint16(p + i * 2));
    p += n * 2;
    p += 2 + dv.getUint16(p);
    const count = n ? endPts[n - 1] + 1 : 0;
    const fl = [];
    while (fl.length < count) { const f = buf[p++]; fl.push(f); if (f & 8) { let r = buf[p++]; while (r--) fl.push(f); } }
    const xs = [], ys = [];
    let v = 0;
    for (const f of fl) { if (f & 2) { const d = buf[p++]; v += f & 16 ? d : -d; } else if (!(f & 16)) { v += dv.getInt16(p); p += 2; } xs.push(v); }
    v = 0;
    for (const f of fl) { if (f & 4) { const d = buf[p++]; v += f & 32 ? d : -d; } else if (!(f & 32)) { v += dv.getInt16(p); p += 2; } ys.push(v); }
    const out = []; let s = 0;
    for (const e of endPts) { const c = []; for (let i = s; i <= e; i++) c.push({ x: xs[i], y: ys[i], on: !!(fl[i] & 1) }); out.push(c); s = e + 1; }
    return out;
  }

  function contourPath(c, tx, ty) {
    if (!c.length) return "";
    const pts = c.map(pt => ({ x: tx(pt.x), y: ty(pt.y), on: pt.on }));
    // Start on an on-curve point (or the midpoint of two off-curve points).
    let startIdx = pts.findIndex(q => q.on);
    let start;
    if (startIdx < 0) { start = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2, on: true }; startIdx = 0; pts.splice(1, 0, start); startIdx = 1; }
    const ring = pts.slice(startIdx).concat(pts.slice(0, startIdx));
    const r = n => Math.round(n * 100) / 100;
    let d = `M${r(ring[0].x)} ${r(ring[0].y)}`;
    let ctrl = null;
    for (let i = 1; i <= ring.length; i++) {
      const q = ring[i % ring.length];
      if (q.on) { d += ctrl ? `Q${r(ctrl.x)} ${r(ctrl.y)} ${r(q.x)} ${r(q.y)}` : `L${r(q.x)} ${r(q.y)}`; ctrl = null; }
      else if (ctrl) { const mx = (ctrl.x + q.x) / 2, my = (ctrl.y + q.y) / 2; d += `Q${r(ctrl.x)} ${r(ctrl.y)} ${r(mx)} ${r(my)}`; ctrl = q; }
      else ctrl = q;
    }
    return d + "Z";
  }

  /** Path data for `text` with its baseline at (x, y), at `size` px, with `tracking` in em. Returns { d, width }. */
  function textPath(text, { x = 0, y = 0, size = 100, tracking = 0 } = {}) {
    const s = size / unitsPerEm;
    let pen = x, d = "";
    const chars = [...text];
    chars.forEach((ch, i) => {
      const g = glyphIndex(ch.codePointAt(0));
      const ox = pen;
      d += contours(g).map(c => contourPath(c, gx => ox + gx * s, gy => y - gy * s)).join("");
      pen += advance(g) * s + (i < chars.length - 1 ? tracking * size : 0);
    });
    return { d, width: pen - x };
  }

  /** Ink bounds of glyph outlines, in em, for vertical alignment. */
  function capHeight() {
    const pts = contours(glyphIndex(72)).flat(); // "H"
    return Math.max(...pts.map(q => q.y)) / unitsPerEm;
  }

  return { unitsPerEm, ascender, textPath, capHeight };
}
