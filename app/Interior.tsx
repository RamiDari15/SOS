"use client";

import { FormEvent, ReactNode, useEffect, useState } from "react";
import { collegeLogos, legacyChapters, slugify } from "./site-data";

export const Arrow = () => <span aria-hidden="true">↗</span>;

export function CampusIcon({ name }: { name: string }) {
  const initials = name.split(/\s+/).map(word => word[0]).join("").slice(0, 2).toUpperCase();
  const logo = collegeLogos[name];
  return <span className="campus-icon" aria-hidden="true">{logo ? <img src={logo} alt=""/> : <i>{initials}</i>}<b></b></span>;
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
        <a className={active === "conferences" ? "active" : ""} href="/conferences">Conferences</a>
        <a className={active === "news" ? "active" : ""} href="/media">Media</a>
        <a className={active === "newsletter" ? "active" : ""} href="/newsletter">Newsletter</a>
        <a href="/toolkits">Toolkits</a>
        <a className={active === "donate" ? "active" : ""} href="/donate">Donate</a>
        <a className="nav-action" href="/get-involved">Take action <Arrow /></a>
      </nav>
    </header>
    {children}
    <footer>
      <a className="footer-mark" href="/">SOS</a>
      <p>Students Organize For Syria<br />Building community power.<br />Shaping what comes next.<br/><a href="mailto:sos@organize4syria.com">sos@organize4syria.com</a><br/><a href="https://www.instagram.com/organize4syria/">Instagram</a> · <a href="https://www.facebook.com/Organize4Syria/">Facebook</a></p>
      <div className="footer-nav"><a href="/about">About</a><a href="/our-work">Our work</a><a href="/campaigns">Campaigns</a><a href="/chapters">Chapters</a><a href="/conferences">Conferences</a><a href="/media">Media</a><a href="/newsletter">Newsletter</a><a href="/toolkits">Toolkits</a><a href="/donate">Donate</a><a href="/contact">Contact</a></div>
      <div className="footer-meta"><span>© 2026 Students Organize for Syria</span><span>Student-led. Always.</span></div>
    </footer>
  </main>;
}

export function PageHero({ index, kicker, title, intro, tone = "paper" }: { index: string; kicker: string; title: ReactNode; intro: string; tone?: "paper" | "green" | "red" }) {
  return <section className={`page-hero ${tone}`}><div className="section-label"><span>{index}</span>{kicker}</div><h1>{title}</h1>{intro && <p>{intro}</p>}</section>;
}

export function ChapterDirectory() {
  const [query, setQuery] = useState("");
  const [paused, setPaused] = useState(false);
  const filtered = legacyChapters.filter(([name, place]) => `${name} ${place}`.toLowerCase().includes(query.toLowerCase()));
  return <>
    <section className="network" aria-labelledby="network-title">
      <div className="network-head"><div><p className="overline">SOS chapter network</p><h2 id="network-title">Across campuses.<br />Connected by purpose.</h2></div><button onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? "Play animation" : "Pause animation"}</button></div>
      <div className={`orbit ${paused ? "paused" : ""}`}>{[...legacyChapters, ...legacyChapters].map(([name, place], i) => <a key={`${name}-${i}`} href={`/chapters/${slugify(name)}`}><CampusIcon name={name}/><span className="campus-copy"><b>{name}</b><small>{place}</small></span><Arrow /></a>)}</div>
      <p className="verification-note">Explore campuses connected to the SOS network across the United States.</p>
    </section>
    <section className="directory">
      <div className="directory-tools"><div><p className="overline">Find a campus</p><h2>Chapter directory</h2></div><label>Search by school or location<input value={query} onChange={e => setQuery(e.target.value)} placeholder="Try Michigan or Chicago" /></label></div>
      <div className="directory-grid">{filtered.map(([name, place], i) => <a href={`/chapters/${slugify(name)}`} key={name}><span className="campus-number">{String(i + 1).padStart(2, "0")}</span><CampusIcon name={name}/><h3>{name}</h3><p>{place}</p><b className="card-link">View chapter <Arrow /></b></a>)}</div>
      {filtered.length === 0 && <p className="empty">No matching chapter. <a href="/get-involved">Start one at your school <Arrow /></a></p>}
    </section>
  </>;
}

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [toolkitRequest, setToolkitRequest] = useState(false);
  useEffect(() => setToolkitRequest(new URLSearchParams(window.location.search).get("topic") === "toolkit"), []);
  function submit(e: FormEvent) { e.preventDefault(); setSent(true); }
  if (sent) return <div className="form-success" role="status"><span>✓</span><h2>Message received.</h2><p>Thank you for reaching out. The SOS team will follow up at the email you provided.</p><button onClick={() => setSent(false)}>Send another</button></div>;
  return <form className="contact-form cool-form" id="contact-form" onSubmit={submit}>
    <div className="form-heading"><span>Message desk</span><b>01 — 04</b></div>
    <label><span>Name</span><input name="name" placeholder="Your full name" required /></label><label><span>Email</span><input name="email" type="email" placeholder="you@school.edu" required /></label>
    <label>What can we help with?<select name="topic" defaultValue={toolkitRequest ? "Chapter toolkit access" : ""}><option value="" disabled>Select one</option><option>Start or join a chapter</option><option>Chapter toolkit access</option><option>Partnership</option><option>Press or statement</option><option>General inquiry</option></select></label>
    <label><span>Message</span><textarea name="message" rows={6} placeholder="Tell us what you want to build…" required /></label><button className="pill pill-green" type="submit">Send message <Arrow /></button><p className="form-fineprint">Messages are directed to <a href="mailto:sos@organize4syria.com">sos@organize4syria.com</a>.</p>
  </form>;
}

export function MovementForms() {
  const [mode,setMode]=useState<"member"|"chapter">("member"); const [done,setDone]=useState(false);
  useEffect(()=>{if(new URLSearchParams(window.location.search).get("form")==="chapter")setMode("chapter")},[]);
  function submit(e:FormEvent){e.preventDefault();setDone(true)}
  return <section className="application-zone" id="apply"><div className="application-intro"><p className="overline">Take the next step</p><h2>Turn intention<br/>into action.</h2><p>Tell us about your campus, your interests, and how you want to contribute. The SOS team will help connect you with the right next step.</p><div className="form-tabs"><button className={mode==="member"?"active":""} onClick={()=>{setMode("member");setDone(false)}}>Join a chapter</button><button className={mode==="chapter"?"active":""} onClick={()=>{setMode("chapter");setDone(false)}}>Start a chapter</button></div></div>{done?<div className="form-success application-success" role="status"><span>✓</span><h2>Interest received.</h2><p>Thank you for stepping forward. The SOS team will follow up at the email you provided.</p><button onClick={()=>setDone(false)}>Submit another</button></div>:<form className="cool-form application-form" onSubmit={submit}><div className="form-heading"><span>{mode==="member"?"Member interest":"Chapter starter"}</span><b>Get involved</b></div><div className="form-row"><label><span>Name</span><input required placeholder="Your full name"/></label><label><span>Email</span><input required type="email" placeholder="you@school.edu"/></label></div><div className="form-row"><label><span>School</span><input required placeholder="University or institution"/></label><label><span>{mode==="member"?"Major / field":"State / region"}</span><input required placeholder={mode==="member"?"What do you study?":"Where are you organizing?"}/></label></div>{mode==="member"?<><label><span>How would you like to participate?</span><select required defaultValue=""><option value="" disabled>Choose a role</option><option>General member</option><option>Chapter officer</option><option>Volunteer for campaigns</option><option>Not sure yet</option></select></label><label><span>Existing student organizations</span><input placeholder="Optional — list any affiliations"/></label></>:<><label><span>Phone number</span><input required type="tel" placeholder="(000) 000-0000"/></label><label><span>Why this campus, why now?</span><textarea required rows={4} placeholder="Tell us about student interest and what you hope to build."/></label></>}<label><span>Anything else we should know?</span><textarea rows={4} placeholder="Experience, goals, accessibility needs, or questions"/></label><button className="pill pill-green" type="submit">Submit interest <Arrow/></button><p className="form-fineprint">Questions about applying? Email <a href="mailto:sos@organize4syria.com">sos@organize4syria.com</a>.</p></form>}</section>
}
