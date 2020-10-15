/* import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


import { NorwegianTestComponent } from './norwegian-test/norwegian-test.component';
import { NorwegianTest2Component } from './norwegian-test2/norwegian-test2.component';
//import { LoginNoComponent as LoginLangGenericComponent } from '../../features/landing/locale/login/login-no/login-no.component';
import { LoginSVComponent as LoginLangGenericComponent } from '../../features/landing/locale/login/login-sv/login-sv.component';
import { AuthSvMockupComponent  } from '../../features/auth-sv-mockup/auth-sv-mockup.component';
import { AuthSvComponent  } from '../../features/auth-sv/auth-sv.component';
import { OffersListSvComponent as OffersListLangGenericComponent  } from '../../features/dashboard/offers/offers-list/offers-list-sv/offers-list-sv.component';

import { SharedModule } from "@shared/shared.module";



@NgModule({
  declarations: [
    NorwegianTestComponent, 
    NorwegianTest2Component, 
    LoginLangGenericComponent, 
    AuthSvMockupComponent,
    AuthSvComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [NorwegianTestComponent,NorwegianTest2Component, LoginLangGenericComponent]
})
export class NorwegianModule { }
 */