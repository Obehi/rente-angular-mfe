export interface Offers {
  aggregatedRateType: string;
  aggregatedLoanType: string;
  bank: string;
  bestOfferEffectiveRate: number | null;
  bestOfferTotalSaving: number | null;
  bestSavingsFirstYear: number | null;
  bestTotalSavings: number | null;
  offerSavingsType: string;
  membership: string | null;
  offers: OfferInfo[];
  propertyValue: number | null;
  totalEffectiveRate: number | null;
  totalOutstandingDebt: number | null;
  resultType: string;
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

export const OFFERS_RESULT_TYPE = {
  NO_OFFERS: 'NO_OFFERS',
  OFFERS_PRESENT: 'OFFERS_PRESENT',
  LTV_TOO_HIGH_85: 'LTV_TOO_HIGH_85',
  LTV_CREDIT_LINE_TOO_HIGH_60: 'LTV_CREDIT_LINE_TOO_HIGH_60'
};
