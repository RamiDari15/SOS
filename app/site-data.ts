// =============================================================================
// SITE CONTENT
// The words and lists below are NOT typed here any more. They live in the
// content/ folder as .json files, which the admin editor at /admin changes:
//   content/campaigns.json    Past campaigns              (/campaigns)
//   content/statements.json   Official statements         (/media, /news, /about, /newsletter)
//   content/giving.json       "Where your money goes"     (/donate)
//   content/board.json        Current national board      (/about)
//   content/founders.json     Founders                    (/about)
//   content/conferences.json  Conferences                 (/conferences, /about)
//   content/press.json        Press coverage              (/media)
//   content/settings.json     Email + social links        (whole site, see site-settings.ts)
//   content/chapters.json     Chapters                    (see chapter-data.ts)
// This file only tidies those values up for the pages.
// =============================================================================

import boardFile from "../content/board.json";
import campaignsFile from "../content/campaigns.json";
import conferencesFile from "../content/conferences.json";
import foundersFile from "../content/founders.json";
import givingFile from "../content/giving.json";
import pressFile from "../content/press.json";
import statementsFile from "../content/statements.json";

/** Trims text; empty or missing values become undefined so optional fields behave. */
export const text = (value: unknown): string | undefined => (typeof value === "string" && value.trim() ? value.trim() : undefined);
const list = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

type Campaign = { title: string; partner: string; body: string };
export const pastCampaigns: readonly Campaign[] = list<Partial<Campaign>>(campaignsFile.campaigns)
  .filter(c => text(c.title))
  .map(c => ({ title: text(c.title)!, partner: text(c.partner) ?? "", body: text(c.body) ?? "" }));

export type Statement = { date: string; title: string; summary: string; url: string; source: "Instagram" | "organize4syria.com" };

/** Official SOS statements, newest first (the order in the admin list is the order on the site). */
export const statements: readonly Statement[] = list<Partial<Statement>>(statementsFile.statements)
  .filter(s => text(s.title) && text(s.url))
  .map(s => ({
    date: text(s.date) ?? "",
    title: text(s.title)!,
    summary: text(s.summary) ?? "",
    url: text(s.url)!,
    source: s.source === "organize4syria.com" ? "organize4syria.com" : "Instagram",
  }));

export function statementLinkLabel(s: Statement) { return s.source === "Instagram" ? "Read on Instagram ↗" : "Read archived statement ↗"; }

/**
 * "Where your money goes" photo slots on /donate.
 * Slots without an image render a textured placeholder frame.
 */
export type GivingSlot = { title: string; caption: string; image?: string; alt?: string };
export const givingSlots: readonly GivingSlot[] = list<Partial<GivingSlot>>(givingFile.slots)
  .filter(s => text(s.title))
  .map(s => ({ title: text(s.title)!, caption: text(s.caption) ?? "", image: text(s.image), alt: text(s.alt) }));

export function slugify(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

export type BoardMember = { name: string; role: string; bio: string; photo?: string };
/** Current national board, shown above the founders on /about once filled in (content/board.json). */
export const board: readonly BoardMember[] = list<Partial<BoardMember>>(boardFile.board)
  .filter(b => text(b.name))
  .map(b => ({ name: text(b.name)!, role: text(b.role) ?? "", bio: text(b.bio) ?? "", photo: text(b.photo) }));

type Founder = { name: string; bio: string };
export const founders: readonly (readonly [string, string])[] = list<Partial<Founder>>(foundersFile.founders)
  .filter(f => text(f.name))
  .map(f => [text(f.name)!, text(f.bio) ?? ""] as const);

type Conference = { year: string; city: string; dates: string; theme: string; speakers: string[] };
export const conferences: readonly Conference[] = list<Partial<Conference>>(conferencesFile.conferences)
  .filter(c => text(c.year))
  .map(c => ({
    year: text(c.year)!,
    city: text(c.city) ?? "",
    dates: text(c.dates) ?? "",
    theme: text(c.theme) ?? "",
    speakers: list<unknown>(c.speakers).map(text).filter((v): v is string => Boolean(v)),
  }));

type PressItem = { source: string; title: string; url: string };
export const press: readonly (readonly [string, string, string])[] = list<Partial<PressItem>>(pressFile.press)
  .filter(p => text(p.title) && text(p.url))
  .map(p => [text(p.source) ?? "", text(p.title)!, text(p.url)!] as const);
