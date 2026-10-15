"use client";

import { FormEvent, useEffect, useState } from "react";
import { Arrow } from "./Interior";

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
