import { CALLBACK_PATH, STATE_COOKIE, errorPage, oauthEnv } from "../../lib/admin-auth";

export const dynamic = "force-dynamic";

/** Step 1 of signing in to /admin: send the person to GitHub to approve access. */
export async function GET(request: Request) {
  const env = oauthEnv();
  if (!env) return errorPage("The editor's GitHub sign-in is not set up yet (GITHUB_OAUTH_CLIENT_ID and GITHUB_OAUTH_CLIENT_SECRET are missing in Vercel).", 500);

  const url = new URL(request.url);
  const state = crypto.randomUUID();
  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", env.clientId);
  authorize.searchParams.set("redirect_uri", `${url.origin}${CALLBACK_PATH}`);
  // Decap asks for "repo" (needed to save to the repository); never widen it.
  authorize.searchParams.set("scope", url.searchParams.get("scope") === "public_repo" ? "public_repo" : "repo");
  authorize.searchParams.set("state", state);

  const secure = url.protocol === "https:" ? "; Secure" : "";
  return new Response(null, {
    status: 302,
    headers: {
      location: authorize.toString(),
      "set-cookie": `${STATE_COOKIE}=${state}; Path=/api/admin-auth; Max-Age=600; HttpOnly; SameSite=Lax${secure}`,
      "cache-control": "no-store",
    },
  });
}
