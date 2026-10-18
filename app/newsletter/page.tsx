import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, PageHero, Shell } from "../Interior";
import { NewsletterForm } from "../Forms";
import { statements } from "../site-data";

export const metadata: Metadata = {
  title: "Newsletter | Students Organize For Syria",
  description:
    "Subscribe to the monthly Students Organize For Syria newsletter: chapter updates, organizer voices, opportunities to act, and new statements.",
};

const perks = [
  ["Chapter updates", "What chapters across the country are organizing, from campus events to new and revived chapters."],
  ["Organizer voices", "Stories and reflections from the students doing the work."],
  ["Opportunities to act", "Campaigns, events, and ways to show up for Syria on your campus and in your community."],
  ["New statements", "Official Students Organize For Syria statements as soon as they are published."],
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
        intro="One email a month from Students Organize For Syria with chapter updates, organizer voices, opportunities to act, and new statements."
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
            <div><dt>How often</dt><dd>Monthly. One email, no daily noise.</dd></div>
            <div><dt>Your privacy</dt><dd>Your email is only used for Students Organize For Syria updates.</dd></div>
            <div><dt>Unsubscribe</dt><dd>Any time: reply to any newsletter or <a href={UNSUBSCRIBE}>email us with “Unsubscribe”</a>.</dd></div>
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
            <Link key={s.title} href="/media#statements" className="latest-card">
              <time>{s.date}</time>
              <h3>{s.title}</h3>
              <p>{s.summary}</p>
              <b>Read in the archive <Arrow /></b>
            </Link>
          ))}
        </div>
        <p className="newsletter-unsubscribe">Want to stop getting emails? <a href={UNSUBSCRIBE}>Email us</a> and we’ll take you off the list.</p>
      </section>
    </Shell>
  );
}
