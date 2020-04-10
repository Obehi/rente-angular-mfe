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
import { ProfileDialogInfoComponent } from "./profile/dialog-info/dialog-info.component";
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
  MatTooltipModule
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
    ProfileDialogInfoComponent,
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
    LtvTooHighDialogComponent
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
    MatBottomSheetModule
    // ShareButtonModule
  ],
  entryComponents: [
    DialogInfoComponent,
    ProfileDialogInfoComponent,
    ChangeBankDialogComponent,
    SuccessChangeBankDialogComponent,
    ShareSheetComponent,
    GetOfferFromBankDialogComponent,
    LtvTooHighDialogComponent
  ]
})
export class DashboardModule {}
