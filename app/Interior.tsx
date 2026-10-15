"use client";

import { ReactNode, useEffect, useState } from "react";

export const Arrow = () => <span aria-hidden="true">↗</span>;

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
