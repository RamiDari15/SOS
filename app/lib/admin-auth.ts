/**
 * GitHub sign-in for the content editor at /admin (Decap CMS).
 *
 * Decap opens a popup at /api/admin-auth, which sends the person to GitHub to approve.
 * GitHub returns to /api/admin-auth/callback with a code, which is swapped for an access
 * token and handed back to the /admin window. The token never leaves the browser of the
 * person signing in, and GitHub only lets them save if they have write access to the repo.
 *
 * Needs two environment variables (Vercel -> Project -> Settings -> Environment Variables):
 *   GITHUB_OAUTH_CLIENT_ID      from a GitHub OAuth App
 *   GITHUB_OAUTH_CLIENT_SECRET  from the same OAuth App
 * The OAuth App's "Authorization callback URL" must be https://<site>/api/admin-auth/callback.
 */

export const STATE_COOKIE = "sos_admin_oauth_state";
export const CALLBACK_PATH = "/api/admin-auth/callback";

export function oauthEnv() {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};
  const clientId = env.GITHUB_OAUTH_CLIENT_ID?.trim();
  const clientSecret = env.GITHUB_OAUTH_CLIENT_SECRET?.trim();
  return clientId && clientSecret ? { clientId, clientSecret } : null;
}

export function readCookie(request: Request, name: string) {
  for (const part of (request.headers.get("cookie") ?? "").split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return undefined;
}

const htmlHeaders = { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" };

/** A small page shown in the sign-in popup when something is wrong. */
export function errorPage(message: string, status = 400) {
  const safe = message.replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]!);
  return new Response(
    `<!doctype html><meta charset="utf-8"><title>Sign-in problem</title><body style="font-family:system-ui;padding:24px;max-width:520px"><h1 style="font-size:20px">Sign-in did not work</h1><p>${safe}</p><p>Close this window and try again. If it keeps happening, send this message to the site developer.</p></body>`,
    { status, headers: htmlHeaders },
  );
}

/**
 * The popup page that hands the result back to the /admin window, using Decap's
 * postMessage handshake. It only answers a window on this same site.
 */
export function handoffPage(result: { token: string } | { error: string }) {
  const message = "token" in result
    ? `authorization:github:success:${JSON.stringify({ token: result.token, provider: "github" })}`
    : `authorization:github:error:${JSON.stringify({ message: result.error })}`;
  const literal = JSON.stringify(message).replace(/</g, "\\u003c");
  return new Response(
    `<!doctype html><meta charset="utf-8"><title>Signing in…</title><body style="font-family:system-ui;padding:24px">Signing in… you can close this window if it stays open.<script>
(function () {
  var message = ${literal};
  if (!window.opener) { document.body.textContent = "Open the editor at /admin and sign in from there."; return; }
  function reply(event) {
    if (event.origin !== window.location.origin) return;
    window.removeEventListener("message", reply);
    window.opener.postMessage(message, event.origin);
  }
  window.addEventListener("message", reply);
  window.opener.postMessage("authorizing:github", window.location.origin);
})();
</script></body>`,
    { headers: htmlHeaders },
  );
}
