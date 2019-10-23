import { AuthService } from '@services/remote-api/auth.service';
import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
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
            animate('0.2s ease-out',
              style({ height: 200, opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ height: 200, opacity: 1 }),
            animate('0.2s ease-in',
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
  @ViewChild('navBarButton', { static: false }) navBarButton: ElementRef<HTMLElement>;

  constructor(
    public auth: AuthService,
    public localStorageService: LocalStorageService
  ) {
    this.isSmallScreen = window.innerWidth <= 991;
  }

  ngOnInit() {
  }

  public toggleNav() {
    this.toggleNavbar = !this.toggleNavbar;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.isSmallScreen = window.innerWidth <= 991;
  }

  @HostListener('window:click', ['$event.target'])
  onClick(targetElement: HTMLElement) {
    if (targetElement !== this.navBarButton.nativeElement) {
      this.toggleNavbar = false;
    }
  }
}
