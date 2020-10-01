import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BankSelectRoutingModule } from './bank-select-routing.module';
import { BankSelectComponentVariation } from './bank-select.component';
import { MaterialModule } from '@shared/material/material.module';


@NgModule({
  declarations: [BankSelectComponentVariation],
  imports: [
    CommonModule,
    BankSelectRoutingModule,
    FormsModule,
    MaterialModule
  ]
})
export class BankSelectVariationModule { }
