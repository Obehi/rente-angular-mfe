import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES_MAP } from '@config/routes-config';
import { EnvService } from '@services/env.service';
import { Offers } from '@shared/models/offers';

@Component({
  selector: 'box-grid',
  templateUrl: './box-grid.component.html',
  styleUrls: ['./box-grid.component.scss']
})
export class BoxGridComponent implements OnInit {
  @Input() offersInfo: Offers;
  public envService: EnvService;
  public isSweden: boolean;

  constructor(private router: Router) {}

  ngOnInit() {}

  get isMobile(): boolean {
    return window.innerWidth < 600;
  }

  public goToBestOffer(): void {
    const element = document.getElementById('best-offers-text');
    const headerOffset = this.isMobile ? 80 : 180;

    if (element === null) {
      return;
    }

    const elementPosition =
      element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  public goToProperty(): void {
    this.router.navigate(['/dashboard/' + ROUTES_MAP.property]);
  }

  public goToLoans(): void {
    this.router.navigate(['/dashboard/' + ROUTES_MAP.loans]);
  }
}
