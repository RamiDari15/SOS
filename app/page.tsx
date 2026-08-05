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
          <a href="/news">News</a>
          <a className="nav-action" href="/get-involved">Take action <Arrow /></a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-art" aria-hidden="true">
          <div className="green-orbit"></div>
          <div className="hero-art-image"></div>
          <p className="art-caption">A movement belongs<br />to the people building it.</p>
        </div>
        <div className="hero-copy">
          <p className="overline">A student-led movement for Syria</p>
          <h1><span>We are not</span><span>waiting for</span><em>the future.</em></h1>
          <div className="hero-bottom">
            <p>We are building it—campus by campus, community by community, voice by voice.</p>
            <a className="pill pill-green" href="#chapters">Find your chapter <Arrow /></a>
          </div>
        </div>
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
        <a className="pill pill-cream chapter-cta" href="https://organize4syria.com/start-a-chapter/" target="_blank" rel="noreferrer">Start a chapter <Arrow /></a>
      </section>

      <section className="gather" data-reveal>
        <div className="gather-image"><div className="blur-bloom"></div></div>
        <div className="gather-copy">
          <p className="overline">The people become the brand</p>
          <blockquote>A movement is built together—in rooms where students plan, listen, act, and return to do it again.</blockquote>
          <p>At chapter meetings, conferences, workshops, campus actions, and in every conversation that moves someone to care—we are practicing the future we want.</p>
        </div>
      </section>

      <section className="join" id="join">
        <div className="join-art"><img src="/brand/archive-frame.jpg" alt="Historic floral manuscript frame" /></div>
        <div className="join-copy" data-reveal>
          <p className="overline">There is a place for you here</p>
          <h2>Don’t watch<br />the future.<br /><i>Shape it.</i></h2>
          <div className="join-actions"><a className="pill pill-dark" href="https://organize4syria.com/start-a-chapter/" target="_blank" rel="noreferrer">Start a chapter <Arrow /></a><a className="line-link" href="https://organize4syria.com/become-an-sos-member/" target="_blank" rel="noreferrer">Become a member <Arrow /></a></div>
        </div>
      </section>

      <footer>
        <a className="footer-mark" href="#top">SOS</a>
        <p>Students Organize for Syria<br />Building community power.<br />Shaping what comes next.</p>
        <div className="footer-nav"><a href="/about">About</a><a href="/our-work">Our work</a><a href="/campaigns">Campaigns</a><a href="/chapters">Chapters</a><a href="/news">News</a><a href="/contact">Contact</a></div>
        <div className="footer-meta"><span>© 2026 Students Organize for Syria</span><span>Student-led. Always.</span></div>
      </footer>
    </main>
  );
}
