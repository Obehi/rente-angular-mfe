import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from './guards/auth.guard';
import { LocalStorageService } from '@services/local-storage.service';
import { GenericHttpService } from '@services/generic-http.service';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
// import { GenericHttpService } from '@services/generic-http.service';
// import { LocalStorageService } from '@services/local-storage.service';


@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
  providers: [
    AuthGuard,
    GenericHttpService,
    LocalStorageService
  ]
})
export class SharedModule { }
