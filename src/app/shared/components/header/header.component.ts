import { AuthService } from '@services/remote-api/auth.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

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
              style({ height: 200, opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ height: 200, opacity: 1 }),
            animate('0.5s ease-in',
              style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class HeaderComponent implements OnInit {
  toggleNavbar: boolean = false;
  smallScreen: boolean;

  constructor(
    public auth: AuthService
  ) {
    if (window.innerWidth <= 1000) {
      this.smallScreen = true;
    } else {
      this.smallScreen = false;
    }
  }

  ngOnInit() {
  }

  public toggleNav() {
    this.toggleNavbar = !this.toggleNavbar;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    if (window.innerWidth <= 1000) {
      this.smallScreen = true;
    } else {
      this.smallScreen = false;
    }
  }

}
