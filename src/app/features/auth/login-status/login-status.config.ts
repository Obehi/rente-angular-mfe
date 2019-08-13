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
  },
  SPAREBANK_1_BV: {
    label: 'SPAREBANK',
    bankIcon: '../../../../assets/img/banks-logo/square/sparebank1.png'
  },
  SPAREBANK_1_GUDBRANDSDAL: {
    label: 'SPAREBANK',
    bankIcon: '../../../../assets/img/banks-logo/square/sparebank1.png'
  },
  SPAREBANK_1_HALLINGDAL_VALDRES: {
    label: 'SPAREBANK',
    bankIcon: '../../../../assets/img/banks-logo/square/sparebank1.png'
  },
  SPAREBANK_1_LOM_OG_SKJAK: {
    label: 'SPAREBANK',
    bankIcon: '../../../../assets/img/banks-logo/square/sparebank1.png'
  },
  SPAREBANK_1_MODUM: {
    label: 'SPAREBANK',
    bankIcon: '../../../../assets/img/banks-logo/square/sparebank1.png'
  },
  SPAREBANK_1_NORD_NORGE: {
    label: 'SPAREBANK',
    bankIcon: '../../../../assets/img/banks-logo/square/sparebank1.png'
  },
  SPAREBANK_1_NORDVEST: {
    label: 'SPAREBANK',
    bankIcon: '../../../../assets/img/banks-logo/square/sparebank1.png'
  },
  SPAREBANK_1_RINGERIKE_HADELAND: {
    label: 'SPAREBANK',
    bankIcon: '../../../../assets/img/banks-logo/square/sparebank1.png'
  },
  SPAREBANK_1_SMN: {
    label: 'SPAREBANK',
    bankIcon: '../../../../assets/img/banks-logo/square/sparebank1.png'
  },
  SPAREBANK_1_SORE_SUNNMORE: {
    label: 'SPAREBANK',
    bankIcon: '../../../../assets/img/banks-logo/square/sparebank1.png'
  },
  SPAREBANK_1_SR_BANK: {
    label: 'SPAREBANK',
    bankIcon: '../../../../assets/img/banks-logo/square/sparebank1.png'
  },
  SPAREBANK_1_TELEMARK: {
    label: 'SPAREBANK',
    bankIcon: '../../../../assets/img/banks-logo/square/sparebank1.png'
  },
  SPAREBANK_1_OSTFOLD_AKERSHUS: {
    label: 'SPAREBANK',
    bankIcon: '../../../../assets/img/banks-logo/square/sparebank1.png'
  },
  SPAREBANK_1_OSTLANDET: {
    label: 'SPAREBANK',
    bankIcon: '../../../../assets/img/banks-logo/square/sparebank1.png'
  },
};
