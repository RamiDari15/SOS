import { HONEYPOT_FIELD, isFormType, validateSubmission } from "../../lib/forms";
import { deliverSubmission, readFormsEnv } from "../../lib/form-delivery";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 32_000;

function json(body: unknown, status: number) {
  return Response.json(body, { status, headers: { "cache-control": "no-store" } });
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

  const env = await readFormsEnv();
  const delivery = await deliverSubmission(env, {
    type,
    data: result.data,
    submittedAt: new Date().toISOString(),
    page: typeof page === "string" ? page.slice(0, 200).replace(/[^\w\-/?=&.#%]/g, "") : undefined,
  });

  if (delivery.configured.length === 0) return json({ error: "not_configured" }, 503);
  if (delivery.delivered.length === 0) {
    console.error(`[forms] delivery failed for ${type} via ${delivery.failed.join(", ")}`);
    return json({ error: "delivery_failed" }, 502);
  }
  if (delivery.failed.length) console.warn(`[forms] partial delivery for ${type}: failed ${delivery.failed.join(", ")}`);
  return json({ ok: true }, 200);
}
