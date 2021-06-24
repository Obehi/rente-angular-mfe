import { Component, HostListener, OnInit } from '@angular/core';
import { GlobalStateService } from '@services/global-state.service';
@Component({
  selector: 'rente-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  onresize(event): void {
    this.innerWidth = event.target.innerWidth;
    if (this.innerWidth < 992) {
      this.isSmallScreen = true;
    } else {
      this.isSmallScreen = false;
    }
  }

  public toggleNavbar: boolean;
  public isSmallScreen: boolean;
  public innerWidth: any;
  public isDashboard: boolean;

  constructor(private globalStateService: GlobalStateService) {}

  ngOnInit(): void {
    this.globalStateService.getDashboardState().subscribe((state) => {
      if (state) {
        this.isDashboard = true;
      } else {
        this.isDashboard = false;
      }
    });
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 992) {
      this.isSmallScreen = true;
    } else {
      this.isSmallScreen = false;
    }
  }
}
