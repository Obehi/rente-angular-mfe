import { Component, Input, OnInit } from '@angular/core';
import { OfferInfo, Offers } from '../../../../../../shared/models/offers';
import { OfferCardService } from '../../offer-card.service';

@Component({
  selector: 'din-bank-buttons',
  templateUrl: './din-bank-buttons.component.html',
  styleUrls: ['./din-bank-buttons.component.scss']
})
export class DinBankButtonsComponent implements OnInit {
  @Input() offer: OfferInfo;
  @Input() offersInfo: Offers;
  constructor(public offerCardService: OfferCardService) {}

  ngOnInit(): void {}

  get isMobile(): boolean {
    return window.innerWidth < 600;
  }
}
