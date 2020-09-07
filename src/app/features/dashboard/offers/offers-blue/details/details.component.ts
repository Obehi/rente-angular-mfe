import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { OfferInfo } from '@shared/models/offers';

@Component({
  selector: 'rente-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponentBlue implements OnInit {

  @Input() offer: OfferInfo;
  @Output() closeClicked = new EventEmitter();

  constructor() {}

  ngOnInit() {
  }

  public onClick(bigBoolean) {
    this.closeClicked.emit(bigBoolean)
  }

}
