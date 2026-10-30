"use client";

import { useEffect, useRef } from "react";
import { useAboutBoot } from "./useAboutBoot";
import { AboutQuestChrome } from "./AboutQuestChrome";
import { AboutHero } from "./AboutHero";
import { MoodLab } from "./MoodLab";
import { HowItWorks } from "./HowItWorks";
import { TrustNumbers } from "./TrustNumbers";
import { YourVoiceReceipt } from "./YourVoiceReceipt";
import { MeetU } from "./MeetU";
import { LongGameStories } from "./LongGameStories";
import { ForStartupsAndBrands } from "./ForStartupsAndBrands";
import { RoadAhead } from "./RoadAhead";
import { OurPromises } from "./OurPromises";
import { YourMove } from "./YourMove";
import { AboutToasts } from "./AboutToasts";

export function AboutPageView() {
  const rootRef = useRef<HTMLDivElement>(null);
  const boot = useAboutBoot();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    boot(root);
  }, [boot]);

  return (
    <div className="about-tv" ref={rootRef}>
      <AboutQuestChrome />
      <AboutHero />
      <MoodLab />
      <HowItWorks />
      <TrustNumbers />
      <YourVoiceReceipt />
      <MeetU />
      <LongGameStories />
      <ForStartupsAndBrands />
      <RoadAhead />
      <OurPromises />
      <YourMove />
      <AboutToasts />
    </div>
  );
}
