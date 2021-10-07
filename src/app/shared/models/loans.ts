export interface Loans {
  aggregatedTotalInterestAndFee: number;
  aggregatedTotalInterestAndFeeByRemainingYears: number;
  averageRemainingYears: number;
  isFixedPriceBank: boolean;
  loans: LoanInfo[];
  origin: number;
  totalEffectiveRate: number;
  totalOutstandingDebt: number;
}

export interface LoanInfo {
  bank: string;
  bankKey: string;
  effectiveRate: number;
  id: number;
  fee: number | null;
  isDeleted?: boolean;
  isIncompleteInfoLoan: boolean;
  loanName: string;
  loanType: string;
  nominalRate: number | null;
  outstandingDebt: number | null;
  remainingYears: number | null;
  totalInterestAndTotalFee: number;
  totalInterestAndTotalFeeByRemainingYears: number;
}

export class EmailDto {
  checkRateReminderType: null | string;
  receiveNewsEmails: boolean;
}

export class MembershipTypeDto {
  name: string;
  label: string;
}

export class LoanStateDto {
  isAddressNeeded: boolean;
  isAggregatedRateTypeFixed: boolean;
  loansPresent: boolean;
  lowerRateAvailable: boolean;
}

export class AddressDto {
  id: number;
  apartmentSize: number;
  street: string;
  zip: string | null = null;
  manualPropertyValue?: number | null = null;
  propertyType: string | null = null;
  estimatedPropertyValue?: number | null = null;
  useManualPropertyValue: boolean;
  commonDebt: number | null = null;
  message: string;
  error: boolean;
}

export class ClientAddressDto {
  addresses: AddressDto[];
  totalPropertyValue: number;
}

export class ConfirmationGetDto {
  address: AddressCreationDto;
  availableMemberships: MembershipTypeDto[];
  bank: string;
  email: string;
  income: number | null;
  name: string | null;
}

export class ConfirmationSetDto {
  address: AddressCreationDto;
  email: string;
  income: number;
  memberships: string[];
}

export class AddressCreationDto {
  apartmentSize: number | null;
  apartmentValue: number | null;
  propertyType: string | null;
  street: string | null;
  zip: string | null;
}

export class PreferencesDto {
  availableMemberships: MembershipTypeDto[];
  checkRateReminderType: string;
  coBorrowerBelow34: boolean;
  communicationChannelType: string;
  email: string;
  fetchCreditLinesOnly: boolean;
  income: number;
  interestedInEnvironmentMortgages: boolean;
  interestedInFixRate: boolean;
  memberships: string[];
  name: string;
  noAdditionalProductsRequired: boolean;
  receiveNewsEmails: boolean;
}

export class PreferencesUpdateDto {
  memberships: string[];
  checkRateReminderType: string;
  fetchCreditLinesOnly: boolean;
  noAdditionalProductsRequired: boolean;
  interestedInEnvironmentMortgages: boolean;
  email: string;
  income: string;
  receiveNewsEmails: boolean;
}
export class LoanUpdateInfoDto {
  loanSubType: string;
  outstandingDebt: number;
  productId: string;
  remainingYears: number;
}

export class ClientUpdateInfo {
  address: AddressCreationDto;
  email: string;
  income: number;
  memberships: string[];
}

export interface AddressStatisticsDto {
  indexHistory: any;
  statistics: any;
}

export interface LoanStatisticsDto {
  combinedSavingsPotential: number;
  totalOutstandingDebt: number;
}

export class SignicatLoanInfoDto {
  fee?: number;
  id: number;
  loanSubType?: string;
  loanType: string;
  nominalInterestRate?: number;
  productId?: string;
  remainingYears: number;
  outstandingDebt: number;
}

export interface bankOfferDto {
  name: string;
  id: string;
  rate: number;
}

export type SignicatLoanInfoDtoArray = Array<SignicatLoanInfoDto>;
