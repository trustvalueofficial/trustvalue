import type { AttributeDef, AttrValue, Offering, Provider, ProviderProfile, ResolvedCategory, SectorConfig, Variant } from "@/lib/types";

export interface TemplateProps {
  sector: SectorConfig;
  provider: Provider;
  profile?: ProviderProfile;
  offering: Offering;
  variant?: Variant;
  category: ResolvedCategory;
  attrs: AttributeDef[];
  values: Record<string, AttrValue>;
}
