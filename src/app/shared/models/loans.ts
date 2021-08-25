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
  bankKey: string;
  effectiveRate: number;
  loanName: string;
  nominalRate: number;
  outstandingDebt: number;
  remainingYears: number;
  totalInterestAndTotalFee: number;
  totalInterestAndTotalFeeByRemainingYears: number;
}

export class LoanUpdateInfoDto {
  outstandingDebt: number;
  productId: string;
  remainingYears: number;
  loanSubType: string;
}

export class SignicatLoanInfoDto {
  outstandingDebt: number;
  productId: string;
  remainingYears: number;
  id: number;
  loanSubType: string;
  loanType: string;
  fee?: number;
  nominalInterestRate?: number;
}

export type SignicatLoanInfoDtoArray = Array<SignicatLoanInfoDto>;
