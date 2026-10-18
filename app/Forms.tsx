"use client";

import { FormEvent, ReactNode, useEffect, useId, useRef, useState } from "react";
import { Arrow } from "./Interior";
import { CONTACT_TOPICS, FormType, HONEYPOT_FIELD, MEMBER_ROLES, ORG_EMAIL, ORG_NAME, buildMailto } from "./lib/forms";

/* ---------- shared submission logic ---------- */

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; fields: Record<string, string> }
  | { kind: "invalid" }
  | { kind: "fallback"; mailto: string; reason: "not_configured" | "rate_limited" | "failed" };

function readFields(form: HTMLFormElement): Record<string, string> {
  const out: Record<string, string> = {};
  new FormData(form).forEach((value, key) => {
    if (typeof value === "string") out[key] = value;
  });
  return out;
}

function trimmed(fields: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(fields)) if (k !== HONEYPOT_FIELD && v.trim()) out[k] = v.trim();
  return out;
}

function useFormSubmission(type: FormType) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const uid = useId();
  const inFlight = useRef(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // The button stays focusable while sending (aria-disabled), so guard repeat submits here.
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      await send(e.currentTarget);
    } finally {
      inFlight.current = false;
    }
  }

  async function send(form: HTMLFormElement) {
    const fields = readFields(form);
    setStatus({ kind: "submitting" });
    setFieldErrors({});
    let res: Response | null = null;
    try {
      res = await fetch("/api/forms", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ type, fields, page: window.location.pathname }),
      });
    } catch {
      res = null;
    }
    if (res?.ok) {
      setStatus({ kind: "success", fields: trimmed(fields) });
      return;
    }
    let payload: { error?: string; fieldErrors?: Record<string, string> } = {};
    try {
      payload = res ? await res.json() : {};
    } catch {
      payload = {};
    }
    if (res?.status === 400 && payload.fieldErrors && Object.keys(payload.fieldErrors).length) {
      setFieldErrors(payload.fieldErrors);
      setStatus({ kind: "invalid" });
      const first = form.querySelector<HTMLElement>(`[name="${Object.keys(payload.fieldErrors)[0]}"]`);
      first?.focus();
      return;
    }
    setStatus({
      kind: "fallback",
      mailto: buildMailto(type, trimmed(fields)),
      reason: payload.error === "not_configured" ? "not_configured" : payload.error === "rate_limited" ? "rate_limited" : "failed",
    });
  }

  /** Props that wire an input to its error message, and to its hint when `withHint` is set (render it with hintFor). */
  function fieldProps(name: string, withHint = false) {
    const err = fieldErrors[name];
    const describedBy = [withHint ? `${uid}-${name}-hint` : "", err ? `${uid}-${name}-err` : ""].filter(Boolean).join(" ");
    return {
      name,
      "aria-invalid": err ? true : undefined,
      "aria-describedby": describedBy || undefined,
    } as const;
  }

  function hintFor(name: string, text: string) {
    return <small className="field-hint" id={`${uid}-${name}-hint`}>{text}</small>;
  }

  function errorFor(name: string) {
    const err = fieldErrors[name];
    return err ? <em className="field-error" id={`${uid}-${name}-err`}>{err}</em> : null;
  }

  function reset() {
    setStatus({ kind: "idle" });
    setFieldErrors({});
  }

  return { status, onSubmit, fieldProps, errorFor, hintFor, reset };
}

function Honeypot() {
  return (
    <div className="form-hp" aria-hidden="true">
      <label>
        Leave this field empty
        <input name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="new-password" data-lpignore="true" data-1p-ignore="" defaultValue="" />
      </label>
    </div>
  );
}

/** Live region inside the form: submitting / validation / fallback messages. */
function FormStatus({ status }: { status: Status }) {
  let content: ReactNode = null;
  if (status.kind === "submitting") content = <p>Sending…</p>;
  if (status.kind === "invalid") content = <p>Please fix the highlighted fields and try again.</p>;
  if (status.kind === "fallback")
    content = (
      <>
        <p>
          <strong>{status.reason === "not_configured" ? "Online submissions aren’t switched on yet." : status.reason === "rate_limited" ? "Too many submissions from this connection. Please wait a minute." : "We couldn’t send your submission."}</strong>{" "}
          Nothing you typed has been lost. Send it to us by email instead. The message is already filled in.
        </p>
        <a className="pill pill-green form-fallback-link" href={status.mailto}>
          Email {ORG_EMAIL} <Arrow />
        </a>
      </>
    );
  return (
    <div className={`form-status${status.kind === "fallback" ? " is-error" : ""}`} role="status" aria-live="polite">
      {content}
    </div>
  );
}

function SuccessPanel({ title, children, again, onAgain, className = "" }: { title: string; children: ReactNode; again: string; onAgain: () => void; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    // No live region here: focus moves to the heading, which announces the result once.
    <div className={`form-success ${className}`}>
      <span aria-hidden="true">✓</span>
      <h2 ref={ref} tabIndex={-1}>{title}</h2>
      <p>{children}</p>
      <button type="button" onClick={onAgain}>{again}</button>
    </div>
  );
}

function SubmitButton({ busy, children }: { busy: boolean; children: ReactNode }) {
  return (
    <button className="pill pill-green" type="submit" aria-disabled={busy || undefined}>
      {busy ? "Sending…" : children} {!busy && <Arrow />}
    </button>
  );
}

/* ---------- contact ---------- */

/** `initialTopic` comes from `?topic=` on the server (see topicFromParam), so the right option renders on first paint. */
export function ContactForm({ initialTopic = "" }: { initialTopic?: string }) {
  const { status, onSubmit, fieldProps, errorFor, reset } = useFormSubmission("contact");
  const [topic, setTopic] = useState(initialTopic);
  const busy = status.kind === "submitting";

  if (status.kind === "success")
    return (
      <div id="contact-form">
        <SuccessPanel title="Message received." again="Send another" onAgain={reset}>
          Thank you for reaching out. The {ORG_NAME} team will follow up at the email you provided.
        </SuccessPanel>
      </div>
    );

  return (
    <form className="contact-form cool-form" id="contact-form" onSubmit={onSubmit} aria-busy={busy}>
      <div className="form-heading"><span>Message desk</span><b>01 — 04</b></div>
      <label><span>Name</span><input {...fieldProps("name")} autoComplete="name" placeholder="Your full name" required maxLength={120} />{errorFor("name")}</label>
      <label><span>Email</span><input {...fieldProps("email")} type="email" autoComplete="email" placeholder="you@school.edu" required maxLength={254} />{errorFor("email")}</label>
      <label>
        <span>What can we help with?</span>
        <select {...fieldProps("topic")} required value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option value="" disabled>Select one</option>
          {CONTACT_TOPICS.map((t) => <option key={t}>{t}</option>)}
        </select>
        {errorFor("topic")}
      </label>
      <label><span>Message</span><textarea {...fieldProps("message")} rows={6} placeholder="Tell us what you want to build…" required maxLength={5000} />{errorFor("message")}</label>
      <Honeypot />
      <SubmitButton busy={busy}>Send message</SubmitButton>
      <FormStatus status={status} />
      <p className="form-fineprint">Messages are directed to <a href={`mailto:${ORG_EMAIL}`}>{ORG_EMAIL}</a>.</p>
    </form>
  );
}

/* ---------- get involved: join / start a chapter ---------- */

function MovementForm({ mode }: { mode: "member" | "chapter" }) {
  const { status, onSubmit, fieldProps, errorFor, reset } = useFormSubmission(mode);
  const busy = status.kind === "submitting";
  const member = mode === "member";

  if (status.kind === "success")
    return (
      <SuccessPanel className="application-success" title="Interest received." again="Submit another" onAgain={reset}>
        Thank you for stepping forward. The {ORG_NAME} team will follow up at the email you provided.
      </SuccessPanel>
    );

  return (
    <form className="cool-form application-form" onSubmit={onSubmit} aria-busy={busy} aria-label={member ? "Join a chapter" : "Start a chapter"}>
      <div className="form-heading"><span>{member ? "Member interest" : "Chapter starter"}</span><b>Get involved</b></div>
      <div className="form-row">
        <label><span>Name</span><input {...fieldProps("name")} autoComplete="name" required maxLength={120} placeholder="Your full name" />{errorFor("name")}</label>
        <label><span>Email</span><input {...fieldProps("email")} autoComplete="email" required maxLength={254} type="email" placeholder="you@school.edu" />{errorFor("email")}</label>
      </div>
      <div className="form-row">
        <label><span>School</span><input {...fieldProps("school")} autoComplete="organization" required maxLength={160} placeholder="University or institution" />{errorFor("school")}</label>
        {member
          ? <label><span>Major / field</span><input {...fieldProps("major")} required maxLength={160} placeholder="What do you study?" />{errorFor("major")}</label>
          : <label><span>State / region</span><input {...fieldProps("region")} autoComplete="address-level1" required maxLength={160} placeholder="Where are you organizing?" />{errorFor("region")}</label>}
      </div>
      {member ? (
        <>
          <label>
            <span>How would you like to participate?</span>
            <select {...fieldProps("role")} required defaultValue="">
              <option value="" disabled>Choose a role</option>
              {MEMBER_ROLES.map((r) => <option key={r}>{r}</option>)}
            </select>
            {errorFor("role")}
          </label>
          <label><span>Existing student organizations</span><input {...fieldProps("affiliations")} maxLength={500} placeholder="Optional — list any affiliations" />{errorFor("affiliations")}</label>
        </>
      ) : (
        <>
          <label><span>Phone number</span><input {...fieldProps("phone")} autoComplete="tel" required maxLength={40} type="tel" placeholder="(000) 000-0000" />{errorFor("phone")}</label>
          <label><span>Why this campus, why now?</span><textarea {...fieldProps("why")} required maxLength={3000} rows={4} placeholder="Tell us about student interest and what you hope to build." />{errorFor("why")}</label>
        </>
      )}
      <label><span>Anything else we should know?</span><textarea {...fieldProps("notes")} maxLength={3000} rows={4} placeholder="Experience, goals, accessibility needs, or questions" />{errorFor("notes")}</label>
      <Honeypot />
      <SubmitButton busy={busy}>Submit interest</SubmitButton>
      <FormStatus status={status} />
      <p className="form-fineprint">Questions about applying? Email <a href={`mailto:${ORG_EMAIL}`}>{ORG_EMAIL}</a>.</p>
    </form>
  );
}

/** `initialMode` comes from `?form=` on the server (see modeFromParam), so the right form renders on first paint. */
export function MovementForms({ initialMode = "member" }: { initialMode?: "member" | "chapter" }) {
  const [mode, setMode] = useState<"member" | "chapter">(initialMode);
  return (
    <section className="application-zone" id="apply">
      <div className="application-intro">
        <p className="overline">Take the next step</p>
        <h2>Turn intention<br />into action.</h2>
        <p>Tell us about your campus, your interests, and how you want to contribute. The {ORG_NAME} team will help connect you with the right next step.</p>
        <div className="form-tabs" role="group" aria-label="Choose a form">
          <button type="button" className={mode === "member" ? "active" : ""} aria-pressed={mode === "member"} onClick={() => setMode("member")}>Join a chapter</button>
          <button type="button" className={mode === "chapter" ? "active" : ""} aria-pressed={mode === "chapter"} onClick={() => setMode("chapter")}>Start a chapter</button>
        </div>
      </div>
      <MovementForm key={mode} mode={mode} />
    </section>
  );
}

/* ---------- monthly newsletter signup ---------- */

export function NewsletterForm() {
  const { status, onSubmit, fieldProps, errorFor, hintFor, reset } = useFormSubmission("newsletter");
  const busy = status.kind === "submitting";

  if (status.kind === "success") {
    const { firstName, email } = status.fields;
    return (
      <SuccessPanel className="newsletter-success" title={firstName ? `You’re on the list, ${firstName}.` : "You’re on the list."} again="Subscribe another email" onAgain={reset}>
        We’ll email <b>{email || "you"}</b> when the {ORG_NAME} newsletter goes out. Want to do more in the meantime? <a href="/get-involved">Find your next step</a>.
      </SuccessPanel>
    );
  }

  return (
    <form className="cool-form newsletter-form" id="subscribe" onSubmit={onSubmit} aria-busy={busy} aria-label="Subscribe to the monthly newsletter">
      <div className="form-heading"><span>Monthly newsletter</span><b>Free</b></div>
      <label><span>Email address</span><input {...fieldProps("email")} autoComplete="email" required maxLength={254} type="email" placeholder="you@school.edu" />{errorFor("email")}</label>
      <div className="form-row">
        <label><span>First name</span><input {...fieldProps("firstName")} autoComplete="given-name" required maxLength={80} placeholder="First name" />{errorFor("firstName")}</label>
        <label><span>Last name</span><input {...fieldProps("lastName")} autoComplete="family-name" required maxLength={80} placeholder="Last name" />{errorFor("lastName")}</label>
      </div>
      <label><span>School / chapter</span><input {...fieldProps("school", true)} autoComplete="organization" maxLength={160} placeholder="e.g. UCLA" />{hintFor("school", "Optional. Helps us connect you with your campus chapter.")}{errorFor("school")}</label>
      <label className="check"><input {...fieldProps("consent")} type="checkbox" required /><span>I want monthly updates from {ORG_NAME}.</span></label>
      {errorFor("consent")}
      <Honeypot />
      <SubmitButton busy={busy}>Subscribe</SubmitButton>
      <FormStatus status={status} />
      <p className="form-fineprint">We use your email only to send {ORG_NAME} updates. We never sell or share it. To unsubscribe, email <a href={`mailto:${ORG_EMAIL}?subject=Unsubscribe`}>{ORG_EMAIL}</a> with “Unsubscribe”.</p>
    </form>
  );
}
