export const BANKID_STATUS = {
  PROCESS_STARTED: 'PROCESS_STARTED',
  PASSPHRASE_CONFIRM: 'PASSPHRASE_CONFIRM',
  PASSPHRASE_CONFIRM_SUCCESS: 'PASSPHRASE_CONFIRM_SUCCESS',
  PASSPHRASE_CONFIRM_FAIL: 'PASSPHRASE_CONFIRM_FAIL',
  CRAWLER_ERROR: 'CRAWLER_ERROR',
  CRAWLER_RESULT: 'CRAWLER_RESULT',
  LOANS_PERSISTED: 'LOANS_PERSISTED',
  USER_PERSISTED: 'USER_PERSISTED'
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

export const BANK_MAP = {
  dnb: {
    label: 'DNB',
    bankIcon: '../../../assets/img/banks-logo/dnb.png',
    isSSN: true
  },
  nordea: {
    label: 'NORDEA',
    bankIcon: '../../../assets/img/banks-logo/nordea.png'
  }
};
