import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../../shared/material/material.module';
import { BankGuidePageComponent } from './bank-guide-page/bank-guide-page.component';
import { BanksGuideRoutingModule } from './banks-guide-routing.module';
import { BanksGuideComponent } from './banks-guide.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [BanksGuideComponent, BankGuidePageComponent],
  imports: [
    CommonModule,
    BanksGuideRoutingModule,
    MaterialModule,
    NgbRatingModule,
    SharedModule,
    FormsModule
  ]
})
export class BanksGuideModule {}
