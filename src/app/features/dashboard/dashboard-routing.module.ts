import { OffersComponentBlue } from './offers/offers-blue/offers.component';
import { OffersComponent } from './offers/offers.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { LoansComponent } from './loans/loans.component';
import { HouseComponent }   from './house/house.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { ProfileComponent } from './profile/profile.component';
import { RateTypeFixedComponent } from './rate-type-fixed/rate-type-fixed.component';
import { NoLoansComponent } from './no-loans/no-loans.component';
import { customMeta, defaultMeta } from '@config/routes-config';
import {RouteGuard } from '@shared/guards/route.guard';
import { BargainSuccessComponent } from './offers/bargain-success/bargain-success.component';


const getVariation = (): number | null => {
  if((window as any).google_optimize == undefined) {
    return null;
  }
  if((window as any).google_optimize == null) {
    return null;
  }

  console.log("variation " + (window as any).google_optimize.get('-FGlj4ayQK66hF9kV4Wiow'));
  return (window as any).google_optimize.get('-FGlj4ayQK66hF9kV4Wiow');
}

const getOfferVariationComponent = () => {
  let variation =  getVariation()
  return OffersComponentBlue;

  if(variation == 0 || variation == null) {
    return OffersComponent;
  } else if(variation == 1) {
    return OffersComponentBlue;
  } else {
    return OffersComponent;
  }
};

const routes: Routes = [
  {
    path: '', component: DashboardComponent, children: [
      {
        path: 'tilbud', component: getOfferVariationComponent(),
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
        path: 'profil', component: ProfileComponent,
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
  { path: 'fastrente', component: RateTypeFixedComponent },
  { path: 'ingenlaan', component: NoLoansComponent }
];

@NgModule({
  providers: [ProfileComponent, RouteGuard],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
