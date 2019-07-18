export interface Loans {
  aggregatedTotalInterest: number;
  aggregatedTotalInterestByRemainingYears: number;
  averageRemainingYears: number;
  loans: LoanInfo[];
  totalEffectiveRate: number;
  totalOutstandingDebt: number;
}

export interface LoanInfo {
  bank: string;
  effectiveRate: number;
  loanType: string;
  nominalRate: number;
  outstandingDebt: number;
  remainingYears: number;
  totalInterest: number;
  totalInterestByRemainingYears: number;
}
