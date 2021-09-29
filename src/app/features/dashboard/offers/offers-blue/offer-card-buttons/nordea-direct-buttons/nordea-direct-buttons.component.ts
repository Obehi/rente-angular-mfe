import { Component, Input, OnInit } from '@angular/core';
import { OfferInfo, Offers } from '@models/offers';

@Component({
  selector: 'nordea-direct-buttons',
  templateUrl: './nordea-direct-buttons.component.html',
  styleUrls: ['./nordea-direct-buttons.component.scss']
})
export class NordeaDirectButtonsComponent implements OnInit {
  @Input() offer: OfferInfo;
  @Input() offersInfo: Offers;
  constructor() {}

  ngOnInit(): void {}
}
