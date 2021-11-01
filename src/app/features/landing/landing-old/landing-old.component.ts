import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';

import { locale } from '@config/locale/locale';
import { SeoService } from '@services/seo.service';

@Component({
  selector: 'rente-landing-old',
  templateUrl: './landing-old.component.html',
  styleUrls: ['./landing-old.component.scss']
})
export class LandingOldComponent implements OnInit {
  time = 0;
  isSweden = false;

  get isMobile(): boolean {
    return window.innerWidth < 600;
  }

  constructor(private seoService: SeoService) {
    if (locale.includes('sv')) {
      this.isSweden = true;
    } else {
      this.isSweden = false;
    }
  }

  ngOnInit(): void {
    this.seoService.createLinkForCanonicalURL();
    const subscription = timer(1000, 1000).subscribe((t) => {
      this.time = t;
      if (t === 3) {
        subscription.unsubscribe();
      }
    });
  }
}
