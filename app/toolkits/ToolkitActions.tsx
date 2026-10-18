"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Copies a block of approved text.
 * Order of attempts: the async Clipboard API, then a hidden textarea + document.execCommand("copy")
 * (older or locked-down browsers), and finally selecting the visible text in the element with id
 * `targetId` so the person can copy it with their keyboard. The button label never changes; the
 * result is announced in a separate visually hidden status region.
 */
export function CopyButton({ text, targetId, label = "Copy text" }: { text: string; targetId: string; label?: string }) {
  const [message, setMessage] = useState("");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const announce = (next: string) => {
    window.clearTimeout(timer.current);
    setMessage(next);
    timer.current = window.setTimeout(() => setMessage(""), 4000);
  };

  const legacyCopy = () => {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch { ok = false; }
    area.remove();
    return ok;
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      announce("Copied to clipboard.");
      return;
    } catch { /* fall through */ }
    if (legacyCopy()) { announce("Copied to clipboard."); return; }
    const target = document.getElementById(targetId);
    const selection = window.getSelection();
    if (target && selection) {
      selection.selectAllChildren(target);
      announce("Text selected. Press Ctrl+C, or Command+C on a Mac, to copy.");
    } else {
      announce("Copy did not work. Select the text and copy it manually.");
    }
  };

  return <>
    <button type="button" className="toolkit-copy" onClick={copy} aria-controls={targetId}>{label}</button>
    <span className="toolkit-sr" role="status">{message}</span>
  </>;
}

export function PrintButton() {
  return <button type="button" className="pill pill-dark toolkit-print" onClick={() => window.print()}>Print or save as PDF <span aria-hidden="true">↗</span></button>;
}
