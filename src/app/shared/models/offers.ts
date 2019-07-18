export interface Offers {
  bank: string;
  bestOfferEffectiveRate: number | null;
  bestOfferTotalSaving: number | null;
  bestSavingsFirstYear: number | null;
  bestTotalSavings: number | null;
  currentLoanState: string;
  membership: string | null;
  offers: OfferInfo[];
  propertyValue: number | null;
  totalEffectiveRate: number | null;
  totalOutstandingDebt: number | null;
}

export interface OfferInfo {
  bank: string;
  depotFee: number;
  effectiveRate: number;
  establishmentFee: number;
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
