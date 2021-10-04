export interface LoanTypeOption {
  name: string;
  value?: string;
  subType?: string;
}

export const nonListLoanType: LoanTypeOption[] = [
  {
    name: 'Nedbetalingslån',
    value: 'DOWNPAYMENT_REGULAR_LOAN',
    subType: 'AMORTISING_LOAN'
  },
  {
    name: 'Rammelån/Boligkreditt',
    value: 'CREDIT_LINE',
    subType: 'SERIES_LOAN'
  }
];
