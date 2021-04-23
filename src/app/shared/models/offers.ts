export interface Offers {
  aggregatedRateType: string;
  aggregatedLoanType: string;
  bank: string;
  bestOfferEffectiveRate: number | null;
  bestOfferTotalSaving: number | null;
  bestSavingsFirstYear: number | null;
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
  bankStatistics: BankStatistics;
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
  haveSpecialDealWithBank: boolean;
  effectiveInterest: number | null;
  outstandingDebt: number | null;
  loanPeriodYears: number | null;
  cost: number | null;
  totalCost: number | null;
  loanType: string | null;
  fixedRatePeriod: number | null;
  bankRating: string | null;
}

export interface BankInfo {
  bank: string;
  name: string;
  url: string;
  transferUrl: string | undefined;
  partner: boolean;
  score: number;
  applicationTime: number;
  area: string | null;
  bankType: string;
  mobileAppRating: number | undefined;
}

export interface BankLocationAddress {
  address: string;
  name: string;
  openingHours: string;
  bankLocationServiceDomains: string[];
  relevant: boolean;
}

export interface BankGuideInfo {
  renteRating: string;
  applicationTime: number;
  score: number;
  mobileAppRating: number;
  bankType: string;
  url: string;
  area: string;
  bestNomOffer: number;
  text1: string;
  text2: string;
  text3: string;
  text4: string;
  creditLineLoans: string;
  constructionLoans: boolean;
  fixedRateLoans: boolean;
  intermediateFinancing: boolean;
  medianEffectiveRate: number;
  constructionLoansOffers: { name: string; rate: string }[];
  creditLineLoansOffers: { name: string; rate: string }[];
  fixedRateLoansOffers: { name: string; rate: string }[];
  intermediateFinancingOffers: { name: string; rate: string }[];
  regularOffers: { name: string; rate: string }[];
  addresses: { [key: string]: BankLocationAddress[] };
  depositOffers: { name: string; rate: string }[];
  membershipOffers: { [key: string]: any[] };
}

export interface BankStatistics {
  age: number;
  allBanksStatistics: BankStatisticItem;
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
  LTV_OK: 'LTV_OK',
  LTV_TOO_HIGH_85: 'LTV_TOO_HIGH_85',
  LTV_CREDIT_LINE_TOO_HIGH_60: 'LTV_CREDIT_LINE_TOO_HIGH_60'
};
