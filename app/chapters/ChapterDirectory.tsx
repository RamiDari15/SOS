"use client";

import { useState } from "react";
import { Arrow } from "../Interior";
import { collegeLogos, legacyChapters } from "../chapter-data";
import { slugify } from "../site-data";

export function CampusIcon({ name }: { name: string }) {
  const initials = name.split(/\s+/).map(word => word[0]).join("").slice(0, 2).toUpperCase();
  const logo = collegeLogos[name];
  return <span className="campus-icon" aria-hidden="true">{logo ? <img src={logo} alt=""/> : <i>{initials}</i>}<b></b></span>;
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
