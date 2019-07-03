export interface ViewStatus {
  isLoginShown: boolean;
  isSpinnerShown: boolean;
  isBankIdApproved: boolean;
  isParsingFinished: boolean;
  isError: boolean;
  isCommonError: boolean;
  isOfferCreated: boolean;
  isUserDataInvalid: boolean;
  modalTermsActive: boolean;
  isConfirmationStep: boolean;
  isSubmitingConfirmationStep: boolean;
  isSocketConnectionLost: boolean;
  isRecconectFail: boolean;
  isNoActiveInsurances: boolean;
}

export class ViewStatus {
  constructor() {
    this.isLoginShown = false;
    this.isSpinnerShown = false;
    this.isBankIdApproved = false;
    this.isParsingFinished = false;
    this.isError = false;
    this.isCommonError = false;
    this.isOfferCreated = false;
    this.isUserDataInvalid = false;
    this.modalTermsActive = false;
    this.isConfirmationStep = false;
    this.isSubmitingConfirmationStep = false;
    this.isSocketConnectionLost = false;
    this.isRecconectFail = false;
    this.isNoActiveInsurances = false;
  }
}
