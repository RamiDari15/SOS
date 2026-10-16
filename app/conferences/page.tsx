import type { Metadata } from "next";
import { PageHero, Shell } from "../Interior";import { conferences } from "../site-data";
export const metadata: Metadata = {
  title: "Conferences | Students Organize For Syria",
  description: "National conferences that bring students, activists, artists, professionals, and organizations together for Syria.",
};

export default function Conferences(){return <Shell active="conferences"><PageHero index="05" kicker="National conferences" tone="green" title={<>Ideas gather.<br /><i>Movements grow.</i></>} intro="SOS brings students, activists, artists, professionals, and organizations together to imagine what solidarity requires from the next generation."/><section className="conference-list">{conferences.map(c=><article key={c.year} data-reveal><div className="conference-year">{c.year}</div><div><p className="overline">{c.dates} · {c.city}</p><h2>{c.theme}</h2><details><summary>Explore speakers and organizations <span>+</span></summary><div className="speaker-cloud">{c.speakers.map(s=><span key={s}>{s}</span>)}</div></details></div></article>)}</section><section className="conference-note"><div className="art-pulse"><img src="/art/gathering-plan.jpg" alt="Red and green floor-plan drawing of a student gathering with round tables, a stage and rows of chairs"/></div><div><p className="overline">Build the next gathering</p><h2>What should students build together now?</h2><a className="pill pill-dark" href="/contact">Propose a partnership ↗</a></div></section></Shell>}
