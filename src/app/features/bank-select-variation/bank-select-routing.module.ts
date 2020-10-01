import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BankSelectComponentVariation } from './bank-select.component';

const routes: Routes = [{ path: '', component: BankSelectComponentVariation }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankSelectRoutingModule { }
  

