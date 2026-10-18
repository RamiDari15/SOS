import type { MetadataRoute } from "next";
import { chapterHref, chapters } from "./chapter-data";
import { templates } from "./toolkits/toolkit-data";

const SITE_URL = (process.env.SITE_URL || "https://organize4syria.com").replace(/\/+$/, "");

const pages = ["", "/about", "/our-work", "/campaigns", "/chapters", "/conferences", "/media", "/news", "/newsletter", "/toolkits", "/get-involved", "/donate", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map(path => ({ url: `${SITE_URL}${path || "/"}`, changeFrequency: "monthly" as const, priority: path === "" ? 1 : 0.7 })),
    ...templates.map(t => ({ url: `${SITE_URL}/toolkits/${t.slug}`, changeFrequency: "yearly" as const, priority: 0.5 })),
    ...chapters.map(c => ({ url: `${SITE_URL}${chapterHref(c)}`, changeFrequency: "monthly" as const, priority: c.status === "active" ? 0.6 : 0.4 })),
  ];
}
