import { Component, Input, OnInit } from '@angular/core';
import { OfferInfo, Offers } from '@models/offers';
import { OfferCardService } from '../../offer-card.service';

@Component({
  selector: 'nordea-direct-buttons',
  templateUrl: './nordea-direct-buttons.component.html',
  styleUrls: ['./nordea-direct-buttons.component.scss']
})
export class NordeaDirectButtonsComponent implements OnInit {
  @Input() offer: OfferInfo;
  @Input() offersInfo: Offers;
  constructor(public offerCardService: OfferCardService) {}

  ngOnInit(): void {}

  get isMobile(): boolean {
    return window.innerWidth < 600;
  }
}
