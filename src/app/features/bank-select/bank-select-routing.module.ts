import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BankSelectComponent } from './bank-select.component';

const routes: Routes = [{ path: '', component: BankSelectComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankSelectRoutingModule { }
