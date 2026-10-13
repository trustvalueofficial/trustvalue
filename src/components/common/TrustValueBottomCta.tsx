import React from "react";
import Link from "next/link";

interface TrustValueBottomCtaProps {
  title?: React.ReactNode;
  description?: string;
  primaryBtnText?: string;
  primaryBtnHref?: string;
  secondaryBtnText?: string;
  secondaryBtnHref?: string;
  className?: string;
}

export default function TrustValueBottomCta({
  title = "Before you experience anything, check its TrustValue.",
  description = "And after you've experienced it, leave its TrustValue for the next person. That is how a Trust Index gets built: one genuine experience at a time.",
  primaryBtnText = "Write the first review",
  primaryBtnHref = "/write-review",
  secondaryBtnText = "Search a brand",
  secondaryBtnHref = "/industry/insurance",
  className = "",
}: TrustValueBottomCtaProps) {
  return (
    <section className={`north-section ${className}`} aria-labelledby="north-cta-title">
      <div className="wrap north-wrap">
        <div className="north-content">
          <h2 id="north-cta-title" className="north-heading">
            {title}
          </h2>
          <p className="north-lead">
            {description}
          </p>
          <div className="north-cta">
            <Link className="btn-north-orange" href={primaryBtnHref}>
              {primaryBtnText}
            </Link>
            <Link className="btn-north-navy" href={secondaryBtnHref}>
              {secondaryBtnText}
            </Link>
          </div>
        </div>

        <div className="north-mascot-container">
          <img
            className="north-mascot-img"
            src="/brand/north__mascot.webp"
            alt="TrustValue Mascot"
            width={340}
            height={340}
          />
        </div>
      </div>
    </section>
  );
}
