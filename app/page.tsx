import Link from "next/link";
import { Arrow, Shell } from "./Interior";
import { CampusIcon } from "./chapters/ChapterDirectory";
import { activeChapters, chapterHref, displayName, pastChapters, type Chapter } from "./chapter-data";

const heroCampuses = activeChapters.filter(c => c.logo).slice(0, 4);
const railChapters = [...activeChapters, ...pastChapters];
// Second rail starts mid-list so the two rows never line up card for card.
const railRowTwo = [...railChapters.slice(Math.ceil(railChapters.length / 2)), ...railChapters.slice(0, Math.ceil(railChapters.length / 2))];

const history = [
  ["Books Not Bombs", "With Karam Foundation, SOS helped fund scholarships and support education in Syria."],
  ["Advocacy in D.C.", "SOS and the Syrian American Medical Society brought student voices to Washington."],
  ["Paper Airplanes", "Members offered English tutoring to young Syrians through a national partnership."],
  ["Warmth in Action", "SOS partnered with NuDay Syria to fundraise for winter coats for refugee children."],
];

function RailCard({ chapter, hidden }: { chapter: Chapter; hidden?: boolean }) {
  const past = chapter.status !== "active";
  return <a className={past ? "is-past" : undefined} href={chapterHref(chapter)} tabIndex={hidden ? -1 : undefined}><CampusIcon chapter={chapter}/><span className="campus-copy"><b>{displayName(chapter)}</b><small>{past ? "Past chapter · Revive it" : chapter.location}</small></span><Arrow /></a>;
}

export default function Home() {
  return (
    <Shell>
      <section className="hero hero-impact">
        <div className="impact-photo" aria-hidden="true"><div className="impact-photo-inner"></div><div className="hero-campus-bubbles">{heroCampuses.map(c => <CampusIcon key={c.name} chapter={c}/>)}</div><span className="photo-stamp">{activeChapters.length} active chapters<br/>One connected movement</span></div>
        <div className="impact-copy">
          <div className="hero-eyebrow"><span>Student-led</span><span>Nationwide</span><span>Syria-focused</span></div>
          <h1><span>Students</span><span>shaping Syria’s</span><em>future.</em></h1>
          <div className="impact-bottom"><p>We mobilize students to honor the revolution, build solidarity, and empower a new generation to engage in shaping Syria’s future.</p><div><a className="pill pill-green" href="/get-involved?form=member#apply">Join the movement <Arrow /></a><a className="impact-link" href="#chapters">Explore {activeChapters.length} active chapters ↓</a></div></div>
        </div>
        <a className="impact-badge" href="/get-involved?form=chapter#apply"><span>Bring SOS to your campus</span><b>Start a chapter</b><i>↗</i></a>
        <div className="impact-proof"><span><b>01</b>Organize campuses</span><span><b>02</b>Advocate for Syria</span><span><b>03</b>Mobilize community</span><a href="/about">Our story <Arrow/></a></div>
      </section>

      <div className="marquee" aria-hidden="true"><div>STUDENT-LED / COMMUNITY-POWERED / SYRIA-FOCUSED / BOLD ENOUGH TO BUILD WHAT COMES NEXT / </div></div>

      <section className="manifesto" id="movement" data-reveal>
        <div className="section-label"><span>01</span> The movement</div>
        <p className="manifesto-lead">SOS began with students responding to crisis. Today, we are students <strong>shaping what comes next.</strong></p>
        <div className="manifesto-grid">
          <div className="manifesto-art"><img src="/art/olive-branch.jpg" alt="Print of a pale green olive branch across a deep green circle with the words Rooted in memory, growing forward" /></div>
          <div className="manifesto-copy">
            <h2>Building power,<br />not just programs.</h2>
            <p>Students Organize For Syria’s ultimate goal is to effectively mobilize for Syria from within the diaspora. We are committed to sustaining a strong, united student network that honors the Syrian revolution, champions advocacy, and empowers a new generation to take part in rebuilding and shaping Syria’s future.</p>
            <p>Training, mentorship, and partnerships make our organizers stronger. <b>The movement is the mission.</b></p>
            <a className="line-link" href="#campaigns">What we’re building <Arrow /></a>
          </div>
        </div>
      </section>

      <section className="campaigns" id="campaigns">
        <div className="campaign-intro" data-reveal>
          <div className="section-label light"><span>02</span> Our work</div>
          <h2>People power<br />has a purpose.</h2>
          <p>Our work gives student organizers a clear way to turn attention into action, and action into lasting community power.</p>
        </div>
        <div className="campaign-stack">
          <article className="campaign-card green" data-reveal><span>Organize</span><h3>Campus<br />power</h3><p>Build chapters that make Syria visible, mobilize peers, and create local action.</p><a href="#chapters" aria-label="Find a campus chapter"><Arrow /></a></article>
          <article className="campaign-card paper" data-reveal><span>Advocate</span><h3>Change the<br />narrative</h3><p>Center Syrian voices in public conversation and move people from awareness to solidarity.</p><a href="#history" aria-label="See what students have done"><Arrow /></a></article>
          <article className="campaign-card red" data-reveal><span>Sustain</span><h3>Back the<br />organizers</h3><p>Give young leaders the tools, relationships, and pathways to stay in the work.</p><a href="#join" aria-label="Get involved"><Arrow /></a></article>
        </div>
      </section>

      <section className="history" id="history">
        <div className="history-head" data-reveal>
          <div className="section-label"><span>03</span> What students have done</div>
          <h2>Our history is<br /><i>proof of power.</i></h2>
        </div>
        <div className="history-grid">
          <div className="history-visual"><img src="/art/voices-poster.jpg" alt="Red letterpress poster with a black megaphone sending out sound waves and the words Our voice carries further" /></div>
          <div className="history-list">
            {history.map(([title, text], i) => <article key={title} data-reveal><span>0{i + 1}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}
          </div>
        </div>
        <p className="source-note">Documented on the legacy SOS website.</p>
      </section>

      <section className="chapter-section" id="chapters">
        <div className="chapter-title" data-reveal>
          <div className="section-label light"><span>04</span> Across the country</div>
          <h2>Find your people.<br />Build from where you are.</h2>
          <p>{activeChapters.length} active chapters and {pastChapters.length} past chapters ready to be revived. Select a campus to see its chapter.</p>
        </div>
        <div className="chapter-rails" role="region" aria-label="Students Organize For Syria college chapters">
          <ul className="chapter-track row-0">
            {railChapters.map(c => <li key={c.name}><RailCard chapter={c}/></li>)}
            {railChapters.map(c => <li key={`dup-${c.name}`} aria-hidden="true"><RailCard chapter={c} hidden/></li>)}
          </ul>
          <div className="chapter-track row-1" aria-hidden="true">{[...railRowTwo, ...railRowTwo].map((c, i) => <RailCard key={`row1-${i}`} chapter={c} hidden/>)}</div>
        </div>
        <div className="chapter-cta-row"><a className="pill pill-cream chapter-cta" href="/get-involved?form=chapter#apply">Start a chapter <Arrow /></a><Link className="line-link" href="/chapters">See all chapters <Arrow /></Link></div>
      </section>

      <section className="join" id="join">
        <div className="join-art"><img src="/art/archive-pattern.jpg" alt="Geometric green star pattern around a cream arched panel reading SOS Archive, Rooted in history" /></div>
        <div className="join-copy" data-reveal>
          <p className="overline">There is a place for you here</p>
          <h2>Don’t watch<br />the future.<br /><i>Shape it.</i></h2>
          <div className="join-actions"><a className="pill pill-dark" href="/get-involved?form=chapter#apply">Start a chapter <Arrow /></a><a className="line-link" href="/get-involved?form=member#apply">Become a member <Arrow /></a><a className="line-link" href="/donate">Support SOS <Arrow /></a></div>
        </div>
      </section>

    </Shell>
  );
}
