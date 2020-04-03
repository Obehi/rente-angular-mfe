export interface Offers {
  aggregatedRateType: string;
  aggregatedLoanType: string;
  bank: string;
  bestOfferEffectiveRate: number | null;
  bestOfferTotalSaving: number | null;
  bestSavingsFirstYear: number | null;
  bestTotalSavings: number | null;
  offerSavingsType: string;
  memberships: string[];
  offers: OfferInfo[];
  propertyValue: number | null;
  totalEffectiveRate: number | null;
  totalOutstandingDebt: number | null;
  resultType: string;
  bestPercentileEffectiveRateYourBank: number;
  bestPercentileEffectiveRateAllBanks: number;
  medianEffectiveRateYourBank: number;
  medianEffectiveRateAllBanks: number;
  tips: string;
  commonDebt: number;
  ltv: number;
}

export interface OfferInfo {
  bank: string;
  bankName: string;
  bankUrl: string;
  depotFee: number;
  effectiveRate: number;
  establishmentFee: number;
  nominalRate: number;
  monthlyFee: number;
  id: number;
  marketArea: string;
  maxInstallmentFreePeriod: number;
  maxLTV: number;
  maxLoanPeriod: number;
  otherConditions: string;
  productName: string;
  requiredMembership: string;
  requiredProductPackage: string;
  savingsFirstYear: number;
  selectedRate: number;
  totalSavings: number;
  haveSpecialDealWithBank: Boolean
  //REMOVE BEFORE PRODUCTION
  effectiveInterest: number | null;
  loanAmount: number | null;
  years: number | null;
  cost: number | null;
  total: number | null;
}

export const OFFERS_RESULT_TYPE = {
  NO_OFFERS: "NO_OFFERS",
  OFFERS_PRESENT: "OFFERS_PRESENT",
  OFFERS_PRESENT_LOAN_INCOMPLETE_INFO: "OFFERS_PRESENT_LOAN_INCOMPLETE_INFO",
  LTV_TOO_HIGH_85: "LTV_TOO_HIGH_85",
  LTV_CREDIT_LINE_TOO_HIGH_60: "LTV_CREDIT_LINE_TOO_HIGH_60"
};
