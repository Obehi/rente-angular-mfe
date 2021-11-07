import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BankSelectSvRoutingModule } from './bank-select-routing.module';
import { BankSelectSvComponent } from './bank-select.component';
import { MaterialModule } from '@shared/material/material.module';
import { ChangeBrowserDialogInfoComponent } from '../landing/landing-top-sv/change-browser-dialog-info/dialog-info.component';

@NgModule({
  declarations: [BankSelectSvComponent, ChangeBrowserDialogInfoComponent],
  imports: [
    CommonModule,
    BankSelectSvRoutingModule,
    FormsModule,
    MaterialModule
  ]
})
export class BankSelectSvModule {}
