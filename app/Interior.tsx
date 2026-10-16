"use client";

import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";

export const Arrow = () => <span aria-hidden="true">↗</span>;

const NAV_ITEMS: { key?: string; href: string; label: string }[] = [
  { key: "about", href: "/about", label: "About" },
  { key: "work", href: "/our-work", label: "Our work" },
  { key: "campaigns", href: "/campaigns", label: "Campaigns" },
  { key: "chapters", href: "/chapters", label: "Chapters" },
  { key: "conferences", href: "/conferences", label: "Conferences" },
  { key: "news", href: "/media", label: "Media" },
  { key: "newsletter", href: "/newsletter", label: "Newsletter" },
  { href: "/toolkits", label: "Toolkits" },
  { key: "donate", href: "/donate", label: "Donate" },
];

export function Shell({ children, active }: { children: ReactNode; active?: string }) {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add("is-visible")), { threshold: .12 });
    document.querySelectorAll("[data-reveal]").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Close the mobile menu after any navigation, including back/forward cache restores and in-page hash jumps.
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("pageshow", close);
    window.addEventListener("hashchange", close);
    return () => {
      window.removeEventListener("pageshow", close);
      window.removeEventListener("hashchange", close);
    };
  }, []);

  // Escape closes the open menu and returns focus to its toggle.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      menuButton.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return <div className="site">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div className="signal"><span>Students shaping Syria’s future</span><Link href="/get-involved">Join the movement <Arrow /></Link></div>
    <header className="nav-wrap">
      <Link className="brand" href="/" aria-label="Students Organize For Syria home"><b>SOS</b><span>Students<br />Organize<br />For Syria</span></Link>
      <button ref={menuButton} type="button" className="menu" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="site-nav">{open ? "Close" : "Menu"}</button>
      <nav id="site-nav" className={open ? "nav-open" : ""} aria-label="Main navigation">
        {NAV_ITEMS.map(item => {
          const current = item.key !== undefined && active === item.key;
          return <Link key={item.href} className={current ? "active" : ""} href={item.href} aria-current={current ? "page" : undefined} onClick={close}>{item.label}</Link>;
        })}
        <Link className="nav-action" href="/get-involved" onClick={close}>Take action <Arrow /></Link>
      </nav>
    </header>
    {/* While the mobile menu is open, the page behind it is inert so focus and screen readers stay in the menu. */}
    <main id="main-content" tabIndex={-1} inert={open || undefined}>{children}</main>
    <footer inert={open || undefined}>
      <Link className="footer-mark" href="/" aria-label="Students Organize For Syria home">SOS</Link>
      <p>Students Organize For Syria<br />Building community power.<br />Shaping what comes next.<br/><a href="mailto:sos@organize4syria.com">sos@organize4syria.com</a><br/><a href="https://www.instagram.com/organize4syria/">Instagram</a> · <a href="https://www.facebook.com/Organize4Syria/">Facebook</a></p>
      <nav className="footer-nav" aria-label="Footer"><Link href="/about">About</Link><Link href="/our-work">Our work</Link><Link href="/campaigns">Campaigns</Link><Link href="/chapters">Chapters</Link><Link href="/conferences">Conferences</Link><Link href="/media">Media</Link><Link href="/newsletter">Newsletter</Link><Link href="/toolkits">Toolkits</Link><Link href="/donate">Donate</Link><Link href="/contact">Contact</Link></nav>
      <div className="footer-meta"><span>© 2026 Students Organize For Syria</span><span>Student-led. Always.</span></div>
    </footer>
  </div>;
}

export function PageHero({ index, kicker, title, intro, tone = "paper" }: { index: string; kicker: string; title: ReactNode; intro: string; tone?: "paper" | "green" | "red" }) {
  return <section className={`page-hero ${tone}`}><div className="section-label"><span>{index}</span>{kicker}</div><h1>{title}</h1>{intro && <p>{intro}</p>}</section>;
}
