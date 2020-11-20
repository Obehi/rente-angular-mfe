import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankGuidePageComponent } from './bank-guide-page/bank-guide-page.component';
import { BanksGuideComponent } from './banks-guide.component';


const routes: Routes = [
  {
    path: '',
    component: BanksGuideComponent
  },
  {
    path: ':id',
    component: BankGuidePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BanksGuideRoutingModule {
}

