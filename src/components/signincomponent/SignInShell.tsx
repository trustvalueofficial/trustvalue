"use client";

import React from "react";
import { SignInAuthPanel } from "./SignInAuthPanel";
import { SignInMascotStage } from "./SignInMascotStage";

/** Full-viewport single-section dark navy split layout below Header: Auth (left) + Mascot (right, hidden on mobile, side-by-side from tablet upward). */
export function SignInShell() {
  return (
    <section
      aria-label="TrustValue Sign In"
      className="flex-1 w-full flex flex-col md:grid md:grid-cols-12 md:h-[calc(100dvh-65px)] md:overflow-hidden overflow-x-hidden"
      style={{
        background:
          "radial-gradient(circle at 75% 45%, rgba(255, 90, 10, 0.14) 0%, #071433 48%, #050E26 100%)",
      }}
    >
      <div className="flex-1 md:flex-none md:col-span-6 flex flex-col justify-center min-h-0 md:border-r md:border-white/[0.07]">
        <SignInAuthPanel />
      </div>
      <div className="hidden md:flex md:col-span-6 flex-col min-h-0 md:h-full">
        <SignInMascotStage />
      </div>
    </section>
  );
}
