import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BankIdLoginComponent } from './bank-id-login/bank-id-login.component';

const routes: Routes = [
  { path: '', redirectTo: 'bank' },
  { path: 'bank', component: BankIdLoginComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
