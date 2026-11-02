/**
 * Simplified, illustrative visa rules for the demo. Passports are grouped into
 * tiers and each destination defines what each tier needs.
 */
export type PassportTier = "A" | "B" | "C";

export type VisaKind = "Visa-free" | "Visa on arrival" | "eVisa" | "Travel authorisation" | "Embassy visa";

export type VisaRule = {
  kind: VisaKind;
  maxStayDays: number;
  processingDays: [number, number];
  governmentFee: number;
};

export type Passport = { code: string; country: string; tier: PassportTier };

export const passports: Passport[] = [
  { code: "PK", country: "Pakistan", tier: "C" },
  { code: "IN", country: "India", tier: "C" },
  { code: "BD", country: "Bangladesh", tier: "C" },
  { code: "EG", country: "Egypt", tier: "C" },
  { code: "AE", country: "United Arab Emirates", tier: "B" },
  { code: "TR", country: "Türkiye", tier: "B" },
  { code: "MY", country: "Malaysia", tier: "B" },
  { code: "GB", country: "United Kingdom", tier: "A" },
  { code: "US", country: "United States", tier: "A" },
  { code: "CA", country: "Canada", tier: "A" },
  { code: "DE", country: "Germany", tier: "A" },
  { code: "AU", country: "Australia", tier: "A" },
];

export type VisaDestination = {
  code: string;
  country: string;
  rules: Record<PassportTier, VisaRule>;
};

const free = (days: number): VisaRule => ({
  kind: "Visa-free",
  maxStayDays: days,
  processingDays: [0, 0],
  governmentFee: 0,
});

const schengen: Record<PassportTier, VisaRule> = {
  A: free(90),
  B: { kind: "Embassy visa", maxStayDays: 90, processingDays: [10, 15], governmentFee: 95 },
  C: { kind: "Embassy visa", maxStayDays: 90, processingDays: [15, 30], governmentFee: 95 },
};

export const visaDestinations: VisaDestination[] = [
  {
    code: "AE",
    country: "United Arab Emirates",
    rules: {
      A: { kind: "Visa on arrival", maxStayDays: 30, processingDays: [0, 0], governmentFee: 0 },
      B: free(90),
      C: { kind: "eVisa", maxStayDays: 30, processingDays: [3, 5], governmentFee: 90 },
    },
  },
  {
    code: "GB",
    country: "United Kingdom",
    rules: {
      A: { kind: "Travel authorisation", maxStayDays: 180, processingDays: [1, 3], governmentFee: 20 },
      B: { kind: "Travel authorisation", maxStayDays: 180, processingDays: [1, 3], governmentFee: 20 },
      C: { kind: "Embassy visa", maxStayDays: 180, processingDays: [15, 21], governmentFee: 160 },
    },
  },
  { code: "FR", country: "France", rules: schengen },
  { code: "IT", country: "Italy", rules: schengen },
  { code: "PT", country: "Portugal", rules: schengen },
  { code: "GR", country: "Greece", rules: schengen },
  { code: "NL", country: "Netherlands", rules: schengen },
  {
    code: "TR",
    country: "Türkiye",
    rules: {
      A: free(90),
      B: free(90),
      C: { kind: "eVisa", maxStayDays: 30, processingDays: [1, 2], governmentFee: 60 },
    },
  },
  {
    code: "TH",
    country: "Thailand",
    rules: {
      A: free(60),
      B: free(60),
      C: { kind: "eVisa", maxStayDays: 60, processingDays: [5, 10], governmentFee: 40 },
    },
  },
  {
    code: "ID",
    country: "Indonesia",
    rules: {
      A: { kind: "Visa on arrival", maxStayDays: 30, processingDays: [0, 0], governmentFee: 35 },
      B: { kind: "Visa on arrival", maxStayDays: 30, processingDays: [0, 0], governmentFee: 35 },
      C: { kind: "eVisa", maxStayDays: 30, processingDays: [2, 5], governmentFee: 35 },
    },
  },
  {
    code: "MV",
    country: "Maldives",
    rules: {
      A: { kind: "Visa on arrival", maxStayDays: 30, processingDays: [0, 0], governmentFee: 0 },
      B: { kind: "Visa on arrival", maxStayDays: 30, processingDays: [0, 0], governmentFee: 0 },
      C: { kind: "Visa on arrival", maxStayDays: 30, processingDays: [0, 0], governmentFee: 0 },
    },
  },
  {
    code: "JP",
    country: "Japan",
    rules: {
      A: free(90),
      B: free(30),
      C: { kind: "Embassy visa", maxStayDays: 15, processingDays: [5, 8], governmentFee: 25 },
    },
  },
  {
    code: "SG",
    country: "Singapore",
    rules: {
      A: free(90),
      B: free(30),
      C: { kind: "eVisa", maxStayDays: 30, processingDays: [3, 5], governmentFee: 30 },
    },
  },
  {
    code: "US",
    country: "United States",
    rules: {
      A: { kind: "Travel authorisation", maxStayDays: 90, processingDays: [1, 3], governmentFee: 21 },
      B: { kind: "Embassy visa", maxStayDays: 180, processingDays: [30, 90], governmentFee: 185 },
      C: { kind: "Embassy visa", maxStayDays: 180, processingDays: [45, 120], governmentFee: 185 },
    },
  },
  {
    code: "CA",
    country: "Canada",
    rules: {
      A: { kind: "Travel authorisation", maxStayDays: 180, processingDays: [1, 3], governmentFee: 7 },
      B: { kind: "Embassy visa", maxStayDays: 180, processingDays: [20, 40], governmentFee: 75 },
      C: { kind: "Embassy visa", maxStayDays: 180, processingDays: [30, 60], governmentFee: 75 },
    },
  },
  {
    code: "AU",
    country: "Australia",
    rules: {
      A: { kind: "Travel authorisation", maxStayDays: 90, processingDays: [1, 2], governmentFee: 14 },
      B: { kind: "eVisa", maxStayDays: 90, processingDays: [10, 20], governmentFee: 130 },
      C: { kind: "eVisa", maxStayDays: 90, processingDays: [20, 35], governmentFee: 130 },
    },
  },
  {
    code: "ZA",
    country: "South Africa",
    rules: {
      A: free(90),
      B: free(30),
      C: { kind: "Embassy visa", maxStayDays: 90, processingDays: [10, 15], governmentFee: 45 },
    },
  },
];

export const visaPurposes = ["Tourism", "Business", "Family visit", "Study"] as const;

export const visaDocuments: Record<VisaKind, string[]> = {
  "Visa-free": ["Passport valid for 6 months beyond your stay", "Return or onward ticket", "Hotel booking or address"],
  "Visa on arrival": [
    "Passport valid for 6 months with two blank pages",
    "Return ticket",
    "Hotel confirmation",
    "Proof of funds (recent bank statement)",
  ],
  eVisa: [
    "Passport scan (bio-data page)",
    "Recent passport-size photo on white background",
    "Confirmed hotel booking",
    "Return flight reservation",
    "Bank statement for the last 3 months",
  ],
  "Travel authorisation": ["Passport valid for your whole stay", "Email address and payment card", "Travel dates"],
  "Embassy visa": [
    "Completed application form",
    "Two photos to embassy specification",
    "Bank statements for the last 6 months",
    "Employment letter or business registration",
    "Travel insurance covering the full trip",
    "Flight and hotel reservations",
    "Cover letter stating purpose of travel",
  ],
};

/** What Meridian charges on top of government fees. */
export const visaServiceFee: Record<VisaKind, number> = {
  "Visa-free": 0,
  "Visa on arrival": 15,
  eVisa: 35,
  "Travel authorisation": 20,
  "Embassy visa": 79,
};
