"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [topic, setTopic] = useState("Question about TrustValue");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSent(true);
  };

  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><span aria-current="page">Contact</span></li>
        </ol>
      </nav>

      <header className="phead">
        <p className="eyebrow">Direct Communications</p>
        <h1>Contact &amp; Grievances</h1>
        <p className="lead">
          Reach our editorial desk, actuarial audit team, or statutory grievance officer.
        </p>
      </header>

      <div className="body2">
        {sent ? (
          <div className="card card-mist">
            <h2>Message received</h2>
            <p className="muted" style={{ marginTop: "8px" }}>
              Thank you, {name}. Your inquiry has been routed to our compliance desk. Inquiries are acknowledged within 24 hours.
            </p>
          </div>
        ) : (
          <form className="card stack" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="ct-topic">Inquiry category</label>
              <select
                id="ct-topic"
                className="input"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                <option>Question about TrustValue</option>
                <option>Report an error in policy wording</option>
                <option>Editorial correction request</option>
                <option>Legal or compliance notice</option>
                <option>Insurer enterprise claim</option>
              </select>
            </div>
            <div className="grid g2">
              <div className="field">
                <label htmlFor="ct-name">Your name</label>
                <input
                  id="ct-name"
                  className="input"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="ct-email">Official email</label>
                <input
                  id="ct-email"
                  type="email"
                  className="input"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="ct-msg">Message</label>
              <textarea
                id="ct-msg"
                className="input"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" type="submit" style={{ marginTop: "12px" }}>
              Send message
            </button>
          </form>
        )}

        <aside className="rail stack">
          <div className="card">
            <h3>Grievance Officer</h3>
            <p className="small muted" style={{ marginTop: "6px" }}>
              Under DPDP Act 2023 &amp; IT Rules 2021:
              <br /><br />
              <b>Email:</b> grievance@trustvalue.ai
              <br />
              <b>Response SLA:</b> 24-hour acknowledgement, 15-day resolution
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
