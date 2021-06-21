import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../../shared/material/material.module';
import { BankGuidePageComponent } from './bank-guide-page/bank-guide-page.component';
import { BanksGuideRoutingModule } from './banks-guide-routing.module';
import { BanksGuideComponent } from './banks-guide.component';
import { SharedModule } from '../../shared/shared.module';
import { BankGuideService } from './bank-guide.service';
import { AccordionGroupComponent } from '../../shared/components/ui-components/accordion-new/accordion-group.component';
import { AccordionComponent } from '../../shared/components/ui-components/accordion-new/accordion.component';
import { TestComponent } from './test/test.component';

@NgModule({
  declarations: [
    BanksGuideComponent,
    BankGuidePageComponent,
    AccordionGroupComponent,
    AccordionComponent,
    TestComponent
  ],
  imports: [
    CommonModule,
    BanksGuideRoutingModule,
    MaterialModule,
    NgbRatingModule,
    SharedModule,
    FormsModule
  ],
  providers: [BankGuideService]
})
export class BanksGuideModule {}
