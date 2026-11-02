import { passports, visaDestinations, visaDocuments, visaServiceFee, type VisaKind, type VisaRule } from "@/data/visa";
import type { VisaQuery } from "./types";

export type VisaResult =
  | { status: "home-country"; country: string }
  | {
      status: "ok";
      passportCountry: string;
      destinationCountry: string;
      purpose: string;
      rule: VisaRule;
      documents: string[];
      serviceFee: number;
      totalFee: number;
    };

const STUDY_RULE: VisaRule = { kind: "Embassy visa", maxStayDays: 365, processingDays: [20, 45], governmentFee: 150 };

const extraDocuments: Partial<Record<string, string[]>> = {
  Business: ["Invitation letter from the host company"],
  "Family visit": ["Invitation letter and ID copy of your host"],
  Study: ["Offer letter from the institution", "Proof of tuition payment"],
};

export function checkVisa(query: VisaQuery): VisaResult | null {
  const passport = passports.find((p) => p.code === query.passport);
  const destination = visaDestinations.find((d) => d.code === query.destination);
  if (!passport || !destination) return null;

  if (passport.code === destination.code) {
    return { status: "home-country", country: destination.country };
  }

  // Visa-free and arrival entries cover tourism only; study always needs a student visa.
  const rule = query.purpose === "Study" ? STUDY_RULE : destination.rules[passport.tier];
  const kind: VisaKind = rule.kind;
  const serviceFee = visaServiceFee[kind];

  return {
    status: "ok",
    passportCountry: passport.country,
    destinationCountry: destination.country,
    purpose: query.purpose,
    rule,
    documents: [...visaDocuments[kind], ...(extraDocuments[query.purpose] ?? [])],
    serviceFee,
    totalFee: serviceFee + rule.governmentFee,
  };
}
