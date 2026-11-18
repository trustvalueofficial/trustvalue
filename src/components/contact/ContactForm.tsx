"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  CONTACT_TOPICS,
  channelForSector,
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
  const channel = form.sector && form.sector !== "general" ? channelForSector(form.sector) : null;
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
      <p className="contact-form__eyebrow">Start here</p>
      <h2>Write to TrustValue</h2>
      <p>
        Tell us what you need. This prepares an email to <strong>{desk.email}</strong>. It is sent only when you press send in your mail app.
      </p>

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

      <label htmlFor="contact-organisation">
        Company, if you represent a provider
        <input
          id="contact-organisation"
          name="organisation"
          autoComplete="organization"
          value={form.organisation}
          aria-invalid={Boolean(errors.organisation)}
          aria-describedby={errors.organisation ? "contact-organisation-error" : undefined}
          onChange={(event) => update("organisation", event.target.value)}
        />
        {errors.organisation && <span id="contact-organisation-error" className="contact-error">{errors.organisation}</span>}
      </label>

      <div className="contact-grid">
        <label htmlFor="contact-topic">
          What is this about?
          <select
            id="contact-topic"
            name="topic"
            value={form.topic}
            aria-invalid={Boolean(errors.topic)}
            onChange={(event) => update("topic", event.target.value)}
          >
            {CONTACT_TOPICS.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
          {errors.topic && <span className="contact-error">{errors.topic}</span>}
        </label>

        <label htmlFor="contact-sector">
          Sector
          <select
            id="contact-sector"
            name="sector"
            value={form.sector}
            aria-invalid={Boolean(errors.sector)}
            aria-describedby={errors.sector ? "contact-sector-error" : undefined}
            onChange={(event) => update("sector", event.target.value)}
          >
            <option value="">Select a sector</option>
            <option value="general">Not sector-specific</option>
            {sectors.map((sector) => (
              <option key={sector.slug} value={sector.slug}>{sector.name}</option>
            ))}
          </select>
          {errors.sector && <span id="contact-sector-error" className="contact-error">{errors.sector}</span>}
        </label>
      </div>

      {channel && (
        <p className="contact-route">
          <strong>{sectorName}.</strong> {channel.route}
          {channel.href && (
            <>
              {" "}
              <a href={channel.href} target="_blank" rel="noopener noreferrer">{channel.linkLabel ?? "Official channel"}</a>
            </>
          )}
        </p>
      )}

      <div className="contact-grid">
        <label htmlFor="contact-reference">
          Complaint reference (optional)
          <input
            id="contact-reference"
            name="reference"
            value={form.reference}
            onChange={(event) => update("reference", event.target.value)}
          />
        </label>
        <label htmlFor="contact-pageUrl">
          Page URL (optional)
          <input
            id="contact-pageUrl"
            name="pageUrl"
            type="url"
            inputMode="url"
            placeholder="https://trustvalue.ai/..."
            value={form.pageUrl}
            onChange={(event) => update("pageUrl", event.target.value)}
          />
        </label>
      </div>

      <label htmlFor="contact-message">
        What happened, and what do you want done?
        <textarea
          id="contact-message"
          name="message"
          rows={3}
          value={form.message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : "contact-message-hint"}
          onChange={(event) => update("message", event.target.value)}
        />
        <span id="contact-message-hint" className="contact-hint">Include the provider name, the date, and the exact point you want checked. Do not attach identity documents.</span>
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
        <span>
          I am 18 or older. This message is a request to TrustValue. It is not a filing with the regulator, the ombudsman, or the provider.
        </span>
      </label>
      {errors.consent && <span className="contact-error">{errors.consent}</span>}

      <button type="submit" className="contact-submit">Send to {desk.title}</button>
    </form>
  );
}
