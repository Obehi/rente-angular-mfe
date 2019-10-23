export interface ViewStatus {
  isSocketConnectionLost: boolean;
  isRecconectFail: boolean;
  isNoActiveInsurances: boolean;
  isOfferCreated: boolean;
  isProcessStarted: boolean;
  isRenewBankId: boolean;
  isPassphraseConfirmSuccess: boolean;
  isPassphraseConfirmFail: boolean;
  isCrawlerError: boolean;
  isCrawlerResult: boolean;
  isLoansPersisted: boolean;
  isTimedOut: boolean;
  isNotValidDataProvided: boolean;
  isConfirmationRequired: boolean;
  isRenewBankIdRequired: boolean;
}

export class ViewStatus {
  constructor() {
    this.isSocketConnectionLost = false;
    this.isRecconectFail = false;
    this.isNoActiveInsurances = false;
    this.isOfferCreated = false;
    this.isProcessStarted = false;
    this.isConfirmationRequired = false;
    this.isRenewBankId = false;
    this.isPassphraseConfirmSuccess = false;
    this.isPassphraseConfirmFail = false;
    this.isCrawlerError = false;
    this.isCrawlerResult = false;
    this.isLoansPersisted = false;
    this.isTimedOut = false;
    this.isNotValidDataProvided = false;
  }
}
