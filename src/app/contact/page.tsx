import type { Metadata } from "next";
import { meta } from "@/lib/seo";
import { paths } from "@/lib/routing";

export const metadata: Metadata = meta(
  "Contact & Ombudsman Escalation",
  "Get in touch with TrustValue audit team or request dispute escalation assistance.",
  paths.contact()
);

export default function ContactPage() {
  return (
    <>
      <h1>Contact &amp; Grievance Support</h1>
      <p className="lead">
        Have a question about an audit score, need help filing an Ombudsman dispute, or want to submit evidence?
      </p>

      <div className="two-col">
        <section className="card">
          <h2>Consumer Grievances</h2>
          <p>
            If a registered financial or healthcare provider has wrongfully repudiated a claim, our research desk provides regulatory escalation guidance.
          </p>
          <p><strong>Email:</strong> grievances@trustvalue.ai</p>
        </section>

        <section className="card">
          <h2>Provider Verification</h2>
          <p>
            Are you an authorized representative of an IRDAI insurer, RERA builder, or NABH hospital requesting an audit review?
          </p>
          <p><strong>Email:</strong> audits@trustvalue.ai</p>
        </section>
      </div>
    </>
  );
}
