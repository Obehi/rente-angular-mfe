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
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogInfoComponent } from './offers/dialog-info/dialog-info.component';
@NgModule({
  declarations: [
    OffersComponent,
    DashboardComponent,
    LoansComponent,
    HouseComponent,
    PreferencesComponent,
    ProfileComponent,
    DialogInfoComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatTabsModule,
    ReactiveFormsModule,
    SharedModule,
    MatDialogModule
  ],
  entryComponents: [DialogInfoComponent]
})
export class DashboardModule { }
