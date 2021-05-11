import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ROUTES_MAP } from '@config/routes-config';
import { locale } from '../../.././config/locale/locale';
import { environment } from '@environments/environment';
import { GlobalStateService } from '@services/global-state.service';
import { startWith, take } from 'rxjs/operators';

@Component({
  selector: 'rente-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public routes = ROUTES_MAP;
  isSweden: boolean;
  public env = environment;

  constructor(
    public router: Router,
    private globalStateService: GlobalStateService
  ) {}
  shouldShowFooter = true;

  ngOnInit(): void {
    if (locale.includes('sv')) {
      this.isSweden = true;
    } else {
      this.isSweden = false;
    }

    this.globalStateService
      .getFooterState()
      .pipe(take(1), startWith(true))
      .subscribe((state) => {
        this.shouldShowFooter = state;
      });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.shouldShowFooter = event.url !== '/messenger-share';
      }
    });
  }
}
