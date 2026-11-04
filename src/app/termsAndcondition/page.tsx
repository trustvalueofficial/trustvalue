import { LegalCentreView } from "@/components/legal/LegalCentreView";
import { LEGAL_HUB } from "@/components/legal/pages";

export const metadata = {
  title: "TrustValue Legal Centre",
  description: LEGAL_HUB.description,
};

export default function LegalCentrePage() {
  return <LegalCentreView />;
}
