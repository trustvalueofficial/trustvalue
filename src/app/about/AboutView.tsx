"use client";

import { useEffect, useRef } from "react";
import "./about.css";
import { ABOUT_MARKUP } from "./about-markup";
import { bootAboutPage } from "./about-boot";

export default function AboutView() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    bootAboutPage(root);
  }, []);

  return (
    <div
      className="about-tv"
      ref={rootRef}
      dangerouslySetInnerHTML={{ __html: ABOUT_MARKUP }}
    />
  );
}
