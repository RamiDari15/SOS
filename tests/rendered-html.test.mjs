// Server smoke tests for the Students Organize For Syria site.
// They import the built Worker (dist/server/index.js) and call its fetch handler directly,
// so run `npm run build` first (`npm test` does that for you).
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

// Form delivery must be unconfigured here so /api/forms answers 503 not_configured.
for (const key of [
  "FORMS_WEBHOOK_URL",
  "FORMS_WEBHOOK_SECRET",
  "RESEND_API_KEY",
  "FORMS_TO_EMAIL",
  "FORMS_FROM_EMAIL",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "FORMS_IP_SALT",
]) delete process.env[key];

const ORIGIN = "http://localhost";
let workerPromise;
function loadWorker() {
  workerPromise ??= (async () => {
    const workerUrl = new URL("../dist/server/index.js", import.meta.url);
    workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
    return (await import(workerUrl.href)).default;
  })();
  return workerPromise;
}

const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };

async function request(path, init = {}) {
  const worker = await loadWorker();
  return worker.fetch(new Request(ORIGIN + path, { ...init, headers: { accept: "text/html", ...(init.headers ?? {}) } }), env, ctx);
}

/** Visible text of the first <h1>, with tags removed and whitespace collapsed. */
function h1Text(html) {
  const match = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  if (!match) return "";
  return match[1]
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

const PAGES = [
  ["/", /Students\s+shaping Syria’s\s+future/i],
  ["/about", /Born from urgency/i],
  ["/our-work", /Power is something/i],
  ["/campaigns", /Attention is not enough/i],
  ["/chapters", /Find your people/i],
  ["/conferences", /Ideas gather/i],
  ["/media", /The student voice/i],
  ["/news", /Our voices/i],
  ["/newsletter", /Field notes\s+from the movement/i],
  ["/get-involved", /There is a place/i],
  ["/toolkits", /Built for/i],
  ["/donate", /Fuel student/i],
  ["/contact", /Let’s build/i],
];

for (const [path, heading] of PAGES) {
  test(`GET ${path} renders 200 with its heading`, async () => {
    const res = await request(path);
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type") ?? "", /^text\/html\b/i);
    const html = await res.text();
    assert.match(h1Text(html), heading);
    assert.match(html, /<title>[^<]+<\/title>/i, "page has a <title>");
    assert.match(html, /Students Organize For Syria/, "official name appears");
  });
}

test("/chapters lists 14 active and 11 past chapters, and each chapter page renders", async () => {
  const html = await (await request("/chapters")).text();
  const active = html.match(/class="chapter-card is-active"/g) ?? [];
  const past = html.match(/class="chapter-card is-past"/g) ?? [];
  assert.equal(active.length, 14, "active chapter cards");
  assert.equal(past.length, 11, "past chapter cards");

  const slugs = [...new Set([...html.matchAll(/href="\/chapters\/([a-z0-9-]+)"/g)].map((m) => m[1]))];
  assert.equal(slugs.length, 25, "one detail link per chapter");
  for (const slug of slugs) {
    const res = await request(`/chapters/${slug}`);
    assert.equal(res.status, 200, `/chapters/${slug}`);
    assert.notEqual(h1Text(await res.text()), "", `/chapters/${slug} has an h1`);
  }
});

test("/newsletter is a finished signup page with the latest statements", async () => {
  const html = await (await request("/newsletter")).text();
  assert.doesNotMatch(html, /coming soon/i, "no placeholder copy");
  assert.doesNotMatch(html, /Issue 001/i, "no fake issue preview");
  assert.match(html, /<form[^>]*class="cool-form newsletter-form"/);
  for (const name of ["email", "firstName", "lastName", "school", "consent"]) assert.match(html, new RegExp(`name="${name}"`), `field ${name}`);
  assert.match(html, /[Mm]onthly/);
  assert.match(html, /mailto:sos@organize4syria\.com\?subject=Unsubscribe/, "unsubscribe mailto");
  // The three newest statements are the first three entries of `statements` in app/site-data.ts.
  const source = await readFile(new URL("../app/site-data.ts", import.meta.url), "utf8");
  const block = source.slice(source.indexOf("export const statements"));
  const expected = [...block.matchAll(/title: "([^"]+)"/g)].slice(0, 3).map((m) => m[1].replace(/&/g, "&amp;"));
  assert.equal(expected.length, 3, "found three statements in site-data.ts");
  const strip = html.slice(html.indexOf("newsletter-latest"));
  for (const title of expected) assert.ok(strip.includes(title), `latest statement "${title}"`);
  assert.equal((strip.match(/class="latest-card"/g) ?? []).length, 3, "three latest cards");
  assert.match(strip, /href="\/media#statements"/);
});

test("unknown chapter returns 404", async () => {
  const res = await request("/chapters/not-a-real-chapter-xyz");
  assert.equal(res.status, 404);
});

test("?form=chapter and ?topic=toolkit render the right form on first paint", async () => {
  const involved = await (await request("/get-involved?form=chapter")).text();
  assert.match(involved, /Chapter starter/);
  assert.match(involved, /name="phone"/);
  const contact = await (await request("/contact?topic=toolkit")).text();
  assert.match(contact, /<option[^>]*selected[^>]*>Toolkit request<\/option>|<option value="Toolkit request"[^>]*selected/);
});

let ipCounter = 0;
function postForm(body, headers = {}) {
  return request("/api/forms", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json", "cf-connecting-ip": `203.0.113.${++ipCounter}`, ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const validContact = { type: "contact", fields: { name: "Test Person", email: "test@example.edu", topic: "General inquiry", message: "Smoke test" } };

test("/api/forms rejects bad input with 400 and field errors", async () => {
  let res = await postForm({ type: "contact", fields: { name: "", email: "nope", topic: "Other", message: "" } });
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(body.error, "validation_failed");
  assert.deepEqual(Object.keys(body.fieldErrors).sort(), ["email", "message", "name", "topic"]);

  res = await postForm({ type: "unknown", fields: {} });
  assert.equal(res.status, 400);
  res = await postForm("{not json");
  assert.equal(res.status, 400);
  res = await postForm({ type: "newsletter", fields: { email: "a@b.co", firstName: "A", lastName: "B" } });
  assert.equal(res.status, 400, "newsletter without consent");
  res = await postForm({ type: "newsletter", fields: { email: "a@b.co", firstName: "A", lastName: "B", consent: "on", school: "x".repeat(161) } });
  assert.equal(res.status, 400, "newsletter school over 160 chars");
  assert.ok((await res.json()).fieldErrors.school);
});

test("/api/forms answers 503 not_configured for valid input when no delivery is set up", async () => {
  for (const payload of [
    validContact,
    { type: "member", fields: { name: "A", email: "a@b.co", school: "U", major: "History", role: "Not sure yet" } },
    { type: "chapter", fields: { name: "A", email: "a@b.co", school: "U", region: "OH", phone: "555 123 4567", why: "Because" } },
    { type: "newsletter", fields: { email: "a@b.co", firstName: "A", lastName: "B", consent: "on" } },
    { type: "newsletter", fields: { email: "a@b.co", firstName: "A", lastName: "B", consent: "on", school: "Loyola University Chicago" } },
  ]) {
    const res = await postForm(payload);
    assert.equal(res.status, 503, payload.type);
    assert.deepEqual(await res.json(), { error: "not_configured" });
  }
});

test("/api/forms refuses cross-origin posts, oversize bodies and non-JSON", async () => {
  assert.equal((await postForm(validContact, { origin: "https://evil.example" })).status, 403);
  assert.equal((await postForm(validContact, { origin: ORIGIN })).status, 503, "same origin is allowed");
  assert.equal((await postForm({ ...validContact, pad: "x".repeat(40_000) })).status, 413);
  assert.equal((await postForm("name=x", { "content-type": "application/x-www-form-urlencoded" })).status, 415);
});

test("/api/forms rate-limits one IP after 5 accepted submissions", async () => {
  const statuses = [];
  for (let i = 0; i < 6; i++) statuses.push((await postForm(validContact, { "cf-connecting-ip": "198.51.100.77" })).status);
  assert.deepEqual(statuses, [503, 503, 503, 503, 503, 429]);
});
