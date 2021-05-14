export interface Loans {
  aggregatedTotalInterestAndFee: number;
  aggregatedTotalInterestAndFeeByRemainingYears: number;
  averageRemainingYears: number;
  loans: LoanInfo[];
  totalEffectiveRate: number;
  totalOutstandingDebt: number;
}

export interface LoanInfo {
  bank: string;
  effectiveRate: number;
  loanName: string;
  nominalRate: number;
  outstandingDebt: number;
  remainingYears: number;
  totalInterestAndTotalFee: number;
  totalInterestAndTotalFeeByRemainingYears: number;
}

export class EmailDto {
  checkRateReminderType: null | string;
  receiveNewsEmails: false | true;
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
  apartmentSize: number;
  commonDebt: number | null = null;
  error: boolean;
  estimatedPropertyValue?: number | null = null;
  id: number;
  manualPropertyValue?: number | null = null;
  message: string;
  propertyType: string | null = null;
  street: string;
  useManualPropertyValue: boolean;
  zip: string | null = null;
}

export class ClientAddressDto {
  addresses: AddressDto[];
  totalPropertyValue: number;
}

export class ConfirmationGetDto {
  email: string;
  name: string | null;
  bank: string;
  income: number;
  memberships: string[];
  apartmentSize: number;
  apartmentValue: number;
  availableMemberships: MembershipTypeDto[];
}

export class ConfirmationSetDto {
  memberships: string[];
  apartmentSize: number;
  email: string;
  income: number;
  name: string;
  address: AddressCreationDto;
  apartmentValue: number;
}

export class AddressCreationDto {
  apartmentSize: number;
  apartmentValue: number;
  propertyType: string;
  street: string;
  zip: string;
}

export class PreferencesDto {
  availableMemberships: MembershipTypeDto[];
  checkRateReminderType: string;
  communicationChannelType: string;
  email: string;
  fetchCreditLinesOnly: boolean;
  income: number;
  interestedInEnvironmentMortgages: boolean;
  memberships: string[];
  name: string;
  noAdditionalProductsRequired: boolean;
  receiveNewsEmails: boolean;
}

export class PreferencesUpdateDto {
  checkRateReminderType: string;
  email: string;
  fetchCreditLinesOnly: boolean;
  income: string;
  interestedInEnvironmentMortgages: boolean;
  memberships: string[];
  noAdditionalProductsRequired: boolean;
  receiveNewsEmails: boolean;
}
export class LoanUpdateInfoDto {
  outstandingDebt: number;
  productId: string;
  remainingYears: number;
  loanSubType: string;
}

export class ClientUpdateInfo {
  address: AddressCreationDto;
  email: string;
  income: number;
  memberships: string[];
}
