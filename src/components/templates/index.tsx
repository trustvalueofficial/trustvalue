import type { ComponentType } from "react";
import type { TemplateKey } from "@/lib/types";
import { ListingPage } from "./ListingPage";
import { PlacePage } from "./PlacePage";
import { PlanPage } from "./PlanPage";
import { SchemePage } from "./SchemePage";
import { SpecPage } from "./SpecPage";
import type { TemplateProps } from "./types";

/** Add a new layout = add one component here + one key to TemplateKey. */
export const TEMPLATES: Record<TemplateKey, ComponentType<TemplateProps>> = {
  plan: PlanPage, spec: SpecPage, place: PlacePage, listing: ListingPage, scheme: SchemePage,
};
