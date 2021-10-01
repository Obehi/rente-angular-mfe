import { Component, Input, OnInit } from '@angular/core';
import {
  OfferMessage,
  OffersService
} from '@features/dashboard/offers/offers.service';
import { OfferInfo, Offers } from '@models/offers';
import { LoggingService } from '@services/logging.service';

@Component({
  selector: 'nordea-buttons',
  templateUrl: './nordea-buttons.component.html',
  styleUrls: ['./nordea-buttons.component.scss']
})
export class NordeaButtonsComponent implements OnInit {
  @Input() offer: OfferInfo;
  @Input() offersInfo: Offers;
  constructor(
    private loggingService: LoggingService,
    private offersService: OffersService
  ) {}

  ngOnInit(): void {}

  get isMobile(): boolean {
    return window.innerWidth < 600;
  }

  public clickNordea(): void {
    this.loggingService.googleAnalyticsLog({
      category: 'NordeaAntiChurn',
      action: 'Click offer card anti-churn',
      label: `top offer: ${this.offersInfo.offers.top5[0].bankInfo.name}`
    });
    this.offersService.pushMessage(OfferMessage.antiChurn);
  }
}
