export interface SectorItem {
  id: string;
  need: string;
  name: string;
  desc: string;
  status: number; // 1: opens first, 2: opens second, 3: opens third, 4: opens fourth, 0: planned
}

export type BrandTuple = [string, string, string]; // [name, sub/reg, slug]

export const TV_SECTORS: [string, string, string, string, number][] = [
  ["0", "Money & protection", "Insurance", "Term, health, motor, travel", 1],
  ["1", "Money & protection", "Banking & loans", "Savings accounts, credit cards, home and personal loans", 2],
  ["2", "Money & protection", "Investments", "Mutual funds, stocks, NPS, FDs", 0],
  ["3", "Health", "Healthcare", "Hospitals, diagnostics, health checkups", 0],
  ["4", "Health", "Pharma & pharmacy", "Medicines, online pharmacies", 0],
  ["5", "Connectivity", "Telecom", "Prepaid and postpaid plans, broadband", 3],
  ["6", "Connectivity", "Internet & OTT", "Streaming plans, data plans", 0],
  ["7", "Food", "Food & grocery", "Packaged food, quick commerce, restaurants", 0],
  ["8", "Food", "Agriculture", "Seeds, fertilizers, farm equipment", 0],
  ["9", "Housing", "Real estate", "Home projects, rentals", 0],
  ["10", "Housing", "Home & utilities", "Electricity, gas, water, solar", 0],
  ["11", "Mobility", "Automobiles", "Cars, two-wheelers, EVs", 4],
  ["12", "Mobility", "Travel & transport", "Airlines, trains, hotels", 0],
  ["13", "Education", "Education", "Schools, online courses, coaching", 0],
  ["14", "Everyday goods", "Consumer electronics", "Phones, laptops, appliances", 0],
  ["15", "Everyday goods", "Retail & e-commerce", "Fashion, personal care", 0],
  ["16", "Work & government", "Jobs & skilling", "Job portals, certifications", 0],
  ["17", "Work & government", "Government services", "Schemes, documents, taxes", 0]
];

export const TV_BRANDS: Record<string, BrandTuple[]> = {
  "0": [
    ["ACKO Life", "IRDAI reg. 164 · Bengaluru", "acko-life"],
    ["Aditya Birla Sun Life Insurance", "IRDAI reg. 109 · Mumbai", "aditya-birla-sun-life"],
    ["Ageas Federal Life", "IRDAI reg. 135 · Formerly IDBI Federal Life", "ageas-federal-life"],
    ["Aviva Life Insurance", "IRDAI reg. 122 · Gurugram", "aviva-life"],
    ["Axis Max Life", "IRDAI reg. 104 · Formerly Max Life", "axis-max-life"],
    ["Bajaj Life", "IRDAI reg. 116 · Formerly Bajaj Allianz Life", "bajaj-life"],
    ["Bandhan Life", "IRDAI reg. 138 · Formerly Aegon Life", "bandhan-life"],
    ["Bharti AXA Life", "IRDAI reg. 130 · Mumbai", "bharti-axa-life"],
    ["Canara HSBC Life", "IRDAI reg. 136 · Gurugram", "canara-hsbc-life"],
    ["CreditAccess Life", "IRDAI reg. 163 · Bengaluru", "creditaccess-life"],
    ["Digit Life", "IRDAI reg. 165 · Pune", "go-digit-life"],
    ["Edelweiss Life", "IRDAI reg. 147 · Formerly Edelweiss Tokio Life", "edelweiss-life"],
    ["Generali Central Life", "IRDAI reg. 133 · Formerly Future Generali India Life", "generali-central-life"],
    ["HDFC Life", "IRDAI reg. 101 · Mumbai", "hdfc-life"],
    ["ICICI Prudential Life", "IRDAI reg. 105 · Mumbai", "icici-prudential-life"],
    ["IndiaFirst Life", "IRDAI reg. 143 · Mumbai", "indiafirst-life"],
    ["IndusInd Nippon Life", "IRDAI reg. 121 · Formerly Reliance Nippon Life", "indusind-nippon-life"],
    ["Kotak Life", "IRDAI reg. 107 · Mumbai", "kotak-life"],
    ["LIC", "IRDAI reg. 512 · Mumbai", "lic"],
    ["PNB MetLife", "IRDAI reg. 117 · Bengaluru", "pnb-metlife"],
    ["Pramerica Life", "IRDAI reg. 140 · Gurugram", "pramerica-life"],
    ["Sahara Life", "IRDAI reg. 127 · Lucknow", "sahara-life"],
    ["SBI Life", "IRDAI reg. 111 · Mumbai", "sbi-life"],
    ["Shriram Life", "IRDAI reg. 128 · Hyderabad", "shriram-life"],
    ["SUD Life", "IRDAI reg. 142 · Navi Mumbai", "sud-life"],
    ["Tata AIA Life", "IRDAI reg. 110 · Mumbai", "tata-aia-life"]
  ],
  "1": [
    ["HDFC Bank", "Private bank", "hdfc-bank"],
    ["State Bank of India", "Public sector bank", "state-bank-of-india"],
    ["ICICI Bank", "Private bank", "icici-bank"],
    ["Axis Bank", "Private bank", "axis-bank"],
    ["Kotak Mahindra Bank", "Private bank", "kotak-mahindra-bank"],
    ["Punjab National Bank", "Public sector bank", "punjab-national-bank"],
    ["Bank of Baroda", "Public sector bank", "bank-of-baroda"],
    ["Canara Bank", "Public sector bank", "canara-bank"],
    ["IndusInd Bank", "Private bank", "indusind-bank"],
    ["IDFC FIRST Bank", "Private bank", "idfc-first-bank"],
    ["Yes Bank", "Private bank", "yes-bank"],
    ["Bajaj Finance", "NBFC lender", "bajaj-finance"]
  ],
  "2": [
    ["SBI Mutual Fund", "Fund house", "sbi-mutual-fund"],
    ["HDFC Mutual Fund", "Fund house", "hdfc-mutual-fund"],
    ["ICICI Prudential Mutual Fund", "Fund house", "icici-prudential-mutual-fund"],
    ["Nippon India Mutual Fund", "Fund house", "nippon-india-mutual-fund"],
    ["Axis Mutual Fund", "Fund house", "axis-mutual-fund"],
    ["Zerodha", "Broker", "zerodha"],
    ["Groww", "Investing app", "groww"],
    ["Upstox", "Broker", "upstox"],
    ["Angel One", "Broker", "angel-one"]
  ],
  "3": [
    ["Apollo Hospitals", "Hospital network", "apollo-hospitals"],
    ["Fortis Healthcare", "Hospital network", "fortis-healthcare"],
    ["Max Healthcare", "Hospital network", "max-healthcare"],
    ["Manipal Hospitals", "Hospital network", "manipal-hospitals"],
    ["Narayana Health", "Hospital network", "narayana-health"],
    ["Medanta", "Hospital", "medanta"],
    ["Dr Lal PathLabs", "Diagnostics", "dr-lal-pathlabs"],
    ["Metropolis Healthcare", "Diagnostics", "metropolis-healthcare"],
    ["Thyrocare", "Diagnostics", "thyrocare"]
  ],
  "4": [
    ["Tata 1mg", "Online pharmacy", "tata-1mg"],
    ["PharmEasy", "Online pharmacy", "pharmeasy"],
    ["Apollo Pharmacy", "Pharmacy chain", "apollo-pharmacy"],
    ["Netmeds", "Online pharmacy", "netmeds"],
    ["MedPlus", "Pharmacy chain", "medplus"],
    ["Cipla", "Medicines maker", "cipla"],
    ["Sun Pharma", "Medicines maker", "sun-pharma"],
    ["Dr. Reddy's", "Medicines maker", "dr-reddy-s"]
  ],
  "5": [
    ["Reliance Jio", "Mobile and broadband", "reliance-jio"],
    ["Bharti Airtel", "Mobile and broadband", "bharti-airtel"],
    ["Vodafone Idea (Vi)", "Mobile", "vodafone-idea-vi"],
    ["BSNL", "Mobile and broadband", "bsnl"],
    ["ACT Fibernet", "Broadband", "act-fibernet"],
    ["Tata Play Fiber", "Broadband", "tata-play-fiber"],
    ["Hathway", "Broadband", "hathway"]
  ],
  "6": [
    ["Netflix", "Streaming", "netflix"],
    ["Amazon Prime Video", "Streaming", "amazon-prime-video"],
    ["JioHotstar", "Streaming", "jiohotstar"],
    ["Sony LIV", "Streaming", "sony-liv"],
    ["ZEE5", "Streaming", "zee5"],
    ["Spotify", "Music streaming", "spotify"],
    ["YouTube Premium", "Subscription", "youtube-premium"]
  ],
  "7": [
    ["Zomato", "Food delivery", "zomato"],
    ["Swiggy", "Food delivery", "swiggy"],
    ["Blinkit", "Quick commerce", "blinkit"],
    ["Zepto", "Quick commerce", "zepto"],
    ["BigBasket", "Grocery", "bigbasket"],
    ["Amul", "Dairy", "amul"],
    ["Britannia", "Packaged food", "britannia"],
    ["Nestlé India", "Packaged food", "nestl-india"]
  ],
  "8": [
    ["Coromandel International", "Fertilisers", "coromandel-international"],
    ["UPL", "Crop protection", "upl"],
    ["Dhanuka Agritech", "Crop protection", "dhanuka-agritech"],
    ["Escorts Kubota", "Farm equipment", "escorts-kubota"],
    ["TAFE", "Tractors", "tafe"],
    ["John Deere India", "Farm equipment", "john-deere-india"],
    ["DeHaat", "Farm services", "dehaat"],
    ["BigHaat", "Agri e-commerce", "bighaat"]
  ],
  "9": [
    ["Godrej Properties", "Developer", "godrej-properties"],
    ["DLF", "Developer", "dlf"],
    ["Prestige Estates", "Developer", "prestige-estates"],
    ["Sobha", "Developer", "sobha"],
    ["Lodha", "Developer", "lodha"],
    ["Brigade Group", "Developer", "brigade-group"],
    ["Oberoi Realty", "Developer", "oberoi-realty"],
    ["MagicBricks", "Property portal", "magicbricks"],
    ["NoBroker", "Property portal", "nobroker"],
    ["99acres", "Property portal", "99acres"]
  ],
  "10": [
    ["Tata Power", "Electricity", "tata-power"],
    ["Adani Electricity", "Electricity", "adani-electricity"],
    ["BSES", "Electricity", "bses"],
    ["Mahanagar Gas", "Piped gas", "mahanagar-gas"],
    ["Indraprastha Gas", "Piped gas", "indraprastha-gas"],
    ["Indane", "LPG", "indane"],
    ["Bharat Gas", "LPG", "bharat-gas"],
    ["HP Gas", "LPG", "hp-gas"]
  ],
  "11": [
    ["Maruti Suzuki", "Cars", "maruti-suzuki"],
    ["Tata Motors", "Cars and EVs", "tata-motors"],
    ["Mahindra", "SUVs and EVs", "mahindra"],
    ["Hyundai", "Cars", "hyundai"],
    ["Kia", "Cars", "kia"],
    ["Toyota Kirloskar", "Cars", "toyota-kirloskar"],
    ["Honda Cars India", "Cars", "honda-cars-india"],
    ["MG Motor", "Cars and EVs", "mg-motor"],
    ["Hero MotoCorp", "Two-wheelers", "hero-motocorp"],
    ["Bajaj Auto", "Two-wheelers", "bajaj-auto"],
    ["TVS Motor", "Two-wheelers", "tvs-motor"],
    ["Royal Enfield", "Motorcycles", "royal-enfield"],
    ["Ather Energy", "Electric scooters", "ather-energy"],
    ["Ola Electric", "Electric scooters", "ola-electric"]
  ],
  "12": [
    ["IndiGo", "Airline", "indigo"],
    ["Air India", "Airline", "air-india"],
    ["Akasa Air", "Airline", "akasa-air"],
    ["SpiceJet", "Airline", "spicejet"],
    ["IRCTC", "Railway booking", "irctc"],
    ["MakeMyTrip", "Travel booking", "makemytrip"],
    ["Goibibo", "Travel booking", "goibibo"],
    ["OYO", "Hotels", "oyo"],
    ["Taj Hotels", "Hotels", "taj-hotels"],
    ["Uber", "Ride-hailing", "uber"],
    ["Rapido", "Ride-hailing", "rapido"]
  ],
  "13": [
    ["Physics Wallah", "Online courses", "physics-wallah"],
    ["Unacademy", "Online courses", "unacademy"],
    ["upGrad", "Online courses", "upgrad"],
    ["Coursera", "Online courses", "coursera"],
    ["Allen Career Institute", "Coaching", "allen-career-institute"],
    ["Vedantu", "Online tutoring", "vedantu"],
    ["Simplilearn", "Certifications", "simplilearn"],
    ["Great Learning", "Online courses", "great-learning"]
  ],
  "14": [
    ["Apple", "Phones and laptops", "apple"],
    ["Samsung", "Phones and appliances", "samsung"],
    ["OnePlus", "Phones", "oneplus"],
    ["Xiaomi", "Phones", "xiaomi"],
    ["Realme", "Phones", "realme"],
    ["Vivo", "Phones", "vivo"],
    ["OPPO", "Phones", "oppo"],
    ["Sony", "Electronics", "sony"],
    ["LG", "Appliances", "lg"],
    ["Dell", "Laptops", "dell"],
    ["HP", "Laptops", "hp"],
    ["Lenovo", "Laptops", "lenovo"],
    ["boAt", "Audio", "boat"],
    ["Whirlpool", "Appliances", "whirlpool"],
    ["Voltas", "Air conditioners", "voltas"]
  ],
  "15": [
    ["Amazon India", "Marketplace", "amazon-india"],
    ["Flipkart", "Marketplace", "flipkart"],
    ["Myntra", "Fashion", "myntra"],
    ["Nykaa", "Beauty and personal care", "nykaa"],
    ["Meesho", "Marketplace", "meesho"],
    ["Ajio", "Fashion", "ajio"],
    ["Tata CLiQ", "Marketplace", "tata-cliq"],
    ["Lenskart", "Eyewear", "lenskart"],
    ["FirstCry", "Baby and kids", "firstcry"]
  ],
  "16": [
    ["Naukri", "Job portal", "naukri"],
    ["LinkedIn", "Job network", "linkedin"],
    ["Indeed", "Job portal", "indeed"],
    ["foundit", "Job portal", "foundit"],
    ["Apna", "Job app", "apna"],
    ["Internshala", "Internships and training", "internshala"],
    ["Shine", "Job portal", "shine"]
  ],
  "17": [
    ["Aadhaar (UIDAI)", "Identity", "aadhaar-uidai"],
    ["Income Tax e-Filing", "Taxes", "income-tax-e-filing"],
    ["GST Portal", "Taxes", "gst-portal"],
    ["DigiLocker", "Documents", "digilocker"],
    ["UMANG", "Service app", "umang"],
    ["Passport Seva", "Passports", "passport-seva"],
    ["EPFO", "Provident fund", "epfo"]
  ]
};

export const RAW_PRODUCTS_STRING =
  "1|HDFC Bank|Regalia Credit Card|Credit card;1|State Bank of India|SBI Home Loan|Home loan;1|ICICI Bank|Amazon Pay Credit Card|Credit card;1|Axis Bank|Magnus Credit Card|Credit card;1|Kotak Mahindra Bank|811 Savings Account|Savings account;1|Bajaj Finance|Personal Loan|Personal loan;2|SBI Mutual Fund|SBI Bluechip Fund|Mutual fund;2|HDFC Mutual Fund|HDFC Flexi Cap Fund|Mutual fund;2|Zerodha|Kite|Trading app;2|Groww|Groww App|Investing app;3|Dr Lal PathLabs|Full Body Checkup|Health checkup;3|Thyrocare|Aarogyam Packages|Health checkup;3|Apollo Hospitals|Apollo Health Check|Health checkup;4|Tata 1mg|Online Pharmacy|Pharmacy app;4|PharmEasy|Online Pharmacy|Pharmacy app;5|Reliance Jio|JioFiber|Broadband;5|Reliance Jio|Jio Prepaid Plans|Mobile plan;5|Bharti Airtel|Airtel Xstream Fiber|Broadband;5|Bharti Airtel|Airtel Postpaid Plans|Mobile plan;5|Vodafone Idea (Vi)|Vi Postpaid Plans|Mobile plan;5|BSNL|BSNL Bharat Fibre|Broadband;6|Netflix|Netflix Subscription|Streaming plan;6|Amazon Prime Video|Prime Membership|Streaming plan;6|JioHotstar|JioHotstar Subscription|Streaming plan;6|Spotify|Spotify Premium|Music plan;7|Zomato|Zomato Gold|Membership;7|Swiggy|Swiggy One|Membership;7|Britannia|Good Day Biscuits|Packaged food;7|Amul|Amul Butter|Dairy;11|Maruti Suzuki|Swift|Hatchback;11|Tata Motors|Nexon|SUV;11|Mahindra|XUV700|SUV;11|Hyundai|Creta|SUV;11|Hero MotoCorp|Splendor|Motorcycle;11|Royal Enfield|Classic 350|Motorcycle;11|Ather Energy|450X|Electric scooter;11|Ola Electric|S1 Pro|Electric scooter;12|IndiGo|IndiGo Flights|Airline;12|IRCTC|Train Ticket Booking|Rail booking;12|MakeMyTrip|Hotel Booking|Travel booking;13|Physics Wallah|NEET Courses|Course;13|upGrad|Online MBA|Course;13|Coursera|Coursera Plus|Subscription;14|Apple|iPhone|Phone;14|Samsung|Galaxy S Series|Phone;14|OnePlus|Nord Series|Phone;14|Xiaomi|Redmi Note Series|Phone;14|boAt|Airdopes|Earbuds;14|LG|OLED TVs|Television;14|Voltas|Split ACs|Air conditioner;15|Amazon India|Prime Membership|Membership;15|Flipkart|Flipkart Plus|Membership;16|Naukri|Naukri Resume Services|Job service;16|LinkedIn|LinkedIn Premium|Subscription;17|DigiLocker|DigiLocker App|Document service";

export const SUBJECTS_CONFIG: Record<string, { name: string; feats: string[]; rungs: string[] }> = {
  policy: {
    name: "A life or health insurance policy",
    feats: ["Delivered as promised", "Premium worth it", "Buying and issuance", "Honest about charges", "Service and claims"],
    rungs: ["This policy", "Its insurer", "Insurance category", "Insurance Trust Index"]
  },
  loan: {
    name: "A loan, account or card from a bank",
    feats: ["Honest about rates and charges", "Approval and disbursal speed", "Fair treatment on changes", "Ease of closing or switching", "Customer service"],
    rungs: ["This product", "Its bank", "Banking category", "Banking Trust Index"]
  },
  tel: {
    name: "A mobile or broadband plan",
    feats: ["Network and speed as promised", "Worth the price", "Honest about plan terms", "Easy to change or cancel", "Support and billing"],
    rungs: ["This plan", "Its operator", "Telecom category", "Telecom Trust Index"]
  },
  car: {
    name: "A car or two-wheeler",
    feats: ["Mileage or range as promised", "Build quality", "Warranty fairness", "Workshop service", "Resale confidence"],
    rungs: ["This model", "Its maker", "Automobile category", "Automobile Trust Index"]
  },
  phone: {
    name: "A phone, laptop or appliance",
    feats: ["Does what it promised", "Worth the price", "Hardware life", "Honest marketing claims", "Support and repair"],
    rungs: ["This device", "Its maker", "Electronics category", "Electronics Trust Index"]
  },
  hospital: {
    name: "A hospital or diagnostics visit",
    feats: ["Billing transparency", "Admission and approval speed", "Honest advice", "Care and hygiene", "Follow-up and records"],
    rungs: ["This visit", "Its hospital or lab", "Healthcare category", "Healthcare Trust Index"]
  },
  edu: {
    name: "A course, school or coaching class",
    feats: ["Delivered as promised", "Worth the fees", "Honest about outcomes", "Teaching quality", "Refunds and support"],
    rungs: ["This course", "Its institute", "Education category", "Education Trust Index"]
  }
};
