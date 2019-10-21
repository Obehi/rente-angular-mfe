export interface ViewStatus {
  isSocketConnectionLost: boolean;
  isRecconectFail: boolean;
  isNoActiveInsurances: boolean;
  isOfferCreated: boolean;
  isProcessStarted: boolean;
  isPassphraseConfirmSuccess: boolean;
  isPassphraseConfirmFail: boolean;
  isCrawlerError: boolean;
  isCrawlerResult: boolean;
  isLoansPersisted: boolean;
  isTimedOut: boolean;
  isNotValidDataProvided: boolean;
  isConfirmationRequired: boolean;
  isRenewBankIdRequired: boolean;
  step2Error:boolean;
}

export class ViewStatus {
  constructor() {
    this.isSocketConnectionLost = false;
    this.isRecconectFail = false;
    this.isNoActiveInsurances = false;
    this.isOfferCreated = false;
    this.isProcessStarted = false;
    this.isPassphraseConfirmSuccess = false;
    this.isPassphraseConfirmFail = false;
    this.isCrawlerError = false;
    this.isCrawlerResult = false;
    this.isLoansPersisted = false;
    this.isTimedOut = false;
    this.isNotValidDataProvided = false;
  }
}
