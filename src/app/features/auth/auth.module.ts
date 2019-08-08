import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { BankIdLoginComponent } from './bank-id-login/bank-id-login.component';
import { LoginStatusComponent } from './login-status/login-status.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { StatusMessageComponent } from './status-message/status-message.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DialogInfoServiceComponent } from './bank-id-login/dialog-info-service/dialog-info-service.component';
import { MatDialogModule } from '@angular/material';

@NgModule({
  declarations: [BankIdLoginComponent, LoginStatusComponent, StatusMessageComponent, DialogInfoServiceComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
  entryComponents: [DialogInfoServiceComponent]
})
export class AuthModule { }
