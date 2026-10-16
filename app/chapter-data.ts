// =============================================================================
// SOS CHAPTER LIST
// Source of truth: the board's "Active Chapters" list.
//
// HOW TO EDIT (no coding experience needed):
//   • Each chapter is one block between { and }, followed by a comma.
//   • To ADD a chapter, copy an existing block, paste it into the list, and
//     change the values. Keep the quotes "..." and the comma after the }.
//   • To mark a chapter as active or inactive, change  status: "active"
//     to  status: "inactive"  (or the other way around).
//   • To REMOVE a chapter, delete its whole block, from { to },
//
// FIELDS
//   name         Full school name. Also builds the page address, e.g.
//                "UCLA" -> /chapters/ucla  (changing it changes the link).
//   shortName    Optional. Shorter name for the small scrolling cards.
//   abbreviation Optional. Letters shown in the circle when there is no logo.
//   location     "City, State" of the campus.
//   status       "active" or "inactive" (inactive = shown as a past chapter).
//   instagram    Optional. Instagram handle WITHOUT the @, e.g. "sosucla".
//   email        Optional. ONLY a chapter-owned address. Never put a student's
//                personal email here — this is published on the website.
//                Chapters without one are contacted through Instagram or the
//                national team (sos@organize4syria.com).
//   logo         Optional. Path to an image in public/college-logos/.
//
// The website sorts and counts chapters automatically, so the order below
// does not matter and no other file needs to change.
// =============================================================================

import { slugify } from "./site-data";

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

export const chapters: Chapter[] = [
  // ---------------------------------------------------------------- ACTIVE
  {
    name: "UT Dallas",
    abbreviation: "UTD",
    location: "Richardson, Texas",
    status: "active",
    instagram: "sos.utd",
    email: "sosatutd@gmail.com",
  },
  {
    name: "University of South Florida",
    shortName: "South Florida",
    abbreviation: "USF",
    location: "Tampa, Florida",
    status: "active",
    instagram: "sos_usf",
    logo: "/college-logos/south-florida.jpg",
  },
  {
    name: "Loyola University Chicago",
    shortName: "Loyola Chicago",
    location: "Chicago, Illinois",
    status: "active",
    instagram: "sosloyola",
    logo: "/college-logos/loyola-chicago.jpg",
  },
  {
    name: "Benedictine University",
    shortName: "Benedictine",
    location: "Lisle, Illinois",
    status: "active",
    instagram: "sosbenu",
    logo: "/college-logos/benedictine.jpg",
  },
  {
    name: "University of Michigan",
    shortName: "Michigan",
    location: "Ann Arbor, Michigan",
    status: "active",
    instagram: "sosatum",
    email: "sosumichig@gmail.com",
    logo: "/college-logos/michigan.jpg",
  },
  {
    name: "Michigan State University",
    shortName: "Michigan State",
    location: "East Lansing, Michigan",
    status: "active",
    instagram: "sos.msu",
    email: "msu.studentsorganize4syria@gmail.com",
    logo: "/college-logos/michigan-state.png",
  },
  {
    name: "University of Nebraska–Lincoln",
    shortName: "Nebraska–Lincoln",
    abbreviation: "UNL",
    location: "Lincoln, Nebraska",
    status: "active",
    instagram: "sos_unl",
  },
  {
    name: "UCLA",
    location: "Los Angeles, California",
    status: "active",
    instagram: "sosucla",
    logo: "/college-logos/ucla.jpg",
  },
  {
    name: "UIC",
    location: "Chicago, Illinois",
    status: "active",
    instagram: "sos_uic",
    logo: "/college-logos/uic.jpg",
  },
  {
    name: "University of Illinois Urbana-Champaign",
    shortName: "Illinois Urbana-Champaign",
    abbreviation: "UIUC",
    location: "Champaign, Illinois",
    status: "active",
    instagram: "sosuiuc",
  },
  {
    name: "Oakland University",
    shortName: "Oakland",
    location: "Rochester, Michigan",
    status: "active",
    instagram: "sosatoakland",
    logo: "/college-logos/oakland.jpeg",
  },
  {
    name: "Wayne State University",
    shortName: "Wayne State",
    location: "Detroit, Michigan",
    status: "active",
    instagram: "sosatwsu",
    logo: "/college-logos/wayne-state.jpg",
  },
  {
    name: "UC Riverside",
    location: "Riverside, California",
    status: "active",
    instagram: "sos_ucr",
    logo: "/college-logos/uc-riverside.jpg",
  },
  {
    name: "Eastern Michigan University",
    shortName: "Eastern Michigan",
    location: "Ypsilanti, Michigan",
    status: "active",
    instagram: "sos.emu",
    logo: "/college-logos/eastern-michigan.jpg",
  },

  // -------------------------------------------------------------- INACTIVE
  {
    name: "Arizona State University",
    shortName: "Arizona State",
    location: "Tempe, Arizona",
    status: "inactive",
    logo: "/college-logos/arizona-state.png",
  },
  {
    name: "Yale University",
    shortName: "Yale",
    location: "New Haven, Connecticut",
    status: "inactive",
    logo: "/college-logos/yale.jpg",
  },
  {
    name: "University of Pittsburgh",
    shortName: "Pittsburgh",
    abbreviation: "PITT",
    location: "Pittsburgh, Pennsylvania",
    status: "inactive",
  },
  {
    name: "Wichita State University",
    shortName: "Wichita State",
    abbreviation: "WSU",
    location: "Wichita, Kansas",
    status: "inactive",
  },
  {
    name: "Indiana University",
    abbreviation: "IU",
    location: "Bloomington, Indiana",
    status: "inactive",
  },
  {
    name: "DePaul University",
    shortName: "DePaul",
    location: "Chicago, Illinois",
    status: "inactive",
    logo: "/college-logos/depaul.jpg",
  },
  {
    name: "University of Michigan–Dearborn",
    shortName: "Michigan–Dearborn",
    abbreviation: "UMD",
    location: "Dearborn, Michigan",
    status: "inactive",
  },
  {
    name: "Florida State University",
    shortName: "Florida State",
    location: "Tallahassee, Florida",
    status: "inactive",
    logo: "/college-logos/florida-state.jpg",
  },
  {
    name: "University of Central Florida",
    shortName: "UCF",
    location: "Orlando, Florida",
    status: "inactive",
    logo: "/college-logos/ucf.jpg",
  },
  {
    name: "University of Southern California",
    shortName: "USC",
    location: "Los Angeles, California",
    status: "inactive",
    logo: "/college-logos/usc.png",
  },
  {
    name: "UC Berkeley",
    location: "Berkeley, California",
    status: "inactive",
    logo: "/college-logos/uc-berkeley.jpg",
  },
];

// -----------------------------------------------------------------------------
// Helpers used by the website. You do not need to edit anything below.
// -----------------------------------------------------------------------------

/** National contact used when a chapter has no public chapter email. */
export const nationalEmail = "sos@organize4syria.com";

export const displayName = (c: Chapter) => c.shortName ?? c.name;

const byDisplayName = (a: Chapter, b: Chapter) => displayName(a).localeCompare(displayName(b), "en");

export const activeChapters = chapters.filter(c => c.status === "active").sort(byDisplayName);
export const pastChapters = chapters.filter(c => c.status === "inactive").sort(byDisplayName);

export const instagramUrl = (handle: string) => `https://www.instagram.com/${handle.replace(/^@/, "")}/`;

export const chapterSlug = (c: Chapter) => slugify(c.name);
export const chapterHref = (c: Chapter) => `/chapters/${chapterSlug(c)}`;
export const findChapter = (slug: string) => chapters.find(c => chapterSlug(c) === slug);
