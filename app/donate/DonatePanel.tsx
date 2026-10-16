"use client";
import { useState } from "react";

const DONATION_EMAIL = "sos@organize4syria.com";
const PRESETS = ["25", "50", "100", "250", "500"];

/**
 * Giving panel. There is no online checkout yet, so giving goes through an email to the national team.
 * TODO(board): when the online checkout link exists, add it here as the primary action and keep email as the fallback.
 * TODO(board): add the approved tax-deductibility statement under the legal line before checkout opens.
 */
export function DonatePanel() {
  const [choice, setChoice] = useState("50");
  const [custom, setCustom] = useState("");
  const isOther = choice === "other";
  const cleanCustom = custom.replace(/[^0-9.]/g, "");
  const customValue = Number.parseFloat(cleanCustom);
  const amount = isOther ? (customValue > 0 ? String(Math.round(customValue * 100) / 100) : "") : choice;
  const amountText = amount ? `$${amount}` : "a gift";
  const subject = "Donation inquiry";
  const body = `Hello SOS team,\n\nI would like to give ${amountText} to Students Organize For Syria. Please let me know how to complete my donation.\n\nName:\nSchool or city (optional):\n`;
  const mailto = `mailto:${DONATION_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return <div className="donation-panel">
    <span>Choose an amount</span>
    <h2>Make an investment in student organizing.</h2>
    <p>Pick an amount and send it to our team by email. We will reply with how to complete your gift.</p>
    <div className="amount-grid" role="group" aria-label="Giving amount">
      {PRESETS.map(v => <button type="button" aria-pressed={choice === v} className={choice === v ? "active" : ""} onClick={() => setChoice(v)} key={v}>${v}</button>)}
      <button type="button" aria-pressed={isOther} className={isOther ? "active" : ""} onClick={() => setChoice("other")}>Other</button>
    </div>
    {isOther && <label className="amount-other">Your amount (USD)<span><b aria-hidden="true">$</b><input type="text" inputMode="decimal" autoComplete="off" value={custom} onChange={e => setCustom(e.target.value)} placeholder="75" autoFocus/></span></label>}
    <a className="pill pill-green give-email" href={mailto}>Give {amountText} by email <span aria-hidden="true">↗</span></a>
    <p className="give-alt">Opens your email app, addressed to <a href={`mailto:${DONATION_EMAIL}?subject=${encodeURIComponent(subject)}`}>{DONATION_EMAIL}</a>.</p>
    <div className="give-status"><i aria-hidden="true"/><span>Online checkout opens soon</span></div>
    <p className="donation-legal">STUDENTS ORGANIZE FOR SYRIA INC · <span className="nowrap">EIN 81-3410686</span></p>
  </div>;
}
