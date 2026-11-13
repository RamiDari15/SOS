import { STATE_COOKIE, errorPage, handoffPage, oauthEnv, readCookie } from "../../../lib/admin-auth";

export const dynamic = "force-dynamic";

/** Step 2 of signing in to /admin: GitHub sends the person back here with a one-time code. */
export async function GET(request: Request) {
  const env = oauthEnv();
  if (!env) return errorPage("The editor's GitHub sign-in is not set up yet.", 500);

  const url = new URL(request.url);
  if (url.searchParams.get("error")) return handoffPage({ error: url.searchParams.get("error_description") || "GitHub sign-in was cancelled." });

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const expected = readCookie(request, STATE_COOKIE);
  if (!code || !state || !expected || state !== expected) return errorPage("This sign-in link expired or was opened in a different browser.");

  let token: string | undefined;
  let problem = "GitHub did not return an access token.";
  try {
    const res = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { accept: "application/json", "content-type": "application/json" },
      body: JSON.stringify({ client_id: env.clientId, client_secret: env.clientSecret, code }),
    });
    const data = (await res.json()) as { access_token?: string; error_description?: string };
    token = data.access_token;
    if (data.error_description) problem = data.error_description;
  } catch {
    problem = "Could not reach GitHub. Try again in a minute.";
  }

  const response = token ? handoffPage({ token }) : handoffPage({ error: problem });
  response.headers.append("set-cookie", `${STATE_COOKIE}=; Path=/api/admin-auth; Max-Age=0; HttpOnly; SameSite=Lax`);
  return response;
}
