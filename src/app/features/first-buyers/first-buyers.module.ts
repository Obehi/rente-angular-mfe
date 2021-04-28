import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectAutocompleteModule } from 'mat-select-autocomplete';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { MaterialModule } from '../../shared/material/material.module';
import { SharedModule } from '../../shared/shared.module';
import { InitialOfferComponent } from './components/initial-offer/initial-offer.component';
import { InitialOffersComponent } from './components/initial-offers/initial-offers.component';
import { InputFlowComponent } from './components/input-flow/input-flow.component';
import { PropertyInputComponent } from './components/property-input/property-input.component';
import { FirstBuyersRoutingModule } from './first-buyers-routing.module';
import { FirstBuyersComponent } from './first-buyers.component';
import { FirstBuyersService } from './first-buyers.service';
import { PropertySelectComponent } from './components/property-select/property-select.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    FirstBuyersComponent,
    InitialOffersComponent,
    InputFlowComponent,
    PropertyInputComponent,
    InitialOfferComponent,
    PropertySelectComponent
  ],
  imports: [
    CommonModule,
    FirstBuyersRoutingModule,
    SharedModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    SelectAutocompleteModule,
    CurrencyMaskModule,
    ScrollingModule
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    },
    FirstBuyersService
  ]
})
export class FirstBuyersModule {}
