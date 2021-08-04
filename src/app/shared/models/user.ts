export interface UserScorePreferences {
  advisorScore?: number;
  changeProcessScore?: number;
  complicatedEconomyScore?: number;
  insuranceScore?: number;
  localPresenceScore?: number;
  priceSensitivity?: number;
  savingScore?: number;
  stockScore?: number;
  combinedStockEnsuranceProductsScore?: number;
}
export interface UserInfo {
  birthDate: number;
  country: string;
  email: string;
  id: number;
  income: number;
  name: string;
  phone: string;
  sessionId: number | null;
  ssn: string;
  unfinishedRegistration: boolean;
}

export interface DemoUserInfo {
  name: string;
  newClient: boolean;
  newLoan: boolean;
  roles: string[];
  token: string;
}

export interface FirstTimeLoanDebtData {
  country: string;
  income?: number;
  outstandingDebt: number | null;
}

export interface UserContactUsForm {
  name: string;
  email: string;
  phone: string;
  message: string;
  country?: string;
}
