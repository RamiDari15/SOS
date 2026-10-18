import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, PageHero, Shell } from "../Interior";
import { NewsletterForm } from "../Forms";
import { statementLinkLabel, statements } from "../site-data";

export const metadata: Metadata = {
  title: "Newsletter | Students Organize For Syria",
  description:
    "A monthly email from Students Organize For Syria with chapter updates, organizer voices, opportunities to act, and new statements.",
};

const perks = [
  ["Chapter updates", "What chapters across the country are organizing, from campus events to new and revived chapters."],
  ["Organizer voices", "Stories and reflections from the students doing the work."],
  ["Opportunities to act", "Campaigns, events, and ways to show up for Syria on your campus and in your community."],
  ["New statements", "New official statements."],
] as const;

const UNSUBSCRIBE = "mailto:sos@organize4syria.com?subject=Unsubscribe";

export default function Newsletter() {
  const latest = statements.slice(0, 3);
  return (
    <Shell active="newsletter">
      <PageHero
        index="07"
        kicker="Monthly newsletter"
        tone="green"
        title={<>Field notes<br /><i>from the movement.</i></>}
        intro="A monthly email from Students Organize For Syria with chapter updates, organizer voices, opportunities to act, and new statements."
      />
      <section className="newsletter-stage" aria-labelledby="newsletter-what">
        <div className="newsletter-copy">
          <p className="overline">What you’ll get</p>
          <h2 id="newsletter-what">Stay close<br />to the movement.</h2>
          <ul className="newsletter-perks">
            {perks.map(([title, text], i) => (
              <li key={title}>
                <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <div><b>{title}</b><p>{text}</p></div>
              </li>
            ))}
          </ul>
          <dl className="newsletter-facts">
            <div><dt>How often</dt><dd>Monthly.</dd></div>
            <div><dt>Your privacy</dt><dd>We use your email only to send Students Organize For Syria updates. We never sell or share it.</dd></div>
            <div><dt>Unsubscribe</dt><dd>Any time: email <a href={UNSUBSCRIBE}>sos@organize4syria.com</a> with “Unsubscribe”.</dd></div>
          </dl>
        </div>
        <NewsletterForm />
      </section>
      <section className="newsletter-latest" aria-labelledby="newsletter-latest-title">
        <div className="newsletter-latest-head">
          <p className="overline">Latest from SOS</p>
          <h2 id="newsletter-latest-title">Recent statements</h2>
          <Link className="line-link" href="/media#statements">All statements <Arrow /></Link>
        </div>
        <div className="newsletter-latest-grid">
          {latest.map((s) => (
            <a
              key={s.title}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="latest-card"
              aria-label={`${s.title}, ${s.date}: ${statementLinkLabel(s).replace(" ↗", "")} (opens in a new tab)`}
            >
              <time>{s.date}</time>
              <h3>{s.title}</h3>
              <p>{s.summary}</p>
              <b>{statementLinkLabel(s)}</b>
            </a>
          ))}
        </div>
        <p className="newsletter-unsubscribe">Want to stop getting emails? Email <a href={UNSUBSCRIBE}>sos@organize4syria.com</a> with “Unsubscribe”.</p>
      </section>
    </Shell>
  );
}
