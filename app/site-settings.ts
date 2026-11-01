// Site-wide contact details. The values live in content/settings.json, which the
// admin editor (/admin -> "Site settings") changes. Code should import from here.
import settings from "../content/settings.json";

const clean = (value: unknown) => (typeof value === "string" ? value.trim() : "");

/** Accepts "name", "@name" or a full Instagram link and returns just "name". */
export const instagramHandleFrom = (value: string) =>
  clean(value).replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").replace(/^@/, "").replace(/[/?#].*$/, "");

export const contactEmail = clean(settings.contactEmail) || "sos@organize4syria.com";
export const instagramHandle = instagramHandleFrom(settings.instagramHandle) || "organize4syria";
export const instagramProfileUrl = `https://www.instagram.com/${instagramHandle}/`;
export const facebookUrl = clean(settings.facebookUrl) || "https://www.facebook.com/Organize4Syria/";
export const facebookLabel = facebookUrl.replace(/^https?:\/\/(www\.)?facebook\.com\//i, "").replace(/\/$/, "") || "Facebook";
export const organizingGuideUrl = clean(settings.organizingGuideUrl);
