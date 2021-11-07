import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BankSelectNoComponent } from './bank-select.component';

const routes: Routes = [{ path: '', component: BankSelectNoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankSelectNoRoutingModule {}
