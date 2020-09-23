import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { OfferInfo } from '@shared/models/offers';

@Component({
  selector: 'rente-details-blue',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponentBlue implements OnInit {

  @Input() offer: OfferInfo;
  @Output() closeClicked = new EventEmitter();

  constructor() {}

  ngOnInit() {
    if(this.offer.establishmentFee == undefined) {
      this.offer.establishmentFee = 0;
    }
  }

  public onClick(bigBoolean) {
    this.closeClicked.emit(bigBoolean)
  }

}
