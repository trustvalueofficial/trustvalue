export const SCORE = "TrustScore";
export const LAUNCH = "17 October 2026";
export const CHECKED = "30 Sep 2026";

export interface Insurer {
  slug: string;
  name: string;
  legal: string;
  reg: string;
  city: string;
  former: string;
  status: string;
}

export const INSURERS: Insurer[] = [
  { slug: "acko-life", name: "ACKO Life", legal: "ACKO Life Insurance Limited", reg: "164", city: "Bengaluru", former: "", status: "" },
  { slug: "aditya-birla-sun-life", name: "Aditya Birla Sun Life Insurance", legal: "Aditya Birla Sun Life Insurance Company Limited", reg: "109", city: "Mumbai", former: "", status: "" },
  { slug: "ageas-federal-life", name: "Ageas Federal Life", legal: "Ageas Federal Life Insurance Company Limited", reg: "135", city: "Mumbai", former: "IDBI Federal Life", status: "" },
  { slug: "aviva-life", name: "Aviva Life Insurance", legal: "Aviva Life Insurance Company India Limited", reg: "122", city: "Gurugram", former: "", status: "" },
  { slug: "axis-max-life", name: "Axis Max Life", legal: "Axis Max Life Insurance Limited", reg: "104", city: "Gurugram", former: "Max Life", status: "" },
  { slug: "bajaj-life", name: "Bajaj Life", legal: "Bajaj Life Insurance Limited", reg: "116", city: "Pune", former: "Bajaj Allianz Life", status: "" },
  { slug: "bandhan-life", name: "Bandhan Life", legal: "Bandhan Life Insurance Limited", reg: "138", city: "Mumbai", former: "Aegon Life", status: "" },
  { slug: "bharti-axa-life", name: "Bharti AXA Life", legal: "Bharti AXA Life Insurance Company Limited", reg: "130", city: "Mumbai", former: "", status: "" },
  { slug: "canara-hsbc-life", name: "Canara HSBC Life", legal: "Canara HSBC Life Insurance Company Limited", reg: "136", city: "Gurugram", former: "", status: "" },
  { slug: "creditaccess-life", name: "CreditAccess Life", legal: "CreditAccess Life Insurance Limited", reg: "163", city: "Bengaluru", former: "", status: "" },
  { slug: "go-digit-life", name: "Digit Life", legal: "Go Digit Life Insurance Limited", reg: "165", city: "Pune", former: "", status: "" },
  { slug: "edelweiss-life", name: "Edelweiss Life", legal: "Edelweiss Life Insurance Company Limited", reg: "147", city: "Mumbai", former: "Edelweiss Tokio Life", status: "" },
  { slug: "generali-central-life", name: "Generali Central Life", legal: "Generali Central Life Insurance Company Limited", reg: "133", city: "Mumbai", former: "Future Generali India Life", status: "" },
  { slug: "hdfc-life", name: "HDFC Life", legal: "HDFC Life Insurance Company Limited", reg: "101", city: "Mumbai", former: "", status: "" },
  { slug: "icici-prudential-life", name: "ICICI Prudential Life", legal: "ICICI Prudential Life Insurance Company Limited", reg: "105", city: "Mumbai", former: "", status: "" },
  { slug: "indiafirst-life", name: "IndiaFirst Life", legal: "IndiaFirst Life Insurance Company Limited", reg: "143", city: "Mumbai", former: "", status: "" },
  { slug: "indusind-nippon-life", name: "IndusInd Nippon Life", legal: "IndusInd Nippon Life Insurance Company Limited", reg: "121", city: "Mumbai", former: "Reliance Nippon Life", status: "" },
  { slug: "kotak-life", name: "Kotak Life", legal: "Kotak Mahindra Life Insurance Company Limited", reg: "107", city: "Mumbai", former: "", status: "" },
  { slug: "lic", name: "LIC", legal: "Life Insurance Corporation of India", reg: "512", city: "Mumbai", former: "", status: "" },
  { slug: "pnb-metlife", name: "PNB MetLife", legal: "PNB MetLife India Insurance Company Limited", reg: "117", city: "Bengaluru", former: "", status: "" },
  { slug: "pramerica-life", name: "Pramerica Life", legal: "Pramerica Life Insurance Company Limited", reg: "140", city: "Gurugram", former: "", status: "" },
  { slug: "sahara-life", name: "Sahara Life", legal: "Sahara India Life Insurance Company Limited", reg: "127", city: "Lucknow", former: "", status: "admin" },
  { slug: "sbi-life", name: "SBI Life", legal: "SBI Life Insurance Company Limited", reg: "111", city: "Mumbai", former: "", status: "" },
  { slug: "shriram-life", name: "Shriram Life", legal: "Shriram Life Insurance Company Limited", reg: "128", city: "Hyderabad", former: "", status: "" },
  { slug: "sud-life", name: "SUD Life", legal: "Star Union Dai-ichi Life Insurance Company Limited", reg: "142", city: "Navi Mumbai", former: "", status: "" },
  { slug: "tata-aia-life", name: "Tata AIA Life", legal: "Tata AIA Life Insurance Company Limited", reg: "110", city: "Mumbai", former: "", status: "" },
];

export const INS: Record<string, Insurer> = Object.fromEntries(INSURERS.map((i) => [i.slug, i]));

export const EXTRA_FACTS: Record<string, [string, string, string][]> = {
  lic: [
    ["Central office", "Yogakshema, Jeevan Bima Marg, Mumbai 400021", "licindia.in"],
    ["Website", "licindia.in", "Official website"],
  ],
  "ageas-federal-life": [
    ["CIN", "U66010MH2007PLC167164", "Insurer's website"],
    ["Registered office", "22nd Floor, A Wing, Marathon Futurex, N. M. Joshi Marg, Lower Parel (East), Mumbai 400013", "Insurer's website"],
    ["Website", "ageasfederal.com", "Official website"],
  ],
  "sahara-life": [
    ["Status", "Under an administrator appointed by IRDAI", "IRDAI order published on the insurer's website"],
  ],
};

export interface PlanType {
  slug: string;
  name: string;
  short: string;
  plain: string;
  subs: string[];
}

export const TYPES: PlanType[] = [
  { slug: "term-insurance", name: "Term insurance", short: "Term", plain: "Pays your family a lump sum or income if you die during the policy term. Pure term pays nothing if you outlive it.", subs: ["Pure term", "Return of premium", "Standard term (Saral Jeevan Bima)"] },
  { slug: "savings-plans", name: "Savings plans", short: "Savings", plain: "Life cover with money paid back as a lump sum or regular income, either fixed in the contract or with bonuses.", subs: ["Guaranteed", "With bonuses"] },
  { slug: "ulips", name: "ULIPs", short: "ULIP", plain: "Life cover plus market-linked funds you choose. Returns are not guaranteed and charges matter, especially in the first five years.", subs: ["Wealth", "Growth"] },
  { slug: "retirement-pension", name: "Retirement and pension", short: "Retirement", plain: "Builds a retirement corpus or turns savings into a regular income, often for life.", subs: ["Deferred pension", "Immediate annuity"] },
  { slug: "child-plans", name: "Child plans", short: "Child", plain: "Savings plans built around a child's future goal, usually with the parent as the life assured.", subs: ["With premium waiver"] },
  { slug: "critical-illness", name: "Critical illness", short: "Critical illness", plain: "Pays a lump sum on diagnosis of an illness listed in the policy, after any waiting and survival periods.", subs: ["Lump sum"] },
  { slug: "group-insurance", name: "Group insurance", short: "Group", plain: "Cover bought by an employer, lender or government scheme for the people it covers.", subs: ["Employer", "Loan cover", "Government scheme"] },
  { slug: "riders", name: "Riders", short: "Riders", plain: "Optional add-ons attached to a base policy, such as accident or critical illness cover.", subs: ["Accident", "Critical illness"] },
];

export const TYPE: Record<string, PlanType> = Object.fromEntries(TYPES.map((t) => [t.slug, t]));

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const AF = "ageas-federal-life";
export const PLAN_ROWS: [string, string, string, string?][] = [
  ["Super Protect Plan", "term-insurance", "Pure term, with a return-of-premium option"],
  ["iSecure Plan", "term-insurance", "Pure term"],
  ["Saral Jeevan Bima", "term-insurance", "Standard term plan"],
  ["Termsurance Life Protection Insurance Plan", "term-insurance", "Pure term"],
  ["Guaranteed Income Plan", "savings-plans", "Guaranteed income or endowment"],
  ["Life Advantage Plus Plan", "savings-plans", "With bonuses"],
  ["Assured Income Plan", "savings-plans", "Guaranteed income"],
  ["Magic Savings Plan", "savings-plans", "Guaranteed"],
  ["Guaranteed Wealth Plan", "savings-plans", "Guaranteed lump sum or income"],
  ["Super Cash Supreme Plan", "savings-plans", "With bonuses, income"],
  ["Super Cash Plan", "savings-plans", "With bonuses, income"],
  ["Easy Save Plan", "savings-plans", "Guaranteed"],
  ["Young Star Plus Plan", "child-plans", "With bonuses, marketed as a child plan"],
  ["Smart Growth Plan", "ulips", "ULIP"],
  ["ProGrow Plan", "ulips", "ULIP"],
  ["Platinum Wealth Builder Plan", "ulips", "ULIP"],
  ["Wealth Gain Insurance Plan", "ulips", "ULIP"],
  ["Wealthsurance Growth Insurance Plan SP-II", "ulips", "ULIP, single premium"],
  ["Retire Smart Plan", "retirement-pension", "Pension"],
  ["Saral Pension", "retirement-pension", "Standard immediate annuity"],
  ["Golden Years Pension Plan", "retirement-pension", "Pension"],
  ["Criti Care Plan", "critical-illness", "Critical illness"],
  ["Group Home Secure Plan", "group-insurance", "Group, loan cover"],
  ["Group Credit Shield Plan II", "group-insurance", "Group, credit cover"],
  ["Group Loan Secure Plan II", "group-insurance", "Group, loan cover"],
  ["Group Term Life Plan II", "group-insurance", "Group term"],
  ["Group Employee Benefit Plan", "group-insurance", "Group, employer"],
  ["Group Microsurance Plan II", "group-insurance", "Group, micro insurance"],
  ["Pradhan Mantri Jeevan Jyoti Bima Yojana", "group-insurance", "Government scheme"],
  ["Critical Shield Rider", "riders", "Rider, critical illness"],
  ["Accident Care Rider", "riders", "Rider, accident"],
  ["Guaranteed Lifetime Income Plan", "retirement-pension", "No longer sold", "withdrawn"],
  ["Guaranteed Savings Plan", "savings-plans", "No longer sold", "withdrawn"],
];

export interface Plan {
  slug: string;
  name: string;
  insurer: string;
  type: string;
  sub: string;
  status: "on-sale" | "withdrawn";
}

export const PLANS: Plan[] = PLAN_ROWS.map((r) => ({
  slug: slugify(r[0]),
  name: r[0],
  insurer: AF,
  type: r[1],
  sub: r[2],
  status: r[3] === "withdrawn" ? "withdrawn" : "on-sale",
}));

export const PLAN: Record<string, Plan> = Object.fromEntries(PLANS.map((p) => [p.insurer + "/" + p.slug, p]));

const PD = "Sample policy document";
export interface PlanFactData {
  alias?: string;
  kind?: string;
  what?: string;
  facts?: [string, string, string][];
  watch?: [string, string, string][];
  riders?: string[];
  docs?: [string, string][];
  rop?: boolean;
  faq?: [string, string][];
}

export const PLAN_FACTS: Record<string, PlanFactData> = {
  "ageas-federal-life/super-protect-plan": {
    alias: "Super Protect Plus Plan",
    kind: "Individual, non-linked, non-participating",
    what: "A term life insurance plan from Ageas Federal Life. If the life assured dies during the policy term, the nominee receives the death benefit. An optional return-of-premium version pays back the premiums at maturity.",
    facts: [
      ["Plan options", "Life Cover; Life Cover with Return of Premium", PD + ", pages 4 to 5"],
      ["How you pay", "Regular, limited or single pay", PD + ", pages 11 to 12"],
      ["How often", "Yearly, half-yearly or monthly", PD + ", page 10"],
      ["Entry age", "Up to 65 years", "Insurer product page"],
      ["Cover can run to age", "85 years", "Insurer product page"],
      ["Death benefit, regular or limited pay", "Highest of 10 times the annual premium, 105% of premiums paid, or the sum assured on death", PD + ", pages 3 to 4"],
      ["Death benefit, single pay", "Higher of 125% of the single premium or the sum assured on death", PD + ", pages 3 to 4"],
      ["How the claim is paid", "Lump sum, monthly income, or both", PD + ", pages 6 to 7"],
      ["Paid if you outlive the term", "Nothing with Life Cover; 100% of premiums paid with Return of Premium", PD + ", page 5"],
      ["Free-look period", "30 days", PD],
      ["Grace period", "15 days for monthly premiums, 30 days otherwise", PD],
      ["Revival", "Within 5 years of the first unpaid premium", PD + ", page 11"],
    ],
    watch: [
      ["Death by suicide in the first year", "If death is by suicide within 12 months of the cover starting, the nominee gets 80% of premiums paid, or the surrender value if higher.", PD + ", page 19"],
      ["Stopping regular premiums", "A Life Cover policy on regular pay lapses with nothing paid back if premiums stop.", PD + ", page 11"],
      ["Limited pay refunds", "A refund value is payable only after three full years of premiums.", PD + ", pages 11 to 12"],
      ["Nothing back on survival", "The Life Cover option pays nothing if the life assured outlives the term.", PD + ", page 5"],
    ],
    riders: ["critical-shield-rider", "accident-care-rider"],
    docs: [["Product page", "https://www.ageasfederal.com/term-insurance-plans/super-protect-plan"]],
    rop: true,
  },
  "ageas-federal-life/young-star-plus-plan": {
    kind: "Individual, participating savings plan",
    what: "A participating savings plan from Ageas Federal Life, marketed as a child plan. Part of its return comes as bonuses, which are not guaranteed.",
    facts: [["Plan type", "Participating savings plan, marketed as a child plan", "Insurer product page"]],
    docs: [["Product page", "https://www.ageasfederal.com/child-insurance-plans/young-star-plus-plan"]],
  },
};

export const ASPECTS: [string, string, string][] = [
  ["claims", "Claims", "How the claim, if any, was handled"],
  ["service", "Service", "Calls, branches, emails, turnaround"],
  ["honesty", "Sales honesty", "Was the plan explained truthfully"],
  ["digital", "Digital experience", "App, website, e-policy, payments"],
  ["value", "Value for money", "Was the premium worth what you got"],
];

export interface RatingStop {
  v: number;
  label: string;
  sub: string;
}

export const STOPS: RatingStop[] = [
  { v: 0, label: "Angry Star", sub: "Broke my trust" },
  { v: 20, label: "1", sub: "Poor" },
  { v: 40, label: "2", sub: "Below par" },
  { v: 60, label: "3", sub: "Okay" },
  { v: 80, label: "4", sub: "Good" },
  { v: 100, label: "Rec.", sub: "Recommend" },
];

export const VERIFY: Record<string, { v: number; label: string }> = {
  policy: { v: 1.0, label: "Policy-verified" },
  id: { v: 0.9, label: "ID-verified" },
  phone: { v: 0.7, label: "Phone-verified" },
  email: { v: 0.5, label: "Email only" },
};

export const JOURNEYS = ["Buying", "Policy issuance", "Paying premiums", "Service request", "Claim", "Surrender or exit"];
export const LANGS = ["English", "Hindi", "Marathi", "Bengali", "Tamil", "Telugu", "Kannada", "Gujarati", "Malayalam", "Punjabi", "Odia"];

export interface GlossaryItem {
  slug: string;
  term: string;
  def: string;
  type: string;
  related: string[];
}

const RAW_GLOSSARY: [string, string, string, string[]][] = [
  ["Annuity", "A series of regular payments, usually for life, bought with a lump sum. Pension plans often end in one.", "retirement-pension", ["deferred-annuity", "pension-plan", "settlement-option"]],
  ["Annualised premium", "The premium you would pay in a year, whatever your payment frequency. Many policy benefits are worked out from it.", "", ["premium", "sum-assured-on-death"]],
  ["Assignment", "Transferring the rights in a policy to another person or a lender, for example to secure a home loan.", "", ["nominee", "policyholder"]],
  ["Authenticity score", "TrustValue's 0 to 1 estimate of how genuine a review is. It sets how much a review counts toward a TrustScore; reviews under 0.3 are filtered but stay viewable.", "", ["trustscore", "verified-review", "expectation-gap"]],
  ["Bancassurance", "Selling insurance through a bank's branches and relationship managers, under a corporate agency arrangement.", "", ["corporate-agent", "mis-selling", "posp"]],
  ["Base plan", "The main policy that riders attach to. A rider cannot be bought on its own.", "riders", ["rider"]],
  ["Bima Bharosa", "IRDAI's online grievance system. You can use it if your insurer does not resolve your complaint.", "", ["insurance-ombudsman", "grievance-redressal-officer", "irdai"]],
  ["Bonus", "An amount added to a participating policy from the insurer's surplus. It is not guaranteed until the insurer declares it.", "savings-plans", ["participating-plan", "reversionary-bonus"]],
  ["Claim", "A request to the insurer to pay a benefit under the policy, such as the death benefit or a critical illness payout.", "", ["claim-settlement-ratio", "death-benefit", "non-disclosure"]],
  ["Claim settlement ratio", "The share of death claims an insurer paid out of the claims it decided in a year. IRDAI publishes it in its annual report.", "", ["claim", "irdai"]],
  ["Contestability (Section 45)", "Under Section 45 of the Insurance Act, a policy cannot be questioned on any ground once three years have passed from its start or revival.", "", ["non-disclosure", "claim", "revival"]],
  ["Corporate agent", "A company, such as a bank, licensed to sell insurance for a limited number of insurers.", "", ["bancassurance", "posp", "web-aggregator"]],
  ["Critical illness cover", "Cover that pays a lump sum when you are diagnosed with an illness listed in the policy.", "critical-illness", ["waiting-period", "survival-period", "rider"]],
  ["Death benefit", "The amount paid to the nominee if the life assured dies while the policy is in force.", "term-insurance", ["sum-assured-on-death", "nominee", "settlement-option"]],
  ["Deferred annuity", "A pension plan that builds a corpus first and starts paying income later.", "retirement-pension", ["annuity", "pension-plan"]],
  ["e-Insurance Account", "An electronic account with an insurance repository that holds your policies in one place. TrustValue can use it to verify a policy.", "", ["policy-document", "verified-review"]],
  ["Endowment plan", "A savings plan that pays a lump sum at maturity or on earlier death.", "savings-plans", ["maturity-benefit", "participating-plan"]],
  ["Exclusion", "Something the policy does not cover. Exclusions are listed in the policy document.", "", ["policy-document", "expectation-gap", "suicide-clause"]],
  ["Expectation gap", "TrustValue's label for a complaint about something the policy never covered. The review stays visible with the clause explained, and counts at reduced weight.", "", ["exclusion", "authenticity-score", "trustscore"]],
  ["Free-look period", "A window after you receive the policy when you can cancel it and get your premium back, less allowed deductions. Your policy document states its length.", "", ["policy-document", "mis-selling"]],
  ["Fund switch", "Moving your ULIP money from one fund to another inside the same policy.", "ulips", ["ulip", "nav", "fund-value"]],
  ["Fund value", "The current value of the units in your ULIP.", "ulips", ["ulip", "nav", "partial-withdrawal"]],
  ["Grace period", "Extra time after a premium's due date during which you can pay without losing cover.", "", ["lapse", "revival", "premium"]],
  ["Grievance redressal officer", "The person at an insurer who handles complaints that its normal service channels did not resolve.", "", ["bima-bharosa", "insurance-ombudsman"]],
  ["Group insurance", "One policy that covers a group, such as employees or borrowers, bought by the employer, lender or scheme.", "group-insurance", ["policyholder"]],
  ["Guaranteed surrender value", "The minimum amount the insurer must pay if you surrender a policy, as set out in the policy document.", "", ["surrender-value", "special-surrender-value", "paid-up-value"]],
  ["Human life value", "An estimate of the income your family would lose if you died, used to decide how much cover you need.", "term-insurance", ["sum-assured", "term-insurance"]],
  ["Insurance Ombudsman", "A free forum for resolving complaints against insurers, set up under the Insurance Ombudsman Rules, 2017.", "", ["bima-bharosa", "grievance-redressal-officer"]],
  ["IRDAI", "The Insurance Regulatory and Development Authority of India, which licenses and regulates insurers and intermediaries.", "", ["irdai-registration-number", "web-aggregator"]],
  ["IRDAI registration number", "The number IRDAI gives each insurer. TrustValue shows it beside every insurer's name.", "", ["irdai"]],
  ["Lapse", "When a policy stops because premiums were not paid within the grace period.", "", ["grace-period", "revival", "paid-up-value"]],
  ["Life assured", "The person whose life is covered. The policyholder and the life assured are often, but not always, the same person.", "", ["policyholder", "proposer", "nominee"]],
  ["Limited pay", "Paying premiums for fewer years than the policy runs.", "", ["regular-pay", "single-premium", "premium-paying-term"]],
  ["Lock-in period", "The years during which you cannot withdraw from a ULIP. It is five years.", "ulips", ["ulip", "surrender-value"]],
  ["Married Women's Property Act policy", "A policy taken under Section 6 of the MWP Act for a wife or children. The money is held in trust for them and is out of reach of creditors.", "", ["nominee", "assignment"]],
  ["Maturity benefit", "The amount paid when a policy reaches the end of its term with the life assured alive.", "savings-plans", ["endowment-plan", "return-of-premium"]],
  ["Medical underwriting", "Assessing your health, often with tests, before the insurer accepts the proposal and sets the premium.", "", ["underwriting", "proposal-form", "non-disclosure"]],
  ["Mis-selling", "Selling a policy with false or incomplete information, or one that does not fit the buyer, such as a ULIP sold as a fixed deposit.", "", ["free-look-period", "sales-honesty", "bancassurance"]],
  ["Mortality charge", "The cost of the life cover inside a ULIP, deducted from your fund.", "ulips", ["ulip", "fund-value"]],
  ["NAV", "Net asset value: the price of one unit of a ULIP fund on a given day.", "ulips", ["fund-value", "fund-switch"]],
  ["Nominee", "The person who receives the policy money if the life assured dies.", "", ["death-benefit", "assignment", "claim"]],
  ["Non-disclosure", "Not telling the insurer something material, such as an illness or smoking, on the proposal form. It is a common reason for claim disputes.", "", ["proposal-form", "contestability-section-45", "claim"]],
  ["Non-participating plan", "A plan that does not share in the insurer's profits. Its benefits are fixed in the contract.", "savings-plans", ["participating-plan", "bonus"]],
  ["Paid-up value", "A reduced benefit a policy keeps if you stop paying premiums after it has acquired a value.", "", ["lapse", "surrender-value"]],
  ["Partial withdrawal", "Taking out part of your ULIP fund after the lock-in period, within the limits in the policy.", "ulips", ["lock-in-period", "fund-value"]],
  ["Participating plan", "A plan that shares in the insurer's surplus through bonuses, which are not guaranteed.", "savings-plans", ["bonus", "non-participating-plan"]],
  ["Pension plan", "A plan that builds savings for retirement and then pays an income.", "retirement-pension", ["annuity", "deferred-annuity"]],
  ["Policy document", "The legal contract that sets out cover, benefits, charges and exclusions. TrustValue cites its page numbers.", "", ["exclusion", "free-look-period"]],
  ["Policy term", "How long the policy runs.", "", ["premium-paying-term", "maturity-benefit"]],
  ["Policyholder", "The person who owns the policy and pays the premium.", "", ["life-assured", "proposer"]],
  ["POSP", "Point of Sales Person: an IRDAI-defined seller who can sell simple products after short training.", "", ["corporate-agent", "web-aggregator"]],
  ["Premium", "What you pay for the policy, yearly, half-yearly, quarterly, monthly or once.", "", ["annualised-premium", "grace-period"]],
  ["Premium paying term", "How many years you pay premiums. It can be shorter than the policy term.", "", ["limited-pay", "regular-pay", "policy-term"]],
  ["Proposal form", "The application you fill in. What you declare here is what the insurer relies on.", "", ["non-disclosure", "underwriting"]],
  ["Proposer", "The person who applies for the policy. Usually becomes the policyholder.", "", ["policyholder", "life-assured"]],
  ["Regular pay", "Paying premiums every year for the whole policy term.", "", ["limited-pay", "single-premium"]],
  ["Return of premium", "A term plan option that pays back the premiums paid if you outlive the term. It costs more than pure term.", "term-insurance", ["term-insurance", "maturity-benefit"]],
  ["Reversionary bonus", "A bonus added to a participating policy each year and paid with the claim or at maturity.", "savings-plans", ["bonus", "participating-plan"]],
  ["Revival", "Restoring a lapsed policy by paying the overdue premiums, often with interest and health checks, within the window the policy allows.", "", ["lapse", "grace-period"]],
  ["Rider", "An optional add-on to a base plan, such as accident or critical illness cover, for an extra premium.", "riders", ["base-plan", "critical-illness-cover"]],
  ["Sales honesty", "One of the five aspects rated on TrustValue: whether the plan was explained truthfully when it was sold.", "", ["mis-selling", "trustscore"]],
  ["Settlement option", "Taking a death or maturity benefit as instalments instead of a lump sum, where the plan allows it.", "", ["death-benefit", "annuity"]],
  ["Single premium", "Paying the whole premium once, at the start.", "", ["regular-pay", "limited-pay"]],
  ["Special surrender value", "A surrender value the insurer may pay that is higher than the guaranteed surrender value.", "", ["surrender-value", "guaranteed-surrender-value"]],
  ["Suicide clause", "A policy condition that limits the death benefit if death is by suicide within a set period, usually the first year.", "term-insurance", ["exclusion", "death-benefit"]],
  ["Sum assured", "The guaranteed amount of cover the policy is built around.", "", ["sum-assured-on-death", "death-benefit"]],
  ["Sum assured on death", "The amount the policy promises to pay on death, as defined in the policy document.", "term-insurance", ["sum-assured", "death-benefit"]],
  ["Surrender value", "What you get if you end a policy before maturity.", "", ["guaranteed-surrender-value", "special-surrender-value", "paid-up-value"]],
  ["Survival period", "How long you must live after a critical illness diagnosis before the benefit is paid.", "critical-illness", ["critical-illness-cover", "waiting-period"]],
  ["Term insurance", "Pure life cover for a fixed period. It pays if the life assured dies during the term and usually nothing otherwise.", "term-insurance", ["death-benefit", "return-of-premium", "human-life-value"]],
  ["Trust Alert", "Shown on a plan when 10% or more of its reviewers gave an Angry Star, whatever its average.", "", ["trustscore", "authenticity-score"]],
  ["TrustScore", "TrustValue's 0 to 100 measure of how well an insurer or plan keeps its promises, built from weighted, verified reviews.", "", ["trust-alert", "authenticity-score", "verified-review"]],
  ["ULIP", "Unit-linked insurance plan: life cover plus investment in market-linked funds you choose.", "ulips", ["fund-value", "lock-in-period", "mortality-charge"]],
  ["Underwriting", "How the insurer decides whether to accept a proposal and at what premium.", "", ["medical-underwriting", "proposal-form"]],
  ["Verified review", "A review whose writer proved something about themselves: holding the policy, their ID, or their phone number. Policy verification counts most.", "", ["authenticity-score", "e-insurance-account"]],
  ["Waiting period", "Time at the start of a cover during which certain claims, such as critical illness, are not paid.", "critical-illness", ["survival-period", "exclusion"]],
  ["Waiver of premium", "A benefit or rider under which the insurer pays future premiums if a stated event happens, such as the parent's death in a child plan.", "child-plans", ["rider", "child-plans"]],
  ["Web aggregator", "An IRDAI-licensed intermediary that runs a website comparing insurance products and passing leads to insurers.", "", ["irdai", "corporate-agent", "posp"]],
];

export const GLOSSARY: GlossaryItem[] = RAW_GLOSSARY.map((g) => ({
  slug: slugify(g[0]),
  term: g[0],
  def: g[1],
  type: g[2],
  related: g[3],
}));

export const GLOSS: Record<string, GlossaryItem> = Object.fromEntries(GLOSSARY.map((g) => [g.slug, g]));

export interface Pillar {
  slug: string;
  name: string;
  intro: string;
}

export const PILLARS: Pillar[] = [
  { slug: "claims", name: "Claims", intro: "How life insurance claims work, why some are disputed, and what to do when one goes wrong." },
  { slug: "buying-well", name: "Buying well", intro: "Questions to ask before you sign, and how to spot a plan that does not fit you." },
  { slug: "term-insurance", name: "Term insurance", intro: "Pure protection: how much cover you need, options, and the clauses that matter." },
  { slug: "policy-changes", name: "Policy changes", intro: "Renamed insurers, missed premiums, revivals and exits." },
  { slug: "using-trustvalue", name: "Using TrustValue", intro: "How reviews, verification and TrustScores work." },
];

export interface Article {
  slug: string;
  pillar: string;
  title: string;
  updated: string;
  answer: string;
  body: [string, any?][];
  sources: [string, string][];
  faq: [string, string][];
}

export const ARTICLES: Article[] = [
  {
    slug: "insurer-changed-its-name",
    pillar: "policy-changes",
    title: "Your life insurer changed its name. What happens to your policy?",
    updated: "30 Sep 2026",
    answer: "Nothing changes in your contract. A renamed insurer is the same company with the same IRDAI registration number, so your cover, premiums, benefits and claim rights stay as they are.",
    body: [
      ["p", "Seven life insurers in India have changed their names in recent years. The registration number is the easiest way to confirm that a new name belongs to the company you bought from."],
      ["table"],
      ["h2", "What stays the same"],
      ["ul", ["Your policy number, cover and benefits", "Your premium and due dates", "Your nominee", "Your right to claim and to complain"]],
      ["h2", "What can change"],
      ["ul", ["The logo and name on letters, receipts and the app", "The website address, usually with a redirect from the old one", "Bank account names for premium payments: pay only through the insurer's official channels"]],
      ["h2", "Watch for scams"],
      ["p", "A renaming is never a reason to buy a new policy, pay a migration fee, or share an OTP. If someone calls about moving your policy to the new name, hang up and call the insurer on the number printed in your policy document."],
    ],
    sources: [
      ["Life Insurance Council member list", "https://www.lifeinscouncil.org"],
      ["IRDAI list of life insurers", "https://irdai.gov.in"],
    ],
    faq: [
      ["Do I need a new policy document?", "No. You may receive letters under the new name, but your existing document stays valid."],
      ["Will my claim be paid under the new name?", "Yes. The company, its registration number and its obligations are unchanged."],
    ],
  },
  {
    slug: "claim-rejected-what-now",
    pillar: "claims",
    title: "Claim rejected? What to do next",
    updated: "12 Oct 2026",
    answer: "Ask for the rejection reason in writing, check it against your policy document, then complain to the insurer's grievance team. If that fails, use IRDAI's Bima Bharosa portal and then the Insurance Ombudsman, which is free.",
    body: [
      ["h2", "1. Get the reason in writing"],
      ["p", "The rejection letter should name the clause the insurer relied on. Common reasons are non-disclosure on the proposal form, an exclusion, a waiting period, or missing documents."],
      ["h2", "2. Read the clause yourself"],
      ["p", "Find that clause in the policy document. If the claim was rejected for something the policy never covered, a complaint is unlikely to change the outcome. If the reason looks wrong, or documents were simply missing, it often can."],
      ["h2", "3. Complain to the insurer"],
      ["p", "Write to the insurer's grievance redressal officer with your policy number, the claim number, the rejection letter and why you disagree. Keep copies and note the date."],
      ["h2", "4. Escalate"],
      ["ul", ["Bima Bharosa: IRDAI's grievance system, if the insurer does not resolve it", "Insurance Ombudsman: a free forum for disputes, under the Insurance Ombudsman Rules, 2017"]],
      ["h2", "5. Tell others what happened"],
      ["p", "Write a review of the claim on TrustValue. If the insurer replies and fixes it, you can update your rating, and the full history stays visible."],
    ],
    sources: [
      ["IRDAI Bima Bharosa", "https://bimabharosa.irdai.gov.in"],
      ["Council for Insurance Ombudsmen", "https://www.cioins.co.in"],
    ],
    faq: [
      ["Does it cost anything to go to the Ombudsman?", "No. The Insurance Ombudsman is free for policyholders."],
      ["Should I accept a partial settlement?", "Read what you are signing. Accepting may close the claim, so ask the insurer in writing whether you keep the right to dispute the rest."],
    ],
  },
  {
    slug: "was-i-mis-sold",
    pillar: "buying-well",
    title: "Was I mis-sold a policy? Signs and steps",
    updated: "12 Oct 2026",
    answer: "You may have been mis-sold if the policy is not what you were told: a ULIP or savings plan sold as a fixed deposit, a premium you cannot afford, or benefits promised that are not in the document. Act fast if you are still inside the free-look period.",
    body: [
      ["h2", "Common signs"],
      ["ul", ["You were told it was a fixed deposit or a guaranteed return, but it is a ULIP", "The premium is far more than you agreed, or runs for longer", "Benefits you were promised are not in the policy document", "You were told a bonus was guaranteed"]],
      ["h2", "What to do"],
      ["ul", ["Inside the free-look period: cancel in writing and ask for the refund", "After it: complain to the insurer's grievance officer with details of what you were told", "Then escalate to Bima Bharosa and the Insurance Ombudsman"]],
      ["p", "Use the mis-selling checker to collect your answers into a complaint you can send."],
    ],
    sources: [["IRDAI policyholder information", "https://irdai.gov.in"]],
    faq: [["Can I get my money back after the free-look period?", "It depends on the case. A complaint backed by evidence, such as messages or recordings, has a better chance."]],
  },
  {
    slug: "how-much-term-cover",
    pillar: "term-insurance",
    title: "How much term cover do you need?",
    updated: "12 Oct 2026",
    answer: "Enough to replace the income your family would lose, plus your loans, minus what you already have. The human life value calculator works this out from your own numbers.",
    body: [
      ["h2", "The simple method"],
      ["p", "Take the yearly income your family relies on, minus your own expenses, and work out what it would take to replace it until you would have retired. Add loans and big goals such as education. Subtract savings and existing cover."],
      ["h2", "Choices that change the cost"],
      ["ul", ["Pure term or return of premium: return of premium pays back premiums if you outlive the term, and costs more", "Regular, limited or single pay", "Lump sum or monthly income for your family"]],
      ["h2", "Clauses to read"],
      ["ul", ["Suicide clause in the first year", "What happens if you stop paying", "Free-look period"]],
    ],
    sources: [["Super Protect Plan sample policy document (Ageas Federal Life)", "https://www.ageasfederal.com/term-insurance-plans/super-protect-plan"]],
    faq: [["Is return of premium worth it?", "It depends on what else you could do with the extra premium. The plan page shows what each option pays."]],
  },
  {
    slug: "stopped-paying-premiums",
    pillar: "policy-changes",
    title: "What happens if you stop paying premiums",
    updated: "12 Oct 2026",
    answer: "After the grace period the policy lapses or becomes paid-up, depending on the plan and how long you have paid. Most plans let you revive a lapsed policy within a set window.",
    body: [
      ["h2", "Grace period"],
      ["p", "You keep cover for a short time after the due date. The policy document states how long."],
      ["h2", "Lapse or paid-up"],
      ["p", "Pure term plans usually lapse with nothing paid back. Savings plans that have acquired a value may continue with reduced benefits, called paid-up value, or can be surrendered."],
      ["h2", "Revival"],
      ["p", "You can usually restore a lapsed policy within a window, often five years, by paying the arrears and sometimes passing health checks."],
    ],
    sources: [["Super Protect Plan sample policy document (Ageas Federal Life)", "https://www.ageasfederal.com/term-insurance-plans/super-protect-plan"]],
    faq: [],
  },
  {
    slug: "how-trustscore-works",
    pillar: "using-trustvalue",
    title: "How a TrustScore works",
    updated: "12 Oct 2026",
    answer: "A TrustScore is a weighted average of reviews on a 0 to 100 scale. Each review counts by how authentic, verified, recent and relevant it is, and a prior keeps a handful of reviews from producing an extreme score.",
    body: [
      ["h2", "Weights"],
      ["p", "Every review gets a weight: authenticity times verification times recency times context. Policy-verified reviews count most."],
      ["h2", "Why a new plan does not jump to 100"],
      ["p", "The formula blends reviews with the category average, weighted like 20 reviews. Three glowing reviews cannot outrank three thousand."],
      ["h2", "When a score shows"],
      ["p", "A plan's TrustScore shows from its 10th review. Before that you see how many reviews it has."],
    ],
    sources: [],
    faq: [],
  },
  {
    slug: "expectation-gap-reviews",
    pillar: "using-trustvalue",
    title: "Why some negative reviews are labelled expectation gap",
    updated: "12 Oct 2026",
    answer: "When a complaint is about something the policy never covered, such as a waiting period or an exclusion, the review stays visible with the clause explained. It counts at a reduced weight. Nothing is deleted.",
    body: [["p", "Anger is real even when the policy was followed. Explaining the clause helps the next buyer more than hiding the review, and each common gap becomes a guide."]],
    sources: [],
    faq: [],
  },
];

export const ARTICLE: Record<string, Article> = Object.fromEntries(ARTICLES.map((a) => [a.slug, a]));
export const RENAMES = INSURERS.filter((i) => i.former);

export interface Question {
  slug: string;
  q: string;
  a: string;
  insurers: string[];
  topic: string;
  by: string;
  answered: boolean;
  seed?: boolean;
  author?: string;
  created?: number;
}

const RAW_QUESTIONS: [string, string, string[], string][] = [
  ["What is Bajaj Allianz Life called now?", "It is now Bajaj Life Insurance Limited. The IRDAI registration number, 116, is unchanged, and existing policies continue as before.", ["bajaj-life"], "Policy changes"],
  ["What is Max Life Insurance called now?", "Axis Max Life Insurance Limited, registration number 104. Existing policies are unaffected.", ["axis-max-life"], "Policy changes"],
  ["Is IDBI Federal Life the same as Ageas Federal Life?", "Yes. IDBI Federal Life was renamed Ageas Federal Life Insurance Company Limited. Its registration number is 135.", ["ageas-federal-life"], "Policy changes"],
  ["What is Aegon Life called now?", "Bandhan Life Insurance Limited, registration number 138.", ["bandhan-life"], "Policy changes"],
  ["Is Sahara Life still operating?", "An IRDAI order appointing an administrator for Sahara India Life is published on the insurer's website. Its policyholders can still review their experience on TrustValue.", ["sahara-life"], "Insurers"],
  ["How many life insurers are there in India?", "TrustValue lists 26: the members of the Life Insurance Council on 30 September 2026.", [], "Insurers"],
  ["Where do I complain if my insurer ignores me?", "Start with the insurer's grievance redressal officer. If that fails, use IRDAI's Bima Bharosa portal, then the Insurance Ombudsman, which is free.", [], "Claims"],
  ["Does Super Protect Plan pay anything if I survive the term?", "Only with the Return of Premium option, which pays back 100% of premiums paid. The Life Cover option pays nothing on survival (sample policy document, page 5).", ["ageas-federal-life"], "Plans"],
  ["Can an insurer pay TrustValue to remove a bad review?", "No. Insurers can reply publicly for free, but only the reviewer can change a rating, and the full history stays visible.", [], "Using TrustValue"],
  ["Why does a plan show no TrustScore?", "A plan's TrustScore appears from its 10th review. Before that, the page shows how many reviews it has.", [], "Using TrustValue"],
  ["What is LIC's IRDAI registration number?", "512, according to licindia.in.", ["lic"], "Insurers"],
  ["What is the free-look period on Super Protect Plan?", "30 days, according to the sample policy document.", ["ageas-federal-life"], "Plans"],
];

export const QUESTIONS: Question[] = RAW_QUESTIONS.map((q) => ({
  slug: slugify(q[0]),
  q: q[0],
  a: q[1],
  insurers: q[2],
  topic: q[3],
  by: "TrustValue editors",
  answered: true,
  seed: true,
}));

export interface Need {
  slug: string;
  name: string;
  crit: string;
  match: (p: Plan) => boolean;
}

export const NEEDS: Need[] = [
  { slug: "term-plans-with-return-of-premium", name: "Term plans with return of premium", crit: "The policy document offers an option that pays back premiums on survival.", match: (p) => !!(PLAN_FACTS[p.insurer + "/" + p.slug] || {}).rop },
  { slug: "term-plans-for-smokers", name: "Term plans for smokers", crit: "Accepts tobacco users, with the smoker premium basis stated in the policy document.", match: () => false },
  { slug: "term-plans-for-nris", name: "Term plans for NRIs", crit: "Accepts proposals from non-resident Indians, with the residence rules stated in the policy document.", match: () => false },
  { slug: "term-plans-for-women", name: "Term plans for women", crit: "Offers women-specific benefits or premium rates stated in the policy document.", match: () => false },
];

export interface NewsStory {
  slug: string;
  date: string;
  cat: string;
  title: string;
  dek: string;
  body: string[];
  sources: [string, string][];
}

export const NEWS: NewsStory[] = [
  {
    slug: "trustvalue-opens-for-reviews",
    date: "17 Oct 2026",
    cat: "TrustValue data",
    title: "TrustValue opens for reviews of all 26 life insurers in India",
    dek: "Policyholders can review any life insurer from today. TrustScores appear as reviews arrive; nothing is pre-filled.",
    body: [
      "TrustValue.ai opened today with pages for all 26 life insurers that are members of the Life Insurance Council, each with its IRDAI registration number.",
      "Every insurer and plan starts with no score. A plan's TrustScore appears from its 10th review, weighted by how authentic, verified and recent each review is. Insurers cannot pay to change a score or remove a review; they can reply in public for free.",
      "Plan lists start with Ageas Federal Life's catalogue and grow insurer by insurer. Reviewers whose plan is not yet listed can name it, and the review counts once the plan is matched.",
    ],
    sources: [["How TrustScores work", "#/methodology"]],
  },
];

/* ===== Client state store & scoring ===== */
export interface Review {
  id: string;
  insurer: string;
  plan?: string | null;
  planName?: string;
  matchPending?: boolean;
  overall: number;
  aspects?: Record<string, number>;
  title: string;
  body: string;
  journey?: string;
  lang?: string;
  verify: string;
  status: "published" | "waiting-match" | "pending";
  created: number;
  author: string;
  helpful: number;
  media?: string[];
  history: { t: number; ev: string; text?: string }[];
  sample?: boolean;
  auth?: number;
  gap?: boolean;
}

export interface Complaint {
  id: string;
  insurer: string;
  plan?: string;
  issue: string;
  details: string;
  outcome?: string;
  status: "Sent" | "Insurer replied" | "Resolved" | "Escalated";
  created: number;
  updated: number;
  author: string;
  review?: string;
  firstReply?: number;
  events: { t: number; who: string; text: string }[];
}

export interface User {
  name: string;
  handle: string;
  verify: string;
  joined: number;
  phone?: string;
}

export interface Post {
  id: string;
  kind: "video" | "photo" | "audio";
  shape?: string;
  title: string;
  status: "published" | "pending";
  created: number;
  insurer: string;
  author: string;
  lang?: string;
  transcript?: string;
  caption?: string;
  alt?: string;
  journey?: string;
  plan?: string;
}

export interface AppStore {
  user: User | null;
  reviews: Review[];
  complaints: Complaint[];
  questions: Question[];
  answers: Record<string, { text: string; author: string; created: number }[]>;
  posts: Post[];
  follows: string[];
  saved: string[];
  helpful: Record<string, boolean>;
  messages: { topic: string; t: number }[];
  claims: { insurer: string; t: number }[];
  alerts: string[];
  feedback: Record<string, string>;
  draft?: any;
  shareDraft?: any;
  shareFile?: string | null;
  lastReview?: string;
  policies?: { insurer: string; plan: string; t: number }[];
  views?: Record<string, number>;
  portal?: string | null;
  asks?: Record<string, number>;
}

export const STORE_KEY = "tv-prototype-v1";

const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: "cmp-101",
    insurer: "hdfc-life",
    issue: "Maturity payment delay - RTGS credit pending",
    details: "Policy matured on 1st, payment delayed due to bank IFSC update. Resolved with credit confirmation.",
    status: "Resolved",
    created: 1727500000000,
    updated: 1728500000000,
    author: "arun.kumar",
    events: [
      { t: 1727500000000, who: "Policyholder", text: "Raised dispute with branch documentation." },
      { t: 1728500000000, who: "Insurer Grievance Team", text: "RTGS transfer credited successfully." },
    ],
  },
  {
    id: "cmp-102",
    insurer: "ageas-federal-life",
    issue: "Nominee name spelling mismatch after legal update",
    details: "Aadhaar name variation was causing delay in nominee record update. Re-verified via e-KYC.",
    status: "Resolved",
    created: 1727800000000,
    updated: 1728600000000,
    author: "meera.iyer",
    events: [
      { t: 1727800000000, who: "Policyholder", text: "Submitted marriage certificate and revised Aadhaar." },
      { t: 1728600000000, who: "Insurer Support", text: "Nominee endorsement updated in policy master." },
    ],
  },
  {
    id: "cmp-103",
    insurer: "lic",
    issue: "Excess auto-debit deduction on NACH mandate",
    details: "Double deduction in billing cycle, refunded to bank account within 4 working days.",
    status: "Resolved",
    created: 1727900000000,
    updated: 1728700000000,
    author: "satish.patil",
    events: [
      { t: 1727900000000, who: "Policyholder", text: "Reported double debit with bank statement." },
      { t: 1728700000000, who: "Branch Accounts", text: "Reversed duplicate deduction to bank account." },
    ],
  },
];

const INITIAL_REVIEWS: Review[] = [
  // HDFC Life reviews (10)
  { id: "rev-h1", insurer: "hdfc-life", plan: "click-2-protect", overall: 80, title: "Smooth death benefit settlement", body: "Claim processing for my uncle's policy took only 3 days. Clean documentation checklist provided beforehand with proactive SMS updates.", journey: "Claim", verify: "policy", status: "published", created: 1728750000000, author: "rahul.m", helpful: 14, history: [] },
  { id: "rev-h2", insurer: "hdfc-life", plan: "click-2-protect", overall: 80, title: "Clear term insurance onboarding", body: "Medical examiner visited home on time. Medical report shared digitally within 24 hours.", journey: "Policy issuance", verify: "policy", status: "published", created: 1728700000000, author: "deepak.sharma", helpful: 8, history: [] },
  { id: "rev-h3", insurer: "hdfc-life", overall: 80, title: "Prompt customer service", body: "Address change processed online through DigiLocker KYC without visiting any branch.", journey: "Service request", verify: "id", status: "published", created: 1728600000000, author: "swati.n", helpful: 5, history: [] },
  { id: "rev-h4", insurer: "hdfc-life", overall: 100, title: "Hassle-free nominee registration", body: "Added second nominee online, endorsement receipt generated immediately.", journey: "Service request", verify: "policy", status: "published", created: 1728500000000, author: "vijay.b", helpful: 4, history: [] },
  { id: "rev-h5", insurer: "hdfc-life", overall: 80, title: "Transparent premium breakdown", body: "Good policy portal with downloadable tax certificates and GST invoices.", journey: "Paying premiums", verify: "policy", status: "published", created: 1728400000000, author: "amit.k", helpful: 6, history: [] },
  { id: "rev-h6", insurer: "hdfc-life", overall: 80, title: "Reliable term cover", body: "Policy issued strictly per proposal declaration. No unexpected riders added.", journey: "Buying", verify: "policy", status: "published", created: 1728300000000, author: "sneha.r", helpful: 3, history: [] },
  { id: "rev-h7", insurer: "hdfc-life", overall: 100, title: "Great claim experience", body: "Critical illness claim approved after document submission without hassle.", journey: "Claim", verify: "policy", status: "published", created: 1728200000000, author: "manish.g", helpful: 9, history: [] },
  { id: "rev-h8", insurer: "hdfc-life", overall: 80, title: "Timely premium reminders", body: "WhatsApp and email reminders sent 15 days before due date.", journey: "Paying premiums", verify: "phone", status: "published", created: 1728100000000, author: "pooja.v", helpful: 2, history: [] },
  { id: "rev-h9", insurer: "hdfc-life", overall: 80, title: "Good digital dashboard", body: "Policy download through WhatsApp service worked in seconds.", journey: "Service request", verify: "id", status: "published", created: 1728000000000, author: "tarun.j", helpful: 4, history: [] },
  { id: "rev-h10", insurer: "hdfc-life", overall: 80, title: "Solid renewal track record", body: "Paid 5th year renewal with zero issues on netbanking.", journey: "Paying premiums", verify: "policy", status: "published", created: 1727900000000, author: "anand.s", helpful: 5, history: [] },

  // Ageas Federal Life reviews (10)
  { id: "rev-a1", insurer: "ageas-federal-life", plan: "super-protect-plan", overall: 100, title: "Accurate tele-medical issuance", body: "Policy issued in 48 hours after tele-medical consultation. Sample document matched the policy terms word for word.", journey: "Policy issuance", verify: "policy", status: "published", created: 1728740000000, author: "vikram.k", helpful: 11, history: [] },
  { id: "rev-a2", insurer: "ageas-federal-life", plan: "super-protect-plan", overall: 80, title: "Clear pure term contract", body: "Document wordings are clean. Clear explanations of the 3-year Section 45 contestability window.", journey: "Buying", verify: "policy", status: "published", created: 1728650000000, author: "rohit.t", helpful: 7, history: [] },
  { id: "rev-a3", insurer: "ageas-federal-life", overall: 80, title: "Prompt support on phone", body: "Customer service answered within 30 seconds and provided the revival quotation directly.", journey: "Service request", verify: "phone", status: "published", created: 1728550000000, author: "anita.m", helpful: 4, history: [] },
  { id: "rev-a4", insurer: "ageas-federal-life", overall: 100, title: "Very easy claim payout", body: "Death claim settlement for father was completed with full empathy and no redundant paper runs.", journey: "Claim", verify: "policy", status: "published", created: 1728450000000, author: "kunal.p", helpful: 13, history: [] },
  { id: "rev-a5", insurer: "ageas-federal-life", overall: 80, title: "Straightforward payment process", body: "Auto-pay setup via e-mandate worked seamlessly on HDFC netbanking.", journey: "Paying premiums", verify: "id", status: "published", created: 1728350000000, author: "divya.c", helpful: 3, history: [] },
  { id: "rev-a6", insurer: "ageas-federal-life", overall: 80, title: "Good term insurance rates", body: "Competitive premium with standard non-smoker discount honored.", journey: "Buying", verify: "policy", status: "published", created: 1728250000000, author: "rajesh.l", helpful: 5, history: [] },
  { id: "rev-a7", insurer: "ageas-federal-life", overall: 80, title: "Prompt email response", body: "Received soft copy policy schedule within 1 hour of online payment.", journey: "Policy issuance", verify: "policy", status: "published", created: 1728150000000, author: "sangeeta.b", helpful: 2, history: [] },
  { id: "rev-a8", insurer: "ageas-federal-life", overall: 80, title: "No spam or cold calls", body: "Respect privacy and don't push unsolicited endowment schemes.", journey: "Buying", verify: "policy", status: "published", created: 1728050000000, author: "naveen.k", helpful: 6, history: [] },
  { id: "rev-a9", insurer: "ageas-federal-life", overall: 100, title: "Clean policy bond delivery", body: "Hardcopy policy bond received at home with IRDAI grievance cell contact details.", journey: "Policy issuance", verify: "policy", status: "published", created: 1727950000000, author: "ashok.n", helpful: 4, history: [] },
  { id: "rev-a10", insurer: "ageas-federal-life", overall: 80, title: "Smooth surrender calculation", body: "Surrender value quotation generated with transparent formula citing policy page 11.", journey: "Surrender or exit", verify: "policy", status: "published", created: 1727850000000, author: "priya.k", helpful: 5, history: [] },

  // LIC reviews (10)
  { id: "rev-l1", insurer: "lic", overall: 80, title: "Nominee endorsement was quick", body: "Branch visited once for nominee update after marriage. Done across counter without any delay or bribe.", journey: "Service request", verify: "policy", status: "published", created: 1728730000000, author: "ananya.s", helpful: 16, history: [] },
  { id: "rev-l2", insurer: "lic", overall: 80, title: "Unquestioned sovereign guarantee", body: "Maturity proceeds credited to SBI savings account on the exact maturity date.", journey: "Claim", verify: "policy", status: "published", created: 1728620000000, author: "sunil.v", helpful: 12, history: [] },
  { id: "rev-l3", insurer: "lic", overall: 80, title: "Tech Term online buy was fine", body: "Bought online without agent. Premium is very low and verification was completed on video.", journey: "Buying", verify: "policy", status: "published", created: 1728520000000, author: "harish.m", helpful: 9, history: [] },
  { id: "rev-l4", insurer: "lic", overall: 100, title: "Claim settlement without dispute", body: "Death claim for maternal grandfather cleared in 14 days with standard municipal death cert.", journey: "Claim", verify: "policy", status: "published", created: 1728420000000, author: "vinay.t", helpful: 15, history: [] },
  { id: "rev-l5", insurer: "lic", overall: 60, title: "Portal is dated but works", body: "LIC customer portal UI looks 10 years old, but premium receipt downloads work every time.", journey: "Paying premiums", verify: "id", status: "published", created: 1728320000000, author: "alok.g", helpful: 6, history: [] },
  { id: "rev-l6", insurer: "lic", overall: 80, title: "Trust of decades", body: "Held 3 policies over 20 years, all bonuses declared annually credited properly.", journey: "Paying premiums", verify: "policy", status: "published", created: 1728220000000, author: "ramesh.k", helpful: 8, history: [] },
  { id: "rev-l7", insurer: "lic", overall: 80, title: "Revival camp discount", body: "Revived lapsed policy during festival waiver period without penalty interest.", journey: "Service request", verify: "policy", status: "published", created: 1728120000000, author: "geeta.p", helpful: 4, history: [] },
  { id: "rev-l8", insurer: "lic", overall: 80, title: "Good branch staff support", body: "Branch staff helped fill the discharge voucher and NEFT mandate patiently.", journey: "Claim", verify: "policy", status: "published", created: 1728020000000, author: "manoj.d", helpful: 5, history: [] },
  { id: "rev-l9", insurer: "lic", overall: 80, title: "Reliable death benefit claim", body: "No dispute raised on 7-year old policy under Section 45 rules.", journey: "Claim", verify: "policy", status: "published", created: 1727920000000, author: "bhavna.m", helpful: 7, history: [] },
  { id: "rev-l10", insurer: "lic", overall: 80, title: "Direct bank auto-debit works", body: "Standing instruction on bank account deducts premium on due date without bounce.", journey: "Paying premiums", verify: "phone", status: "published", created: 1727820000000, author: "kishore.r", helpful: 3, history: [] },

  // Tata AIA Life reviews (10)
  { id: "rev-t1", insurer: "tata-aia-life", overall: 80, title: "Honest sales process", body: "Zero medical checkup hassle at my age group, rider inclusions were explained clearly by compliance team.", journey: "Buying", verify: "policy", status: "published", created: 1728720000000, author: "karthik.r", helpful: 10, history: [] },
  { id: "rev-t2", insurer: "tata-aia-life", overall: 80, title: "Clean app experience", body: "Tata AIA mobile app is modern and clean. Biometric login makes tracking easy.", journey: "Paying premiums", verify: "policy", status: "published", created: 1728610000000, author: "sarah.j", helpful: 6, history: [] },
  { id: "rev-t3", insurer: "tata-aia-life", overall: 80, title: "Express claim promise kept", body: "Beneficiary received notification on day 2 and payment on day 3.", journey: "Claim", verify: "policy", status: "published", created: 1728510000000, author: "arvind.p", helpful: 11, history: [] },
  { id: "rev-t4", insurer: "tata-aia-life", overall: 80, title: "Accurate policy document", body: "All terms agreed in telephonic call recording matched the written contract.", journey: "Policy issuance", verify: "policy", status: "published", created: 1728410000000, author: "neha.c", helpful: 5, history: [] },
  { id: "rev-t5", insurer: "tata-aia-life", overall: 60, title: "Good plan, follow-up calls exist", body: "Good cover and fast claim ratio, but relationship manager calls once a quarter for top-ups.", journey: "Paying premiums", verify: "id", status: "published", created: 1728310000000, author: "prateek.s", helpful: 4, history: [] },
  { id: "rev-t6", insurer: "tata-aia-life", overall: 80, title: "Quick e-KYC approval", body: "PAN and Aadhaar OTP verification done in 5 minutes.", journey: "Buying", verify: "policy", status: "published", created: 1728210000000, author: "simran.k", helpful: 3, history: [] },
  { id: "rev-t7", insurer: "tata-aia-life", overall: 80, title: "High CSR delivers peace of mind", body: "Claim settlement ratio of 99%+ gives genuine confidence for family protection.", journey: "Buying", verify: "policy", status: "published", created: 1728110000000, author: "gopal.v", helpful: 7, history: [] },
  { id: "rev-t8", insurer: "tata-aia-life", overall: 80, title: "Clean policy renewal receipts", body: "Tax 80C receipt received by email within 2 minutes of UPI payment.", journey: "Paying premiums", verify: "policy", status: "published", created: 1728010000000, author: "madhav.t", helpful: 2, history: [] },
  { id: "rev-t9", insurer: "tata-aia-life", overall: 80, title: "Nominee confirmation via SMS", body: "Nominee received automated message confirming their registration.", journey: "Policy issuance", verify: "phone", status: "published", created: 1727910000000, author: "leela.d", helpful: 4, history: [] },
  { id: "rev-t10", insurer: "tata-aia-life", overall: 80, title: "Fast claim settlement", body: "Death claim under Term plan settled without delay.", journey: "Claim", verify: "policy", status: "published", created: 1727810000000, author: "bhaskar.n", helpful: 8, history: [] },

  // SBI Life reviews (10)
  { id: "rev-s1", insurer: "sbi-life", overall: 80, title: "Reliable cover backed by SBI", body: "Good cover and transparent pricing. Branch staff at local SBI verified the documents with zero fuss.", journey: "Buying", verify: "policy", status: "published", created: 1728710000000, author: "priya.d", helpful: 9, history: [] },
  { id: "rev-s2", insurer: "sbi-life", overall: 80, title: "Online term policy is value for money", body: "eShield plan premium is economical compared to competitors with similar CSR.", journey: "Buying", verify: "policy", status: "published", created: 1728630000000, author: "dinesh.b", helpful: 7, history: [] },
  { id: "rev-s3", insurer: "sbi-life", overall: 80, title: "Quick maturity settlement", body: "Endowment plan matured last month, funds credited directly into SBI account.", journey: "Claim", verify: "policy", status: "published", created: 1728530000000, author: "vijaya.l", helpful: 8, history: [] },
  { id: "rev-s4", insurer: "sbi-life", overall: 60, title: "Mobile app is a bit slow", body: "Cover is genuine and claim ratio is high, but the Smart Care mobile app occasionally hangs.", journey: "Paying premiums", verify: "id", status: "published", created: 1728430000000, author: "tanmay.k", helpful: 5, history: [] },
  { id: "rev-s5", insurer: "sbi-life", overall: 80, title: "Prompt renewal notice", body: "Notice sent by post and SMS well before grace period.", journey: "Paying premiums", verify: "policy", status: "published", created: 1728330000000, author: "shobha.r", helpful: 3, history: [] },
  { id: "rev-s6", insurer: "sbi-life", overall: 80, title: "Clean term issuance", body: "Medical checkup was arranged at reputed SRL lab at zero cost.", journey: "Policy issuance", verify: "policy", status: "published", created: 1728230000000, author: "chetan.m", helpful: 6, history: [] },
  { id: "rev-s7", insurer: "sbi-life", overall: 80, title: "Solid claim settlement record", body: "Claim processing for relative settled within 10 days of submitting hospital summaries.", journey: "Claim", verify: "policy", status: "published", created: 1728130000000, author: "raghav.s", helpful: 10, history: [] },
  { id: "rev-s8", insurer: "sbi-life", overall: 80, title: "Easy auto-debit integration", body: "Integrated directly with SBI YONO app for auto renewal.", journey: "Paying premiums", verify: "phone", status: "published", created: 1728030000000, author: "urvashi.p", helpful: 4, history: [] },
  { id: "rev-s9", insurer: "sbi-life", overall: 80, title: "Helpful regional customer desk", body: "Customer care helped change postal address within 48 hours.", journey: "Service request", verify: "policy", status: "published", created: 1727930000000, author: "farhan.a", helpful: 3, history: [] },
  { id: "rev-s10", insurer: "sbi-life", overall: 80, title: "Genuine term cover", body: "Transparent terms without hidden fees or forced rider attachments.", journey: "Buying", verify: "policy", status: "published", created: 1727830000000, author: "abhishek.t", helpful: 6, history: [] },
];

export function getBlankStore(): AppStore {
  return {
    user: null,
    reviews: INITIAL_REVIEWS,
    complaints: INITIAL_COMPLAINTS,
    questions: [],
    answers: {},
    posts: [],
    follows: [],
    saved: [],
    helpful: {},
    messages: [],
    claims: [],
    alerts: [],
    feedback: {},
  };
}

export function loadStore(): AppStore {
  if (typeof window === "undefined") return getBlankStore();
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return Object.assign(getBlankStore(), JSON.parse(raw));
  } catch (e) {}
  return getBlankStore();
}

export function saveStore(s: AppStore) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(s));
  } catch (e) {}
}

export const K_PRIOR = 20;
export const SHOW_AT = 10;

export function weight(r: Review) {
  const A = r.auth == null ? 1 : r.auth;
  const V = (VERIFY[r.verify] || VERIFY.email).v;
  const months = (Date.now() - r.created) / (30.44 * 864e5);
  const R = Math.pow(0.5, months / 18);
  const C = r.gap ? 0.6 : 1;
  return A * V * R * C;
}

export function getLiveReviews(s: AppStore, f: (r: Review) => boolean) {
  return s.reviews.filter((r) => r.status === "published" && (r.auth == null || r.auth >= 0.3) && f(r));
}

export function categoryMean(s: AppStore, type: string) {
  const rs = getLiveReviews(s, (r) => !!r.plan && !!PLAN[r.insurer + "/" + r.plan] && PLAN[r.insurer + "/" + r.plan].type === type);
  if (!rs.length) return 60;
  return rs.reduce((a, r) => a + r.overall, 0) / rs.length;
}

export function scoreOf(rs: Review[], m: number) {
  let sw = 0,
    swr = 0;
  rs.forEach((r) => {
    const w = weight(r);
    sw += w;
    swr += w * r.overall;
  });
  return (K_PRIOR * m + swr) / (K_PRIOR + sw);
}

export function aspectScores(rs: Review[]) {
  return ASPECTS.map(([k, name]) => {
    const with_ = rs.filter((r) => r.aspects && r.aspects[k]);
    if (with_.length < SHOW_AT) return { k, name, n: with_.length, v: null };
    const v = with_.reduce((a, r) => a + (r.aspects![k] - 1) * 25, 0) / with_.length;
    return { k, name, n: with_.length, v: Math.round(v) };
  });
}

export function stats(s: AppStore, kind: "plan" | "insurer", key: string) {
  const rs = kind === "plan" ? getLiveReviews(s, (r) => r.insurer + "/" + r.plan === key) : getLiveReviews(s, (r) => r.insurer === key);
  const n = rs.length;
  let m = 60;
  if (kind === "plan") m = categoryMean(s, PLAN[key] ? PLAN[key].type : "");
  const score = n >= SHOW_AT ? Math.round(scoreOf(rs, m)) : null;
  const angry = rs.filter((r) => r.overall === 0).length;
  const verified = rs.filter((r) => r.verify === "policy" || r.verify === "id").length;
  const comps = s.complaints.filter((c) => (kind === "plan" ? c.insurer + "/" + c.plan === key : c.insurer === key));
  const resolved = comps.filter((c) => c.status === "Resolved").length;
  const replied = comps.filter((c) => !!c.firstReply);
  const med = replied.length
    ? Math.round(replied.map((c) => (c.firstReply! - c.created) / 36e5).sort((a, b) => a - b)[Math.floor(replied.length / 2)])
    : null;
  const turned = s.reviews.filter((r) => (kind === "plan" ? r.insurer + "/" + r.plan === key : r.insurer === key) && r.history && r.history.some((h) => h.ev === "Rating raised")).length;
  return {
    n,
    score,
    angry,
    alert: n >= SHOW_AT && angry / n >= 0.1,
    verified,
    comps: comps.length,
    resolved,
    med,
    turned,
    aspects: aspectScores(rs),
    pending: s.reviews.filter((r) => r.status === "waiting-match" && r.insurer === key).length,
  };
}

export function band(s: number | null) {
  if (s == null) return { c: "", label: "Not scored yet" };
  if (s >= 85) return { c: "b1", label: "Very high trust" };
  if (s >= 70) return { c: "b2", label: "High trust" };
  if (s >= 55) return { c: "b3", label: "Moderate trust" };
  if (s >= 40) return { c: "b4", label: "Low trust" };
  return { c: "b5", label: "Very low trust" };
}

export function stopIndex(v: number) {
  return Math.round(v / 20);
}

export const insName = (s: string) => (INS[s] ? INS[s].name : s);
export const planOf = (r: Review) => (r.plan ? PLAN[r.insurer + "/" + r.plan] : null);
export const planUrl = (p: Plan) => `/industry/insurance/${p.insurer}/${p.slug}`;
export const insUrl = (s: string) => `/industry/insurance/${s}`;
export const fmtDate = (ts: number) => new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
export const plural = (n: number, a: string, b?: string) => n + " " + (n === 1 ? a : b || a + "s");
export const esc = (s: any) =>
  String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] || c));
export const uid = () => Math.random().toString(36).slice(2, 9);
