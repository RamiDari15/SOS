"use client";
import { useState } from "react";

/** Copies a block of approved text. Falls back to selecting nothing silently if the clipboard is blocked. */
export function CopyButton({ text, label = "Copy text" }: { text: string; label?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), 2200);
  };
  return <button type="button" className="toolkit-copy" onClick={copy}>
    <span aria-live="polite">{state === "copied" ? "Copied" : state === "failed" ? "Select and copy manually" : label}</span>
  </button>;
}

export function PrintButton() {
  return <button type="button" className="pill pill-dark toolkit-print" onClick={() => window.print()}>Print or save as PDF <span aria-hidden="true">↗</span></button>;
}
