import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { ProfileComponent } from './profile/profile.component';
import { RateTypeFixedComponent } from './rate-type-fixed/rate-type-fixed.component';
import { NoLoansComponent } from './no-loans/no-loans.component';
import { customMeta, defaultMeta, ROUTES_MAP } from '@config/routes-config';
import {RouteGuard } from '@shared/guards/route.guard';
import { BargainSuccessComponent } from './offers/bargain-success/bargain-success.component';
import { OptimizeService } from '@services/optimize.service'
import { OffersComponentBlue } from './offers/offers-blue/offers.component';
import { HouseBlueComponent }   from './house/house-blue/house-blue.component';
import { BlueProfileComponent }   from './profile/blue-profile/blue-profile.component';
import { LoansBlueComponent }   from './loans/loans-blue/loans-blue.component';
import { EPSIScoreComponent }   from './offers/offers-blue/epsi-score/epsi-score.component';
import { LoansLangGenericComponent } from '../../local-components/components-output'



const routes: Routes = [
  {
    path: '', component: DashboardComponent, children: [
      {
        path: ROUTES_MAP.offers, component: OffersComponentBlue,
        data: {
          title: customMeta.tilbudTitle,
          meta: {
            name: defaultMeta.name,
            description: defaultMeta.description
          }
        }
      },
      {
        path: 'prute-fullfort', component: BargainSuccessComponent
      },
      {
        path: ROUTES_MAP.loans, component: LoansLangGenericComponent,
        data: {
          title: customMeta.mineLanTitle,
          meta: {
            name: defaultMeta.name,
            description: defaultMeta.description
          }
        }
      },
      {
        path: ROUTES_MAP.property, component: HouseBlueComponent,
        canDeactivate: [RouteGuard],
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
        path: ROUTES_MAP.profile, component: BlueProfileComponent,
        canDeactivate: [RouteGuard],
        data: {
          title: customMeta.profilTitle,
          meta: {
            name: defaultMeta.name,
            description: defaultMeta.description
          }
        }
      },
      {
        path: 'epsi-kundetilfredshet', component: EPSIScoreComponent,
        canDeactivate: [RouteGuard],
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
  { path: ROUTES_MAP.fixedRate, component: RateTypeFixedComponent },
  { path: ROUTES_MAP.noLoan, component: NoLoansComponent }
];

@NgModule({
  providers: [ProfileComponent, RouteGuard],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
