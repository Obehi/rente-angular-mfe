import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { OfferInfo } from '@shared/models/offers';

@Component({
  selector: 'rente-offer-card-details',
  templateUrl: './details-no.component.html',
  styleUrls: ['./details-no.component.scss']
})
export class OfferDetailsNoComponent implements OnInit {
  @Input() offer: OfferInfo;
  @Input() align: string;
  @Output() closeClicked = new EventEmitter();

  constructor() {}

  ngOnInit() {
    console.log('this.align');
    console.log(this.align);
    if (this.offer.establishmentFee == undefined) {
      this.offer.establishmentFee = 0;
    }
  }

  public onClick(bigBoolean) {
    this.closeClicked.emit(bigBoolean);
  }
}
