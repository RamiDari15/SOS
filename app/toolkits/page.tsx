import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Shell } from "../Interior";
import { CopyButton } from "./ToolkitActions";
import { BOILERPLATE, CONTACT_EMAIL, MISSION, ORG_NAME, brandFiles, chapterSteps, nameRules, socials, templateFile, templates } from "./toolkit-data";

export const metadata: Metadata = {
  title: "Chapter toolkit | Students Organize For Syria",
  description: "Free tools for starting and running a Students Organize For Syria chapter: organizing steps, messaging guide, printable templates, and brand files.",
};

// Colors and type already used across the site (see app/globals.css and app/layout.tsx).
const palette = [
  { name: "Ink", hex: "#1B1C1A" },
  { name: "Paper", hex: "#F4F6F1" },
  { name: "Forest", hex: "#063F2C" },
  { name: "Green", hex: "#0D6844" },
  { name: "Sage", hex: "#ACD0B9" },
  { name: "Mist", hex: "#DFE8DF" },
  { name: "Clay red", hex: "#A84A42" },
];

const sections = [
  { id: "start", label: "Start a chapter" },
  { id: "messaging", label: "Messaging guide" },
  { id: "templates", label: "Run the work" },
  { id: "brand", label: "Brand kit" },
];

const n = (i: number) => String(i + 1).padStart(2, "0");

export default function Toolkits(){return <Shell>
  <PageHero index="10" kicker="Chapter toolkit" tone="green" title={<>Built for<br/><i>organizers.</i></>} intro={`Free, public tools for starting and running a ${ORG_NAME} chapter: organizing steps, messaging, printable templates, and brand files.`}/>

  <nav className="toolkit-index" aria-label="Toolkit sections">{sections.map((s,i)=><a key={s.id} href={`#${s.id}`}><span>{n(i)}</span>{s.label}<b aria-hidden="true">↓</b></a>)}</nav>

  <section className="toolkit-section" id="start" aria-labelledby="start-title">
    <div className="toolkit-head"><p className="overline">01 · Start a chapter</p><h2 id="start-title" className="ink">From an idea<br/>to a chapter.</h2><p>Every chapter starts with students who refuse to stay on the sidelines. These steps get you from first conversation to first meeting.</p></div>
    <ol className="toolkit-steps">{chapterSteps.map((s,i)=><li key={s.title} data-reveal><span>{n(i)}</span><div><h3>{s.title}</h3><p>{s.body}</p>{s.link && (s.link.external
      ? <a href={s.link.href} target="_blank" rel="noreferrer" aria-label={`${s.link.label} (opens in a new tab)`}>{s.link.label} ↗</a>
      : <a href={s.link.href}>{s.link.label} ↗</a>)}</div></li>)}</ol>
  </section>

  <section className="toolkit-section toolkit-messaging" id="messaging" aria-labelledby="messaging-title">
    <div className="toolkit-head"><p className="overline">02 · Messaging guide</p><h2 id="messaging-title" className="ink">Say it the<br/>same way.</h2><p>Use these when you write posts, flyers, emails, event descriptions, or introductions for partners and press.</p></div>
    <div className="name-rules">{nameRules.map((r,i)=><article key={r.title}><span>{n(i)}</span><h3>{r.title}</h3><p>{r.body}</p></article>)}</div>
    <div className="copy-blocks">
      <article className="copy-block is-mission"><div className="copy-block-head"><p>Mission statement · approved, use word for word</p><CopyButton text={MISSION} label="Copy mission"/></div><blockquote>{MISSION}</blockquote></article>
      <article className="copy-block"><div className="copy-block-head"><p>Short description · for bios, flyers, and partner emails</p><CopyButton text={BOILERPLATE} label="Copy description"/></div><blockquote>{BOILERPLATE}</blockquote></article>
    </div>
    <dl className="toolkit-contacts">
      {socials.map(s=><div key={s.label}><dt>{s.label}</dt><dd><a href={s.url} target="_blank" rel="noreferrer" aria-label={`${ORG_NAME} on ${s.label}, ${s.handle} (opens in a new tab)`}>{s.handle} ↗</a></dd></div>)}
      <div><dt>Email</dt><dd><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></dd></div>
      <div><dt>Website</dt><dd><Link href="/">organize4syria.com</Link></dd></div>
    </dl>
  </section>

  <section className="toolkit-section toolkit-templates" id="templates" aria-labelledby="templates-title">
    <div className="toolkit-head"><p className="overline">03 · Run the work</p><h2 id="templates-title" className="ink">Templates you<br/>can use tonight.</h2><p>Open a template to print it or save it as a PDF, or download an editable Markdown copy for Google Docs, Word, or Notion.</p></div>
    <div className="template-grid">{templates.map((t,i)=><article key={t.slug} data-reveal><span>{n(i)}</span><h3>{t.short}</h3><p>{t.summary}</p><div className="template-actions"><Link className="template-open" href={`/toolkits/${t.slug}`}>Open printable <span aria-hidden="true">↗</span></Link><a className="template-download" href={templateFile(t)} download={`${t.slug}.md`}>Download .md</a></div></article>)}</div>
  </section>

  <section className="toolkit-section toolkit-brand" id="brand" aria-labelledby="brand-title">
    <div className="toolkit-head"><p className="overline">04 · Brand kit</p><h2 id="brand-title" className="ink">Look like<br/>one movement.</h2><p>All chapters share the same SOS logo. Use these files and colors so every chapter’s posts and flyers read as part of one network.</p></div>
    {brandFiles.length > 0
      ? <ul className="brand-files">{brandFiles.map(f=><li key={f.file}><div><h3>{f.title}</h3>{f.note && <p>{f.note}</p>}</div><a href={f.file} download>{f.format} <span aria-hidden="true">↓</span></a></li>)}</ul>
      : <div className="brand-request"><p>Logo files and social templates are shared by the national team.</p><a className="line-link" href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Brand files request")}`}>Email for logo files ↗</a></div>}
    <div className="brand-palette" role="list" aria-label="Brand colors">{palette.map(c=><div role="listitem" key={c.hex}><i style={{background:c.hex}} aria-hidden="true"/><b>{c.name}</b><code>{c.hex}</code></div>)}</div>
    <div className="brand-type"><div><span>Display</span><b>Archivo Black</b></div><div><span>Body</span><b className="is-body">Archivo</b></div><p>Both are free on Google Fonts.</p></div>
  </section>

  <section className="toolkit-contact"><div><p className="overline">Need something else?</p><h2 className="ink">Ask the<br/>national team.</h2></div><div><p>Looking for a resource that isn’t here, or have a template other chapters should use? Tell us.</p><a className="pill pill-dark" href="/contact?topic=toolkit#contact-form">Contact us ↗</a></div></section>
</Shell>}
