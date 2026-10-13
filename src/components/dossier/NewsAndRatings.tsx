import React from "react";
import Link from "next/link";

interface NewsItem {
  date: string;
  title: string;
  desc: string;
  citation?: string;
}

interface NewsAndRatingsProps {
  newsList?: NewsItem[];
  rateUrl?: string;
  entityName?: string;
}

const defaultNews: NewsItem[] = [
  {
    date: "22 SEP 2026",
    title: "ICICI Prudential Life is now ICICI Life Insurance",
    desc: "The new name took effect on 22 September 2026. The company says the change does not affect the rights and liabilities of its stakeholders. The old name will appear next to the new one for two years.",
    citation: "3",
  },
  {
    date: "22 SEP 2025",
    title: "No GST on individual life insurance premiums",
    desc: "Since 22 September 2025, premiums on individual life and health insurance carry no GST. The rate was 18%.",
    citation: "5",
  },
];

export default function NewsAndRatings({
  newsList = defaultNews,
  rateUrl = "/write-review",
  entityName,
}: NewsAndRatingsProps) {
  return (
    <>
      {/* News Section */}
      <section className="news-section">
        <h2 className="news-title">News</h2>

        <div className="space-y-3.5">
          {newsList.map((item, idx) => (
            <div key={idx} className="news-card-item">
              <span className="news-date-badge">{item.date}</span>
              <h3 className="news-card-heading">{item.title}</h3>
              <p className="news-card-desc">
                {item.desc}
                {item.citation && (
                  <sup className="facts-cite-sup">[{item.citation}]</sup>
                )}
              </p>
              <button
                type="button"
                className="news-make-card-btn"
                title="Create a summary card"
              >
                <i className="fa-solid fa-plus text-[10px]" aria-hidden="true" />
                <span>Make a card</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Ratings Section */}
      <section className="ratings-section">
        <h2 className="ratings-title">Ratings</h2>

        <div className="ratings-box-clean">
          <span>
            No ratings yet. When people rate it, every rating shows here the moment it is locked.
          </span>
          <Link href={rateUrl} className="ratings-first-link">
            Be the first
          </Link>
        </div>
      </section>
    </>
  );
}
