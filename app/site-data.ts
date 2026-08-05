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
  ["Syrian American Medical Society", "SAMS highlights Students Organize for Syria", "https://www.sams-usa.net/foundation/blog/523/"],
  ["The State Press", "Arizona State University’s mock refugee tent", "http://www.statepress.com/article/2015/03/asu-students-experience-living-like-syrian-refugees/"],
  ["The Eastern Echo", "Eastern Michigan University hosts Tea With a Syrian", "http://www.easternecho.com/article/2015/03/tea-with-a-syrian"],
  ["The Independent Florida Alligator", "University of Florida SOS shows students the life of a refugee", "https://www.alligator.org/news/did-you-notice-the-blue-tent-on-plaza-of-americas/article_bfd0ef48-41ed-11e8-9f26-3f0f31f6ef6d.html"],
] as const;
