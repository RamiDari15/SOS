import { HONEYPOT_FIELD, isFormType, validateSubmission } from "../../lib/forms";
import { deliverSubmission, readFormsEnv } from "../../lib/form-delivery";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 32_000;

/*
 * Best-effort per-IP rate limit: 5 accepted submissions per minute. The map lives in
 * memory, so it is per server instance / Worker isolate and resets on cold start. Use a
 * Cloudflare or Vercel WAF rate-limit rule (or Turnstile) for real abuse protection.
 */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

function clientIp(request: Request): string {
  // Trust only the header the hosting platform sets itself: Vercel overwrites x-real-ip,
  // Cloudflare sets cf-connecting-ip. The other platform's header is client-controlled.
  const platformHeader = process.env.VERCEL ? "x-real-ip" : "cf-connecting-ip";
  return (
    request.headers.get(platformHeader) ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

/** Records a hit and returns seconds to wait if the IP is over the limit, else 0. */
function rateLimited(ip: string, now = Date.now()): number {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return Math.ceil((RATE_WINDOW_MS - (now - recent[0])) / 1000);
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) if (!times.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(key);
  }
  return 0;
}

function json(body: unknown, status: number, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "cache-control": "no-store", ...headers } });
}

export async function POST(request: Request) {
  if (!(request.headers.get("content-type") || "").toLowerCase().includes("application/json")) {
    return json({ error: "unsupported_media_type" }, 415);
  }

  // Reject cross-site posts when the browser tells us the origin.
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      const allowed = [new URL(request.url).host, request.headers.get("host"), request.headers.get("x-forwarded-host")];
      if (!allowed.includes(new URL(origin).host)) {
        return json({ error: "forbidden_origin" }, 403);
      }
    } catch {
      return json({ error: "forbidden_origin" }, 403);
    }
  }

  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) return json({ error: "payload_too_large" }, 413);

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json({ error: "payload_too_large" }, 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "invalid_json" }, 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return json({ error: "invalid_json" }, 400);

  const { type, fields, page } = body as { type?: unknown; fields?: unknown; page?: unknown };
  if (!isFormType(type)) return json({ error: "invalid_type" }, 400);
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) return json({ error: "invalid_fields" }, 400);
  const input = fields as Record<string, unknown>;

  // Honeypot: real visitors never see or fill this field. Answer like a success so bots learn nothing.
  const trap = input[HONEYPOT_FIELD];
  if (typeof trap === "string" && trap.trim() !== "") return json({ ok: true }, 200);

  const result = validateSubmission(type, input);
  if (!result.ok) return json({ error: "validation_failed", fieldErrors: result.fieldErrors }, 400);

  const ip = clientIp(request);
  const wait = rateLimited(ip);
  if (wait) return json({ error: "rate_limited" }, 429, { "retry-after": String(wait) });

  const env = await readFormsEnv();
  const delivery = await deliverSubmission(env, {
    type,
    data: result.data,
    submittedAt: new Date().toISOString(),
    page: typeof page === "string" ? page.slice(0, 200).replace(/[^\w\-/?=&.#%]/g, "") : undefined,
    ip: ip === "unknown" ? undefined : ip,
  });

  if (delivery.configured.length === 0) return json({ error: "not_configured" }, 503);
  if (delivery.delivered.length === 0) {
    console.error(`[forms] delivery failed for ${type} via ${delivery.failed.join(", ")}`);
    return json({ error: "delivery_failed" }, 502);
  }
  if (delivery.failed.length) console.warn(`[forms] partial delivery for ${type}: failed ${delivery.failed.join(", ")}`);
  return json({ ok: true }, 200);
}
