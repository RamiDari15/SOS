"use client";

import { FormEvent, ReactNode, useEffect, useState } from "react";
import { legacyChapters, slugify } from "./site-data";

export const Arrow = () => <span aria-hidden="true">↗</span>;

export function CampusIcon({ name }: { name: string }) {
  const initials = name.split(/\s+/).map(word => word[0]).join("").slice(0, 2).toUpperCase();
  return <span className="campus-icon" aria-hidden="true"><i>{initials}</i><b></b></span>;
}

export function Shell({ children, active }: { children: ReactNode; active?: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add("is-visible")), { threshold: .12 });
    document.querySelectorAll("[data-reveal]").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return <main>
    <div className="signal"><span>Students shaping Syria’s future</span><a href="/get-involved">Join the movement <Arrow /></a></div>
    <header className="nav-wrap">
      <a className="brand" href="/" aria-label="Students Organize for Syria home"><b>SOS</b><span>Students<br />Organize<br />for Syria</span></a>
      <button className="menu" onClick={() => setOpen(!open)} aria-expanded={open}>{open ? "Close" : "Menu"}</button>
      <nav className={open ? "nav-open" : ""} aria-label="Main navigation">
        <a className={active === "about" ? "active" : ""} href="/about">About</a>
        <a className={active === "work" ? "active" : ""} href="/our-work">Our work</a>
        <a className={active === "campaigns" ? "active" : ""} href="/campaigns">Campaigns</a>
        <a className={active === "chapters" ? "active" : ""} href="/chapters">Chapters</a>
        <a className={active === "news" ? "active" : ""} href="/news">News</a>
        <a className="nav-action" href="/get-involved">Take action <Arrow /></a>
      </nav>
    </header>
    {children}
    <footer>
      <a className="footer-mark" href="/">SOS</a>
      <p>Students Organize for Syria<br />Building community power.<br />Shaping what comes next.</p>
      <div className="footer-nav"><a href="/about">About</a><a href="/our-work">Our work</a><a href="/campaigns">Campaigns</a><a href="/chapters">Chapters</a><a href="/news">News</a><a href="/contact">Contact</a></div>
      <div className="footer-meta"><span>© 2026 Students Organize for Syria</span><span>Student-led. Always.</span></div>
    </footer>
  </main>;
}

export function PageHero({ index, kicker, title, intro, tone = "paper" }: { index: string; kicker: string; title: ReactNode; intro: string; tone?: "paper" | "green" | "red" }) {
  return <section className={`page-hero ${tone}`}><div className="section-label"><span>{index}</span>{kicker}</div><h1>{title}</h1><p>{intro}</p></section>;
}

export function ChapterDirectory() {
  const [query, setQuery] = useState("");
  const [paused, setPaused] = useState(false);
  const filtered = legacyChapters.filter(([name, place]) => `${name} ${place}`.toLowerCase().includes(query.toLowerCase()));
  return <>
    <section className="network" aria-labelledby="network-title">
      <div className="network-head"><div><p className="overline">Legacy chapter network</p><h2 id="network-title">Across campuses.<br />Connected by purpose.</h2></div><button onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? "Play animation" : "Pause animation"}</button></div>
      <div className={`orbit ${paused ? "paused" : ""}`}>{[...legacyChapters, ...legacyChapters].map(([name, place], i) => <a key={`${name}-${i}`} href={`/chapters/${slugify(name)}`}><CampusIcon name={name}/><span className="campus-copy"><b>{name}</b><small>{place}</small></span><Arrow /></a>)}</div>
      <p className="verification-note">These schools appeared in the legacy SOS network. Current chapter status must be confirmed before public launch.</p>
    </section>
    <section className="directory">
      <div className="directory-tools"><div><p className="overline">Find a campus</p><h2>Chapter directory</h2></div><label>Search by school or location<input value={query} onChange={e => setQuery(e.target.value)} placeholder="Try Michigan or Chicago" /></label></div>
      <div className="directory-grid">{filtered.map(([name, place], i) => <a href={`/chapters/${slugify(name)}`} key={name}><span className="campus-number">{String(i + 1).padStart(2, "0")}</span><CampusIcon name={name}/><h3>{name}</h3><p>{place}</p><b className="card-link">View chapter <Arrow /></b></a>)}</div>
      {filtered.length === 0 && <p className="empty">No matching legacy chapter. <a href="/get-involved">Start one at your school <Arrow /></a></p>}
    </section>
  </>;
}

export function ContactForm() {
  const [sent, setSent] = useState(false);
  function submit(e: FormEvent) { e.preventDefault(); setSent(true); }
  if (sent) return <div className="form-success" role="status"><span>✓</span><h2>Message prepared.</h2><p>This prototype demonstrates the completed interaction. Connect SOS’s approved inbox before launch to deliver submissions.</p><button onClick={() => setSent(false)}>Send another</button></div>;
  return <form className="contact-form" onSubmit={submit}>
    <label>Name<input name="name" required /></label><label>Email<input name="email" type="email" required /></label>
    <label>What can we help with?<select name="topic" defaultValue=""><option value="" disabled>Select one</option><option>Start or join a chapter</option><option>Partnership</option><option>Press or statement</option><option>General inquiry</option></select></label>
    <label>Message<textarea name="message" rows={6} required /></label><button className="pill pill-green" type="submit">Send message <Arrow /></button>
  </form>;
}
