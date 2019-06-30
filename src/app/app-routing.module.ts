import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '@features/page-not-found/page-not-found.component';
import { AboutUsComponent } from '@features/about-us/about-us.component';
import { ROUTES_MAP } from '@config/routes-config';

const routes: Routes = [
  { path: ROUTES_MAP.aboutUs, component: AboutUsComponent},
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
