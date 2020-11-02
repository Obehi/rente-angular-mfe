import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BankSelectSvRoutingModule } from './bank-select-routing.module';
import { BankSelectSvComponent } from './bank-select.component';
import { MaterialModule } from '@shared/material/material.module';


@NgModule({
  declarations: [BankSelectSvComponent],
  imports: [
    CommonModule,
    BankSelectSvRoutingModule,
    FormsModule,
    MaterialModule
  ]
})
export class BankSelectSvModule { }
