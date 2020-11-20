import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material/material.module';
import { BankGuidePageComponent } from './bank-guide-page/bank-guide-page.component';
import { BanksGuideRoutingModule } from './banks-guide-routing.module';
import { BanksGuideComponent } from './banks-guide.component';


@NgModule({
  declarations: [BanksGuideComponent, BankGuidePageComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BanksGuideRoutingModule,
    MaterialModule
  ]
})
export class BanksGuideModule {
}
