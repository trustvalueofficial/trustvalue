export type DeskId = "grievances" | "audits";

export interface ContactDesk {
  id: DeskId;
  title: string;
  email: string;
  summary: string;
  handles: string;
}

export interface ContactTopic {
  id: string;
  label: string;
  desk: DeskId;
}

export interface SectorChannel {
  regulator: string;
  forum: string;
  route: string;
  href?: string;
  linkLabel?: string;
}

/** Published TrustValue desks. These are the only inboxes named in the product. */
export const CONTACT_DESKS: Record<DeskId, ContactDesk> = {
  grievances: {
    id: "grievances",
    title: "Consumer Grievances",
    email: "grievances@trustvalue.ai",
    summary:
      "Questions about a published score, evidence you want reviewed, or guidance before you escalate a rejected claim.",
    handles: "Scores, corrections, privacy, evidence, and escalation guidance",
  },
  audits: {
    id: "audits",
    title: "Provider Verification",
    email: "audits@trustvalue.ai",
    summary:
      "Authorised representatives of a regulated provider asking for an audit review of a published record.",
    handles: "IRDAI, RBI, RERA, NABH and other regulated-provider audit requests",
  },
};

export const CONTACT_TOPICS: ContactTopic[] = [
  { id: "score", label: "Question about an audit score", desk: "grievances" },
  { id: "escalation", label: "Guidance before a regulator or ombudsman filing", desk: "grievances" },
  { id: "correction", label: "Correction of a published page", desk: "grievances" },
  { id: "privacy", label: "Privacy or personal-data request", desk: "grievances" },
  { id: "evidence", label: "Submit evidence for a record", desk: "grievances" },
  { id: "press", label: "Press or research enquiry", desk: "grievances" },
  { id: "audit", label: "Provider audit review", desk: "audits" },
];

/**
 * Public escalation path for each sector in content/sectors.
 * TrustValue guides the filing. It does not replace the regulator or the ombudsman.
 */
export const SECTOR_CHANNELS: Record<string, SectorChannel> = {
  insurance: {
    regulator: "IRDAI",
    forum: "Insurer grievance officer, then Bima Bharosa, then the Insurance Ombudsman",
    route:
      "Write to the insurer with the policy number, claim number and rejection letter. If that is not resolved, use Bima Bharosa, then the Insurance Ombudsman under the Insurance Ombudsman Rules, 2017.",
    href: "https://bimabharosa.irdai.gov.in",
    linkLabel: "Bima Bharosa",
  },
  banking: {
    regulator: "Reserve Bank of India",
    forum: "Bank or NBFC grievance cell, then the RBI Complaint Management System",
    route:
      "Complain to the regulated entity first and keep the complaint reference. Unresolved complaints go to the RBI CMS. TrustValue does not sit in place of the RBI Ombudsman.",
    href: "https://cms.rbi.org.in",
    linkLabel: "RBI CMS",
  },
  investments: {
    regulator: "SEBI",
    forum: "Fund house or broker, then SEBI SCORES",
    route:
      "Raise it with the mutual fund, broker or advisor first. Securities-market complaints that remain unresolved can be filed on SEBI SCORES.",
    href: "https://scores.sebi.gov.in",
    linkLabel: "SEBI SCORES",
  },
  healthcare: {
    regulator: "State Medical Council and the consumer commission",
    forum: "Hospital grievance cell, then the consumer commission or State Medical Council",
    route:
      "Start with the hospital grievance cell and keep the bill and discharge papers. Billing disputes can go to the consumer commission. Conduct complaints go to the State Medical Council. NABH accredits hospitals; it is not the complaint court.",
  },
  pharma: {
    regulator: "CDSCO and the State Drug Controller",
    forum: "Pharmacy grievance desk, State Drug Controller, consumer commission",
    route:
      "Order and refund disputes start with the pharmacy. Quality, expiry and spurious-drug complaints go to the State Drug Controller and CDSCO. Keep the batch number and invoice.",
  },
  telecom: {
    regulator: "TRAI",
    forum: "Operator complaint desk, then its appellate authority",
    route:
      "File with the operator and then its appellate authority. TRAI sets the quality and tariff rules. It does not decide an individual bill or outage complaint.",
  },
  "internet-ott": {
    regulator: "MeitY, under the IT Rules",
    forum: "Platform grievance officer, then the Grievance Appellate Committee where it applies",
    route:
      "Use the platform's resident grievance officer and keep the ticket number. Unresolved intermediary complaints follow the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules.",
  },
  food: {
    regulator: "FSSAI",
    forum: "Seller or restaurant, FSSAI, and the consumer commission",
    route:
      "Keep the pack, bill and batch or order number. Safety and labelling complaints can go to FSSAI. Refund and service disputes also go to the consumer commission.",
  },
  agriculture: {
    regulator: "State agriculture and licensing authorities",
    forum: "Seller, the licensing authority named on the pack, and the consumer commission",
    route:
      "Seed, pesticide and equipment complaints start with the seller. Quality and licensing issues go to the authority named on the pack, then the consumer commission if money is still due.",
  },
  "real-estate": {
    regulator: "State RERA",
    forum: "Promoter, then the State RERA authority for that project",
    route:
      "Write to the promoter with the agreement and payment record. Possession, carpet-area and refund complaints go to the State RERA authority of the project state.",
  },
  utilities: {
    regulator: "State electricity regulator",
    forum: "Discom consumer grievance forum, then the state electricity ombudsman",
    route:
      "File with the distribution company's consumer grievance redressal forum. If that fails, the electricity ombudsman of that state hears the dispute.",
  },
  automobiles: {
    regulator: "Manufacturer and the consumer commission",
    forum: "Dealer or manufacturer nodal officer, then the consumer commission",
    route:
      "Log the defect with the dealer and keep the job card. Unresolved warranty and delivery disputes go to the consumer commission. Safety recalls stay with the manufacturer.",
  },
  travel: {
    regulator: "DGCA for airlines",
    forum: "Operator nodal officer, AirSewa for airlines, then the consumer commission",
    route:
      "For airlines, complain to the airline first and then AirSewa. Hotels, rail and other operators start with their own grievance desk. Unresolved refunds can go to the consumer commission.",
    href: "https://www.airsewa.gov.in",
    linkLabel: "AirSewa",
  },
  education: {
    regulator: "UGC or the state education authority, where the institute is recognised",
    forum: "Institute grievance cell, then the recognising authority or the consumer commission",
    route:
      "Use the institute grievance cell first. Recognised-university academic grievances can go to the relevant education authority. Fee disputes for a paid service can also go to the consumer commission.",
  },
  electronics: {
    regulator: "BIS for standards, consumer commission for the sale",
    forum: "Brand service centre, then the consumer commission",
    route:
      "Raise a job sheet with the brand service centre. Unresolved warranty, repair and refund disputes go to the consumer commission. Keep the invoice and serial number.",
  },
  retail: {
    regulator: "Central Consumer Protection Authority",
    forum: "Seller, marketplace grievance officer, then the consumer commission",
    route:
      "Complain to the seller and the marketplace grievance officer. Unresolved refunds and dark-pattern complaints can go to the consumer commission and the Central Consumer Protection Authority.",
  },
  "jobs-skilling": {
    regulator: "Consumer commission for paid services",
    forum: "Portal or institute grievance desk, then the consumer commission",
    route:
      "TrustValue does not place candidates or certify courses. Paid-course and portal-fee disputes start with the provider and, if unresolved, the consumer commission.",
  },
  government: {
    regulator: "The department that runs the scheme",
    forum: "CPGRAMS for central and state public services",
    route:
      "File on CPGRAMS for a public-service grievance. TrustValue cannot issue a government document or change a scheme decision.",
    href: "https://pgportal.gov.in",
    linkLabel: "CPGRAMS",
  },
};

export const FALLBACK_CHANNEL: SectorChannel = {
  regulator: "The provider's own regulator",
  forum: "Provider grievance desk, then the consumer commission",
  route:
    "Write to the provider first and keep the reference number. If money, service or a published promise is still unresolved, use the National Consumer Helpline or the consumer commission.",
  href: "https://consumerhelpline.gov.in",
  linkLabel: "National Consumer Helpline",
};

export function channelForSector(slug: string): SectorChannel {
  return SECTOR_CHANNELS[slug] ?? FALLBACK_CHANNEL;
}

export function deskForTopic(topicId: string): ContactDesk {
  const topic = CONTACT_TOPICS.find((item) => item.id === topicId);
  return CONTACT_DESKS[topic?.desk ?? "grievances"];
}
