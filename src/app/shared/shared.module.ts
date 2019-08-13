import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from './guards/auth.guard';
import { LocalStorageService } from '@services/local-storage.service';
import { GenericHttpService } from '@services/generic-http.service';
import { HeaderComponent } from './components/header/header.component';
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
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { TextAreaComponent } from './components/ui-components/text-area/text-area.component';
import { AuthService } from '@services/remote-api/auth.service';
import { ContactService } from '@services/remote-api/contact.service';
import { HouseService } from '@services/remote-api/house.service';
import { LoansService } from '@services/remote-api/loans.service';
import { PreferancesService } from '@services/remote-api/preferances.service';
import { ProfileService } from '@services/remote-api/profile.service';
import { HttpClientModule } from '@angular/common/http';
import { BigNumberPipe } from './pipes/big-number.pipe';
import { ChipsAutocompleteComponent } from './components/ui-components/chips-autocomplete/chips-autocomplete.component';
import { TextMaskModule } from 'angular2-text-mask';
import { UserService } from '@services/remote-api/user.service';
import { AbsPipe } from './pipes/abs.pipe';
import { MaterialModule } from './material/material.module';

// export declare const options: Partial<IConfig> | (() => Partial<IConfig>);

const components = [
  HeaderComponent,
  FooterComponent,
  ButtonComponent,
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
  GenericHttpService,
  LocalStorageService,
  AuthService,
  ContactService,
  HouseService,
  LoansService,
  PreferancesService,
  ProfileService,
  UserService
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    MaterialModule,
    // MatButtonModule,
    // MatInputModule,
    // MatSnackBarModule,
    // MatRadioModule,
    TextMaskModule,
    // MatChipsModule,
    // MatIconModule
  ],
  declarations: [...components, BigNumberPipe, ChipsAutocompleteComponent, AbsPipe],
  exports: [...components, AbsPipe, TextMaskModule],
  providers: [...services]
})
export class SharedModule { }
