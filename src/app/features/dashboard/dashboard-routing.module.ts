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
import { customMeta, defaultMeta } from '@config/routes-config';

const routes: Routes = [
  {
    path: '', component: DashboardComponent, children: [
      {
        path: 'tilbud', component: OffersComponent,
        data: {
          title: customMeta.tilbudTitle,
          meta: {
            name: defaultMeta.name,
            description: defaultMeta.description
          }
        }
      },
      {
        path: 'mine-lan', component: LoansComponent,
        data: {
          title: customMeta.mineLanTitle,
          meta: {
            name: defaultMeta.name,
            description: defaultMeta.description
          }
        }
      },
      {
        path: 'bolig', component: HouseComponent,
        data: {
          title: customMeta.boligTitle,
          meta: {
            name: defaultMeta.name,
            description: defaultMeta.description
          }
        }
      },
      {
        path: 'preferanser', component: PreferencesComponent,
        data: {
          title: customMeta.preferanserTitle,
          meta: {
            name: defaultMeta.name,
            description: defaultMeta.description
          }
        }
      },
      {
        path: 'profil', component: ProfileComponent,
        data: {
          title: customMeta.profilTitle,
          meta: {
            name: defaultMeta.name,
            description: defaultMeta.description
          }
        }
      },
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
