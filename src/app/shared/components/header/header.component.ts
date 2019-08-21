import { AuthService } from '@services/remote-api/auth.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { LocalStorageService } from '@services/local-storage.service';

@Component({
  selector: 'rente-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ height: 0, opacity: 0 }),
            animate('0.5s ease-out',
              style({ height: 150, opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ height: 150, opacity: 1 }),
            animate('0.5s ease-in',
              style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class HeaderComponent implements OnInit {
  public toggleNavbar: boolean;
  public isSmallScreen: boolean;

  constructor(
    public auth: AuthService,
    public localStorageService: LocalStorageService
  ) {
    this.isSmallScreen = window.innerWidth <= 1000;
  }

  ngOnInit() {
  }

  public toggleNav() {
    this.toggleNavbar = !this.toggleNavbar;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.isSmallScreen = window.innerWidth <= 1000;
  }

}
