export const BANKID_STATUS = {
  PROCESS_STARTED: 'PROCESS_STARTED',
  PASSPHRASE_CONFIRM: 'PASSPHRASE_CONFIRM',
  PASSPHRASE_CONFIRM_SUCCESS: 'PASSPHRASE_CONFIRM_SUCCESS',
  PASSPHRASE_CONFIRM_FAIL: 'PASSPHRASE_CONFIRM_FAIL',
  CRAWLER_ERROR: 'CRAWLER_ERROR',
  ERROR_3: 'ERROR_3',
  CRAWLER_RESULT: 'CRAWLER_RESULT',
  LOANS_PERSISTED: 'LOANS_PERSISTED',
  USER_PERSISTED: 'USER_PERSISTED',
  NOT_VALID_DATA_PROVIDED: 'NOT_VALID_DATA_PROVIDED',
  NOT_BANK_CUSTOMER: 'NOT_BANK_CUSTOMER',
  CONFIRMATION_REQUIRED: 'CONFIRMATION_REQUIRED',
  CONFIRMATION_REQUIRED_DNB_RENEW_BANK_ID:
    'CONFIRMATION_REQUIRED_DNB_RENEW_BANK_ID',
  CONFIRMATION_REQUIRED_DNB_PORTAL_AGREEMENT:
    'CONFIRMATION_REQUIRED_DNB_PORTAL_AGREEMENT',
  BANKID_NO_ACCESS_FOR_SIGNIN: 'BANKID_NO_ACCESS_FOR_SIGNIN',
  EIKA_CHOOSE_ACCOUNT_TO_PROCESS: 'EIKA_CHOOSE_ACCOUNT_TO_PROCESS',
  EIKA_CHOOSE_ACCOUNT_TO_PROCESS_RESPONSE:
    'EIKA_CHOOSE_ACCOUNT_TO_PROCESS_RESPONSE',
  DIALOG_NO_RESPONSE_FROM_USER: 'DIALOG_NO_RESPONSE_FROM_USER',
  BANK_WEBSITE_DOESNT_WORK: 'BANK_WEBSITE_DOESNT_WORK',
  BID_C167: 'BID_C167',
  BID_C325: 'BID_C325',
  BANKID_UNSTABLE: 'BANKID_UNSTABLE',
  NO_LOANS: 'NO_LOANS',
  BANK_ID_CONFIRM: 'BANK_ID_CONFIRM',
  NOT_VALID_DATA_PROVIDED_V2: 'NOT_VALID_DATA_PROVIDED_V2',
  APP_CONFIRM: 'APP_CONFIRM',
  APP_CONFIRM_FAIL: 'APP_CONFIRM_FAIL',
  APP_CONFIRM_SUCCESS: 'APP_CONFIRM_SUCCESS'
};

export const IDENTIFICATION_TIMEOUT_TIME = 15;

export const BANKID_TIMEOUT_TIME = 90;

export const RECONNECTION_TIME = 3000;

export const RECONNECTION_TRIES = 10;

export const PING_TIME = 15000;

export const MESSAGE_STATUS = {
  SUCCESS: 'success',
  LOADING: 'loading',
  INFO: 'info',
  ERROR: 'error'
};
