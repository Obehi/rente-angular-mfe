export const BANKID_STATUS = {
  PROCESS_STARTED: 'PROCESS_STARTED',
  PASSPHRASE_CONFIRM: 'PASSPHRASE_CONFIRM',
  PASSPHRASE_CONFIRM_SUCCESS: 'PASSPHRASE_CONFIRM_SUCCESS',
  PASSPHRASE_CONFIRM_FAIL: 'PASSPHRASE_CONFIRM_FAIL',
  CRAWLER_ERROR: 'CRAWLER_ERROR',
  CRAWLER_RESULT: 'CRAWLER_RESULT',
  LOANS_PERSISTED: 'LOANS_PERSISTED',
  USER_PERSISTED: 'USER_PERSISTED',
  NOT_VALID_DATA_PROVIDED: 'NOT_VALID_DATA_PROVIDED',
  NOT_SB1_CUSTOMER: 'NOT_SB1_CUSTOMER',
  CONFIRMATION_REQUIRED: 'CONFIRMATION_REQUIRED',
  RENEW_BANK_ID: 'RENEW_BANK_ID'
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
    bankName: 'DNB',
    bankIcon: '../../../assets/img/banks-logo/dnb.png',
    isSSN: true
  },
  nordea: {
    label: 'NORDEA',
    bankName: 'NORDEA',
    bankIcon: '../../../assets/img/banks-logo/nordea.png'
  },
  sparebank_1_bv: {
    label: 'SPAREBANK',
    bankName: 'SPAREBANK_1_BV',
    bankIcon: '../../../../assets/img/banks-logo/square/sparebank1.png'
  },
  sparebank_1_gudbrandsdal: {
    label: 'SPAREBANK',
    bankName: 'SPAREBANK_1_GUDBRANDSDAL',
    bankIcon: '../../../../assets/img/banks-logo/square/sparebank1.png'
  },
  sparebank_1_hallingdal_valdres: {
    label: 'SPAREBANK',
    bankName: 'SPAREBANK_1_HALLINGDAL_VALDRES',
    bankIcon: '../../../../assets/img/banks-logo/square/sparebank1.png'
  },
  sparebank_1_lom_og_skjak: {
    label: 'SPAREBANK',
    bankName: 'SPAREBANK_1_LOM_OG_SKJAK',
    bankIcon: '../../../../assets/img/banks-logo/square/sparebank1.png'
  },
  sparebank_1_modum: {
    label: 'SPAREBANK',
    bankName: 'SPAREBANK_1_MODUM',
    bankIcon: '../../../../assets/img/banks-logo/square/sparebank1.png'
  },
  sparebank_1_nord_norge: {
    label: 'SPAREBANK',
    bankName: 'SPAREBANK_1_NORD_NORGE',
    bankIcon: '../../../../assets/img/banks-logo/square/sparebank1.png'
  },
  sparebank_1_nordvest: {
    label: 'SPAREBANK',
    bankName: 'SPAREBANK_1_NORDVEST',
    bankIcon: '../../../../assets/img/banks-logo/square/sparebank1.png'
  },
  sparebank_1_ringerike_hadeland: {
    label: 'SPAREBANK',
    bankName: 'SPAREBANK_1_RINGERIKE_HADELAND',
    bankIcon: '../../../../assets/img/banks-logo/square/sparebank1.png'
  },
  sparebank_1_smn: {
    label: 'SPAREBANK',
    bankName: 'SPAREBANK_1_SMN',
    bankIcon: '../../../../assets/img/banks-logo/square/sparebank1.png'
  },
  sparebank_1_sore_sunnmore: {
    label: 'SPAREBANK',
    bankName: 'SPAREBANK_1_SORE_SUNNMORE',
    bankIcon: '../../../../assets/img/banks-logo/square/sparebank1.png'
  },
  sparebank_1_sr_bank: {
    label: 'SPAREBANK',
    bankName: 'SPAREBANK_1_SR_BANK',
    bankIcon: '../../../../assets/img/banks-logo/square/sparebank1.png'
  },
  sparebank_1_telemark: {
    label: 'SPAREBANK',
    bankName: 'SPAREBANK_1_TELEMARK',
    bankIcon: '../../../../assets/img/banks-logo/square/sparebank1.png'
  },
  sparebank_1_ostfold_akershus: {
    label: 'SPAREBANK',
    bankName: 'SPAREBANK_1_OSTFOLD_AKERSHUS',
    bankIcon: '../../../../assets/img/banks-logo/square/sparebank1.png'
  },
  sparebank_1_ostlandet: {
    label: 'SPAREBANK',
    bankName: 'SPAREBANK_1_OSTLANDET',
    bankIcon: '../../../../assets/img/banks-logo/square/sparebank1.png'
  },
};
