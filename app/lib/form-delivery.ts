/**
 * Server-only delivery for form submissions. Uses only fetch/Web APIs so it
 * runs on Cloudflare Workers (vinext) and on Vercel/Node (next build).
 *
 * Configuration (all optional, read at request time, never hardcoded):
 *   FORMS_WEBHOOK_URL   POST the JSON submission here (Google Apps Script, Zapier, Make...)
 *   FORMS_WEBHOOK_SECRET  optional shared secret sent as `secret` in the JSON and X-Forms-Secret header
 *   RESEND_API_KEY      Resend API key; requires FORMS_TO_EMAIL
 *   FORMS_TO_EMAIL      inbox(es) that receive submissions, comma-separated
 *   FORMS_FROM_EMAIL    sender on a domain verified in Resend (default: onboarding@resend.dev)
 */
import { FormType, ORG_NAME, formatSubmissionText, submissionSubject } from "./forms";

const ENV_KEYS = ["FORMS_WEBHOOK_URL", "FORMS_WEBHOOK_SECRET", "RESEND_API_KEY", "FORMS_TO_EMAIL", "FORMS_FROM_EMAIL"] as const;
type EnvKey = (typeof ENV_KEYS)[number];
export type FormsEnv = Partial<Record<EnvKey, string>>;

/**
 * Read config from process.env (Vercel/Node, vinext dev, Workers with nodejs_compat),
 * falling back to Cloudflare's `cloudflare:workers` env bindings. The Cloudflare import is
 * resolved at runtime only, so `next build` never tries to bundle it.
 */
export async function readFormsEnv(): Promise<FormsEnv> {
  const out: FormsEnv = {};
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
  for (const key of ENV_KEYS) {
    const v = proc?.env?.[key];
    if (typeof v === "string" && v.trim()) out[key] = v.trim();
  }
  if (ENV_KEYS.some((k) => !out[k])) {
    try {
      const specifier = "cloudflare:workers";
      const mod = (await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ /* @vite-ignore */ specifier)) as { env?: Record<string, unknown> };
      for (const key of ENV_KEYS) {
        const v = mod.env?.[key];
        if (!out[key] && typeof v === "string" && v.trim()) out[key] = v.trim();
      }
    } catch {
      // Not running on Cloudflare Workers; process.env is the source of truth.
    }
  }
  return out;
}

export type Channel = "webhook" | "email";
export type DeliveryResult = { configured: Channel[]; delivered: Channel[]; failed: Channel[] };

const TIMEOUT_MS = 10_000;

async function postWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export async function deliverSubmission(
  env: FormsEnv,
  submission: { type: FormType; data: Record<string, string>; submittedAt: string; page?: string },
): Promise<DeliveryResult> {
  const configured: Channel[] = [];
  const tasks: Array<Promise<[Channel, boolean]>> = [];

  if (env.FORMS_WEBHOOK_URL && /^https:\/\//i.test(env.FORMS_WEBHOOK_URL)) {
    configured.push("webhook");
    const headers: Record<string, string> = { "content-type": "application/json" };
    if (env.FORMS_WEBHOOK_SECRET) headers["x-forms-secret"] = env.FORMS_WEBHOOK_SECRET;
    const payload = {
      source: ORG_NAME,
      type: submission.type,
      submittedAt: submission.submittedAt,
      page: submission.page ?? "",
      ...(env.FORMS_WEBHOOK_SECRET ? { secret: env.FORMS_WEBHOOK_SECRET } : {}),
      data: submission.data,
    };
    tasks.push(
      postWithTimeout(env.FORMS_WEBHOOK_URL, { method: "POST", headers, body: JSON.stringify(payload), redirect: "follow" })
        .then((r): [Channel, boolean] => [ "webhook", r.ok ])
        .catch((): [Channel, boolean] => ["webhook", false]),
    );
  }

  if (env.RESEND_API_KEY && env.FORMS_TO_EMAIL) {
    configured.push("email");
    const to = env.FORMS_TO_EMAIL.split(",").map((s) => s.trim()).filter(Boolean);
    const text = `${formatSubmissionText(submission.type, submission.data)}\n\nSubmitted: ${submission.submittedAt}${submission.page ? `\nPage: ${submission.page}` : ""}`;
    const body = {
      from: env.FORMS_FROM_EMAIL || `${ORG_NAME} <onboarding@resend.dev>`,
      to,
      subject: submissionSubject(submission.type, submission.data),
      text,
      html: `<pre style="font:14px/1.5 system-ui,sans-serif;white-space:pre-wrap">${escapeHtml(text)}</pre>`,
      ...(submission.data.email ? { reply_to: submission.data.email } : {}),
    };
    tasks.push(
      postWithTimeout("https://api.resend.com/emails", {
        method: "POST",
        headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((r): [Channel, boolean] => ["email", r.ok])
        .catch((): [Channel, boolean] => ["email", false]),
    );
  }

  const results = await Promise.all(tasks);
  return {
    configured,
    delivered: results.filter(([, ok]) => ok).map(([c]) => c),
    failed: results.filter(([, ok]) => !ok).map(([c]) => c),
  };
}
