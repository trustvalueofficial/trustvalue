import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactForm } from "@/components/contact/ContactForm";
import { SectorHelpList } from "@/components/contact/SectorHelpList";
import { JsonLd } from "@/components/JsonLd";
import { CONTACT_DESKS, channelForSector } from "@/lib/contactChannels";
import { getSectors } from "@/lib/cms";
import { getSectorFaIcon } from "@/lib/icons";
import { paths } from "@/lib/routing";
import { canonical, meta, SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = meta(
  "Contact Us",
  "Write to TrustValue about a score, a correction, evidence, or a provider audit. A person on the right desk reads every message.",
  paths.contact(),
);

const REASONS = [
  {
    title: "A score does not match what you lived",
    body: "Tell us the page, the provider, and the line that looks wrong. The research desk checks it against the record we published, then writes back with what we can change and what we cannot.",
  },
  {
    title: "You have evidence we have not seen",
    body: "A rejection letter, a bill, a job card, or a complaint reference can change how a page should read. Describe it in the form. Send the document only if we ask, and redact anything we do not need.",
  },
  {
    title: "You represent the provider",
    body: "If you are authorised to speak for an insurer, bank, hospital, builder, or other listed company, use the audit option. Name the company and the exact page. We review the record. We do not sell a change.",
  },
  {
    title: "You need the public path, not just our inbox",
    body: "A message here does not file your case with a regulator. Choose your sector in the form and we show the official forum beside it, so you know where the dispute itself has to go.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "You write it once",
    body: "The form asks for the name, the sector, and what you want done. That is enough for a person to start. You do not need an account.",
  },
  {
    n: "02",
    title: "Your mail app opens",
    body: "We address it to the desk that owns that topic and add a reference number. Press send there. Until you do, TrustValue has not received it.",
  },
  {
    n: "03",
    title: "The desk reads it",
    body: "Consumer questions go to grievances@trustvalue.ai. Provider audit requests go to audits@trustvalue.ai. Applicable grievance notices are acknowledged within 24 hours.",
  },
  {
    n: "04",
    title: "You get a clear answer",
    body: "We aim to resolve a grievance notice within 7 days. The reply says what changed, what stays, or the one fact still missing. Quote the reference if you write again.",
  },
];

const FAQS = [
  {
    q: "Is this the right place if I just want a human to read my note?",
    a: "Yes. Use the form at the top. Pick the closest topic. If you are unsure, choose a question about an audit score and name the provider in the message. We route it from there.",
  },
  {
    q: "Will TrustValue file my complaint with the ombudsman or the regulator?",
    a: "No. We explain the published record and, when you pick a sector, the public forum that actually hears that dispute. The filing is yours, with the insurer, bank, hospital, builder, or the authority named for that sector.",
  },
  {
    q: "Can a company pay to change a score from this page?",
    a: "No. An authorised representative can ask for an audit review and send the record they say we missed. Payment is not part of the review, and a request is not a promise that the score will move.",
  },
  {
    q: "What should I leave out?",
    a: "Do not send Aadhaar, full account numbers, medical records, or other identity papers with the first message. Name the page, the date, and the statement. If a document is necessary, we will ask for a redacted copy.",
  },
  {
    q: "How do I know you received it?",
    a: "The reference number on the prepared email is yours to keep. An acknowledgement of an applicable grievance notice follows within 24 hours of the email reaching the desk, not from filling the form alone.",
  },
  {
    q: "What if my problem is not about a TrustValue page?",
    a: "We can still point you to the public channel for that industry. For a refund or a service failure that is not about our pages, the National Consumer Helpline on 1915 is the cross-sector starting point.",
  },
];

export default function ContactPage() {
  const sectors = getSectors();

  return (
    <div className="contact-page">
      <link rel="stylesheet" href="/css/contact.css" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact Us",
          url: canonical(paths.contact()),
          description: "Write to the TrustValue grievance desk or the provider audit desk.",
          mainEntity: {
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
            contactPoint: Object.values(CONTACT_DESKS).map((desk) => ({
              "@type": "ContactPoint",
              contactType: desk.title,
              email: desk.email,
              areaServed: "IN",
              availableLanguage: "en",
            })),
          },
        }}
      />

      <section className="contact-stage">
        <div className="contact-wrap">
          <Breadcrumbs
            items={[
              { name: "Home", href: paths.home() },
              { name: "Contact", href: paths.contact() },
            ]}
          />
          <div className="contact-hero">
            <div className="contact-hero__main">
              <ContactForm sectors={sectors.map((sector) => ({ slug: sector.slug, name: sector.name }))} />
              <section className="contact-reasons" aria-labelledby="why-write">
                <div className="contact-reasons__head">
                  <h2 id="why-write">People write to us for four reasons</h2>
                  <p>If one of these is yours, the form above is the whole path. Say which one it is in the first lines of the message.</p>
                </div>
                <div className="reason-grid">
                  {REASONS.map((reason, index) => (
                    <article className="reason-card" key={reason.title}>
                      <span className="reason-card__index">{String(index + 1).padStart(2, "0")}</span>
                      <h3>{reason.title}</h3>
                      <p>{reason.body}</p>
                    </article>
                  ))}
                </div>
              </section>
              <section className="contact-steps" aria-labelledby="after-send">
                <div className="contact-steps__head">
                  <h2 id="after-send">What happens after you press send</h2>
                  <p>The form does not hide the message in a queue you cannot see. You send it from your own email, and the desk answers that thread.</p>
                </div>
                <div className="step-grid">
                  {STEPS.map((step) => (
                    <article className="step-card" key={step.n}>
                      <b>{step.n}</b>
                      <h3>{step.title}</h3>
                      <p>{step.body}</p>
                    </article>
                  ))}
                </div>
              </section>
            </div>
            <aside className="contact-hero__aside">
              <div className="contact-hero__intro">
                <p className="contact-kicker">Contact us</p>
                <h1>Write to us. The form is the way in.</h1>
                <p>
                  A score that looks wrong, evidence you want checked, a correction, or a provider audit. Choose the sector and the form shows where that dispute goes if it has to leave TrustValue.
                </p>
              </div>
              <ul className="contact-promises">
                <li>
                  <i className="fa-solid fa-envelope" aria-hidden="true" />
                  <div>
                    <strong>Two desks, one form</strong>
                    <span>Consumers reach the grievance desk. Providers reach the audit desk. The topic you pick chooses the address.</span>
                  </div>
                </li>
                <li>
                  <i className="fa-solid fa-clock" aria-hidden="true" />
                  <div>
                    <strong>24 hours to acknowledge</strong>
                    <span>Applicable grievance notices are acknowledged within 24 hours and generally resolved within 7 days.</span>
                  </div>
                </li>
                <li>
                  <i className="fa-solid fa-shield-halved" aria-hidden="true" />
                  <div>
                    <strong>No account, no payment</strong>
                    <span>You do not sign in to write. A company cannot buy a change to a published score from this page.</span>
                  </div>
                </li>
              </ul>
              <div className="contact-mails">
                <a href={`mailto:${CONTACT_DESKS.grievances.email}`}>{CONTACT_DESKS.grievances.email}</a>
                <a href={`mailto:${CONTACT_DESKS.audits.email}`}>{CONTACT_DESKS.audits.email}</a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="contact-section" aria-labelledby="desks">
        <div className="contact-wrap">
          <div className="contact-section__head">
            <h2 id="desks">Who the message reaches</h2>
            <p>Both addresses are monitored. Use the form so the subject line already names the desk. Write directly only if the form will not open.</p>
          </div>
          <div className="desk-grid">
            {Object.values(CONTACT_DESKS).map((desk) => (
              <article className="desk-card" key={desk.id}>
                <h3>{desk.title}</h3>
                <p>{desk.summary}</p>
                <p>{desk.handles}.</p>
                <a href={`mailto:${desk.email}`}>{desk.email}</a>
              </article>
            ))}
          </div>
          <article className="reason-card" style={{ marginTop: "1.25rem" }}>
            <h3>What makes a message easy to act on</h3>
            <ul className="include-list">
              <li>The TrustValue URL, or the provider and product name if you do not have the link.</li>
              <li>The sentence you say is wrong, and the correction you want in one line.</li>
              <li>Dates, a claim or complaint number, and what the provider already told you.</li>
              <li>Your authority to write, if the message is for a company rather than for yourself.</li>
            </ul>
            <p>
              Read the <Link href={paths.termsAndcondition()}>Grievances &amp; Corrections policy</Link> for the handling standard, and <Link href={paths.rating()}>how TrustScores are calculated</Link> if the question is about a number on a page.
            </p>
          </article>
        </div>
      </section>

      <section className="contact-section contact-section--mist" id="sectors" aria-labelledby="sectors-title">
        <div className="contact-wrap">
          <div className="contact-section__head">
            <h2 id="sectors-title">If the dispute is with a provider, not with us</h2>
            <p>
              TrustValue covers {sectors.length} consumer sectors. We can explain our page. The body that can order a refund, a claim, or a possession date is listed under each sector. Mention the sector in the form so the reply matches it.
            </p>
          </div>
          <SectorHelpList
            cards={sectors.map((sector) => {
              const channel = channelForSector(sector.slug);
              return {
                slug: sector.slug,
                name: sector.name,
                icon: getSectorFaIcon(sector.slug),
                route: channel.route,
                pageHref: paths.sector(sector.slug),
                href: channel.href,
                linkLabel: channel.linkLabel,
              };
            })}
          />
        </div>
      </section>

      <section className="contact-section contact-before" aria-labelledby="faq-title">
        <div className="contact-wrap">
          <div className="contact-section__head">
            <h2 id="faq-title">Before you write</h2>
            <p>These are the questions that usually decide whether the form is the right next step.</p>
          </div>
          <div className="step-grid">
            {FAQS.map((item, index) => (
              <article className="step-card" key={item.q}>
                <b>{String(index + 1).padStart(2, "0")}</b>
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-close">
        <div className="contact-wrap">
          <div className="contact-close__box">
            <p>
              Still ready to write? Go back to the form. If the matter is a refund or a service failure across any sector, you can also start at the National Consumer Helpline, 1915, or{" "}
              <a href="https://consumerhelpline.gov.in" target="_blank" rel="noopener noreferrer">consumerhelpline.gov.in</a>.
              TrustValue is an independent information platform. It is not the insurer, bank, hospital, builder, seller, or regulator, and a note to us does not pause a legal deadline.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
