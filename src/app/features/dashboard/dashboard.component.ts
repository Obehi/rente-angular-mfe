import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
@Component({
  selector: 'rente-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit, OnDestroy {

  constructor(private router: Router) { }

  public navLinks = ['tilbud', 'mine-lan', 'bolig', 'preferanser', 'profil'];
  public activeLinkIndex = -1;
  private subscription: any;

  ngOnInit(): void {
    this.activeLinkIndex = this.getActiveIndex();
    this.subscription = this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.getActiveIndex();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public getActiveIndex(): number {
    return this.navLinks.indexOf(this.navLinks.find(link => `/dashboard/${link}` === this.router.url));
  }
}
