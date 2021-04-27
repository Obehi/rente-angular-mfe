import { Injectable } from '@angular/core';
import { LocationStrategy } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NavigationInterceptionService {
  constructor(private location: LocationStrategy) {
    // preventing back button in browser implemented by "Samba Siva"
    history.pushState(null, '', window.location.href);
    this.location.onPopState(() => {
      history.pushState(null, '', window.location.href);
    });
  }
}
