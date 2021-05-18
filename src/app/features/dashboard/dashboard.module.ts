import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { OffersComponentBlue } from './offers/offers-blue/offers.component';
import { DashboardComponent } from './dashboard.component';
import { MatTabsModule } from '@angular/material/tabs';
import { PreferencesComponent } from './preferences/preferences.component';
import { ProfileComponent } from './profile/profile.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { DialogInfoComponent } from './offers/dialog-info/dialog-info.component';
import { RatingComponent } from './offers/rating/rating.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material';
import {
  MatInputModule,
  MatChipsModule,
  MatIconModule,
  MatAutocompleteModule,
  MatProgressSpinnerModule,
  MatCheckboxModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatTooltipModule,
  MatExpansionModule
} from '@angular/material';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { RateTypeFixedComponent } from './rate-type-fixed/rate-type-fixed.component';
import { ChangeBankDialogComponent } from './offers/change-bank-dialog/change-bank-dialog.component';
import { HouseFormErrorDialogComponent } from './house/error-dialog/error-dialog.component';
import { ManualInputDialogComponent } from './house/manual-input-dialog/manual-input-dialog.component';
import { HouseErrorDialogSv } from './house/error-dialog-sv/house-error-dialog-sv.component';

import { SuccessChangeBankDialogComponent } from './offers/change-bank-dialog/success-change-bank-dialog/success-change-bank-dialog.component';
import { VirdiStatisticsComponent } from './house/virdi-statistics/virdi-statistics.component';
import { OffersStatisticsComponentBlue } from './offers/offers-blue/offers-statistics/offers-statistics.component';
import { OffersStatisticsComponent } from './offers/offers-statistics/offers-statistics.component';
import { DialogComponent } from '../../shared/components/ui-components/dialog/dialog.component';
import { GetOfferFromBankDialogComponent } from './offers/get-offer-from-bank-dialog/get-offer-from-bank-dialog.component';
import { LtvTooHighDialogComponent } from './offers/ltv-too-high-dialog/ltv-too-high-dialog.component';
import { OfferCardComponentBlue } from './offers/offers-blue/offer-card/offer-card.component';
import { OfferCardBigComponentBlue } from './offers/offers-blue/offer-card-big/offer-card-big.component';
import { BargainSuccessComponent } from './offers/bargain-success/bargain-success.component';
import { ReferralComponent } from './offers/bargain-success/referral/referral.component';

import { HousesComponent } from './house/houses.component';
import { BlueProfileComponent } from './profile/blue-profile/blue-profile.component';
import { EPSIScoreComponent } from './offers/offers-blue/epsi-score/epsi-score.component';
import { OffersListLangGenericComponent } from '../../local-components/components-output';
import { LoansLangGenericComponent } from '../../local-components/components-output';
import { HouseFormLangGenericComponent } from '../../local-components/components-output';
import { ChangeBankDialogLangGenericComponent } from '../../local-components/components-output';
import { BankScoreLangGenericComponent } from '../../local-components/components-output';
import { ChangeBankLocationComponent } from './offers/change-bank-dialog/change-bank-location/change-bank-location.component';
import { AntiChurnDialogComponent } from './offers/anti-churn-dialog/anti-churn-dialog.component';
import { AntiChurnErrorDialogComponent } from './offers/anti-churn-dialog/anti-churn-error-dialog/anti-churn-error-dialog.component';
import { NordeaBargainSuccessComponent } from './offers/bargain-success/bargain-nordea/nordea-bargain-success.component';
import { CanNotBargainDialogComponent } from './offers/can-not-bargain-dialog/can-not-bargain-dialog.component';
import { OfferCardV1Component } from './offers/offers-blue/offer-card-v1/offer-card-v1.component';
import { OfferCardV2Component } from './offers/offers-blue/offer-card-v2/offer-card-v2.component';
import { ChangeBankTooManyTriesDialogError } from './offers/change-bank-dialog/change-bank-too-many-tries-dialog-error/change-bank-too-many-tries-dialog-error.component';

// TODO: ADD separate module for material import
@NgModule({
  declarations: [
    OffersComponentBlue,
    DashboardComponent,
    LoansLangGenericComponent,
    PreferencesComponent,
    ProfileComponent,
    DialogInfoComponent,
    LtvTooHighDialogComponent,
    RatingComponent,
    RateTypeFixedComponent,
    ChangeBankDialogComponent,
    SuccessChangeBankDialogComponent,
    VirdiStatisticsComponent,
    OffersStatisticsComponentBlue,
    OffersStatisticsComponent,
    DialogComponent,
    GetOfferFromBankDialogComponent,
    LtvTooHighDialogComponent,
    OfferCardComponentBlue,
    OfferCardBigComponentBlue,
    BargainSuccessComponent,
    ReferralComponent,
    HousesComponent,
    BlueProfileComponent,
    EPSIScoreComponent,
    OffersListLangGenericComponent,
    LoansLangGenericComponent,
    HouseFormLangGenericComponent,
    ChangeBankDialogLangGenericComponent,
    BankScoreLangGenericComponent,
    EPSIScoreComponent,
    HouseFormErrorDialogComponent,
    ManualInputDialogComponent,
    HouseErrorDialogSv,
    ChangeBankLocationComponent,
    AntiChurnDialogComponent,
    CanNotBargainDialogComponent,
    OfferCardV1Component,
    AntiChurnErrorDialogComponent,
    CanNotBargainDialogComponent,
    NordeaBargainSuccessComponent,
    OfferCardV2Component,
    ChangeBankTooManyTriesDialogError
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatDialogModule,
    MatRadioModule,
    LayoutModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatBottomSheetModule,
    MatExpansionModule,
    MatStepperModule,
    NgbRatingModule

    // ShareButtonModule
  ],
  entryComponents: [
    DialogInfoComponent,
    ChangeBankDialogComponent,
    SuccessChangeBankDialogComponent,
    GetOfferFromBankDialogComponent,
    LtvTooHighDialogComponent
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
  ]
})
export class DashboardModule {}
