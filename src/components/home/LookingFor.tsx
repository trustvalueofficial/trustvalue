"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { paths } from "@/lib/routing";

const LOOKING_FOR = [
  { slug: "insurance", name: "Insurance", icon: "fa-shield-halved" },
  { slug: "banking", name: "Banking & loans", icon: "fa-building-columns" },
  { slug: "investments", name: "Investments", icon: "fa-chart-line" },
  { slug: "healthcare", name: "Hospitals", icon: "fa-hospital" },
  { slug: "pharma", name: "Pharma", icon: "fa-pills" },
  { slug: "telecom", name: "Telecom", icon: "fa-tower-broadcast" },
  { slug: "internet-ott", name: "Internet & OTT", icon: "fa-film" },
  { slug: "food", name: "Food & grocery", icon: "fa-bowl-food" },
  { slug: "agriculture", name: "Agriculture", icon: "fa-wheat-awn" },
  { slug: "real-estate", name: "Real estate", icon: "fa-building" },
  { slug: "utilities", name: "Home & utilities", icon: "fa-bolt" },
  { slug: "automobiles", name: "Automobiles", icon: "fa-car" },
  { slug: "travel", name: "Travel", icon: "fa-plane-departure" },
  { slug: "education", name: "Education", icon: "fa-graduation-cap" },
  { slug: "electronics", name: "Electronics", icon: "fa-mobile-screen" },
  { slug: "retail", name: "Retail", icon: "fa-bag-shopping" },
  { slug: "jobs-skilling", name: "Jobs & skilling", icon: "fa-briefcase" },
  { slug: "government", name: "Government", icon: "fa-landmark" },
];

export default function LookingFor() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  function updateEnds() {
    const track = trackRef.current;
    if (!track) return;
    setCanPrev(track.scrollLeft > 4);
    setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
  }

  useEffect(() => {
    updateEnds();
    window.addEventListener("resize", updateEnds);
    return () => window.removeEventListener("resize", updateEnds);
  }, []);

  function scrollTrack(direction: number) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * Math.max(240, track.clientWidth * 0.7), behavior: "smooth" });
  }

  return (
    <section className="looking" aria-labelledby="looking-title">
      <div className="wrap">
        <div className="looking__card">
          <div className="looking__head">
            <h2 id="looking-title">What are you looking for?</h2>
            <div className="looking__controls">
              <button
                type="button"
                className="looking__arrow"
                aria-label="Previous sectors"
                disabled={!canPrev}
                onClick={() => scrollTrack(-1)}
              >
                <i className="fa-solid fa-chevron-left" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="looking__arrow"
                aria-label="Next sectors"
                disabled={!canNext}
                onClick={() => scrollTrack(1)}
              >
                <i className="fa-solid fa-chevron-right" aria-hidden="true" />
              </button>
              <Link className="looking__more" href={paths.sectors()}>
                See more
              </Link>
            </div>
          </div>

          <div
            className="looking__track"
            ref={trackRef}
            onScroll={updateEnds}
            data-lenis-prevent
          >
            {LOOKING_FOR.map((item) => (
              <Link key={item.slug} className="looking__item" href={paths.sector(item.slug)}>
                <i className={`fa-solid ${item.icon}`} aria-hidden="true" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
