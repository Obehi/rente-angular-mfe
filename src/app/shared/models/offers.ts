export interface Offers {
  aggregatedRateType: string;
  aggregatedLoanType: string;
  creditLinesOnlyLtvTooHigh: boolean | null;
  bank: string;
  bestOfferEffectiveRate: number | null;
  bestOfferTotalSaving: number | null;
  bestSavingsFirstYear: number | null;
  bestTotalSavings: number | null;
  offerSavingsType: string;
  membership: string | null;
  offers: OfferInfo[];
  offersPresent: boolean | null;
  propertyValue: number | null;
  totalEffectiveRate: number | null;
  totalOutstandingDebt: number | null;
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
}
