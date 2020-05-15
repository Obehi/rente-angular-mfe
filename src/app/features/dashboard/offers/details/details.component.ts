import { Component, OnInit, Input } from '@angular/core';
import { OfferInfo } from '@shared/models/offers';

@Component({
  selector: 'rente-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  @Input() offer: OfferInfo;
  constructor() {}

  ngOnInit() {
  
  }

}
