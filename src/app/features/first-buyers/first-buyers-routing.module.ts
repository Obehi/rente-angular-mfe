import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES_MAP } from '../../config/routes-config';
import { InitialOffersComponent } from './components/initial-offers/initial-offers.component';
import { FirstBuyersComponent } from './first-buyers.component';


const routes: Routes = [
  {
    path: '',
    component: FirstBuyersComponent
  },
  {
    path: ROUTES_MAP.offers,
    component: InitialOffersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FirstBuyersRoutingModule {
}

