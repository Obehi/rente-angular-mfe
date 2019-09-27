import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { OffersComponent } from './offers/offers.component';
import { DashboardComponent } from './dashboard.component';
import { MatTabsModule } from '@angular/material/tabs';
import { LoansComponent } from './loans/loans.component';
import { HouseComponent } from './house/house.component';
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
import {
  MatInputModule, MatChipsModule, MatIconModule, MatAutocompleteModule,
  MatProgressSpinnerModule,
  MatCheckboxModule,
  MatBottomSheetModule
} from '@angular/material';
import { RateTypeFixedComponent } from './rate-type-fixed/rate-type-fixed.component';
import { NoLoansComponent } from './no-loans/no-loans.component';
import { ChangeBankDialogComponent } from './offers/change-bank-dialog/change-bank-dialog.component';
import {
  SuccessChangeBankDialogComponent
} from './offers/change-bank-dialog/success-change-bank-dialog/success-change-bank-dialog.component';
import { ChartModule } from 'angular-highcharts';
import { ShareSheetComponent } from './offers/share-sheet/share-sheet.component';
import { ShareButtonModule } from '@ngx-share/button';
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
    RatingComponent,
    RateTypeFixedComponent,
    NoLoansComponent,
    ChangeBankDialogComponent,
    SuccessChangeBankDialogComponent,
    ShareSheetComponent
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
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatBottomSheetModule,
    ShareButtonModule,
    ChartModule
  ],
  entryComponents: [
    DialogInfoComponent,
    ChangeBankDialogComponent,
    SuccessChangeBankDialogComponent,
    ShareSheetComponent
  ]
})
export class DashboardModule { }
