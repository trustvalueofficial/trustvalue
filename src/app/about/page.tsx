import type { Metadata } from "next";
import { meta } from "@/lib/seo";
import { paths } from "@/lib/routing";
import AboutView from "./AboutView";

export const metadata: Metadata = meta(
  "About TrustValue",
  "The trust score for everything you buy. Real customers rate what they bought, with a photo as proof.",
  paths.about()
);

export default function AboutPage() {
  return <AboutView />;
}
