export interface LoanTypeOption {
  name: string;
  value?: string;
}

export const eikaBanks: LoanTypeOption[] = [
  {
    name: 'Nedbetalingslån',
    value: 'DOWNPAYMENT_REGULAR_LOAN'
  },
  {
    name: 'Rammelån/Boligkreditt',
    value: 'CREDIT_LINE'
  }
];
