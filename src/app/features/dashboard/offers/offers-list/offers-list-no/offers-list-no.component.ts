import { Component, OnInit, Input } from '@angular/core';
import { Offers } from './../../../../../shared/models/offers';
import { OptimizeService } from '@services/optimize.service';

@Component({
  selector: 'rente-offers-list',
  templateUrl: './offers-list-no.component.html',
  styleUrls: ['./offers-list-no.component.scss']
})
export class OffersListNoComponent implements OnInit {
  @Input() offersInfo: Offers;
  public currentOfferInfo: Offers;
  isV1 = true;

  constructor(public optimizeService: OptimizeService) {}
  public setV1(): void {
    this.isV1 = true;
  }

  public setV2(): void {
    this.isV1 = false;
  }
  get isMobile(): boolean {
    return window.innerWidth < 600;
  }
  public currentOfferType: string;

  ngOnInit(): void {
    console.log('list no ');
    console.log(this.optimizeService.getVariation());
    this.currentOfferInfo = JSON.parse(JSON.stringify(this.offersInfo));
    this.currentOfferType = 'all';

    let flag = false;
    this.offersInfo.offers.top5 = this.offersInfo.offers.top5.map((offer) => {
      offer.loanType = flag ? 'threeMonths' : 'oneYear';
      flag = !flag;
      return offer;
    });
  }

  public setOfferType(type: string): void {
    this.currentOfferType = type;

    if (type === 'all') {
      this.currentOfferInfo.offers.top5 = this.offersInfo.offers.top5;
      return;
    }
    const newLoanTypeSelected = this.offersInfo.offers.top5.filter((item) => {
      return item.loanType === type;
    });

    this.currentOfferInfo.offers.top5 = newLoanTypeSelected;
  }
}
