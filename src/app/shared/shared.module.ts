import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AuthGuard } from './guards/auth.guard';
import { RouteGuard } from './guards/route.guard';

import { FooterComponent } from './components/footer/footer.component';
import { ButtonComponent } from './components/ui-components/button/button.component';
import { InputComponent } from './components/ui-components/input/input.component';
import { SelectComponent } from './components/ui-components/select/select.component';
import { CheckboxComponent } from './components/ui-components/checkbox/checkbox.component';
import { RadioComponent } from './components/ui-components/radio/radio.component';
import { TabsComponent } from './components/ui-components/tabs/tabs.component';
import { TabComponent } from './components/ui-components/tabs/tab.component';
import { FormMessageComponent } from './components/ui-components/form-message/form-message.component';
import { TextAreaComponent } from './components/ui-components/text-area/text-area.component';
import { ChipsAutocompleteComponent } from './components/ui-components/chips-autocomplete/chips-autocomplete.component';
import { CheckboxContainerComponent } from './components/ui-components/checkbox-container/checkbox-container.component';
import { BarComponent } from './components/ui-components/bar/bar.component';
import { TopAnimationBannerComponent } from './components/ui-components/top-animation-banner/top-animation-banner.component';
import { ButtonSmallComponent } from './components/ui-components/button-small/button-small.component';
import {
  HeaderLangGenericComponent,
  OfferDetailsLangGenericComponent
} from '../local-components/components-output';

import { LocalStorageService } from '@services/local-storage.service';
import { GenericHttpService } from '@services/generic-http.service';
import { AuthService } from '@services/remote-api/auth.service';
import { ContactService } from '@services/remote-api/contact.service';
import { TrackingService } from '@services/remote-api/tracking.service';
import { HouseService } from '@services/remote-api/house.service';
import { LoansService } from '@services/remote-api/loans.service';
import { PreferancesService } from '@services/remote-api/preferances.service';
import { ProfileService } from '@services/remote-api/profile.service';
import { SnackBarService } from './services/snackbar.service';
import { MetaService } from './services/meta.service';
import { TitleService } from './services/title.service';
import { EventService } from './services/event-service';
import { CustomLangTextService } from '@services/custom-lang-text.service';
import { MessageBannerService } from '@services/message-banner.service';

import { BigNumberPipe } from './pipes/big-number.pipe';
import { AbsPipe } from './pipes/abs.pipe';
import { RoundPipe } from './pipes/round.pipe';
import { ThousandsSeprator } from './pipes/thousands.pipe';
import { ChildDirective } from './directives/child.directive';

import { IMaskModule } from 'angular-imask';
import { MaterialModule } from './material/material.module';

const components = [
  ButtonComponent,
  ButtonSmallComponent,
  CheckboxComponent,
  CheckboxContainerComponent,
  FooterComponent,
  FormMessageComponent,
  HeaderLangGenericComponent,
  InputComponent,
  OfferDetailsLangGenericComponent,
  RadioComponent,
  SelectComponent,
  TabsComponent,
  TabComponent,
  TextAreaComponent,
  TopAnimationBannerComponent
];

const services = [
  AuthGuard,
  AuthService,
  ContactService,
  CustomLangTextService,
  EventService,
  GenericHttpService,
  HouseService,
  LocalStorageService,
  LoansService,
  MessageBannerService,
  MetaService,
  PreferancesService,
  ProfileService,
  RouteGuard,
  SnackBarService,
  TitleService,
  TrackingService
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IMaskModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule
  ],
  declarations: [
    ...components,
    AbsPipe,
    BarComponent,
    BigNumberPipe,
    ChildDirective,
    ChipsAutocompleteComponent,
    RoundPipe,
    ThousandsSeprator
  ],
  exports: [
    ...components,
    AbsPipe,
    BarComponent,
    ChildDirective,
    ReactiveFormsModule,
    RoundPipe,
    ThousandsSeprator
  ],
  providers: [...services]
})
export class SharedModule {}
