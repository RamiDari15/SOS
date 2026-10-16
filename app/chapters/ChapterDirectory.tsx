"use client";

import { useState } from "react";
import { Arrow } from "../Interior";
import { activeChapters, chapterHref, displayName, instagramUrl, pastChapters, type Chapter } from "../chapter-data";

function initialsFor(name: string) {
  return name.split(/[\s–-]+/).filter(word => !/^(of|the|at|university)$/i.test(word)).map(word => word[0]).join("").slice(0, 3).toUpperCase();
}

export function CampusIcon({ chapter }: { chapter: Chapter }) {
  const label = chapter.abbreviation ?? initialsFor(chapter.name);
  return <span className="campus-icon" aria-hidden="true">{chapter.logo ? <img src={chapter.logo} alt=""/> : <i className={label.length > 3 ? "is-long" : undefined}>{label}</i>}<b></b></span>;
}

type StatusFilter = "all" | "active" | "past";

const filters: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "past", label: "Past" },
];

function ChapterCard({ chapter, index }: { chapter: Chapter; index: number }) {
  const isActive = chapter.status === "active";
  return <article className={`chapter-card ${isActive ? "is-active" : "is-past"}`}>
    <span className="campus-number">{String(index + 1).padStart(2, "0")}</span>
    <CampusIcon chapter={chapter}/>
    <span className={`chapter-status ${isActive ? "is-active" : "is-past"}`}>{isActive ? "Active" : "Past chapter"}</span>
    <h3><a className="chapter-card-link" href={chapterHref(chapter)}>{displayName(chapter)}</a></h3>
    <p>{chapter.location}</p>
    <div className="chapter-card-foot">
      <b className="card-link" aria-hidden="true">View chapter <Arrow /></b>
      {chapter.instagram && <a className="chapter-ig" href={instagramUrl(chapter.instagram)} target="_blank" rel="noopener noreferrer" aria-label={`${displayName(chapter)} on Instagram (@${chapter.instagram})`}>@{chapter.instagram}</a>}
    </div>
  </article>;
}

export function ChapterDirectory() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [paused, setPaused] = useState(false);
  const q = query.trim().toLowerCase();
  const matches = (c: Chapter) => !q || `${c.name} ${c.shortName ?? ""} ${c.abbreviation ?? ""} ${c.location}`.toLowerCase().includes(q);
  const active = status === "past" ? [] : activeChapters.filter(matches);
  const past = status === "active" ? [] : pastChapters.filter(matches);
  const nothing = active.length === 0 && past.length === 0;
  return <>
    <section className="network" aria-labelledby="network-title">
      <div className="network-head"><div><p className="overline">{activeChapters.length} active SOS chapters</p><h2 id="network-title">Across campuses.<br />Connected by purpose.</h2></div><button onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? "Play animation" : "Pause animation"}</button></div>
      <div className={`orbit ${paused ? "paused" : ""}`}>{[...activeChapters, ...activeChapters].map((c, i) => <a key={`${c.name}-${i}`} href={chapterHref(c)} tabIndex={i >= activeChapters.length ? -1 : undefined} aria-hidden={i >= activeChapters.length ? true : undefined}><CampusIcon chapter={c}/><span className="campus-copy"><b>{displayName(c)}</b><small>{c.location}</small></span><Arrow /></a>)}</div>
      <p className="verification-note">Active Students Organize For Syria chapters across the United States.</p>
    </section>
    <section className="directory">
      <div className="directory-tools">
        <div><p className="overline">Find a campus</p><h2>Chapter directory</h2></div>
        <div className="directory-controls">
          <div className="status-filter" role="group" aria-label="Filter by chapter status">{filters.map(f => <button key={f.value} type="button" aria-pressed={status === f.value} onClick={() => setStatus(f.value)}>{f.label}</button>)}</div>
          <label>Search by school or location<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Try Michigan or Chicago" /></label>
        </div>
      </div>

      {active.length > 0 && <div className="directory-group">
        <div className="directory-group-head"><h3>Active chapters</h3><span>{active.length} {active.length === 1 ? "chapter" : "chapters"}</span></div>
        <div className="directory-grid">{active.map((c, i) => <ChapterCard key={c.name} chapter={c} index={i}/>)}</div>
      </div>}

      {past.length > 0 && <div className="directory-group is-past">
        <div className="directory-group-head"><h3>Past chapters</h3><span>{past.length} {past.length === 1 ? "chapter" : "chapters"}</span></div>
        <p className="revive-note">These campuses once had SOS chapters that are not active right now. Are you a student at one of them? <a href="/get-involved?form=chapter#apply">Revive the chapter <Arrow /></a></p>
        <div className="directory-grid">{past.map((c, i) => <ChapterCard key={c.name} chapter={c} index={i}/>)}</div>
      </div>}

      {nothing && <p className="empty">No matching chapter. <a href="/get-involved?form=chapter#apply">Start one at your school <Arrow /></a></p>}
    </section>
  </>;
}
