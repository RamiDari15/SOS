"use client";

import { useEffect, useState } from "react";
import { CampusIcon } from "./Interior";
import { legacyChapters, slugify } from "./site-data";

const history = [
  ["Books Not Bombs", "With Karam Foundation, SOS helped fund scholarships and support education in Syria."],
  ["Advocacy in D.C.", "SOS and the Syrian American Medical Society brought student voices to Washington."],
  ["Paper Airplanes", "Members offered English tutoring to young Syrians through a national partnership."],
  ["Warmth in Action", "SOS partnered with NuDay Syria to fundraise for winter coats for refugee children."],
];

function Arrow() { return <span aria-hidden="true">↗</span>; }

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible"));
    }, { threshold: 0.14 });
    document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main id="top">
      <div className="signal"><span>Students shaping Syria’s future</span><a href="#join">Join the movement <Arrow /></a></div>

      <header className="nav-wrap">
        <a className="brand" href="#top" aria-label="SOS home"><b>SOS</b><span>Students<br />Organize<br />for Syria</span></a>
        <button className="menu" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen}>{menuOpen ? "Close" : "Menu"}</button>
        <nav className={menuOpen ? "nav-open" : ""} aria-label="Main navigation">
          <a href="/about">About</a>
          <a href="/our-work">Our work</a>
          <a href="/campaigns">Campaigns</a>
          <a href="/chapters">Chapters</a>
          <a href="/conferences">Conferences</a>
          <a href="/media">Media</a>
          <a href="/newsletter">Newsletter</a>
          <a href="/toolkits">Toolkits</a>
          <a href="/donate">Donate</a>
          <a className="nav-action" href="/get-involved">Take action <Arrow /></a>
        </nav>
      </header>

      <section className="hero hero-impact">
        <div className="impact-photo" aria-hidden="true"><div className="impact-photo-inner"></div><div className="hero-campus-bubbles"><CampusIcon name="Arizona State"/><CampusIcon name="Michigan"/><CampusIcon name="Yale"/><CampusIcon name="UCLA"/></div><span className="photo-stamp">32 legacy campuses<br/>One connected movement</span></div>
        <div className="impact-copy">
          <div className="hero-eyebrow"><span>Student-led</span><span>Nationwide</span><span>Syria-focused</span></div>
          <h1><span>Students</span><span>shaping Syria’s</span><em>future.</em></h1>
          <div className="impact-bottom"><p>We mobilize students to honor the revolution, build solidarity, and empower a new generation to engage in shaping Syria’s future.</p><div><a className="pill pill-green" href="/get-involved?form=member#apply">Join the movement <Arrow /></a><a className="impact-link" href="#chapters">Explore 32 campuses ↓</a></div></div>
        </div>
        <a className="impact-badge" href="/get-involved?form=chapter#apply"><span>Bring SOS to your campus</span><b>Start a chapter</b><i>↗</i></a>
        <div className="impact-proof"><span><b>01</b>Organize campuses</span><span><b>02</b>Advocate for Syria</span><span><b>03</b>Mobilize community</span><a href="/about">Our story <Arrow/></a></div>
      </section>

      <div className="marquee" aria-hidden="true"><div>STUDENT-LED / COMMUNITY-POWERED / SYRIA-FOCUSED / BOLD ENOUGH TO BUILD WHAT COMES NEXT / </div></div>

      <section className="manifesto" id="movement" data-reveal>
        <div className="section-label"><span>01</span> The movement</div>
        <p className="manifesto-lead">SOS began with students responding to crisis. Today, we are students <strong>shaping what comes next.</strong></p>
        <div className="manifesto-grid">
          <div className="manifesto-art"><img src="/brand/dragonfly.jpg" alt="Red and cobalt dragonfly print artwork" /></div>
          <div className="manifesto-copy">
            <h2>Building power,<br />not just programs.</h2>
            <p>We organize young people across campuses and communities to advocate, act, and create a future for Syria shaped by Syrians.</p>
            <p>Training, mentorship, partnerships, and professional pathways make our organizers stronger. They support the mission. <b>The movement is the mission.</b></p>
            <a className="line-link" href="#campaigns">What we’re building <Arrow /></a>
          </div>
        </div>
      </section>

      <section className="campaigns" id="campaigns">
        <div className="campaign-intro" data-reveal>
          <div className="section-label light"><span>02</span> Our work</div>
          <h2>People power<br />has a purpose.</h2>
          <p>Our campaigns give student organizers a clear way to turn attention into action—and action into lasting community power.</p>
        </div>
        <div className="campaign-stack">
          <article className="campaign-card green" data-reveal><span>Organize</span><h3>Campus<br />power</h3><p>Build chapters that make Syria visible, mobilize peers, and create local action.</p><a href="#chapters"><Arrow /></a></article>
          <article className="campaign-card paper" data-reveal><span>Advocate</span><h3>Change the<br />narrative</h3><p>Center Syrian voices in public conversation and move people from awareness to solidarity.</p><a href="#history"><Arrow /></a></article>
          <article className="campaign-card red" data-reveal><span>Sustain</span><h3>Back the<br />organizers</h3><p>Give young leaders the tools, relationships, and pathways to stay in the work.</p><a href="#join"><Arrow /></a></article>
        </div>
      </section>

      <section className="history" id="history">
        <div className="history-head" data-reveal>
          <div className="section-label"><span>03</span> What students have done</div>
          <h2>Our history is<br /><i>proof of power.</i></h2>
        </div>
        <div className="history-grid">
          <div className="history-visual"><img src="/brand/art-speaks.jpg" alt="Activist poster reading Art Speaks" /></div>
          <div className="history-list">
            {history.map(([title, text], i) => <article key={title} data-reveal><span>0{i + 1}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}
          </div>
        </div>
        <p className="source-note">Documented on the legacy SOS website. Current impact data should be verified before public launch.</p>
      </section>

      <section className="chapter-section" id="chapters">
        <div className="chapter-title" data-reveal>
          <div className="section-label light"><span>04</span> Across the country</div>
          <h2>Find your people.<br />Build from where you are.</h2>
          <p>Explore schools connected to the SOS chapter network. Select a campus to visit the existing chapter directory.</p>
        </div>
        <div className="chapter-rails" aria-label="SOS college chapters">
          {[0,1].map((row) => <div className={`chapter-track row-${row}`} key={row}>{[...legacyChapters, ...legacyChapters].map(([chapter, place], i) => <a key={`${row}-${i}`} href={`/chapters/${slugify(chapter)}`}><CampusIcon name={chapter}/><span className="campus-copy"><b>{chapter}</b><small>{place}</small></span><Arrow /></a>)}</div>)}
        </div>
        <a className="pill pill-cream chapter-cta" href="/get-involved?form=chapter#apply">Start a chapter <Arrow /></a>
      </section>

      <section className="join" id="join">
        <div className="join-art"><img src="/brand/archive-frame.jpg" alt="Historic floral manuscript frame" /></div>
        <div className="join-copy" data-reveal>
          <p className="overline">There is a place for you here</p>
          <h2>Don’t watch<br />the future.<br /><i>Shape it.</i></h2>
          <div className="join-actions"><a className="pill pill-dark" href="/get-involved?form=chapter#apply">Start a chapter <Arrow /></a><a className="line-link" href="/get-involved?form=member#apply">Become a member <Arrow /></a><a className="line-link" href="/donate">Support SOS <Arrow /></a></div>
        </div>
      </section>

      <footer>
        <a className="footer-mark" href="#top">SOS</a>
        <p>Students Organize For Syria<br />Building community power.<br />Shaping what comes next.<br/><a href="https://www.instagram.com/organize4syria/">Instagram</a> · <a href="https://www.facebook.com/Organize4Syria/">Facebook</a></p>
        <div className="footer-nav"><a href="/about">About</a><a href="/our-work">Our work</a><a href="/campaigns">Campaigns</a><a href="/chapters">Chapters</a><a href="/conferences">Conferences</a><a href="/media">Media</a><a href="/newsletter">Newsletter</a><a href="/toolkits">Toolkits</a><a href="/donate">Donate</a><a href="/contact">Contact</a></div>
        <div className="footer-meta"><span>© 2026 Students Organize for Syria</span><span>Student-led. Always.</span></div>
      </footer>
    </main>
  );
}
