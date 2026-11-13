"use client";
import { useState } from "react";
import { FormStatus, Honeypot, SubmitButton, SuccessPanel, useFormSubmission } from "../Forms";
import { ORG_EMAIL, ORG_NAME } from "../lib/forms";

const PRESETS = ["25", "50", "100", "250", "500"];

/**
 * Giving panel. There is no online checkout yet, so a gift is sent as a "donation" submission
 * through /api/forms, the same path every other site form uses, and lands in ORG_EMAIL
 * (sos@organize4syria.com). If online delivery isn't configured, the visitor gets a prefilled email instead.
 * TODO(board): when the online checkout link exists, add it here as the primary action and keep this as the fallback.
 * TODO(board): add the approved tax-deductibility statement under the legal line before checkout opens.
 */
export function DonatePanel() {
  const { status, onSubmit, fieldProps, errorFor, reset } = useFormSubmission("donation");
  const [choice, setChoice] = useState("50");
  const [custom, setCustom] = useState("");
  const busy = status.kind === "submitting";
  const isOther = choice === "other";
  const cleanCustom = custom.replace(/[^0-9.]/g, "");
  const customValue = Number.parseFloat(cleanCustom);
  const amount = isOther ? (customValue > 0 ? String(Math.round(customValue * 100) / 100) : "") : choice;
  const amountText = amount ? `$${amount}` : "a gift";

  if (status.kind === "success") {
    const { name, email, amount: given } = status.fields;
    const first = name?.split(" ")[0];
    return <div className="donation-panel">
      <SuccessPanel className="donation-success" title={first ? `Thank you, ${first}.` : "Thank you."} again="Make another gift" onAgain={reset}>
        Your {given || "gift"} pledge went to the {ORG_NAME} team. We’ll email <b>{email || "you"}</b> with how to complete your donation.
      </SuccessPanel>
      <p className="donation-legal">STUDENTS ORGANIZE FOR SYRIA INC · <span className="nowrap">EIN 81-3410686</span></p>
    </div>;
  }

  return <form className="donation-panel donation-form" onSubmit={onSubmit} aria-busy={busy} aria-label="Give to Students Organize For Syria">
    <span>Choose an amount</span>
    <h2>Make an investment in student organizing.</h2>
    <p>Pick an amount and tell us where to reach you. Your pledge goes straight to our team, and we will reply with how to complete your gift.</p>
    <div className="amount-grid" role="group" aria-label="Giving amount">
      {PRESETS.map(v => <button type="button" aria-pressed={choice === v} className={choice === v ? "active" : ""} onClick={() => setChoice(v)} key={v}>${v}</button>)}
      <button type="button" aria-pressed={isOther} className={isOther ? "active" : ""} onClick={() => setChoice("other")}>Other</button>
    </div>
    {isOther && <label className="amount-other">Your amount (USD)<span><b aria-hidden="true">$</b><input type="text" inputMode="decimal" autoComplete="off" value={custom} onChange={e => setCustom(e.target.value)} placeholder="75" required autoFocus/></span></label>}
    <input type="hidden" name="amount" value={amount ? `$${amount}` : ""}/>
    {errorFor("amount")}
    <div className="give-fields">
      <label><span>Name</span><input {...fieldProps("name")} autoComplete="name" required maxLength={120} placeholder="Your full name"/>{errorFor("name")}</label>
      <label><span>Email</span><input {...fieldProps("email")} type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com"/>{errorFor("email")}</label>
      <label className="give-note"><span>Note (optional)</span><textarea {...fieldProps("note")} rows={2} maxLength={2000} placeholder="In honor of someone, a chapter to support, or a question"/>{errorFor("note")}</label>
    </div>
    <Honeypot/>
    <div className="give-submit"><SubmitButton busy={busy}>Give {amountText}</SubmitButton></div>
    <FormStatus status={status}/>
    <p className="give-alt">Sent to our team at <a href={`mailto:${ORG_EMAIL}?subject=${encodeURIComponent("Donation inquiry")}`}>{ORG_EMAIL}</a>.</p>
    <div className="give-status"><i aria-hidden="true"/><span>Online checkout opens soon</span></div>
    <p className="donation-legal">STUDENTS ORGANIZE FOR SYRIA INC · <span className="nowrap">EIN 81-3410686</span></p>
  </form>;
}
