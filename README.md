# vinext-starter

A clean full-stack starter running on
[vinext](https://github.com/cloudflare/vinext), with optional Cloudflare D1 and
Drizzle support.

## Prerequisites

- Node.js `>=22.13.0`

## Quick Start

```bash
npm install
npm run dev
npm run build
```

This starter does not use `wrangler.jsonc`.

## Included Shape

- edit site code under `app/`
- `.openai/hosting.json` declares optional Sites D1 and R2 bindings
- `vite.config.ts` simulates declared bindings for local development
- `db/schema.ts` starts intentionally empty
- `examples/d1/` contains an optional D1 example surface
- `drizzle.config.ts` supports local migration generation when needed

## Workspace Auth Headers

OpenAI workspace sites can read the current user's email from
`oai-authenticated-user-email`.

SIWC-authenticated workspace sites may also receive
`oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty
`name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by
`oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Optional Dispatch-Owned ChatGPT Sign-In

Import the ready-to-use helpers from `app/chatgpt-auth.ts` when the site needs
optional or required ChatGPT sign-in:

- Use `getChatGPTUser()` for optional signed-in UI.
- Use `requireChatGPTUser(returnTo)` for server-rendered pages that should send
  anonymous visitors through Sign in with ChatGPT.
- Use `chatGPTSignInPath(returnTo)` and `chatGPTSignOutPath(returnTo)` for
  browser links or actions.
- Pass a same-origin relative `returnTo` path for the destination after sign-in
  or sign-out. The helper validates and safely encodes it.
- Mark protected pages with `export const dynamic = "force-dynamic"` because
  they depend on per-request identity headers.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, the
OAuth cookies, and identity header injection. Do not implement app routes for
those reserved paths. Routes that do not import and call the helper remain
anonymous-compatible.

SIWC establishes identity only; it does not prove workspace membership. Use the
Sites hosting platform's access policy controls for workspace-wide restrictions,
or enforce explicit server-side membership or allowlist checks.

Use SIWC for account pages, user-specific dashboards, saved records, and write
actions tied to the current ChatGPT user. Leave public content anonymous.

## Useful Commands

- `npm run dev`: start local development
- `npm run build`: verify the vinext build output
- `npm test`: build the starter and verify its rendered loading skeleton
- `npm run db:generate`: generate Drizzle migrations after schema changes

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)

## Form submissions

The contact, get-involved (join / start a chapter) and newsletter forms POST JSON to
`/api/forms` (`app/api/forms/route.ts`). The route validates every field (required fields,
email format, length limits, allowed options, a hidden honeypot), returns `400` with
`fieldErrors` for bad input, then delivers the submission through whichever channels are
configured with environment variables (see `.env.example`):

| Variable | Purpose |
| --- | --- |
| `FORMS_WEBHOOK_URL` | https URL that receives each submission as JSON (Google Apps Script, Zapier, Make, …). |
| `FORMS_WEBHOOK_SECRET` | Optional. Sent as `secret` in the JSON and as the `X-Forms-Secret` header. |
| `RESEND_API_KEY` | Resend API key. Needs `FORMS_TO_EMAIL`. |
| `FORMS_TO_EMAIL` | Inbox(es) for submission emails, comma-separated. |
| `FORMS_FROM_EMAIL` | Optional sender on a Resend-verified domain (default `onboarding@resend.dev`). |

A webhook counts as delivered only when it answers HTTP 2xx with the body `ok` or JSON
`{"ok":true}`. Anything else (including a 200 HTML error page from Apps Script) counts as a failure.

If neither channel is configured the route answers `503 {"error":"not_configured"}`, and if
every configured channel fails it answers `502`. In both cases the form shows a
`mailto:sos@organize4syria.com` link with the visitor's message already filled in, so nothing is lost.
The site never shows a success message unless delivery actually worked.

**Abuse protection.** The route has a honeypot field and a best-effort in-memory rate limit
(5 accepted submissions per minute per IP, using `cf-connecting-ip` / `x-forwarded-for`). That
limit is per server instance or Worker isolate and resets on restart, so for production also add a
rate-limit rule in the Cloudflare WAF or Vercel Firewall for `POST /api/forms` (for example
10 requests per minute per IP), and consider Cloudflare Turnstile if spam gets through.

Set the variables in Vercel (Project → Settings → Environment Variables) or as Cloudflare
Worker secrets (`wrangler secret put FORMS_WEBHOOK_URL`), or in `.env.local` for local dev.
`.gitignore` ignores `.env*`, so `.env.example` must be added with `git add -f .env.example`.

**Google Sheet recipe (no paid service needed):**

1. Create a Google Sheet, then open Extensions → Apps Script.
2. Paste:
   ```js
   var SECRET = 'change-me'; // must match FORMS_WEBHOOK_SECRET exactly
   function reply(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
   function doPost(e) {
     try {
       var p = JSON.parse(e.postData.contents);
       if (p.secret !== SECRET) return reply({ ok: false, error: 'forbidden' });
       var ss = SpreadsheetApp.getActive(), sh = ss.getSheetByName(p.type) || ss.insertSheet(p.type);
       sh.appendRow([p.submittedAt, p.page].concat(Object.keys(p.data).map(function (k) { return k + ': ' + p.data[k]; })));
       return reply({ ok: true });
     } catch (err) {
       return reply({ ok: false, error: String(err) });
     }
   }
   ```
3. Deploy → New deployment → Web app, execute as **Me**, access **Anyone**. Copy the `/exec` URL.
4. Set `FORMS_WEBHOOK_URL` to that URL and `FORMS_WEBHOOK_SECRET` to the same value as `SECRET`.
5. Submit a test form; a row appears in a tab named after the form type (`contact`, `member`, `chapter`, `newsletter`).
   If the site shows the email fallback instead, the script did not return `{"ok":true}`: check the secret and redeploy a new version after edits.
