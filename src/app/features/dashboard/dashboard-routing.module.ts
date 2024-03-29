import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { RateTypeFixedComponent } from './rate-type-fixed/rate-type-fixed.component';
import {
  customMeta,
  defaultMeta,
  ROUTES_MAP,
  ROUTES_MAP_NO
} from '@config/routes-config';
import { RouteGuard } from '@shared/guards/route.guard';
import { BargainSuccessComponent } from './offers/bargain-success/bargain-success.component';
import { OffersComponentBlue } from './offers/offers-blue/offers.component';
import { HousesComponent } from './house/houses.component';
import { EPSIScoreComponent } from './offers/offers-blue/epsi-score/epsi-score.component';
import { LoansLangGenericComponent } from '../../local-components/components-output';
import { AntiChurnSuccessComponent } from './offers/bargain-success/antichurn/antichurn-success.component';
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: ROUTES_MAP.offers,
        component: OffersComponentBlue,
        data: {
          title: customMeta.tilbudTitle,
          meta: {
            name: defaultMeta.name,
            description: defaultMeta.description
          }
        }
      },
      {
        path: 'prute-fullfort',
        component: BargainSuccessComponent
      },
      {
        path: ROUTES_MAP_NO.bargainAntiChurn,
        component: AntiChurnSuccessComponent
      },

      {
        path: ROUTES_MAP.loans,
        component: LoansLangGenericComponent,
        data: {
          title: customMeta.mineLanTitle,
          meta: {
            name: defaultMeta.name,
            description: defaultMeta.description
          }
        }
      },
      {
        path: ROUTES_MAP.property,
        component: HousesComponent,
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
        path: ROUTES_MAP.profile,
        component: ProfileComponent,
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
        path: 'epsi-kundetilfredshet',
        component: EPSIScoreComponent,
        canDeactivate: [RouteGuard],
        data: {
          title: customMeta.profilTitle,
          meta: {
            name: defaultMeta.name,
            description: defaultMeta.description
          }
        }
      }
    ]
  },
  { path: ROUTES_MAP.fixedRate, component: RateTypeFixedComponent }
];

@NgModule({
  providers: [ProfileComponent, RouteGuard],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
