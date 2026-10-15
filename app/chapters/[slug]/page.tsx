import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, Shell } from "../../Interior";
import { chapterSlug, chapters, findChapter, instagramUrl, nationalEmail } from "../../chapter-data";

export function generateStaticParams() {
  return chapters.map(c => ({ slug: chapterSlug(c) }));
}

export default async function Chapter({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = findChapter(slug);
  if (!chapter) notFound();

  const { name, location, logo, instagram, email } = chapter;
  const isActive = chapter.status === "active";

  return <Shell active="chapters">
    <PageHero
      index="Chapter"
      kicker={isActive ? "Active chapter" : "Past chapter"}
      tone="green"
      title={<>{name}<br /><i>{isActive ? "organizes here." : "organized here."}</i></>}
      intro={isActive
        ? `${location}. An active chapter of Students Organize For Syria.`
        : `${location}. This SOS chapter is not active right now. Students here can bring it back.`}
    />
    <section className={`chapter-profile ${isActive ? "is-active" : "is-past"}`}>
      <div className="profile-art chapter-logo-art">{logo ? <img src={logo} alt={`${name} logo`}/> : <img src="/brand/dragonfly.jpg" alt="SOS artwork"/>}</div>
      <div>
        <p className="overline">Campus chapter</p>
        <h2>{isActive ? <>Built by students.<br />Connected nationally.</> : <>Ready for<br />its next chapter.</>}</h2>
        <dl>
          <div><dt>Campus</dt><dd>{name}</dd></div>
          <div><dt>Location</dt><dd>{location}</dd></div>
          <div><dt>Status</dt><dd><span className={`chapter-status ${isActive ? "is-active" : "is-past"}`}>{isActive ? "Active" : "Inactive"}</span></dd></div>
          {instagram && <div><dt>Instagram</dt><dd><a href={instagramUrl(instagram)} target="_blank" rel="noopener noreferrer">@{instagram} ↗</a></dd></div>}
          {email
            ? <div><dt>Chapter email</dt><dd><a href={`mailto:${email}`}>{email}</a></dd></div>
            : <div><dt>Contact</dt><dd><a href={`mailto:${nationalEmail}`}>{nationalEmail}</a> (national team)</dd></div>}
          <div><dt>Network</dt><dd>Students Organize For Syria</dd></div>
        </dl>
        {isActive
          ? <p>Study here? Join the chapter and organize with students on your campus.{instagram ? " Follow the chapter on Instagram for meetings and events." : ""}</p>
          : <p>Want to bring SOS back to this campus? The national team will help you restart the chapter, from finding co-organizers to planning your first event.</p>}
        <div className="chapter-actions">
          {isActive
            ? <a className="pill pill-green" href="/get-involved?form=member#apply">Join this chapter ↗</a>
            : <a className="pill pill-green" href="/get-involved?form=chapter#apply">Revive this chapter ↗</a>}
          <Link className="line-link" href="/chapters">All chapters ↗</Link>
        </div>
      </div>
    </section>
  </Shell>;
}
