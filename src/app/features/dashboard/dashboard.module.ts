import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { OffersComponent } from "./offers/offers.component";
import { DashboardComponent } from "./dashboard.component";
import { MatTabsModule } from "@angular/material/tabs";
import { LoansComponent } from "./loans/loans.component";
import { HouseComponent } from "./house/house.component";
import { PreferencesComponent } from "./preferences/preferences.component";
import { ProfileComponent } from "./profile/profile.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedModule } from "@shared/shared.module";
import { MatDialogModule } from "@angular/material/dialog";
import { MatRadioModule } from "@angular/material/radio";
import { DialogInfoComponent } from "./offers/dialog-info/dialog-info.component";
import { DetailsComponent } from "./offers/details/details.component";

import { RatingComponent } from "./offers/rating/rating.component";
import { LayoutModule } from "@angular/cdk/layout";
import { MatSelectModule } from "@angular/material/select";
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
} from "@angular/material";
import { RateTypeFixedComponent } from "./rate-type-fixed/rate-type-fixed.component";
import { NoLoansComponent } from "./no-loans/no-loans.component";
import { ChangeBankDialogComponent } from "./offers/change-bank-dialog/change-bank-dialog.component";
import { SuccessChangeBankDialogComponent } from "./offers/change-bank-dialog/success-change-bank-dialog/success-change-bank-dialog.component";
import { ShareSheetComponent } from "./offers/share-sheet/share-sheet.component";
import { VirdiStatisticsComponent } from "./house/virdi-statistics/virdi-statistics.component";
import { OffersStatisticsComponent } from "./offers/offers-statistics/offers-statistics.component";
import { DialogComponent } from "../../shared/components/ui-components/dialog/dialog.component";
import { AddressFormComponent } from "./house/address/address.form.component";
import { GetOfferFromBankDialogComponent } from './offers/get-offer-from-bank-dialog/get-offer-from-bank-dialog.component';
import { LtvTooHighDialogComponent } from './offers/ltv-too-high-dialog/ltv-too-high-dialog.component';
import { OfferCardComponent } from './offers/offer-card/offer-card.component';
import { OfferCardBigComponent } from './offers/offer-card-big/offer-card-big.component';
import { BargainSuccessComponent } from './offers/bargain-success/bargain-success.component';

// TODO: ADD separate module for material import
@NgModule({
  declarations: [
    OffersComponent,
    DashboardComponent,
    LoansComponent,
    HouseComponent,
    PreferencesComponent,
    ProfileComponent,
    DialogInfoComponent,
    LtvTooHighDialogComponent,
    RatingComponent,
    RateTypeFixedComponent,
    NoLoansComponent,
    ChangeBankDialogComponent,
    SuccessChangeBankDialogComponent,
    ShareSheetComponent,
    VirdiStatisticsComponent,
    OffersStatisticsComponent, 
    DialogComponent,
    AddressFormComponent,
    GetOfferFromBankDialogComponent,
    LtvTooHighDialogComponent,
    DetailsComponent,
    OfferCardComponent,
    OfferCardBigComponent,
    BargainSuccessComponent
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
    // ShareButtonModule
  ],
  entryComponents: [
    DialogInfoComponent,
    ChangeBankDialogComponent,
    SuccessChangeBankDialogComponent,
    ShareSheetComponent,
    GetOfferFromBankDialogComponent,
    LtvTooHighDialogComponent
  ]
})
export class DashboardModule {}
