// Rasterizes the SVGs in art-src/ to optimized images in public/art/ (and public/og.png).
// Run: node art-src/render.mjs
// Needs Playwright + Chromium. Override paths with PLAYWRIGHT_MODULE / CHROMIUM_PATH if yours differ.
// Each SVG is drawn at its native size, then downscaled and encoded by Chromium's canvas
// (JPEG + WebP), so no extra image tooling is needed.
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE ?? "/opt/node22/lib/node_modules/playwright");

// [source svg, output path without extension, native w, native h, output w, output h, formats]
const jobs = [
  ["movement-poster.svg", "public/art/movement-poster", 1000, 1500, 800, 1200, ["jpeg", "webp"]],
  ["voices-poster.svg", "public/art/voices-poster", 1000, 1500, 800, 1200, ["jpeg", "webp"]],
  ["olive-branch.svg", "public/art/olive-branch", 1000, 1500, 800, 1200, ["jpeg", "webp"]],
  ["gathering-plan.svg", "public/art/gathering-plan", 1000, 1500, 800, 1200, ["jpeg", "webp"]],
  ["archive-pattern.svg", "public/art/archive-pattern", 1000, 1500, 800, 1200, ["jpeg", "webp"]],
  ["window-print.svg", "public/art/window-print", 1000, 1500, 800, 1200, ["jpeg", "webp"]],
  ["og.svg", "public/og", 1200, 630, 1200, 630, ["png"]],
];
const QUALITY = { jpeg: .74, webp: .72 };
const EXT = { jpeg: "jpg", webp: "webp", png: "png" };

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ deviceScaleFactor: 1 });
for (const [src, dest, w, h, ow, oh, formats] of jobs) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(pathToFileURL(join(here, src)).href);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  const png = await page.screenshot({ type: "png", clip: { x: 0, y: 0, width: w, height: h } });
  for (const format of formats) {
    let bytes = png;
    if (format !== "png" || ow !== w) {
      const blank = await browser.newPage();
      const dataUrl = await blank.evaluate(async ({ b64, ow, oh, format, q }) => {
        const img = new Image();
        img.src = `data:image/png;base64,${b64}`;
        await img.decode();
        const canvas = document.createElement("canvas");
        canvas.width = ow; canvas.height = oh;
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, ow, oh);
        return canvas.toDataURL(`image/${format}`, q);
      }, { b64: png.toString("base64"), ow, oh, format, q: QUALITY[format] });
      await blank.close();
      bytes = Buffer.from(dataUrl.split(",")[1], "base64");
    }
    const out = join(root, `${dest}.${EXT[format]}`);
    writeFileSync(out, bytes);
    console.log(`${dest}.${EXT[format]}  ${ow}x${oh}  ${Math.round(bytes.length / 1024)} KB`);
  }
}
await browser.close();
