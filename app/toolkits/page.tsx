import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Shell } from "../Interior";
import { CopyButton } from "./ToolkitActions";
import { BOILERPLATE, BRAND_KIT_URL, CONTACT_EMAIL, MISSION, ORG_NAME, chapterSteps, nameRules, socials, templateFile, templates } from "./toolkit-data";

export const metadata: Metadata = {
  title: "Chapter toolkit | Students Organize For Syria",
  description: "Free tools for starting and running a Students Organize For Syria chapter: organizing steps, messaging guide, and printable templates.",
};

const sections: { id: string; label: string }[] = [
  { id: "start", label: "Start a chapter" },
  { id: "messaging", label: "Messaging guide" },
  { id: "templates", label: "Run the work" },
];
if (BRAND_KIT_URL) sections.push({ id: "brand", label: "Brand kit" });

const n = (i: number) => String(i + 1).padStart(2, "0");

export default function Toolkits(){return <Shell active="toolkits">
  <PageHero index="10" kicker="Chapter toolkit" tone="green" title={<>Built for<br/><i>organizers.</i></>} intro={`Free, public tools for starting and running a ${ORG_NAME} chapter: organizing steps, messaging, and printable templates.`}/>

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
      <article className="copy-block is-mission"><div className="copy-block-head"><p>Mission statement · approved, use word for word</p><CopyButton text={MISSION} targetId="copy-mission" label="Copy mission"/></div><blockquote id="copy-mission">{MISSION}</blockquote></article>
      <article className="copy-block"><div className="copy-block-head"><p>Short description · for bios, flyers, and partner emails</p><CopyButton text={BOILERPLATE} targetId="copy-description" label="Copy description"/></div><blockquote id="copy-description">{BOILERPLATE}</blockquote></article>
    </div>
    <dl className="toolkit-contacts">
      {socials.map(s=><div key={s.label}><dt>{s.label}</dt><dd><a href={s.url} target="_blank" rel="noreferrer" aria-label={`${ORG_NAME} on ${s.label}, ${s.handle} (opens in a new tab)`}>{s.handle} ↗</a></dd></div>)}
      <div><dt>Email</dt><dd><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></dd></div>
      <div><dt>Website</dt><dd><Link href="/">organize4syria.com</Link></dd></div>
    </dl>
  </section>

  <section className="toolkit-section toolkit-templates" id="templates" aria-labelledby="templates-title">
    <div className="toolkit-head is-wide"><p className="overline">03 · Run the work</p><h2 id="templates-title" className="ink">Templates you<br/>can use tonight.</h2><p>Open a template to print it or save it as a PDF, or download an editable Markdown copy for Google Docs, Word, or Notion.</p></div>
    <div className="template-grid">{templates.map((t,i)=><article key={t.slug} data-reveal><span>{n(i)}</span><h3>{t.short}</h3><p>{t.summary}</p><div className="template-actions"><Link className="template-open" href={`/toolkits/${t.slug}`}>Open printable <span aria-hidden="true">↗</span></Link><a className="template-download" href={templateFile(t)} download={`${t.slug}.md`}>Download .md</a></div></article>)}</div>
  </section>

  {BRAND_KIT_URL && <section className="toolkit-brand-link" id="brand" aria-labelledby="brand-title">
    <div><p className="overline">{n(sections.length - 1)} · Brand kit</p><h2 id="brand-title">Logos, colors and templates.</h2></div>
    <a className="pill pill-cream" href={BRAND_KIT_URL} target="_blank" rel="noreferrer">Open the brand kit (Google Drive) <span aria-hidden="true">↗</span></a>
  </section>}

  <section className="toolkit-contact"><div><p className="overline">Need something else?</p><h2 className="ink">Ask the<br/>national team.</h2></div><div><p>Looking for a resource that isn’t here, or have a template other chapters should use? Tell us.</p><a className="pill pill-dark" href="/contact?topic=toolkit#contact-form">Contact us ↗</a></div></section>
</Shell>}
