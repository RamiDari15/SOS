"use client";

import { useState } from "react";

const Arrow = () => <span aria-hidden="true">↗</span>;

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main>
      <div className="alertbar">
        <p>Students are not waiting for Syria’s future. We’re building it.</p>
        <a href="#join">Join the movement <Arrow /></a>
      </div>

      <header className="site-header">
        <a className="logo" href="#top" aria-label="Students Organizing for Syria home">
          <span>SOS</span>
          <small>Students<br />Organizing<br />for Syria</small>
        </a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation">
          {menuOpen ? "Close" : "Menu"}
        </button>
        <nav className={menuOpen ? "open" : ""} aria-label="Main navigation">
          <a href="#mission" onClick={() => setMenuOpen(false)}>Who we are</a>
          <a href="#work" onClick={() => setMenuOpen(false)}>Our work</a>
          <a href="#chapters" onClick={() => setMenuOpen(false)}>Chapters</a>
          <a href="#stories" onClick={() => setMenuOpen(false)}>News</a>
          <a className="nav-cta" href="#join" onClick={() => setMenuOpen(false)}>Take action <Arrow /></a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">A student-led movement for Syria</p>
          <h1>We are<br />shaping the<br /><em>future.</em></h1>
          <p className="hero-intro">Building the next generation of Syrian advocates, leaders, and changemakers—on campus, in our communities, and everywhere our voices matter.</p>
          <div className="hero-actions">
            <a className="button button-dark" href="#join">Build with us <Arrow /></a>
            <a className="text-link" href="#work">See what we’re fighting for <span>↓</span></a>
          </div>
        </div>
        <div className="hero-image" role="img" aria-label="Young people working together at a community gathering">
          <div className="image-tag">Youth power<br />in motion</div>
          <div className="starburst" aria-hidden="true">✦</div>
        </div>
      </section>

      <div className="ticker" aria-hidden="true">
        <div>STUDENT-LED ✦ SYRIA-FOCUSED ✦ COMMUNITY-POWERED ✦ UNAPOLOGETICALLY HOPEFUL ✦</div>
      </div>

      <section className="mission" id="mission">
        <div className="section-kicker"><span>01</span> This is our movement</div>
        <div className="mission-grid">
          <h2>Not a seat<br />at the table.<br /><mark>A new table.</mark></h2>
          <div className="mission-copy">
            <p className="lead">We are students and young people organizing across borders, building community power, and changing the story of who gets to shape Syria’s future.</p>
            <p>SOS began with students responding to a crisis. Today, we are a movement turning solidarity into lasting power. Our chapters lead campaigns, mobilize communities, and create new pathways for young Syrians to act, connect, and lead.</p>
            <a className="text-link dark" href="#work">Meet the movement <Arrow /></a>
          </div>
        </div>
      </section>

      <section className="impact" aria-label="Our impact">
        <div className="section-kicker light"><span>02</span> Power in numbers</div>
        <h2>We show up.<br />We speak out.<br /><em>We build.</em></h2>
        <div className="stats">
          <article><strong>20+</strong><p>student chapters activating campuses and communities</p></article>
          <article><strong>1K+</strong><p>young people connected through action and advocacy</p></article>
          <article><strong>10+</strong><p>years of student-led organizing for Syria</p></article>
        </div>
        <p className="data-note">Illustrative impact figures—replace with SOS’s verified current data before launch.</p>
      </section>

      <section className="work" id="work">
        <div className="section-kicker"><span>03</span> What we’re building</div>
        <div className="work-heading">
          <h2>Our movement<br />moves on <em>three fronts.</em></h2>
          <p>Programs support the mission. Young people drive it.</p>
        </div>
        <div className="work-list">
          <article>
            <span className="number">01</span>
            <div><p className="label">Organize</p><h3>Campus power</h3><p>Student chapters turn campuses into engines for awareness, advocacy, fundraising, and community action.</p></div>
            <a href="#join" aria-label="Learn about campus power"><Arrow /></a>
          </article>
          <article>
            <span className="number">02</span>
            <div><p className="label">Advocate</p><h3>Change the narrative</h3><p>We equip young people to speak with credibility, center Syrian voices, and move decision-makers toward justice.</p></div>
            <a href="#join" aria-label="Learn about advocacy"><Arrow /></a>
          </article>
          <article>
            <span className="number">03</span>
            <div><p className="label">Build</p><h3>Leaders for what’s next</h3><p>Training, mentorship, partnerships, and professional pathways help our organizers sustain their impact for the long haul.</p></div>
            <a href="#join" aria-label="Learn about leadership development"><Arrow /></a>
          </article>
        </div>
      </section>

      <section className="chapters" id="chapters">
        <div className="chapter-photo" role="img" aria-label="Students gathered in conversation outdoors"><span>From campus<br />to community.</span></div>
        <div className="chapter-copy">
          <div className="section-kicker light"><span>04</span> Find your people</div>
          <h2>Start where<br />you are.</h2>
          <p>Every chapter begins with a few students who refuse to stay on the sidelines. Bring SOS to your campus—or join organizers already building near you.</p>
          <div className="chapter-actions">
            <a className="button button-light" href="#join">Find a chapter <Arrow /></a>
            <a className="text-link light" href="#join">Start a chapter <Arrow /></a>
          </div>
        </div>
      </section>

      <section className="stories" id="stories">
        <div className="stories-top"><div className="section-kicker"><span>05</span> From the movement</div><a className="text-link dark" href="#stories">All updates <Arrow /></a></div>
        <h2>Our voices.<br /><em>Our stories.</em></h2>
        <div className="story-grid">
          <article className="featured-story">
            <div className="story-image story-one"><span>Field notes</span></div>
            <p className="meta">Movement update · 6 min read</p>
            <h3>Students are not the leaders of tomorrow. We are leading right now.</h3>
            <a href="#stories">Read the story <Arrow /></a>
          </article>
          <article>
            <div className="story-image story-two"></div>
            <p className="meta">Chapter spotlight · 4 min read</p>
            <h3>How a campus chapter turns one conversation into collective action.</h3>
            <a href="#stories">Read the story <Arrow /></a>
          </article>
        </div>
      </section>

      <section className="join" id="join">
        <div>
          <p className="eyebrow">This future belongs to all of us</p>
          <h2>Don’t watch<br />history happen.<br /><em>Shape it.</em></h2>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <p>Get movement updates, urgent actions, and opportunities to organize with SOS.</p>
          <label htmlFor="email">Email address</label>
          <div className="form-row"><input id="email" type="email" placeholder="you@example.com" required /><button type="submit" aria-label="Subscribe">→</button></div>
          <div className="join-links"><a href="#chapters">Join a chapter <Arrow /></a><a href="#chapters">Start a chapter <Arrow /></a><a href="#">Donate <Arrow /></a></div>
        </form>
      </section>

      <footer>
        <div className="footer-logo">SOS</div>
        <p>Students Organizing for Syria<br />Building power. Shaping the future.</p>
        <div className="footer-links"><a href="#mission">About</a><a href="#work">Our work</a><a href="#chapters">Chapters</a><a href="#stories">News</a><a href="#join">Contact</a></div>
        <div className="footer-bottom"><span>© 2026 Students Organizing for Syria</span><span>Built for the movement.</span></div>
      </footer>
    </main>
  );
}
