import { Component, Input, OnInit } from '@angular/core';
import { OfferInfo, Offers } from '@models/offers';
import { OfferCardService } from '../../offer-card.service';

@Component({
  selector: 'bulder-buttons',
  templateUrl: './bulder-buttons.component.html',
  styleUrls: ['./bulder-buttons.component.scss']
})
export class BulderButtonsComponent implements OnInit {
  @Input() offer: OfferInfo;
  @Input() offersInfo: Offers;

  constructor(public offerCardService: OfferCardService) {}

  ngOnInit(): void {}

  get isMobile(): boolean {
    return window.innerWidth < 600;
  }

  get isNordea(): boolean {
    return this.offersInfo.bank === 'NORDEA';
  }
}
