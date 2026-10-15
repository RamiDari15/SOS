export const pastCampaigns = [
  { title: "Books Not Bombs", partner: "With Karam Foundation", body: "SOS helped fund scholarships and support education in Syria." },
  { title: "Advocacy in D.C.", partner: "With SAMS", body: "Students brought informed Syrian voices directly to Washington." },
  { title: "Paper Airplanes", partner: "National partnership", body: "SOS members offered English tutoring to young Syrians." },
  { title: "Warmth in Action", partner: "With NuDay Syria", body: "Students fundraised for winter coats for Syrian refugee children." },
  { title: "Syria Solidarity Week", partner: "National campus action", body: "Chapters held panels, screenings, fundraisers, art actions, and public solidarity events." },
  { title: "Dares 4 Syria", partner: "With Karam Foundation", body: "A Giving Tuesday campaign that invited supporters to take action for Syrian youth." },
  { title: "Virtual Mentorship", partner: "Syrian Youth Empowerment", body: "Students and young professionals mentored Syrian youth navigating college applications." },
  { title: "The Revolution Continues", partner: "Washington, D.C.", body: "A public remembrance and advocacy gathering centered on freedom and accountability." },
];

export type Statement = { date: string; title: string; summary: string; url: string; source: "Instagram" | "organize4syria.com" };

/** Official SOS statements, newest first. Dates come from the board's notes or the original posts. */
export const statements: readonly Statement[] = [
  { date: "Dec 10, 2024", title: "Syria is Free", summary: "Our statement: Syria is free.", url: "https://www.instagram.com/p/DDay_bvOloU/", source: "Instagram" },
  // Date not given in the board notes; the year is read from the original Instagram post.
  { date: "2023", title: "In Solidarity with Gaza", summary: "Our statement in solidarity with Gaza.", url: "https://www.instagram.com/p/CyeO14JpQ7_/", source: "Instagram" },
  { date: "Feb 6, 2023", title: "Statement Regarding the Earthquake", summary: "Our statement regarding the earthquake.", url: "https://www.instagram.com/p/CocrQGMJWhP/", source: "Instagram" },
  { date: "May 31, 2020", title: "Statement on BLM protests", summary: "A solidarity statement responding to protests against police brutality in the United States.", url: "https://organize4syria.com/statement-on-blm-protests/", source: "organize4syria.com" },
  { date: "Mar 18, 2020", title: "Statement on Idlib", summary: "A statement addressing displacement, humanitarian conditions, and violence affecting civilians in Idlib.", url: "https://organize4syria.com/statement-on-idlib/", source: "organize4syria.com" },
  { date: "Mar 15, 2020", title: "Remembrance Day", summary: "A reflection marking nine years since the first protests in Daraa and the beginning of the Syrian revolution.", url: "https://organize4syria.com/remembrance-day/", source: "organize4syria.com" },
];

export function statementLinkLabel(s: Statement) { return s.source === "Instagram" ? "Read on Instagram ↗" : "Read statement ↗"; }

/**
 * "Where your money goes" photo slots on /donate.
 * To add a real photo: drop a rights-cleared image in public/donate/ (e.g. public/donate/campus.jpg)
 * and set `image: "/donate/campus.jpg"` plus a descriptive `alt`. Slots without an image render a textured placeholder frame.
 */
export type GivingSlot = { title: string; caption: string; image?: string; alt?: string };
// TODO(board): replace with approved captions + photos.
export const givingSlots: readonly GivingSlot[] = [
  { title: "Campus organizing", caption: "Support for student chapters organizing on their campuses." },
  { title: "National connection", caption: "Support for the national network that connects chapters." },
  { title: "Movement continuity", caption: "Support for keeping the movement running over time." },
];

export function slugify(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

export const founders = [
  ["Zana Alattar", "Founded Save Our Syrian Freedom at Arizona State University in 2012 and used that experience as a foundation for the national SOS network."],
  ["Omar Bailony", "A Syrian American advocate whose work included youth mentorship, asylum representation, and legal scholarship."],
  ["Nada Hashem", "An organizer committed to freedom, justice, and human rights who served Syrian community and advocacy organizations."],
  ["Dina Jaber", "A Syrian American student organizer whose education and human-rights work shaped her activism during the Arab Spring."],
  ["Kenan Rahmani", "A Syrian American political and human-rights activist with experience across grassroots and civil-society organizations."],
  ["Sarah Yazji", "A Yale organizer who helped lead relief and fundraising efforts and traveled to Syria’s northern border and Za’atari Refugee Camp."],
] as const;

export const conferences = [
  { year: "2018", city: "Ann Arbor, Michigan", dates: "November 9–11, 2018", theme: "Where do we go from here?", speakers: ["Qutaiba Idlibi", "Shiyam Galyon", "Suzanne Meridien", "Marc Nelson", "Loubna Mrie", "Lina Sergie Attar", "Kenan Rahmani", "Hadia Zarzour", "Dr. Jihad Qaddour", "Dr. Hend Azhary", "Adham Sahloul", "Big O"] },
  { year: "2017", city: "Chicago, Illinois", dates: "November 10–12, 2017", theme: "Preparing the next generation to stand up for Syria", speakers: ["Kenan Rahmani", "Shiyam Galyon", "Dr. Zaher Sahloul", "Dr. John Kahler", "Mariam Jalabi", "Syrian Community Network", "Karam Foundation", "Syrian American Council", "White Helmets", "Omar Offendum", "Amal Kassir", "Marc Nelson"] },
] as const;

export const press = [
  ["USA Today College", "Student activists organize for a free Syria", "https://www.usatoday.com/story/college/2015/09/16/student-activists-organize-for-a-free-syria/37406537/"],
  ["BarakaBits", "Five ways you can help Syria for real", "http://www.barakabits.com/2015/03/5-ways-you-can-help-syria-for-real"],
  ["Syrian American Medical Society", "SAMS highlights Students Organize For Syria", "https://www.sams-usa.net/foundation/blog/523/"],
  ["The State Press", "Arizona State University’s mock refugee tent", "http://www.statepress.com/article/2015/03/asu-students-experience-living-like-syrian-refugees/"],
  ["The Eastern Echo", "Eastern Michigan University hosts Tea With a Syrian", "http://www.easternecho.com/article/2015/03/tea-with-a-syrian"],
  ["The Independent Florida Alligator", "University of Florida SOS shows students the life of a refugee", "https://www.alligator.org/news/did-you-notice-the-blue-tent-on-plaza-of-americas/article_bfd0ef48-41ed-11e8-9f26-3f0f31f6ef6d.html"],
] as const;
