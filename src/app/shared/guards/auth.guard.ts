import { AuthService } from './../services/remote-api/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: AuthService
  ) {
  }

  // TODO: Change to propper config variables
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.isLoggedIn) {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
}
