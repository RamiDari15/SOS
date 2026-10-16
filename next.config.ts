import type { NextConfig } from "next";

// Chapter page addresses changed when the chapter list was rebuilt from the board's list
// (pages are now named after the full school name). Old links keep working:
//   - schools that still have a chapter page go to their new page
//   - schools no longer listed go to the chapter directory
const renamedChapterSlugs: Record<string, string> = {
  "arizona-state": "arizona-state-university",
  "benedictine": "benedictine-university",
  "ucf": "university-of-central-florida",
  "depaul": "depaul-university",
  "eastern-michigan": "eastern-michigan-university",
  "florida-state": "florida-state-university",
  "loyola-chicago": "loyola-university-chicago",
  "michigan": "university-of-michigan",
  "michigan-state": "michigan-state-university",
  "oakland": "oakland-university",
  "usc": "university-of-southern-california",
  "south-florida": "university-of-south-florida",
  "wayne-state": "wayne-state-university",
  "yale": "yale-university",
  "indiana-university-indianapolis": "indiana-university",
};

const removedChapterSlugs = [
  "brown", "butler", "colorado-boulder", "columbia", "university-of-florida", "illinois-state",
  "north-carolina", "upenn", "toledo", "washington",
  "wellesley", "wesleyan", "west-virginia",
];

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  async redirects() {
    return [
      ...Object.entries(renamedChapterSlugs).map(([from, to]) => ({ source: `/chapters/${from}`, destination: `/chapters/${to}`, permanent: true })),
      ...removedChapterSlugs.map(from => ({ source: `/chapters/${from}`, destination: "/chapters", permanent: true })),
    ];
  },
};

export default nextConfig;
