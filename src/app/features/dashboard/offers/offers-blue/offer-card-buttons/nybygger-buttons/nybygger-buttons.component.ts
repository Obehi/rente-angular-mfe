import { Component, Input, OnInit } from '@angular/core';
import { OfferInfo, Offers } from '../../../../../../shared/models/offers';
import { OfferCardService } from '../../offer-card.service';

@Component({
  selector: 'nybygger-buttons',
  templateUrl: './nybygger-buttons.component.html',
  styleUrls: ['./nybygger-buttons.component.scss']
})
export class NybyggerButtonsComponent implements OnInit {
  @Input() offer: OfferInfo;
  @Input() offersInfo: Offers;
  constructor(public offerCardService: OfferCardService) {}

  ngOnInit(): void {}
}
