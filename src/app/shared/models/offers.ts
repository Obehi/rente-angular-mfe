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
  offers: AllOffers;
  propertyValue: number | null;
  totalEffectiveRate: number | null;  
  totalOutstandingDebt: number | null;
  resultType: string;
  ltvType: string;
  incompleteInfoLoanPresent: boolean;
  tips: string;
  commonDebt: number;
  ltv: number;
  bankStatistics: BankStatistics
  top5: OfferInfo[];
  additionalPartnersOffers: OfferInfo[];

}

export interface AllOffers {
  top5: OfferInfo[];
  additionalPartnersOffers: OfferInfo[];
}

export interface OfferInfo {
  bankInfo: BankInfo;
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
  otherConditions: string | null;
  productName: string;
  requiredMembership: string;
  requiredProductPackage: string;
  savingsFirstYear: number;
  selectedRate: number;
  totalSavings: number;
  haveSpecialDealWithBank: Boolean
  effectiveInterest: number | null;
  outstandingDebt: number | null;
  loanPeriodYears: number | null;
  cost: number | null;
  totalCost: number | null;
  top5;
}

export interface BankInfo{
  bank: string;
  name: string;
  url: string;
  transferUrl: string | null;
  partner: boolean,
  score: number,
  applicationTime: number
}

export interface BankStatistics {
  age: number;
  allBanksStatistics: BankStatisticItem
  clientBankStatistics: BankStatisticItem;
  ltv: number;
  totalOutstandingDebt: number;
}

export interface BankStatisticItem {
  bestPercentileEffectiveRate: number;
  medianEffectiveRate: number;
  segmentedData: boolean;
}

export const OFFERS_LTV_TYPE = {
  LTV_OK: "LTV_OK",
  LTV_TOO_HIGH_85: "LTV_TOO_HIGH_85",
  LTV_CREDIT_LINE_TOO_HIGH_60: "LTV_CREDIT_LINE_TOO_HIGH_60"
};