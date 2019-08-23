import { OffersComponent } from './offers/offers.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { LoansComponent } from './loans/loans.component';
import { HouseComponent } from './house/house.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { ProfileComponent } from './profile/profile.component';
import { RateTypeFixedComponent } from './rate-type-fixed/rate-type-fixed.component';
import { NoLoansComponent } from './no-loans/no-loans.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, children: [
    { path: 'tilbud', component: OffersComponent },
    { path: 'mine-lan', component: LoansComponent },
    { path: 'bolig', component: HouseComponent },
    { path: 'preferanser', component: PreferencesComponent },
    { path: 'profil', component: ProfileComponent },
    ]
  },
  { path: 'fastrente', component: RateTypeFixedComponent },
  { path: 'ingenlaan', component: NoLoansComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
