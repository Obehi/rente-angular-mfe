import { Component, Input, OnInit } from '@angular/core';
import { OfferInfo, Offers } from '@models/offers';

@Component({
  selector: 'bulder-buttons',
  templateUrl: './bulder-buttons.component.html',
  styleUrls: ['./bulder-buttons.component.scss']
})
export class BulderButtonsComponent implements OnInit {
  @Input() offer: OfferInfo;
  @Input() offersInfo: Offers;
  constructor() {}

  ngOnInit() {}
}
