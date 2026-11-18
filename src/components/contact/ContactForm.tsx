"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  CONTACT_TOPICS,
  deskForTopic,
  type ContactTopic,
} from "@/lib/contactChannels";

export interface ContactSectorOption {
  slug: string;
  name: string;
}

interface ContactFormProps {
  sectors: ContactSectorOption[];
}

interface FormState {
  name: string;
  email: string;
  organisation: string;
  topic: string;
  sector: string;
  reference: string;
  pageUrl: string;
  message: string;
  consent: boolean;
}

const EMPTY: FormState = {
  name: "",
  email: "",
  organisation: "",
  topic: "escalation",
  sector: "",
  reference: "",
  pageUrl: "",
  message: "",
  consent: false,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function BrandSelect({
  id,
  name,
  value,
  options,
  invalid,
  describedBy,
  onChange,
}: {
  id: string;
  name: string;
  value: string;
  options: { value: string; label: string }[];
  invalid?: boolean;
  describedBy?: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((item) => item.value === value);

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={`contact-select${open ? " is-open" : ""}`} ref={rootRef}>
      <button
        type="button"
        id={id}
        className="contact-select__button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={() => setOpen((current) => !current)}
      >
        {selected?.label ?? "Select"}
      </button>
      <input type="hidden" name={name} value={value} />
      {open && (
        <ul className="contact-select__menu" role="listbox" aria-labelledby={id}>
          {options.map((item) => (
            <li key={item.value || "empty"} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={item.value === value}
                onClick={() => {
                  onChange(item.value);
                  setOpen(false);
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function fieldError(form: FormState): Partial<Record<keyof FormState, string>> {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (form.name.trim().length < 2) errors.name = "Enter the name we should reply to.";
  if (!EMAIL_RE.test(form.email.trim())) errors.email = "Enter a valid email address.";
  if (!form.topic) errors.topic = "Choose what this message is about.";
  if (form.topic === "audit" && form.organisation.trim().length < 2) {
    errors.organisation = "Enter the provider or company you represent.";
  }
  if (!form.sector) errors.sector = "Choose a sector, or Not sector-specific.";
  if (form.message.trim().length < 30) errors.message = "Add at least 30 characters so the desk can act on it.";
  if (!form.consent) errors.consent = "Confirm that you agree to this being sent to TrustValue.";
  return errors;
}

function referenceId() {
  const now = new Date();
  const day = now.toISOString().slice(0, 10).replace(/-/g, "");
  const salt = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TV-${day}-${salt}`;
}

export function ContactForm({ sectors }: ContactFormProps) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [sent, setSent] = useState<{ id: string; email: string; body: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const topic = CONTACT_TOPICS.find((item) => item.id === form.topic) as ContactTopic | undefined;
  const desk = deskForTopic(form.topic);
  const sectorName = useMemo(
    () => sectors.find((item) => item.slug === form.sector)?.name ?? "Not sector-specific",
    [form.sector, sectors],
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function compose(id: string) {
    const topicLabel = topic?.label ?? form.topic;
    return [
      `Reference: ${id}`,
      `Name: ${form.name.trim()}`,
      `Email: ${form.email.trim()}`,
      form.organisation.trim() ? `Organisation: ${form.organisation.trim()}` : "",
      `Topic: ${topicLabel}`,
      `Sector: ${sectorName}`,
      form.reference.trim() ? `Provider or policy reference: ${form.reference.trim()}` : "",
      form.pageUrl.trim() ? `Page: ${form.pageUrl.trim()}` : "",
      "",
      form.message.trim(),
    ]
      .filter((line) => line !== "")
      .join("\n");
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = fieldError(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const first = Object.keys(nextErrors)[0];
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }

    const id = referenceId();
    const body = compose(id);
    const subject = `${topic?.label ?? "Contact"} · ${sectorName} · ${id}`;
    const href = `mailto:${desk.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent({ id, email: desk.email, body });
    setCopied(false);
    window.location.href = href;
  }

  async function copyMessage() {
    if (!sent) return;
    try {
      await navigator.clipboard.writeText(`To: ${sent.email}\n\n${sent.body}`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  if (sent) {
    return (
      <section className="contact-receipt" aria-live="polite">
        <p className="contact-form__eyebrow">Message prepared</p>
        <h2>Your reference is {sent.id}</h2>
        <p>
          Your mail app should be open with this message addressed to <a href={`mailto:${sent.email}`}>{sent.email}</a>.
          Send it from there. Quote <strong>{sent.id}</strong> if you write again.
        </p>
        <p className="contact-hint">
          TrustValue acknowledges applicable grievance notices within 24 hours and aims to resolve them within 7 days, as published in the Grievances &amp; Corrections policy.
        </p>
        <div className="contact-actions">
          <a className="btn btn--navy" href={`mailto:${sent.email}?subject=${encodeURIComponent(sent.id)}&body=${encodeURIComponent(sent.body)}`}>
            Open mail again
          </a>
          <button type="button" className="btn btn--ghost" onClick={copyMessage}>
            {copied ? "Copied" : "Copy message"}
          </button>
          <button type="button" className="btn btn--quiet" onClick={() => setSent(null)}>
            Write another
          </button>
        </div>
      </section>
    );
  }

  return (
    <form className="contact-form" id="write" onSubmit={onSubmit} noValidate>
      <h2>Write to TrustValue</h2>

      <div className="contact-grid">
        <label htmlFor="contact-name">
          Full name
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            value={form.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            onChange={(event) => update("name", event.target.value)}
          />
          {errors.name && <span id="contact-name-error" className="contact-error">{errors.name}</span>}
        </label>

        <label htmlFor="contact-email">
          Email
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            onChange={(event) => update("email", event.target.value)}
          />
          {errors.email && <span id="contact-email-error" className="contact-error">{errors.email}</span>}
        </label>
      </div>

      <div className="contact-grid">
        <label htmlFor="contact-topic">
          What is this about?
          <BrandSelect
            id="contact-topic"
            name="topic"
            value={form.topic}
            invalid={Boolean(errors.topic)}
            options={CONTACT_TOPICS.map((item) => ({ value: item.id, label: item.label }))}
            onChange={(value) => update("topic", value)}
          />
          {errors.topic && <span className="contact-error">{errors.topic}</span>}
        </label>

        <label htmlFor="contact-sector">
          Sector
          <BrandSelect
            id="contact-sector"
            name="sector"
            value={form.sector}
            invalid={Boolean(errors.sector)}
            describedBy={errors.sector ? "contact-sector-error" : undefined}
            options={[
              { value: "", label: "Select a sector" },
              { value: "general", label: "Not sector-specific" },
              ...sectors.map((sector) => ({ value: sector.slug, label: sector.name })),
            ]}
            onChange={(value) => update("sector", value)}
          />
          {errors.sector && <span id="contact-sector-error" className="contact-error">{errors.sector}</span>}
        </label>
      </div>

      <div className="contact-grid">
        <label htmlFor="contact-reference">
          Reference
          <input
            id="contact-reference"
            name="reference"
            placeholder="Policy or complaint number"
            value={form.reference}
            onChange={(event) => update("reference", event.target.value)}
          />
        </label>
        <label htmlFor="contact-pageUrl">
          Page URL
          <input
            id="contact-pageUrl"
            name="pageUrl"
            type="url"
            inputMode="url"
            placeholder="trustvalue.ai/…"
            value={form.pageUrl}
            onChange={(event) => update("pageUrl", event.target.value)}
          />
        </label>
      </div>

      <label htmlFor="contact-organisation">
        Company
        <input
          id="contact-organisation"
          name="organisation"
          autoComplete="organization"
          placeholder="Only if you represent a provider"
          value={form.organisation}
          aria-invalid={Boolean(errors.organisation)}
          aria-describedby={errors.organisation ? "contact-organisation-error" : undefined}
          onChange={(event) => update("organisation", event.target.value)}
        />
        {errors.organisation && <span id="contact-organisation-error" className="contact-error">{errors.organisation}</span>}
      </label>

      <label htmlFor="contact-message">
        Message
        <textarea
          id="contact-message"
          name="message"
          rows={2}
          placeholder="Provider, date, and what you want checked."
          value={form.message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          onChange={(event) => update("message", event.target.value)}
        />
        {errors.message && <span id="contact-message-error" className="contact-error">{errors.message}</span>}
      </label>

      <label className="contact-consent" htmlFor="contact-consent">
        <input
          id="contact-consent"
          name="consent"
          type="checkbox"
          checked={form.consent}
          aria-invalid={Boolean(errors.consent)}
          onChange={(event) => update("consent", event.target.checked)}
        />
        <span>I am 18 or older. This is a note to TrustValue, not a regulator filing.</span>
      </label>
      {errors.consent && <span className="contact-error">{errors.consent}</span>}

      <button type="submit" className="contact-submit">Send message</button>
      <p className="contact-form__foot">Opens your email to {desk.email}</p>
    </form>
  );
}
