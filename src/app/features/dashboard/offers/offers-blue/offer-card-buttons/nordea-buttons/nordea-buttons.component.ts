import { Component, Input, OnInit } from '@angular/core';
import { OfferInfo, Offers } from '@models/offers';

@Component({
  selector: 'nordea-buttons',
  templateUrl: './nordea-buttons.component.html',
  styleUrls: ['./nordea-buttons.component.scss']
})
export class NordeaButtonsComponent implements OnInit {
  @Input() offer: OfferInfo;
  @Input() offersInfo: Offers;
  constructor() {}

  ngOnInit(): void {}
}
