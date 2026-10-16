import type { Metadata } from "next";
import { PageHero, Shell } from "../Interior";
import { statementLinkLabel, statements } from "../site-data";

export const metadata: Metadata = {
  title: "News & statements | Students Organize For Syria",
  description: "Official statements and public positions from Students Organize For Syria, newest first.",
};

export default function News(){return <Shell active="news"><PageHero index="06" kicker="News & statements" tone="red" title={<>Our voices.<br /><i>On the record.</i></>} intro="Official statements and public positions from Students Organize For Syria, newest first."/><section className="release-archive" id="statements"><div className="section-label"><span>Statements</span>Official statements</div>{statements.map((s,i)=><article data-reveal key={s.title}><time>{s.date}</time><span>{String(i+1).padStart(2,"0")}</span><div><h2>{s.title}</h2><p>{s.summary}</p></div><a className="statement-link" href={s.url} target="_blank" rel="noreferrer" aria-label={`${s.title} — ${statementLinkLabel(s).replace(" ↗","")} (opens in a new tab)`}>{statementLinkLabel(s)}</a></article>)}</section><section className="news-empty"><div><p className="overline">Stay connected</p><h2>Stories from the movement.</h2></div><div><p>Read stories from organizers, chapters, campaigns, and the wider SOS community in the monthly newsletter. Press coverage and the photo archive live on the Media page.</p><div className="news-actions"><a className="pill pill-dark" href="/newsletter">Join the monthly newsletter ↗</a><a className="pill" href="/media">Visit the media archive ↗</a></div></div></section></Shell>}
