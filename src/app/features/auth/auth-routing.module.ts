import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BankIdLoginComponent } from './bank-id-login/bank-id-login.component';
import { Sparebank1SubComponent } from './sparebank1-sub/sparebank1-sub.component';
import { DemoLoginComponent } from './demo-login/demo-user-option-login/demo-login.component';
import { GuidLoginComponent } from './demo-login/guid-login/guid-login.component';

const routes: Routes = [
  { path: 'sparebank1-sub', component: Sparebank1SubComponent },
  { path: 'bank/:bankName', component: BankIdLoginComponent},
  { path: 'demo-login', component: DemoLoginComponent},
  { path: 'guid-login', component: GuidLoginComponent},
  { path: '', redirectTo: 'bank' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
