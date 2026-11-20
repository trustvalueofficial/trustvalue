export interface MinimalAuthorArticle {
  author?: string;
  authors?: string[] | string;
  sector?: string;
}

export const DEFAULT_EDITORIAL_ANALYSTS: Record<string, string[]> = {
  insurance: [
    "Dr. Sameer Joshi (Statutory Actuarial Consultant)",
    "Kavita Rao (Consumer Rights & Claims Advocate)",
  ],
  finance: [
    "Vikram Malhotra (Chartered Financial Risk Analyst)",
    "Ananya Deshmukh (Regulatory Forensics Lead)",
  ],
  healthcare: [
    "Dr. Sunita Kulkarni (NABH Hospital Accreditation Auditor)",
    "Dr. Sameer Joshi (Clinical Quality Governance Lead)",
  ],
  tech: [
    "Dr. Aris Thorne (Lead Systems Architect)",
    "Elena Rostova (Senior Empirical Telemetry Analyst)",
  ],
  general: [
    "Dr. Aris Thorne (Lead Systems Architect)",
    "Elena Rostova (Senior Empirical Telemetry Analyst)",
  ],
};

/**
 * Editorial author control helper.
 * If authors are explicitly provided (or explicitly cleared to []), respects that choice.
 * Only supplements from the editorial analyst pool if both `authors` and `author` are undefined.
 */
export function getAuthors(article: Partial<MinimalAuthorArticle>): string[] {
  let list: string[] = [];

  const rawAuthors = (article as any)?.authors;
  if (Array.isArray(rawAuthors)) {
    // Explicit array provided - respect it even if empty
    return rawAuthors.map((a: any) => String(a).trim()).filter(Boolean).slice(0, 6);
  } else if (typeof rawAuthors === "string") {
    if (rawAuthors.trim() === "") return [];
    return rawAuthors.split(",").map((a: string) => a.trim()).filter(Boolean).slice(0, 6);
  } else if (article.author !== undefined) {
    if (!article.author || !article.author.trim()) return [];
    return article.author.split(",").map((a: string) => a.trim()).filter(Boolean).slice(0, 6);
  }

  // Only auto-supplement if authors/author was completely undefined
  const sectorKey = (article.sector || "general").toLowerCase();
  const pool = DEFAULT_EDITORIAL_ANALYSTS[sectorKey] || DEFAULT_EDITORIAL_ANALYSTS.general;

  let idx = 0;
  while (list.length < 2 && idx < pool.length) {
    if (!list.includes(pool[idx])) {
      list.push(pool[idx]);
    }
    idx++;
  }

  if (list.length < 2) {
    for (const cand of DEFAULT_EDITORIAL_ANALYSTS.general) {
      if (!list.includes(cand)) list.push(cand);
      if (list.length >= 2) break;
    }
  }

  return list.slice(0, 6);
}
