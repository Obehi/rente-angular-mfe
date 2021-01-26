import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from './guards/auth.guard';
import { RouteGuard } from './guards/route.guard';
import { LocalStorageService } from '@services/local-storage.service';
import { GenericHttpService } from '@services/generic-http.service';
import { RouterModule } from '@angular/router';
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
import { AuthService } from '@services/remote-api/auth.service';
import { ContactService } from '@services/remote-api/contact.service';
import { TrackingService } from '@services/remote-api/tracking.service';
import { HouseService } from '@services/remote-api/house.service';
import { LoansService } from '@services/remote-api/loans.service';
import { PreferancesService } from '@services/remote-api/preferances.service';
import { ProfileService } from '@services/remote-api/profile.service';
import { HttpClientModule } from '@angular/common/http';
import { BigNumberPipe } from './pipes/big-number.pipe';
import { ChipsAutocompleteComponent } from './components/ui-components/chips-autocomplete/chips-autocomplete.component';

import { AbsPipe } from './pipes/abs.pipe';
import { MaterialModule } from './material/material.module';
import { SnackBarService } from './services/snackbar.service';
import { MetaService } from './services/meta.service';
import { TitleService } from './services/title.service';
import { EventService } from './services/event-service';
import { RoundPipe } from './pipes/round.pipe';
import { ThousandsSeprator } from './pipes/thousands.pipe';
import { ButtonSmallComponent } from './components/ui-components/button-small/button-small.component';
import { IMaskModule } from 'angular-imask';
import { HeaderLangGenericComponent } from '../local-components/components-output';
import { CustomLangTextService } from '@services/custom-lang-text.service';

const components = [
  HeaderLangGenericComponent,
  FooterComponent,
  ButtonComponent,
  ButtonSmallComponent,
  InputComponent,
  SelectComponent,
  CheckboxComponent,
  RadioComponent,
  TabsComponent,
  TabComponent,
  FormMessageComponent,
  TextAreaComponent
];

const services = [
  AuthGuard,
  RouteGuard,
  GenericHttpService,
  SnackBarService,
  LocalStorageService,
  AuthService,
  ContactService,
  TrackingService,
  HouseService,
  LoansService,
  PreferancesService,
  ProfileService,
  MetaService,
  TitleService,
  EventService,
  CustomLangTextService
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    MaterialModule,
    IMaskModule
  ],
  declarations: [
    ...components,
    BigNumberPipe,
    ChipsAutocompleteComponent,
    AbsPipe,
    RoundPipe,
    ThousandsSeprator
  ],
  exports: [...components, AbsPipe, RoundPipe, ThousandsSeprator],
  providers: [...services]
})
export class SharedModule {}
