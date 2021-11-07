import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BankSelectRoutingModule } from './bank-select-routing.module';
import { BankSelectComponent } from './bank-select.component';
import { MaterialModule } from '@shared/material/material.module';

@NgModule({
  declarations: [BankSelectComponent],
  imports: [CommonModule, BankSelectRoutingModule, FormsModule, MaterialModule]
})
export class BankSelectModule {}
