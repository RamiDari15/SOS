import type { Metadata } from "next";
import { PageHero, Shell } from "../Interior";
import { board, conferences, founders, statements } from "../site-data";

const chicago = conferences.find(c => c.year === "2017");
const annArbor = conferences.find(c => c.year === "2018");
const syriaIsFree = statements.find(s => s.title === "Syria is Free");

/**
 * The SOS story in order. Every entry restates facts already published on the site or in the board's notes.
 * The conference and "Syria is Free" entries read from the admin-edited content and are skipped if those items are removed.
 */
type StoryItem = { year: string; place: string; title: string; body: string; link?: { href: string; label: string } };
const story: StoryItem[] = ([
  { year: "2012", place: "Arizona State University", title: "Save Our Syrian Freedom", body: "Zana Alattar founds Save Our Syrian Freedom at ASU. The initiative raises awareness of the Syrian Revolution, promotes philanthropy, supports humanitarian aid, and connects student activists nationally." },
  { year: "2013", place: "Yale University + international students", title: "Students for Syrian Relief", body: "After a student fundraising trip to the Turkey–Syria border, Students for Syrian Relief is founded to connect students with relief projects, awareness work, and fundraising opportunities. Yale organizers, including Sarah Yazji, led relief and fundraising." },
  { year: "Then", place: "Campuses nationwide", title: "Students Organize For Syria", body: "The two efforts grow into Students Organize For Syria: a unified, national student network. Chapters run campaigns such as Books Not Bombs, Syria Solidarity Week, and Advocacy in D.C.", link: { href: "/campaigns", label: "See past campaigns ↗" } },
  chicago && { year: chicago.year, place: `${chicago.city} · ${chicago.dates}`, title: "National conference in Chicago", body: `Students, activists, artists, and organizations gather around the theme “${chicago.theme}.”`, link: { href: "/conferences", label: "Explore the conferences ↗" } },
  annArbor && { year: annArbor.year, place: `${annArbor.city} · ${annArbor.dates}`, title: "National conference in Ann Arbor", body: `The network meets again and asks, “${annArbor.theme}”` },
  { year: "2020–2023", place: "Official statements", title: "A public voice", body: "SOS speaks on the record: a Remembrance Day reflection marking nine years since the first protests in Daraa, followed by statements on Idlib, the BLM protests, the earthquake, and solidarity with Gaza.", link: { href: "/media#statements", label: "Read the statements ↗" } },
  syriaIsFree && { year: "2024", place: syriaIsFree.date, title: syriaIsFree.title, body: "SOS issues its statement “Syria is Free.”", link: { href: syriaIsFree.url, label: "Read on Instagram ↗" } },
] as (StoryItem | undefined)[]).filter((item): item is StoryItem => Boolean(item));

export const metadata: Metadata = {
  title: "About | Students Organize For Syria",
  description: "Students Organize For Syria is a national, student-led movement rooted in advocacy, solidarity, and action for Syria.",
};

export default function About(){return <Shell active="about"><PageHero index="01" kicker="About SOS" title={<>Born from urgency.<br /><i>Built for what’s next.</i></>} intro=""/>
<section className="evolution-intro evolution-plain" data-reveal><div className="evolution-copy"><p className="big-copy">SOS began with students refusing to let Syria disappear from public conversation. That same conviction now drives something larger: a generation building the relationships, skills, and community power to shape the future.</p><p>We remain rooted in student organizing. Conferences, training, partnerships, and professional pathways strengthen our organizers; they are infrastructure for the movement, not the movement’s identity.</p></div></section>
<section className="story-timeline"><div className="section-label"><span>2012—Today</span>Our story</div><ol>{story.map(item=><li key={item.title} data-reveal><div className="story-year">{item.year}</div><div className="story-body"><span>{item.place}</span><h3>{item.title}</h3><p>{item.body}</p>{item.link && (item.link.href.startsWith("http") ? <a href={item.link.href} target="_blank" rel="noreferrer" aria-label={`${item.title} — ${item.link.label.replace(" ↗","")} (opens in a new tab)`}>{item.link.label}</a> : <a href={item.link.href}>{item.link.label}</a>)}</div></li>)}<li className="story-today" data-reveal><div className="story-year">Today</div><div className="story-body"><span>Our mission</span><h3>Mobilize the diaspora. Shape Syria’s future.</h3><p>Students Organize for Syria’s ultimate goal is to effectively mobilize for Syria from within the diaspora. We are committed to sustaining a strong, united student network that honors the Syrian revolution, champions advocacy, and empowers a new generation to take part in rebuilding and shaping Syria’s future.</p></div></li></ol></section>
<section className="values"><article><span>01</span><h3>Student-led</h3><p>Young people own the agenda, organize the work, and speak for themselves.</p></article><article><span>02</span><h3>Syria-focused</h3><p>We center informed Syrian voices without reducing Syria to crisis alone.</p></article><article><span>03</span><h3>Community-powered</h3><p>Lasting change is built through chapters, relationships, and collective action.</p></article><article><span>04</span><h3>Built to last</h3><p>We develop the people and partnerships that sustain organizing over time.</p></article></section><section className="founders"><div className="section-label"><span>Our people</span>The founders</div><details className="founders-toggle" open={board.length === 0}><summary>Meet the founders</summary><div className="founder-grid">{founders.map(([name,bio],i)=><article key={name}><span>{String(i+1).padStart(2,"0")}</span><div className="founder-mark">{name.split(" ").map(v=>v[0]).join("")}</div><h2>{name}</h2><p>{bio}</p></article>)}</div><p className="verification-note">These biographies honor the organizers who helped build the early SOS network.</p></details><div className="founders-cta"><p>Organize where you are. Bring your voice, your campus, and your community into what comes next.</p><a className="pill pill-green" href="/get-involved">Build with us ↗</a></div></section></Shell>}
