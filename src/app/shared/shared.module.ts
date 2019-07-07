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
import { TextAreaComponent } from './components/ui-components/text-area/text-area.component';

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

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatInputModule
  ],
  declarations: [...components],
  exports: [...components],
  providers: [
    AuthGuard,
    GenericHttpService,
    LocalStorageService
  ]
})
export class SharedModule { }
