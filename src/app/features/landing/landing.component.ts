import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { locale } from '@config/locale/locale';
import { SeoService } from '@services/seo.service';
import { GlobalStateService } from '@services/global-state.service';
@Component({
  selector: 'rente-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('0.5s ease-out', style({ height: 300, opacity: 1 }))
      ]),
      transition(':leave', [
        style({ height: 300, opacity: 1 }),
        animate('0.5s ease-in', style({ height: 0, opacity: 0 }))
      ])
    ])
  ]
})
export class LandingComponent implements OnInit {
  time = 0;
  isSweden = false;
  get isMobile(): boolean {
    return window.innerWidth < 600;
  }

  constructor(
    private seoService: SeoService,
    private globalStateService: GlobalStateService
  ) {
    if (locale.includes('sv')) {
      this.isSweden = true;
    } else {
      this.isSweden = false;
    }
  }

  ngOnInit(): void {
    this.globalStateService.setHeaderState(true);
    this.seoService.createLinkForCanonicalURL();
    const subscription = timer(1000, 1000).subscribe((t) => {
      this.time = t;
      if (t === 3) {
        subscription.unsubscribe();
      }
    });
  }
}
