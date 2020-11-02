import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BankSelectSvComponent } from './bank-select.component';

const routes: Routes = [{ path: '', component: BankSelectSvComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankSelectSvRoutingModule { }
  
