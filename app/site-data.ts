export const legacyChapters = [
  ["Arizona State", "Tempe, Arizona"], ["Brown", "Providence, Rhode Island"],
  ["UC Berkeley", "Berkeley, California"], ["UCLA", "Los Angeles, California"],
  ["Columbia", "New York, New York"], ["DePaul", "Chicago, Illinois"],
  ["Eastern Michigan", "Ypsilanti, Michigan"], ["Florida State", "Tallahassee, Florida"],
  ["UIC", "Chicago, Illinois"], ["Loyola Chicago", "Chicago, Illinois"],
  ["Michigan", "Ann Arbor, Michigan"], ["Michigan State", "East Lansing, Michigan"],
  ["UPenn", "Philadelphia, Pennsylvania"], ["USC", "Los Angeles, California"],
  ["Washington", "Seattle, Washington"], ["Wayne State", "Detroit, Michigan"],
  ["Wellesley", "Wellesley, Massachusetts"], ["Yale", "New Haven, Connecticut"],
] as const;

export const pastCampaigns = [
  { title: "Books Not Bombs", partner: "With Karam Foundation", body: "SOS helped fund scholarships and support education in Syria." },
  { title: "Advocacy in D.C.", partner: "With SAMS", body: "Students brought informed Syrian voices directly to Washington." },
  { title: "Paper Airplanes", partner: "National partnership", body: "SOS members offered English tutoring to young Syrians." },
  { title: "Warmth in Action", partner: "With NuDay Syria", body: "Students fundraised for winter coats for Syrian refugee children." },
];

export function slugify(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
