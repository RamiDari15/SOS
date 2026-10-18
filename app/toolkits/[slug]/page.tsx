import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "../../Interior";
import { PrintButton } from "../ToolkitActions";
import { CONTACT_EMAIL, ORG_NAME, findTemplate, templateFile, templates, type TemplateSection } from "../toolkit-data";

export function generateStaticParams() {
  return templates.map(t => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const t = findTemplate((await params).slug);
  if (!t) return {};
  return { title: `${t.title} | ${ORG_NAME}`, description: t.summary };
}

function Section({ s }: { s: TemplateSection }) {
  return <section className={`sheet-section is-${s.kind}`}>
    <h2>{s.heading}</h2>
    {s.note && <p className="sheet-note">{s.note}</p>}
    {s.kind === "fields" && <dl className="sheet-fields">{s.items.map(item => <div key={item}><dt>{item}</dt><dd/></div>)}</dl>}
    {s.kind === "checklist" && <ul className="sheet-checklist">{s.items.map(item => <li key={item}><i aria-hidden="true"/>{item}</li>)}</ul>}
    {s.kind === "prompts" && <div className="sheet-prompts">{s.items.map(item => <div key={item}><p>{item}</p><span/><span/></div>)}</div>}
    {s.kind === "table" && <table className="sheet-table"><thead><tr>{s.columns.map(c => <th key={c} scope="col">{c}</th>)}</tr></thead><tbody>{Array.from({ length: s.rows }, (_, r) => <tr key={r}>{s.columns.map(c => <td key={c}/>)}</tr>)}</tbody></table>}
  </section>;
}

export default async function TemplatePage({ params }: { params: Promise<{ slug: string }> }) {
  const t = findTemplate((await params).slug);
  if (!t) notFound();
  const others = templates.filter(o => o.slug !== t.slug);
  return <Shell>
    <div className="template-toolbar">
      <Link className="line-link" href="/toolkits#templates"><span aria-hidden="true">←</span> All templates</Link>
      <div><a className="line-link" href={templateFile(t)} download={`${t.slug}.md`}>Download .md</a><PrintButton/></div>
    </div>
    <article className="template-sheet">
      <header className="sheet-header">
        <p><b>SOS</b> {ORG_NAME} · Chapter toolkit</p>
        <h1>{t.title}</h1>
        <p className="sheet-summary">{t.summary}</p>
      </header>
      {t.sections.map(s => <Section key={s.heading} s={s}/>)}
      <p className="sheet-footer">{ORG_NAME} · organize4syria.com · {CONTACT_EMAIL}</p>
    </article>
    <nav className="template-more" aria-label="Other templates"><p className="overline">More templates</p><div>{others.map(o => <Link key={o.slug} href={`/toolkits/${o.slug}`}><b>{o.short}</b><span>{o.summary}</span><i aria-hidden="true">↗</i></Link>)}</div></nav>
  </Shell>;
}
