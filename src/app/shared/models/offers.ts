export interface Offers {
  additionalPartnersOffers: OfferInfo[];
  aggregatedRateType: string;
  aggregatedLoanType: string;
  bank: string;
  bankStatistics: BankStatistics;
  bestOfferEffectiveRate: number | null;
  bestOfferTotalSaving: number | null;
  bestSavingsFirstYear: number | null;
  commonDebt: number;
  incompleteInfoLoanPresent: boolean;
  ltv: number;
  ltvType: string;
  memberships: string[];
  nullInterest: boolean;
  offerSavingsType: string;
  offers: AllOffers;
  propertyValue: number | null;
  resultType: string;
  tips: string;
  totalEffectiveRate: number | null;
  totalOutstandingDebt: number | null;
}

export interface AllOffers {
  additionalPartnersOffers: OfferInfo[];
  top5: OfferInfo[];
  topScoreOffer: OfferInfo[];
}

export interface OfferInfo {
  bankInfo: BankInfo;
  bankRating: string | null;
  cost: number | null;
  depotFee: number;
  effectiveInterest: number | null;
  effectiveRate: number;
  establishmentFee: number;
  fixedRatePeriod: number | null;
  haveSpecialDealWithBank: boolean;
  id: number;
  loanPeriodYears: number | null;
  loanType: string | null;
  monthlyFee: number;
  marketArea: string;
  maxInstallmentFreePeriod: number;
  maxLTV: number;
  maxLoanPeriod: number;
  nominalRate: number;
  otherConditions: string | null;
  outstandingDebt: number | null;
  productName: string;
  requiredMembership: string;
  requiredProductPackage: string;
  savingsFirstYear: number;
  selectedRate: number;
  totalSavings: number;
  totalCost: number | null;
}

export interface BankInfo {
  applicationTime: number;
  area: string | null;
  bank: string;
  bankType: string;
  mobileAppRating: number | undefined;
  name: string;
  partner: boolean;
  score: number;
  transferUrl: string | undefined;
  url: string;
}

export interface BankLocationAddress {
  address: string;
  bankLocationServiceDomains: string[];
  name: string;
  openingHours: string;
  relevant: boolean;
}

export interface BankGuideInfo {
  addresses: { [key: string]: BankLocationAddress[] };
  applicationTime: number;
  area: string;
  bankType: string;
  bestNomOffer: number;
  constructionLoans: boolean;
  constructionLoansOffers: { name: string; rate: string }[];
  creditLineLoans: string;
  creditLineLoansOffers: { name: string; rate: string }[];
  depositOffers: { name: string; rate: string }[];
  fixedRateLoans: boolean;
  fixedRateLoansOffers: { name: string; rate: string }[];
  intermediateFinancing: boolean;
  intermediateFinancingOffers: { name: string; rate: string }[];
  medianEffectiveRate: number;
  membershipOffers: { [key: string]: any[] };
  mobileAppRating: number;
  regularOffers: { name: string; rate: string }[];
  renteRating: string;
  score: number;
  text1: string;
  text2: string;
  text3: string;
  text4: string;
  url: string;
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
