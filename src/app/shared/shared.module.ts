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
import { TopAnimationBannerComponent } from './components/ui-components/top-animation-banner/top-animation-banner.component';
import { ButtonSmallComponent } from './components/ui-components/button-small/button-small.component';
import { OfferDetailsLangGenericComponent } from '../local-components/components-output';

import { HeaderComponent } from '@shared/components/header/header.component';
import { LocalStorageService } from '@services/local-storage.service';
import { GenericHttpService } from '@services/generic-http.service';
import { AuthService } from '@services/remote-api/auth.service';
import { ContactService } from '@services/remote-api/contact.service';
import { TrackingService } from '@services/remote-api/tracking.service';
import { HouseService } from '@services/remote-api/house.service';
import { LoansService } from '@services/remote-api/loans.service';
import { ProfileService } from '@services/remote-api/profile.service';
import { SnackBarService } from './services/snackbar.service';
import { MetaService } from './services/meta.service';
import { TitleService } from './services/title.service';
import { EventService } from './services/event-service';
import { MessageBannerService } from '@services/message-banner.service';
import { BigNumberPipe } from './pipes/big-number.pipe';
import { AbsPipe } from './pipes/abs.pipe';
import { RoundPipe } from './pipes/round.pipe';
import { ThousandsSeprator } from './pipes/thousands.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';
import { PhoneNumberPipe } from './pipes/phone-number.pipe';
import { IMaskModule } from 'angular-imask';
import { CustomLangTextService } from '@services/custom-lang-text.service';
import { ChildDirective } from './directives/child.directive';
import { BarComponent } from './components/ui-components/bar/bar.component';
import { FlowHeaderComponent } from './components/ui-components/flow-header/flow-header.component';
import { GenericInfoDialogComponent } from './components/ui-components/dialogs/generic-info-dialog/generic-info-dialog.component';
import { GenericChoiceDialogComponent } from './components/ui-components/dialogs/generic-choice-dialog/generic-choice-dialog.component';
import { GenericErrorDialogComponent } from './components/ui-components/dialogs/generic-error-dialog/generic-error-dialog.component';
import { VirdiErrorChoiceDialogComponent } from './components/ui-components/dialogs/virdi-error-choice-dialog/virdi-error-choice-dialog.component';
import { LoginTermsDialogV2Component } from './components/ui-components/dialogs/login-terms-dialog-v2/login-terms-dialog-v2.component';
import { DashboardTabsDesktopComponent } from './components/header/dashboard-tabs-desktop/dashboard-tabs-desktop.component';
import { DashboardTabsMobileComponent } from './components/header/dashboard-tabs-mobile/dashboard-tabs-mobile.component';
import { HeaderDesktopLangGenericComponent } from '../local-components/components-output';
import { HeaderMobileLangGenericComponent } from '../local-components/components-output';
import { MaterialModule } from './material/material.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

import { PropertySelectComponent } from '@features/first-buyers/components/property-select/property-select.component';
import { PropertySelectDialogComponent } from '@features/first-buyers/components/property-select-dialog/property-select-dialog.component';
import { SpinnerComponent } from '@shared/components/ui-components/spinner/spinner.component';
import { CheckmarkSuccessComponent } from '@shared/components/ui-components/checkmark-success/checkmark-success.component';
import { VirdiManualValueDialogComponent } from './components/ui-components/dialogs/virdi-manual-value-dialog/virdi-manual-value-dialog.component';
import { GeneralInputComponent } from './components/ui-components/input/general-input/general-input.component';
import { UserScorePreferencesComponent } from './components/ui-components/user-score-preferences/user-score-preferences.component';
import { AccordionGroupComponent } from './components/ui-components/accordion/accordion-group.component';
import { AccordionComponent } from './components/ui-components/accordion/accordion.component';
import { CustomDropdownComponent } from './components/ui-components/custom-dropdown/custom-dropdown.component';

const components = [
  HeaderComponent,
  FooterComponent,
  ButtonComponent,
  ButtonSmallComponent,
  CheckboxComponent,
  CheckboxContainerComponent,
  FooterComponent,
  FormMessageComponent,
  GeneralInputComponent,
  InputComponent,
  OfferDetailsLangGenericComponent,
  RadioComponent,
  SelectComponent,
  TabsComponent,
  TabComponent,
  TextAreaComponent,
  TopAnimationBannerComponent,
  DashboardTabsDesktopComponent,
  DashboardTabsMobileComponent,
  HeaderDesktopLangGenericComponent,
  HeaderMobileLangGenericComponent,
  PropertySelectComponent,
  PropertySelectDialogComponent,
  SpinnerComponent,
  CheckmarkSuccessComponent,
  UserScorePreferencesComponent,
  AccordionGroupComponent,
  AccordionComponent,
  CustomDropdownComponent
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
    RouterModule,
    NgxSliderModule
  ],
  declarations: [
    ...components,
    AbsPipe,
    BarComponent,
    BigNumberPipe,
    ChildDirective,
    ChipsAutocompleteComponent,
    RoundPipe,
    ThousandsSeprator,
    FilterPipe,
    TruncatePipe,
    PhoneNumberPipe,
    ChildDirective,
    BarComponent,
    FlowHeaderComponent,
    GenericInfoDialogComponent,
    GenericChoiceDialogComponent,
    GenericErrorDialogComponent,
    VirdiErrorChoiceDialogComponent,
    LoginTermsDialogV2Component,
    VirdiManualValueDialogComponent
  ],
  exports: [
    ...components,
    AbsPipe,
    RoundPipe,
    ThousandsSeprator,
    FilterPipe,
    TruncatePipe,
    PhoneNumberPipe,
    BarComponent,
    ChildDirective,
    ReactiveFormsModule,
    RoundPipe,
    ThousandsSeprator,
    BarComponent,
    FlowHeaderComponent,
    IMaskModule
  ],
  providers: [...services]
})
export class SharedModule {}
