import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { OfferInfo } from '@shared/models/offers';

@Component({
  selector: 'rente-offer-card-details',
  templateUrl: './details-sv.component.html',
  styleUrls: ['./details-sv.component.scss']
})
export class OfferDetailsSvComponent implements OnInit {
  @Input() offer: OfferInfo;
  @Input() align: string;
  @Output() closeClicked = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    // An alternative for the check could be typeof establishFee === 'undefined's
    // eslint-disable-next-line eqeqeq
    if (this.offer.establishmentFee == undefined) {
      this.offer.establishmentFee = 0;
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public onClick(bigBoolean): void {
    this.closeClicked.emit(bigBoolean);
  }
}
