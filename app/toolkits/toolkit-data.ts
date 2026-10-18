// =============================================================================
// SOS TOOLKIT CONTENT
// Everything on /toolkits and the printable templates comes from this file.
// The downloadable copies live in public/toolkit/docs/<slug>.md. If you change a
// template here, update its .md file too (same headings, same blanks).
// =============================================================================

export const ORG_NAME = "Students Organize For Syria";
export const LEGAL_NAME = "STUDENTS ORGANIZE FOR SYRIA INC";
export const EIN = "81-3410686";
export const CONTACT_EMAIL = "sos@organize4syria.com";
export const GUIDE_URL = "https://docs.google.com/document/d/1Dvi09bJSaOUSksVLpYMAYP8v7EqP3DoLh3_c36PnejM/view?usp=sharing";

/** Approved by the board. Do not edit without board approval (keep it word for word). */
export const MISSION =
  "Students Organize for Syria’s ultimate goal is to effectively mobilize for Syria from within the diaspora. We are committed to sustaining a strong, united student network that honors the Syrian revolution, champions advocacy, and empowers a new generation to take part in rebuilding and shaping Syria’s future.";

/** Built only from copy already published on the site (About page, homepage, chapters). */
export const BOILERPLATE =
  "Students Organize For Syria (SOS) is a national, student-led movement rooted in advocacy, solidarity, and action for Syria. SOS grew from two student efforts, Save Our Syrian Freedom at Arizona State University (2012) and Students for Syrian Relief at Yale (2013), into a unified, nationwide student network. Today, SOS chapters give students concrete ways to organize, advocate, mobilize resources, and grow together.";

export const socials = [
  { label: "Instagram", handle: "@organize4syria", url: "https://www.instagram.com/organize4syria/" },
  { label: "Facebook", handle: "Organize4Syria", url: "https://www.facebook.com/Organize4Syria/" },
] as const;

export const nameRules: { title: string; body: string }[] = [
  { title: "Full name first", body: "Write “Students Organize For Syria” on first mention, then “SOS” after that." },
  { title: "Capital F", body: "It is “Organize For Syria,” with a capital F, everywhere: posts, flyers, emails, and slides." },
  { title: "Name your chapter clearly", body: "Pair the full name with your school, for example “Students Organize For Syria at [your school],” so people know you are part of the national network." },
  { title: "Official paperwork", body: `Some forms ask for the legal name or EIN. Legal name: ${LEGAL_NAME}. EIN: ${EIN}. Questions? Email ${CONTACT_EMAIL}.` },
];

export const chapterSteps: { title: string; body: string; link?: { href: string; label: string; external?: boolean } }[] = [
  { title: "Read the organizing guide", body: "The New Chapter Organizing Guide walks through recognition steps, launch planning, and chapter standards for Students Organize For Syria chapters.", link: { href: GUIDE_URL, label: "Open the organizing guide", external: true } },
  { title: "Check the chapter directory", body: "See whether your campus already has an active chapter to join, or a past chapter you can bring back.", link: { href: "/chapters", label: "Browse chapters" } },
  { title: "Find your co-organizers", body: "A chapter starts with students who refuse to stay on the sidelines. Bring a few friends in early and share the work from day one." },
  { title: "Tell us about your campus", body: "The start-a-chapter form asks for your name, email, school, state or region, phone number, and why this campus, why now. The national team will follow up with next steps.", link: { href: "/get-involved?form=chapter#apply", label: "Start a chapter" } },
  { title: "Hold your first meeting", body: "Use the meeting agenda and event checklist below to plan your first gathering, then keep notes so the next organizers can pick up where you left off." },
];

// -----------------------------------------------------------------------------
// Printable templates. Generic organizing tools: they contain prompts and blanks,
// not SOS rules or numbers.
// -----------------------------------------------------------------------------

export type TemplateSection =
  | { kind: "fields"; heading: string; note?: string; items: string[] }
  | { kind: "checklist"; heading: string; note?: string; items: string[] }
  | { kind: "table"; heading: string; note?: string; columns: string[]; rows: number }
  | { kind: "prompts"; heading: string; note?: string; items: string[] };

export type Template = { slug: string; title: string; short: string; summary: string; sections: TemplateSection[] };

export const templates: Template[] = [
  {
    slug: "meeting-agenda",
    title: "Chapter meeting agenda",
    short: "Meeting agenda",
    summary: "Plan a focused chapter meeting, record decisions, and leave with clear owners for every next step.",
    sections: [
      { kind: "fields", heading: "Meeting details", items: ["Chapter", "Date", "Time", "Location or video link", "Facilitator", "Note-taker"] },
      { kind: "prompts", heading: "Purpose", items: ["What should this meeting decide or produce?"] },
      { kind: "table", heading: "Agenda", note: "A simple flow: welcome, follow-ups from last time, main discussion, decisions, next steps, announcements.", columns: ["Time", "Item", "Lead", "Outcome wanted"], rows: 6 },
      { kind: "prompts", heading: "Decisions made", items: ["Decision 1", "Decision 2", "Decision 3"] },
      { kind: "table", heading: "Action items", columns: ["Task", "Owner", "Due"], rows: 5 },
      { kind: "fields", heading: "Next meeting", items: ["Date and time", "Location or link", "Who sends the reminder"] },
    ],
  },
  {
    slug: "event-checklist",
    title: "Event planning checklist",
    short: "Event checklist",
    summary: "Walk an event from first idea to follow-up, with a checklist for each stage.",
    sections: [
      { kind: "fields", heading: "Event basics", items: ["Event name", "Date and time", "Location", "Lead organizer", "Goal (what should people know, feel, or do afterwards?)", "Expected audience"] },
      { kind: "checklist", heading: "Four or more weeks before", items: ["Agree on the goal and the audience", "Choose a date that avoids exams and major campus events", "Check your school’s rules for registering events and booking rooms", "Reserve the room or space", "Invite and confirm speakers or partners", "Draft a budget and identify funding", "Assign roles: lead, promotion, logistics, host"] },
      { kind: "checklist", heading: "Two weeks before", items: ["Create graphics using the SOS brand kit", "Post on your chapter’s social media and campus channels", "Set up an RSVP or sign-in method", "Confirm accessibility needs (location, captions, seating)", "Order supplies, food, or printing if needed", "Share speaker details: time, place, run of show"] },
      { kind: "checklist", heading: "Week of", items: ["Send reminders to RSVPs and volunteers", "Confirm the room, tech, and setup time", "Prepare a run of show with timings", "Print sign-in sheets and any handouts", "Plan how you will share photos (ask for consent first)"] },
      { kind: "checklist", heading: "Day of", items: ["Arrive early to set up and test tech", "Welcome people and collect sign-ins", "Keep to the run of show", "Take photos only of people who agreed", "Clean up and return the space"] },
      { kind: "checklist", heading: "After", items: ["Thank speakers, partners, and volunteers", "Follow up with attendees (next meeting, how to get involved)", "Post a recap", "Hold a short debrief: what worked, what to change", "Record attendance and results for your semester report"] },
    ],
  },
  {
    slug: "campaign-worksheet",
    title: "Campaign planning worksheet",
    short: "Campaign worksheet",
    summary: "Turn an issue into a campaign with a clear goal, audience, message, plan, and way to measure results.",
    sections: [
      { kind: "fields", heading: "Campaign basics", items: ["Campaign name", "Chapter", "Campaign lead", "Start date", "End date"] },
      { kind: "prompts", heading: "The issue", items: ["What problem are we responding to?", "Why does it matter to our campus or community now?", "Whose voices should we center, and how will we involve them?"] },
      { kind: "prompts", heading: "Goal", items: ["What does success look like? (Something you can count or clearly observe.)", "What is the one thing we want people to do?"] },
      { kind: "prompts", heading: "Audience", items: ["Who do we need to reach?", "Who can make the change we want?", "Who are likely allies or partners?"] },
      { kind: "prompts", heading: "Message", items: ["Our message in one sentence", "Three supporting points", "Call to action"] },
      { kind: "table", heading: "Plan", note: "List each tactic: an event, a tabling day, a fundraiser, an advocacy action, a social push.", columns: ["Tactic", "Date", "Owner", "Resources needed"], rows: 6 },
      { kind: "prompts", heading: "Budget and resources", items: ["What will this cost, and where will the money come from?", "What materials, space, or skills do we need?"] },
      { kind: "prompts", heading: "Safety and care", items: ["What risks should we plan for (physical, online, privacy)?", "How will we look after organizers and participants?"] },
      { kind: "prompts", heading: "Measuring and debrief", items: ["How will we track progress?", "What did we achieve?", "What would we do differently next time?"] },
    ],
  },
  {
    slug: "semester-report",
    title: "End-of-semester chapter report",
    short: "Semester report",
    summary: "Capture what your chapter did this term so the national team and next year’s organizers can build on it.",
    sections: [
      { kind: "fields", heading: "Chapter details", items: ["Chapter / school", "Semester", "Prepared by", "Date"] },
      { kind: "table", heading: "Chapter leadership", columns: ["Role", "Name", "Contact"], rows: 5 },
      { kind: "fields", heading: "Membership", items: ["Approximate number of active members", "How members found the chapter", "How you keep in touch (group chat, email list, social)"] },
      { kind: "table", heading: "Events and actions", columns: ["Date", "Event or action", "Attendance", "Partners"], rows: 6 },
      { kind: "prompts", heading: "Campaigns and fundraising", items: ["Campaigns you ran or joined", "Funds raised, and where they went", "Partners you worked with"] },
      { kind: "prompts", heading: "Reflection", items: ["Highlights we are proud of", "Challenges we faced", "Support we would like from the national team"] },
      { kind: "prompts", heading: "Next semester", items: ["Goals for next semester", "Who is leading next semester?", "Links to photos, posts, or press"] },
    ],
  },
];

export const findTemplate = (slug: string) => templates.find(t => t.slug === slug);
export const templateFile = (t: Template) => `/toolkit/docs/${t.slug}.md`;

// -----------------------------------------------------------------------------
// Brand kit. Files live in public/toolkit/brand/. Add one entry per file.
// `file` is the path under public/, e.g. "/toolkit/brand/sos-logo-black.svg".
// -----------------------------------------------------------------------------

export type BrandFile = { title: string; file: string; format: string; note?: string };

export const brandFiles: BrandFile[] = [];
