#!/usr/bin/env node
// End-to-end checks for the Students Organize For Syria site, run against a live server.
//   node tests/e2e.mjs http://localhost:4173      (or: npm run test:e2e -- http://localhost:4173)
// Uses the globally installed Playwright. Override with PLAYWRIGHT_MODULE / CHROMIUM_PATH.
// Screenshots (failures and a few key states) go to E2E_OUT, default <os tmpdir>/sos-e2e.
import { createRequire } from "node:module";
import { existsSync, mkdirSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const require = createRequire(import.meta.url);
const BASE = (process.argv[2] || process.env.E2E_BASE_URL || "http://localhost:4173").replace(/\/+$/, "");
const OUT = process.env.E2E_OUT || path.join(os.tmpdir(), "sos-e2e");

function loadPlaywright() {
  for (const candidate of [process.env.PLAYWRIGHT_MODULE, "playwright", "/opt/node22/lib/node_modules/playwright"]) {
    if (!candidate) continue;
    try {
      return require(candidate);
    } catch {
      // try the next location
    }
  }
  throw new Error("Playwright not found. Install it globally or set PLAYWRIGHT_MODULE.");
}
const { chromium } = loadPlaywright();
const executablePath = process.env.CHROMIUM_PATH || (existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);

const PAGES = ["/", "/about", "/our-work", "/campaigns", "/chapters", "/conferences", "/media", "/news", "/newsletter", "/get-involved", "/toolkits", "/donate", "/contact"];

const results = [];
let browser;

async function check(name, fn) {
  const started = Date.now();
  try {
    await fn();
    results.push({ name, ok: true });
    console.log(`  ok   ${name} (${Date.now() - started}ms)`);
  } catch (error) {
    results.push({ name, ok: false, error });
    console.log(`  FAIL ${name}\n       ${String(error?.message ?? error).split("\n").join("\n       ")}`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

/** New page that records console errors and uncaught exceptions. */
async function openPage(viewport = { width: 1400, height: 900 }) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (msg) => {
    // The browser logs every 4xx/5xx and aborted fetch; /api/forms 400/503 responses are expected in these tests.
    if (msg.type() === "error" && !msg.location().url?.includes("/api/forms")) errors.push(`console: ${msg.text()}`);
  });
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
  page.on("response", (res) => {
    const url = res.url();
    if (url.startsWith(BASE) && res.status() >= 400 && !url.includes("/api/forms")) errors.push(`HTTP ${res.status()} ${url}`);
  });
  return { context, page, errors };
}

async function shot(page, name) {
  try {
    mkdirSync(OUT, { recursive: true });
    await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: false });
  } catch {
    // screenshots are best effort
  }
}

async function goto(page, route) {
  const res = await page.goto(BASE + route, { waitUntil: "networkidle" });
  assert(res && res.status() === 200, `${route} returned ${res?.status()}`);
}

async function main() {
  browser = await chromium.launch(executablePath ? { executablePath } : {});
  console.log(`E2E against ${BASE}`);

  // ---------------------------------------------------------------- pages, console, overflow, links
  const internalLinks = new Map(); // url -> first page that links it
  const chapterPages = new Set();

  for (const width of [1400, 375]) {
    for (const route of PAGES) {
      await check(`${route} @${width}px: loads, no console errors, no horizontal scroll`, async () => {
        const { context, page, errors } = await openPage({ width, height: 900 });
        try {
          await goto(page, route);
          await page.waitForTimeout(300);
          const { scrollWidth, clientWidth, offenders } = await page.evaluate(() => {
            const cw = document.documentElement.clientWidth;
            const offenders = [];
            // Elements that stick out past the viewport and are not inside a clipping ancestor.
            for (const el of document.querySelectorAll("body *")) {
              const r = el.getBoundingClientRect();
              if (r.width === 0 || r.right <= cw + 1) continue;
              let clipped = false;
              for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
                const o = getComputedStyle(p).overflowX;
                if (o !== "visible") { clipped = true; break; }
              }
              if (!clipped && getComputedStyle(el).position !== "fixed") offenders.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} right=${Math.round(r.right)}`);
              if (offenders.length > 4) break;
            }
            return { scrollWidth: document.documentElement.scrollWidth, clientWidth: cw, offenders };
          });
          assert(scrollWidth <= clientWidth, `horizontal scroll: scrollWidth ${scrollWidth} > ${clientWidth}`);
          if (width === 375) assert(offenders.length === 0, `content overflows the viewport (hidden only by body clip): ${offenders.join("; ")}`);
          if (width === 1400) {
            const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")));
            for (const href of hrefs) {
              if (!href || /^(mailto:|tel:|https?:\/\/(?!localhost))/i.test(href) || href.startsWith("javascript:")) continue;
              const url = new URL(href, BASE + route);
              if (url.origin !== new URL(BASE).origin) continue;
              const key = url.pathname + url.search + url.hash;
              if (!internalLinks.has(key)) internalLinks.set(key, route);
              if (/^\/chapters\/[^/]+$/.test(url.pathname)) chapterPages.add(url.pathname);
            }
          }
          assert(errors.length === 0, errors.join("\n"));
        } catch (e) {
          await shot(page, `fail-${route.replace(/\W+/g, "_") || "home"}-${width}`);
          throw e;
        } finally {
          await context.close();
        }
      });
    }
  }

  await check(`chapter detail pages (${chapterPages.size}) load without console errors or overflow at 375px`, async () => {
    assert(chapterPages.size >= 25, `expected at least 25 chapter links, found ${chapterPages.size}`);
    const { context, page, errors } = await openPage({ width: 375, height: 800 });
    try {
      for (const route of chapterPages) {
        await goto(page, route);
        const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        assert(over <= 0, `${route}: horizontal scroll by ${over}px`);
        const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")));
        for (const href of hrefs) {
          if (!href || /^(mailto:|tel:|https?:)/i.test(href)) continue;
          const url = new URL(href, BASE + route);
          const key = url.pathname + url.search + url.hash;
          if (!internalLinks.has(key)) internalLinks.set(key, route);
        }
      }
      assert(errors.length === 0, errors.join("\n"));
    } finally {
      await context.close();
    }
  });

  await check("every internal link resolves (no 404s) and every #fragment target exists", async () => {
    const { context, page } = await openPage();
    const htmlCache = new Map();
    const problems = [];
    try {
      for (const [key, from] of internalLinks) {
        const url = new URL(key, BASE);
        const pageKey = url.pathname + url.search;
        if (!htmlCache.has(pageKey)) {
          const res = await page.request.get(BASE + pageKey, { maxRedirects: 5 });
          htmlCache.set(pageKey, { status: res.status(), html: res.status() < 400 && /html/.test(res.headers()["content-type"] ?? "") ? await res.text() : "" });
        }
        const { status, html } = htmlCache.get(pageKey);
        if (status >= 400) problems.push(`${key} -> ${status} (linked from ${from})`);
        else if (url.hash && url.hash.length > 1 && html && !new RegExp(`id="${url.hash.slice(1).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`).test(html)) {
          problems.push(`${key}: no element with id "${url.hash.slice(1)}" (linked from ${from})`);
        }
      }
    } finally {
      await context.close();
    }
    console.log(`       checked ${internalLinks.size} internal links`);
    assert(problems.length === 0, problems.join("\n"));
  });

  // ---------------------------------------------------------------- mobile menu
  await check("mobile menu opens, closes with Escape (focus returns), closes on navigation", async () => {
    const { context, page, errors } = await openPage({ width: 375, height: 800 });
    try {
      await goto(page, "/about");
      const toggle = page.locator("button.menu");
      const nav = page.locator("#site-nav");
      assert((await toggle.getAttribute("aria-expanded")) === "false", "menu starts closed");
      assert(!(await nav.locator("a").first().isVisible()), "nav links hidden while closed");
      await toggle.click();
      assert((await toggle.getAttribute("aria-expanded")) === "true", "aria-expanded true after open");
      await nav.locator("a", { hasText: "Media" }).waitFor({ state: "visible", timeout: 2000 });
      await shot(page, "menu-open-375");
      await page.keyboard.press("Escape");
      assert((await toggle.getAttribute("aria-expanded")) === "false", "Escape closes the menu");
      assert(await toggle.evaluate((el) => el === document.activeElement), "focus returns to the menu button");
      await toggle.click();
      await nav.locator("a", { hasText: "Media" }).click();
      await page.waitForURL(/\/media$/);
      assert((await page.locator("button.menu").getAttribute("aria-expanded")) === "false", "menu closed after navigating");
      await page.goBack({ waitUntil: "networkidle" });
      assert((await page.locator("button.menu").getAttribute("aria-expanded")) === "false", "menu closed after Back");
      // Homepage uses the same header.
      await goto(page, "/");
      await page.locator("button.menu").click();
      await page.keyboard.press("Escape");
      assert((await page.locator("button.menu").getAttribute("aria-expanded")) === "false", "Escape closes the homepage menu");
      assert(errors.length === 0, errors.join("\n"));
    } finally {
      await context.close();
    }
  });

  await check("skip link is the first Tab stop and moves focus to main content", async () => {
    const { context, page } = await openPage();
    try {
      for (const route of ["/", "/about"]) {
        await goto(page, route);
        await page.keyboard.press("Tab");
        const text = await page.evaluate(() => document.activeElement?.textContent?.trim());
        assert(/skip to content/i.test(text ?? ""), `${route}: first Tab stop is "${text}"`);
        await page.keyboard.press("Enter");
        const id = await page.evaluate(() => document.activeElement?.id);
        assert(id === "main-content", `${route}: focus after skip link is "${id}"`);
      }
    } finally {
      await context.close();
    }
  });

  // ---------------------------------------------------------------- chapters directory
  await check("chapter directory: status filter and search", async () => {
    const { context, page, errors } = await openPage();
    try {
      await goto(page, "/chapters");
      const count = async () => ({
        active: await page.locator(".directory .chapter-card.is-active").count(),
        past: await page.locator(".directory .chapter-card.is-past").count(),
      });
      let c = await count();
      assert(c.active === 14 && c.past === 11, `All: expected 14/11, got ${c.active}/${c.past}`);
      const filter = page.locator(".status-filter");
      await filter.getByRole("button", { name: "Active", exact: true }).click();
      c = await count();
      assert(c.active === 14 && c.past === 0, `Active filter: got ${c.active}/${c.past}`);
      assert((await filter.getByRole("button", { name: "Active", exact: true }).getAttribute("aria-pressed")) === "true", "Active button pressed");
      await filter.getByRole("button", { name: "Past", exact: true }).click();
      c = await count();
      assert(c.active === 0 && c.past === 11, `Past filter: got ${c.active}/${c.past}`);
      await filter.getByRole("button", { name: "All", exact: true }).click();

      const search = page.locator('.directory input[type="search"]');
      await search.fill("Chicago");
      const cards = page.locator(".directory .chapter-card");
      const n = await cards.count();
      assert(n > 0 && n < 25, `search "Chicago" should narrow the list, got ${n}`);
      for (const text of await cards.allTextContents()) assert(/chicago/i.test(text), `card without "Chicago" after search: ${text.slice(0, 80)}`);
      await search.fill("zzzz-no-such-campus");
      assert((await cards.count()) === 0, "no cards for nonsense search");
      assert(await page.locator(".directory .empty").isVisible(), "empty-state message shown");
      await search.fill("");
      c = await count();
      assert(c.active + c.past === 25, "clearing the search restores all chapters");
      assert(errors.length === 0, errors.join("\n"));
    } finally {
      await context.close();
    }
  });

  // ---------------------------------------------------------------- get involved
  await check("get-involved: join/start tabs switch forms; ?form=chapter renders the chapter form first", async () => {
    const { context, page, errors } = await openPage();
    try {
      await goto(page, "/get-involved");
      const zone = page.locator("#apply");
      assert(await zone.locator('select[name="role"]').isVisible(), "join form shows the role select");
      await zone.getByRole("button", { name: "Start a chapter" }).click();
      await zone.locator('input[name="phone"]').waitFor({ state: "visible", timeout: 2000 });
      assert((await zone.locator('select[name="role"]').count()) === 0, "role select gone on start form");
      assert((await zone.getByRole("button", { name: "Start a chapter" }).getAttribute("aria-pressed")) === "true", "start tab pressed");
      await zone.getByRole("button", { name: "Join a chapter" }).click();
      await zone.locator('select[name="role"]').waitFor({ state: "visible", timeout: 2000 });

      // First paint: read the server HTML, not the hydrated DOM.
      const html = await (await page.request.get(`${BASE}/get-involved?form=chapter`)).text();
      assert(/name="phone"/.test(html), "?form=chapter is server-rendered with the chapter form");
      const guide = page.locator(".guide-callout a", { hasText: /organizing guide/i });
      const href = await guide.getAttribute("href");
      assert(href?.includes("docs.google.com/document/d/1Dvi09bJSaOUSksVLpYMAYP8v7EqP3DoLh3_c36PnejM/view"), `guide link: ${href}`);
      assert((await guide.getAttribute("target")) === "_blank", "guide link opens a new tab");
      assert(errors.length === 0, errors.join("\n"));
    } finally {
      await context.close();
    }
  });

  // ---------------------------------------------------------------- contact form
  await check("contact form: native validation, server field errors, 503 mailto fallback, success only on 2xx", async () => {
    const { context, page, errors } = await openPage();
    let posts = 0;
    page.on("request", (req) => {
      if (req.url().endsWith("/api/forms") && req.method() === "POST") posts++;
    });
    try {
      await goto(page, "/contact?topic=toolkit");
      const form = page.locator("#contact-form");
      assert((await form.locator('select[name="topic"]').inputValue()) === "Toolkit request", "?topic=toolkit preselects toolkit request");
      await goto(page, "/contact?topic=chapter");
      assert((await form.locator('select[name="topic"]').inputValue()) === "Start or join a chapter", "?topic=chapter preselects chapter");

      // Empty submit: the browser blocks it, nothing is sent.
      await form.getByRole("button", { name: /send message/i }).click();
      await page.waitForTimeout(300);
      assert(posts === 0, "empty form must not be posted");

      // Passes the browser's email check but fails the server's (no TLD) -> 400 with field error.
      await form.locator('input[name="name"]').fill("E2E Tester");
      await form.locator('input[name="email"]').fill("tester@localhost");
      await form.locator('textarea[name="message"]').fill("Testing the contact form.\nSecond line.");
      await form.getByRole("button", { name: /send message/i }).click();
      await form.locator(".field-error").first().waitFor({ timeout: 5000 });
      assert((await form.locator('input[name="email"]').getAttribute("aria-invalid")) === "true", "email marked aria-invalid");
      assert(/valid email/i.test(await form.locator(".field-error").first().innerText()), "email error text");
      assert(await form.locator('input[name="email"]').evaluate((el) => el === document.activeElement), "focus moves to the invalid field");

      // Valid input with no delivery configured -> 503 -> mailto fallback, no success panel.
      await form.locator('input[name="email"]').fill("tester@example.edu");
      await form.getByRole("button", { name: /send message/i }).click();
      const fallback = form.locator(".form-status.is-error a[href^='mailto:']");
      await fallback.waitFor({ timeout: 5000 });
      const mailto = decodeURIComponent((await fallback.getAttribute("href")) ?? "");
      assert(mailto.startsWith("mailto:sos@organize4syria.com?subject="), `mailto target: ${mailto.slice(0, 60)}`);
      assert(/Start or join a chapter/.test(mailto) && /Second line\./.test(mailto) && /tester@example\.edu/.test(mailto), "mailto carries what was typed");
      assert((await page.locator(".form-success").count()) === 0, "no success panel on 503");
      assert((await form.locator(".form-status").getAttribute("aria-live")) === "polite", "status region is aria-live");
      await shot(page, "contact-fallback");

      // Network failure -> fallback too.
      await page.route("**/api/forms", (route) => route.abort());
      await form.getByRole("button", { name: /send message/i }).click();
      await page.waitForTimeout(500);
      assert(await fallback.isVisible(), "fallback shown on network failure");
      await page.unroute("**/api/forms");

      // A 2xx shows the success panel.
      await page.route("**/api/forms", (route) => route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' }));
      await form.getByRole("button", { name: /send message/i }).click();
      await page.locator(".form-success h2", { hasText: /message received/i }).waitFor({ timeout: 5000 });
      await page.unroute("**/api/forms");
      assert(errors.length === 0, errors.join("\n"));
    } finally {
      await context.close();
    }
  });

  // ---------------------------------------------------------------- newsletter + get-involved submit
  await check("newsletter page: real content, consent required, optional school, 503 fallback, success says what happens next", async () => {
    const { context, page, errors } = await openPage({ width: 375, height: 800 });
    try {
      await goto(page, "/newsletter");
      const body = await page.locator("main").innerText();
      assert(!/coming soon/i.test(body) && !/issue 001/i.test(body), "no placeholder copy on /newsletter");
      const cards = page.locator(".newsletter-latest .latest-card");
      assert((await cards.count()) === 3, `expected 3 latest statements, got ${await cards.count()}`);
      for (const href of await cards.evaluateAll((as) => as.map((a) => a.getAttribute("href")))) assert(href === "/media#statements", `latest card href ${href}`);
      assert((await page.locator('a[href="mailto:sos@organize4syria.com?subject=Unsubscribe"]').count()) >= 1, "unsubscribe mailto present");

      const form = page.locator("form.newsletter-form");
      assert((await form.locator('input[name="school"]').getAttribute("required")) === null, "school is optional");
      await form.locator('input[name="email"]').fill("reader@example.edu");
      await form.locator('input[name="firstName"]').fill("Rana");
      await form.locator('input[name="lastName"]').fill("K");
      await form.getByRole("button", { name: /subscribe/i }).click();
      await page.waitForTimeout(300);
      assert((await form.locator(".form-status.is-error").count()) === 0, "unchecked consent blocks the submit");
      await form.locator('input[name="consent"]').check();
      await form.getByRole("button", { name: /subscribe/i }).click();
      const link = form.locator(".form-status.is-error a[href^='mailto:']");
      await link.waitFor({ timeout: 5000 });
      const mailto = decodeURIComponent((await link.getAttribute("href")) ?? "");
      assert(/Newsletter signup/.test(mailto) && /: yes/.test(mailto), `newsletter mailto: ${mailto.slice(0, 160)}`);
      assert(!/School \/ chapter/.test(mailto), "empty optional school is left out of the mailto");

      let posted;
      page.on("request", (req) => {
        if (req.url().endsWith("/api/forms")) posted = req.postDataJSON();
      });
      await form.locator('input[name="school"]').fill("Loyola University Chicago");
      await page.route("**/api/forms", (route) => route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' }));
      await form.getByRole("button", { name: /subscribe/i }).click();
      const success = page.locator(".form-success");
      await success.locator("h2", { hasText: /subscribed, Rana/i }).waitFor({ timeout: 5000 });
      assert(posted?.type === "newsletter" && posted.fields.school === "Loyola University Chicago", "school is posted");
      const text = await success.innerText();
      assert(/reader@example\.edu/.test(text) && /monthly/i.test(text), `success says what happens next: ${text.slice(0, 160)}`);
      await shot(page, "newsletter-success-375");
      assert(errors.length === 0, errors.join("\n"));
    } finally {
      await context.close();
    }
  });

  await check("start-a-chapter form posts type=chapter with every field and shows the fallback", async () => {
    const { context, page, errors } = await openPage();
    try {
      await goto(page, "/get-involved?form=chapter");
      let posted;
      page.on("request", (req) => {
        if (req.url().endsWith("/api/forms")) posted = req.postDataJSON();
      });
      const form = page.locator("#apply form");
      await form.locator('input[name="name"]').fill("Organizer");
      await form.locator('input[name="email"]').fill("organizer@example.edu");
      await form.locator('input[name="school"]').fill("Example University");
      await form.locator('input[name="region"]').fill("Ohio");
      await form.locator('input[name="phone"]').fill("(555) 123-4567");
      await form.locator('textarea[name="why"]').fill("Students are asking for it.");
      await form.getByRole("button", { name: /submit interest/i }).click();
      await form.locator(".form-status.is-error a[href^='mailto:']").waitFor({ timeout: 5000 });
      assert(posted?.type === "chapter", `posted type ${posted?.type}`);
      for (const key of ["name", "email", "school", "region", "phone", "why"]) assert(posted.fields[key], `posted field ${key}`);
      assert(errors.length === 0, errors.join("\n"));
    } finally {
      await context.close();
    }
  });

  await browser.close();
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  if (failed.length) {
    console.log(`Failed:\n${failed.map((f) => `  - ${f.name}`).join("\n")}`);
    process.exitCode = 1;
  }
}

main().catch(async (error) => {
  console.error(error);
  await browser?.close().catch(() => {});
  process.exitCode = 1;
});
