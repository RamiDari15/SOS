/**
 * Shared form definitions for Students Organize For Syria submissions.
 * Used by the server route (app/api/forms/route.ts) for validation and by
 * the client (app/Forms.tsx) for the mailto fallback. No secrets here.
 */

export const FORM_TYPES = ["contact", "member", "chapter", "newsletter"] as const;
export type FormType = (typeof FORM_TYPES)[number];

export const HONEYPOT_FIELD = "company_website";
export const ORG_NAME = "Students Organize For Syria";
export const ORG_EMAIL = "sos@organize4syria.com";

export const CONTACT_TOPICS = [
  "Start or join a chapter",
  "Chapter toolkit access",
  "Partnership",
  "Press or statement",
  "General inquiry",
] as const;

export const MEMBER_ROLES = ["General member", "Chapter officer", "Volunteer for campaigns", "Not sure yet"] as const;

type FieldKind = "text" | "email" | "tel" | "multiline" | "choice" | "consent";
export type FieldSpec = {
  label: string;
  kind: FieldKind;
  required?: boolean;
  max: number;
  options?: readonly string[];
};

export const FORM_SCHEMAS: Record<FormType, { title: string; fields: Record<string, FieldSpec> }> = {
  contact: {
    title: "Contact message",
    fields: {
      name: { label: "Name", kind: "text", required: true, max: 120 },
      email: { label: "Email", kind: "email", required: true, max: 254 },
      topic: { label: "Topic", kind: "choice", required: true, max: 60, options: CONTACT_TOPICS },
      message: { label: "Message", kind: "multiline", required: true, max: 5000 },
    },
  },
  member: {
    title: "Join a chapter",
    fields: {
      name: { label: "Name", kind: "text", required: true, max: 120 },
      email: { label: "Email", kind: "email", required: true, max: 254 },
      school: { label: "School", kind: "text", required: true, max: 160 },
      major: { label: "Major / field", kind: "text", required: true, max: 160 },
      role: { label: "How would you like to participate?", kind: "choice", required: true, max: 60, options: MEMBER_ROLES },
      affiliations: { label: "Existing student organizations", kind: "text", max: 500 },
      notes: { label: "Anything else we should know?", kind: "multiline", max: 3000 },
    },
  },
  chapter: {
    title: "Start a chapter",
    fields: {
      name: { label: "Name", kind: "text", required: true, max: 120 },
      email: { label: "Email", kind: "email", required: true, max: 254 },
      school: { label: "School", kind: "text", required: true, max: 160 },
      region: { label: "State / region", kind: "text", required: true, max: 160 },
      phone: { label: "Phone number", kind: "tel", required: true, max: 40 },
      why: { label: "Why this campus, why now?", kind: "multiline", required: true, max: 3000 },
      notes: { label: "Anything else we should know?", kind: "multiline", max: 3000 },
    },
  },
  newsletter: {
    title: "Newsletter early list",
    fields: {
      email: { label: "Email address", kind: "email", required: true, max: 254 },
      firstName: { label: "First name", kind: "text", required: true, max: 80 },
      lastName: { label: "Last name", kind: "text", required: true, max: 80 },
      consent: { label: `I want updates from ${ORG_NAME}`, kind: "consent", required: true, max: 3 },
    },
  },
};

export function isFormType(value: unknown): value is FormType {
  return typeof value === "string" && (FORM_TYPES as readonly string[]).includes(value);
}

const EMAIL_RE = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[A-Za-z]{2,}$/;
const TEL_RE = /^[0-9+().\-\s]{7,40}$/;
// Strip C0/C1 control characters (keeping \n and \t for multiline fields) and bidi overrides.
const CONTROL_MULTILINE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F‪-‮⁦-⁩]/g;
const CONTROL_SINGLE = /[\u0000-\u001F\u007F-\u009F‪-‮⁦-⁩]/g;

export type ValidationResult =
  | { ok: true; data: Record<string, string> }
  | { ok: false; fieldErrors: Record<string, string> };

/** Validate and sanitize a raw submission for the given form type. Unknown keys are dropped. */
export function validateSubmission(type: FormType, raw: Record<string, unknown>): ValidationResult {
  const schema = FORM_SCHEMAS[type];
  const data: Record<string, string> = {};
  const fieldErrors: Record<string, string> = {};

  for (const [key, spec] of Object.entries(schema.fields)) {
    const input = raw[key];
    let value: string;
    if (spec.kind === "consent") {
      value = input === true || input === "on" || input === "true" || input === "yes" ? "yes" : "";
    } else if (input === undefined || input === null) {
      value = "";
    } else if (typeof input === "string") {
      value = spec.kind === "multiline"
        ? input.replace(/\r\n?/g, "\n").replace(CONTROL_MULTILINE, "").trim()
        : input.replace(CONTROL_SINGLE, " ").replace(/\s+/g, " ").trim();
    } else {
      fieldErrors[key] = `${spec.label} is invalid.`;
      continue;
    }

    if (!value) {
      if (spec.required) fieldErrors[key] = spec.kind === "consent" ? "Please confirm to continue." : `${spec.label} is required.`;
      continue;
    }
    if (value.length > spec.max) {
      fieldErrors[key] = `${spec.label} must be ${spec.max} characters or fewer.`;
      continue;
    }
    if (spec.kind === "email" && !EMAIL_RE.test(value)) {
      fieldErrors[key] = "Enter a valid email address.";
      continue;
    }
    if (spec.kind === "tel" && !TEL_RE.test(value)) {
      fieldErrors[key] = "Enter a valid phone number.";
      continue;
    }
    if (spec.kind === "choice" && spec.options && !spec.options.includes(value)) {
      fieldErrors[key] = `Choose a valid option for ${spec.label.toLowerCase()}.`;
      continue;
    }
    data[key] = value;
  }

  return Object.keys(fieldErrors).length ? { ok: false, fieldErrors } : { ok: true, data };
}

/** Plain-text rendering of a submission, used for email bodies and mailto fallbacks. */
export function formatSubmissionText(type: FormType, data: Record<string, string>): string {
  const lines: string[] = [];
  for (const [key, spec] of Object.entries(FORM_SCHEMAS[type].fields)) {
    const value = data[key];
    if (!value) continue;
    lines.push(spec.kind === "multiline" ? `${spec.label}:\n${value}` : `${spec.label}: ${value}`);
  }
  return lines.join("\n");
}

export function submissionSubject(type: FormType, data: Record<string, string>): string {
  const who = data.name || [data.firstName, data.lastName].filter(Boolean).join(" ") || data.email || "";
  const base = `[${ORG_NAME}] ${FORM_SCHEMAS[type].title}`;
  const topic = type === "contact" && data.topic ? ` (${data.topic})` : "";
  return `${base}${topic}${who ? ` from ${who}` : ""}`.slice(0, 200);
}

/** mailto: link so a visitor can send their submission by email if the server path is unavailable. */
export function buildMailto(type: FormType, data: Record<string, string>): string {
  let body = formatSubmissionText(type, data);
  // Very long mailto URLs are cut off by some browsers and mail clients.
  if (body.length > 1800) body = `${body.slice(0, 1800)}\n[...message shortened, please paste the rest]`;
  const params = new URLSearchParams({ subject: submissionSubject(type, data), body });
  // URLSearchParams encodes spaces as "+", which many mail clients show literally.
  return `mailto:${ORG_EMAIL}?${params.toString().replace(/\+/g, "%20")}`;
}
