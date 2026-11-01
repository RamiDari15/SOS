# SOS website: admin guide

This guide is for the person who keeps the Students Organize For Syria website up to date. You do not need to know how to code. Everything in Part 2 is done in a simple online editor. Part 4 lists the few things that still need a developer or a settings change.

**The short version:** go to **organize4syria.com/admin**, sign in with GitHub, pick what you want to change on the left, edit it, and press **Publish → Publish now**. The live site updates by itself in about 1 to 3 minutes.

---

## Part 1. Getting in

### What you need

- A free **GitHub account** (github.com). This is your login for the editor.
- An invitation to the website's repository. Ask Rami (or whoever owns the site) to add your GitHub username. You will get an email from GitHub: open it and click **Accept invitation**. You only do this once.

### Signing in

1. Go to **https://organize4syria.com/admin** (use the live site address, not a preview link).
2. Click **Login with GitHub**.
3. A small window opens. The first time, GitHub asks you to authorize "SOS website editor" (or a similar name). Click **Authorize**.
4. The window closes and you see the editor.

If the window shows "Sign-in did not work", close it and try again. If it keeps happening, see Part 5.

### Finding your way around

The left side lists everything you can edit, all under **Website content**:

| In the editor | What it changes | Where it shows on the site |
| --- | --- | --- |
| Site settings | Contact email, Instagram, Facebook, organizing-guide link | Footer on every page, Contact, Donate, Newsletter, Get Involved, Toolkits |
| Chapters | Every chapter, active or past | Home page chapter strip, Chapters page, each chapter's own page |
| Past campaigns | Campaign cards | Campaigns page |
| Official statements | Statements and their links | Media, News, Newsletter (newest 3), About |
| Donate page photos | The three "Where your money goes" boxes | Donate page |
| Founders | Founder names and bios | About page |
| Conferences | Year, city, dates, theme, speakers | Conferences page, About page timeline |
| Press coverage | News articles about SOS | Media page |

---

## Part 2. Making changes

### How saving works (read this once)

- Nothing goes live until you press **Publish** (top of the screen) and then **Publish now**.
- After you publish, the site rebuilds itself. Wait **1 to 3 minutes**, then reload the page on the live site. If it still looks old, do a hard refresh (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac).
- Every publish is saved in history, with your name and the time, so nothing is ever truly lost. If you make a mistake, just change it back and publish again.
- Lists work the same everywhere:
  - Click the **›** arrow on an item to open it, and again to close it.
  - **Add …** (top right of the list) adds a new item at the bottom.
  - The **✕** on an item deletes it.
  - Drag the **═** handle to move an item up or down. For statements, campaigns, founders, conferences and press, the order in the editor is the order on the site.
- Fields marked **(optional)** can be left empty.

### Site settings

Change the contact email, Instagram handle, Facebook page link, or the chapter organizing guide link.

- **Contact email** is the address shown across the site (footer, Contact, Donate, Newsletter, Toolkits). Only change it to an address someone checks. Website form submissions always go to sos@organize4syria.com no matter what is entered here; changing that needs a developer (see Part 4).
- **Instagram handle**: just the name, no @ (for example `organize4syria`).
- **Facebook page link**: the full address, starting with `https://`.
- **Chapter organizing guide link**: the Google Doc shown on Get Involved and Toolkits. Make sure the Doc is shared as "Anyone with the link can view". Leave it empty to hide that box.

### Chapters

The site sorts chapters alphabetically and counts them for you, so the order in the editor does not matter.

**Add a chapter**
1. Open **Chapters** and click **Add chapter**.
2. Fill in **School name** and **City and state** (for example `Chicago, Illinois`), and set **Status** to **Active**.
3. Optional: a **Short name** for small cards (`Michigan State`), an **Abbreviation** shown in a circle when there is no logo (`UTD`), the chapter's **Instagram** handle without the @, a **Chapter email**, and a **School logo**.
4. Publish. The chapter gets its own page automatically, at an address made from the school name (for example "UCLA" becomes organize4syria.com/chapters/ucla).

**A chapter stops being active:** open it, change **Status** to **Inactive (past chapter)**, publish. It moves to the "past chapters" list. Prefer this over deleting.

**Remove a chapter completely:** click its **✕** and publish. Its page will stop working, so only do this for a chapter that was added by mistake.

**Rules for chapters**
- **Chapter email must be an address the chapter owns** (like `sosatutd@gmail.com`). Never put a student's personal email here: it is published on the website for anyone to see. If a chapter has no shared email, leave it empty and people will be pointed to Instagram or the national email.
- **Renaming a school changes its page address**, which breaks any old links people saved. Fix typos freely, but for a real rename ask a developer to add a redirect from the old address (see Part 4).
- **Logos:** only use a logo the school allows, ideally a square image under 500 KB. Click **Choose an image**, then **Upload**.

### Official statements

1. Open **Official statements**, click **Add statement**.
2. **Date**: type it the way it should appear, for example `Dec 10, 2024`.
3. **Title**, a **one-sentence summary**, and the **link** (the Instagram post or web page, starting with `https://`).
4. **Where the link goes**: pick **Instagram post** for Instagram links. The other option is only for old archived organize4syria.com pages.
5. **Drag the new statement to the top.** The list must stay newest first, because the top three are featured on the Newsletter and News pages.
6. Publish.

Note: the About page timeline mentions the "Syria is Free" statement by its exact title. If you rename or delete that statement, that line on the About page disappears.

### Past campaigns

Each campaign has a **name**, a **partner or tagline** (for example `With Karam Foundation`), and a **short description** of one or two sentences. They show on the Campaigns page in the editor's order.

### Donate page photos

The Donate page has three "Where your money goes" boxes. Each has a **heading**, a **caption**, and an optional **photo**.

- Only use photos SOS has permission to use, and avoid photos where people can be identified unless they agreed.
- Always fill in **Photo description** when you add a photo (for example `Students holding a banner at a campus rally`). Screen readers read this to blind visitors.
- With no photo, the box shows a "Photo coming soon" frame.
- Landscape photos around 1600 pixels wide and under 1 MB work best.

### Founders

Each founder has a **name** and a **short bio**. The circle with their initials is made automatically. They show on the About page in the editor's order.

### Conferences

Each conference has a **year**, **city and state**, **dates** (for example `November 9–11, 2018`), a **theme**, and a list of **speakers and organizations** (click **Add speaker** for each one). Keep the newest first.

Note: the About page timeline refers to the 2017 Chicago and 2018 Ann Arbor conferences by year. If you change those years or delete them, those lines on the About page disappear.

### Press coverage

Each article has the **publication** name, the **headline**, and the **link** to the article. Check the link opens before publishing.

---

## Part 3. Good habits

- **Check the live page after every publish.** Give it 1 to 3 minutes.
- **One topic per publish** makes history easy to read and undo.
- **Do not invent numbers or claims.** Only publish facts the board has approved.
- **No personal information about students** (personal emails, phone numbers, home towns) anywhere on the site.
- **Images must be cleared for use.** No photos pulled from Google or Pinterest.
- **Two people editing the same section at once** can overwrite each other. If you share the job, agree who is editing what.

---

## Part 4. What the editor cannot change

These need a developer (someone comfortable editing the code on GitHub) or the site owner in Vercel. Send them a short note saying what to change and on which page.

### Needs a developer (code changes)

| What | Where it lives in the code |
| --- | --- |
| Page headlines, intros and paragraphs (for example "Born from urgency", the home page sections, Our Work, Get Involved cards) | The page's file in `app/`, for example `app/about/page.tsx`, `app/page.tsx` |
| About page story timeline, values, and "how the original network worked" | `app/about/page.tsx` |
| Menu items and footer links | `app/Interior.tsx` |
| Colors, fonts, spacing, layout | `app/globals.css` |
| Art and captions in the Media page gallery, and home page artwork | `app/media/page.tsx`, `public/art/` |
| Toolkit templates, brand kit, downloads | `app/toolkits/toolkit-data.ts`, `public/toolkit/` |
| Form questions and topics, and the address form submissions are emailed to (sos@organize4syria.com) | `app/Forms.tsx`, `app/lib/forms.ts` |
| Donation amounts, legal name, EIN on the Donate page | `app/donate/DonatePanel.tsx` |
| Redirects when a chapter is renamed (so old links keep working) | `next.config.ts` |
| Page titles shown in Google results | the `metadata` at the top of each page file |
| Adding a new kind of editable content to the editor | `public/admin/config.yml` and the matching file in `content/` |

A developer can also edit any of the files in `content/` directly on GitHub. They are the same files the editor changes.

### Needs the Vercel or GitHub settings (site owner)

| What | Where |
| --- | --- |
| Who can use the editor | GitHub → the SOS repository → **Settings → Collaborators**. Add a person's GitHub username with **Write** access. Remove them the same way. |
| Editor sign-in keys | Vercel → SOS project → **Settings → Environment Variables**: `GITHUB_OAUTH_CLIENT_ID` and `GITHUB_OAUTH_CLIENT_SECRET` (one-time setup below) |
| Where form submissions are delivered | Vercel environment variables: `RESEND_API_KEY` and `FORMS_FROM_EMAIL` (email), or `FORMS_WEBHOOK_URL` (Google Sheets, Zapier and similar), or `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (database) |
| Website address (domain) | Vercel → SOS project → **Settings → Domains** |
| Address used in the sitemap | Vercel environment variable `SITE_URL` (default `https://organize4syria.com`) |
| Seeing whether an update went live, or undoing a broken one | Vercel → SOS project → **Deployments**. Each publish from the editor shows up here. To go back, open the last good deployment → **⋯ → Promote** (or Instant Rollback). |

After changing any Vercel environment variable, redeploy (Vercel → Deployments → latest → **⋯ → Redeploy**) for it to take effect.

### One-time setup of the editor sign-in (site owner, about 10 minutes)

This is done once, before anyone can log in to /admin.

1. On GitHub, go to **Settings → Developer settings → OAuth Apps → New OAuth App** (https://github.com/settings/applications/new). If the repository later moves to an organization, create it under the organization's settings instead.
2. Fill in:
   - **Application name:** `SOS website editor`
   - **Homepage URL:** `https://organize4syria.com`
   - **Authorization callback URL:** `https://organize4syria.com/api/admin-auth/callback`
   (Use the real live address. If the site is still on a `.vercel.app` address, use that, and update it when the domain changes.)
3. Click **Register application**. Copy the **Client ID**. Click **Generate a new client secret** and copy it right away (GitHub only shows it once).
4. In Vercel → SOS project → **Settings → Environment Variables**, add `GITHUB_OAUTH_CLIENT_ID` (the Client ID) and `GITHUB_OAUTH_CLIENT_SECRET` (the secret) for **Production**. Redeploy.
5. Add each admin as a collaborator with **Write** access (GitHub → repository → Settings → Collaborators).
6. Test: open `/admin`, click **Login with GitHub**, and publish a tiny change (for example add and then remove a full stop in a founder's bio).

---

## Part 5. If something goes wrong

**"Sign-in did not work … not set up yet"**
The one-time setup in Part 4 has not been done, or the keys were added without redeploying.

**"Sign-in did not work … expired or was opened in a different browser"**
Close the window and click Login with GitHub again. Allow pop-ups for the site if your browser blocks them.

**GitHub says "The redirect_uri is not associated with this application"**
You opened /admin on a different address than the one in the OAuth App (for example a preview link). Use the main site address.

**You can log in but publishing fails, or the editor says you do not have access**
Your GitHub account is not a collaborator with Write access, or you have not accepted the invitation email yet.

**You published but the site did not change**
Wait 3 minutes and hard refresh. Still old? Check Vercel → Deployments. If the newest one says **Error**, your change is saved but the site could not rebuild. Undo the change in the editor and publish again, and tell a developer what you changed.

**You deleted something by mistake**
A developer can restore any earlier version from the repository history on GitHub (every publish is a saved commit named "Content: update …"). Or simply re-enter it.

---

## For developers

- Editor: [Decap CMS](https://decapcms.org) loaded from `public/admin/index.html`, configured in `public/admin/config.yml` (GitHub backend, simple publish mode, commits straight to `main`).
- Content: JSON files in `content/`. `app/site-data.ts`, `app/chapter-data.ts` and `app/site-settings.ts` read and tidy them (empty optional fields become `undefined`, Instagram handles are normalised, duplicate chapter names are dropped).
- Sign-in: GitHub OAuth through `app/api/admin-auth/route.ts` and `app/api/admin-auth/callback/route.ts` (`app/lib/admin-auth.ts`). The token goes only to the signed-in person's browser; GitHub enforces write access.
- Uploads: general media to `public/uploads/`, chapter logos to `public/college-logos/`, donate photos to `public/donate/`.
- Local editing without GitHub: run `npx decap-server` and `npm run dev`, then open `/admin/index.html` on the local address `npm run dev` prints (Decap's `local_backend` writes to your working copy).
- Adding a new editable section: add a JSON file in `content/`, a matching entry under `files:` in `config.yml`, and read it from a `.ts` helper with the same "tidy" pattern.
