import { Component, Input, OnInit } from '@angular/core';
import { OfferInfo, Offers } from '../../../../../../shared/models/offers';

@Component({
  selector: 'non-partner-buttons',
  templateUrl: './non-partner-buttons.component.html',
  styleUrls: ['./non-partner-buttons.component.scss']
})
export class NonPartnerButtonsComponent implements OnInit {
  @Input() offer: OfferInfo;
  @Input() offersInfo: Offers;
  disabled = true;
  constructor() {}

  ngOnInit(): void {}

  get isMobile(): boolean {
    return window.innerWidth < 600;
  }
}
