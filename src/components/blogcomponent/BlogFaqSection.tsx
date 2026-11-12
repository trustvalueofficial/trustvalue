"use client";

import React from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

export interface FaqItem {
  question?: string;
  answer?: string;
  q?: string;
  a?: string;
}

interface BlogFaqSectionProps {
  faqData: FaqItem[];
}

export function BlogFaqSection({ faqData }: BlogFaqSectionProps) {
  if (!faqData || faqData.length === 0) return null;

  return (
    <section id="faqs" className="scroll-mt-24 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <HelpCircle size={17} className="text-[#FF5A0A]" />
          <div
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#071B46",
              lineHeight: 1.25,
            }}
          >
            Frequently Asked Statutory Questions
          </div>
        </div>
        <span className="text-[10px] font-semibold text-[#0A8754] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
          Audited Answers
        </span>
      </div>

      <div className="divide-y divide-[#DCE2EB] bg-white rounded-xl border border-[#DCE2EB] overflow-hidden shadow-xs">
        {faqData.map((faq, idx) => (
          <details
            key={idx}
            className="group p-3.5 sm:p-4 cursor-pointer transition-colors hover:bg-[#FAFBFD]"
            open={idx === 0}
          >
            <summary className="flex items-center justify-between list-none">
              <span
                style={{
                  fontSize: "13.5px",
                  fontWeight: 700,
                  color: "#071B46",
                  lineHeight: 1.35,
                }}
                className="group-open:text-[#FF5A0A] transition-colors pr-3"
              >
                {faq.question || faq.q}
              </span>
              <span className="shrink-0 text-[#667085] group-open:text-[#FF5A0A] transition-transform duration-200 group-open:rotate-180">
                <ChevronDown size={15} />
              </span>
            </summary>
            <p
              style={{
                fontSize: "13px",
                lineHeight: 1.6,
                color: "#46526B",
                margin: "8px 0 0 0",
              }}
            >
              {faq.answer || faq.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

