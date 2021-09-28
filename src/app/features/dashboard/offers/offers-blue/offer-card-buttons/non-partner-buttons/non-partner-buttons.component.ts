import { Component, Input, OnInit } from '@angular/core';
import { OfferInfo, Offers } from '@models/offers';
import { ButtonComponent } from '@shared/components/ui-components/button/button.component';

@Component({
  selector: 'non-partner-buttons',
  templateUrl: './non-partner-buttons.component.html',
  styleUrls: ['./non-partner-buttons.component.scss']
})
export class NonPartnerButtonsComponent implements OnInit {
  @Input() offer: OfferInfo;
  @Input() offersInfo: Offers;
  constructor() {}

  ngOnInit(): void {}
}
