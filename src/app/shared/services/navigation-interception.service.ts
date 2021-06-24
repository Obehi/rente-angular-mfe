import { Injectable } from '@angular/core';
import { LocationStrategy } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NavigationInterceptionService {
  private backButtonCallback: () => void;

  constructor(private location: LocationStrategy) {
    // preventing back button in browser implemented by "Samba Siva"
    history.pushState(null, '', window.location.href);
    this.location.onPopState(() => {
      this.backButtonCallback && this.backButtonCallback();
      history.pushState(null, '', window.location.href);
    });
  }

  public setBackButtonCallback(callback: () => void): void {
    this.backButtonCallback = callback;
  }
}
