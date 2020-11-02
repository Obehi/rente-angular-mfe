import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BankSelectNoRoutingModule } from './bank-select-routing.module';
import { BankSelectNoComponent } from './bank-select.component';
import { MaterialModule } from '@shared/material/material.module';


@NgModule({
  declarations: [BankSelectNoComponent],
  imports: [
    CommonModule,
    BankSelectNoRoutingModule,
    FormsModule,
    MaterialModule
  ]
})
export class BankSelectNoModule { }
