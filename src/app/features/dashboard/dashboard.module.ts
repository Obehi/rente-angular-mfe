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
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material';
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
    MatInputModule
  ],
  entryComponents: [DialogInfoComponent]
})
export class DashboardModule { }
