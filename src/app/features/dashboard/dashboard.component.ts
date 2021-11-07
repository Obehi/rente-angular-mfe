import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { GlobalStateService } from '@services/global-state.service';


@Component({
  selector: 'rente-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, OnDestroy {
  constructor(private globalStateService: GlobalStateService) {}

  ngOnInit(): void {
    this.globalStateService.setDashboardState(true);
    this.globalStateService.setContentClassName('content', 'content-dashboard');
  }

  get isMobile(): boolean {
    return window.innerWidth < 992;
  }

  onActivate(): void {
    window.scrollTo(0, 0);
  }

  ngOnDestroy(): void {
    this.globalStateService.setDashboardState(false);
    this.globalStateService.setContentClassName('content-dashboard', 'content');
  }
}
