// =============================================================================
// SOS CHAPTER LIST
// Source of truth: the board's "Active Chapters" list.
//
// The chapters themselves live in content/chapters.json and are edited in the
// admin editor at /admin -> "Chapters". See docs/ADMIN-GUIDE.md.
//
// FIELDS
//   name         Full school name. Also builds the page address, e.g.
//                "UCLA" -> /chapters/ucla  (changing it changes the link).
//   shortName    Optional. Shorter name for the small scrolling cards.
//   abbreviation Optional. Letters shown in the circle when there is no logo.
//   location     "City, State" of the campus.
//   status       "active" or "inactive" (inactive = shown as a past chapter).
//   instagram    Optional. Instagram handle WITHOUT the @, e.g. "sosucla".
//   email        Optional. ONLY a chapter-owned address. Never a student's
//                personal email: this is published on the website.
//   logo         Optional. Path to an image, e.g. /college-logos/ucla.jpg.
//
// The website sorts and counts chapters automatically, so the order does not matter.
// =============================================================================

import chaptersFile from "../content/chapters.json";
import { contactEmail, instagramHandleFrom } from "./site-settings";
import { slugify, text } from "./site-data";

export type ChapterStatus = "active" | "inactive";

export type Chapter = {
  name: string;
  shortName?: string;
  abbreviation?: string;
  location: string;
  status: ChapterStatus;
  instagram?: string;
  email?: string;
  logo?: string;
};

type ChapterEntry = { [K in keyof Chapter]?: unknown };

export const chapters: Chapter[] = (Array.isArray(chaptersFile.chapters) ? (chaptersFile.chapters as ChapterEntry[]) : [])
  .filter(c => text(c.name))
  .map((c): Chapter => ({
    name: text(c.name)!,
    shortName: text(c.shortName),
    abbreviation: text(c.abbreviation),
    location: text(c.location) ?? "",
    status: c.status === "inactive" ? "inactive" : "active",
    instagram: text(c.instagram) && (instagramHandleFrom(text(c.instagram)!) || undefined),
    email: text(c.email),
    logo: text(c.logo),
  }))
  // Two chapters with the same name would share one page address; keep the first.
  .filter((c, i, all) => all.findIndex(o => slugify(o.name) === slugify(c.name)) === i);

// -----------------------------------------------------------------------------
// Helpers used by the website. You do not need to edit anything below.
// -----------------------------------------------------------------------------

/** National contact used when a chapter has no public chapter email. */
export const nationalEmail = contactEmail;

export const displayName = (c: Chapter) => c.shortName ?? c.name;

const byDisplayName = (a: Chapter, b: Chapter) => displayName(a).localeCompare(displayName(b), "en");

export const activeChapters = chapters.filter(c => c.status === "active").sort(byDisplayName);
export const pastChapters = chapters.filter(c => c.status === "inactive").sort(byDisplayName);

export const instagramUrl = (handle: string) => `https://www.instagram.com/${instagramHandleFrom(handle)}/`;

export const chapterSlug = (c: Chapter) => slugify(c.name);
export const chapterHref = (c: Chapter) => `/chapters/${chapterSlug(c)}`;
export const findChapter = (slug: string) => chapters.find(c => chapterSlug(c) === slug);
