import type { Metadata } from "next";
import "./legal.css";

export const metadata: Metadata = {
  title: {
    default: "TrustValue Legal Centre | TrustValue.ai",
    template: "%s | TrustValue.ai",
  },
  description:
    "The rules behind genuine reviews, independent TrustScores, data privacy and fair corrections.",
};

export default function TermsAndConditionLayout({ children }: { children: React.ReactNode }) {
  return <div className="legal-route">{children}</div>;
}
