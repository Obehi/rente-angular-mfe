import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { OfferCardService } from '@features/dashboard/offers/offers-blue/offer-card.service';
import { OffersService } from '@features/dashboard/offers/offers.service';
import { OfferInfo, Offers } from '@models/offers';
import { CustomLangTextService } from '@services/custom-lang-text.service';
import { TrackingService } from '@services/remote-api/tracking.service';
import { BankUtils } from '@shared/models/bank';
import { BankVo } from '../../../../shared/models/bank';

@Component({
  selector: 'rente-initial-offer',
  templateUrl: './initial-offer.component.html',
  styleUrls: ['./initial-offer.component.scss']
})
export class InitialOfferComponent implements OnInit {
  @Input() offer: OfferInfo;
  @Input() offersInfo: Offers;
  @Input() index: number;
  public currentOfferInfo: Offers;
  public bankSpecialPromoText: string | null = null;
  bank: BankVo | null;
  expandStatus: boolean;

  constructor(
    private trackingService: TrackingService,
    public dialog: MatDialog,
    private router: Router,
    public customLangTextSerice: CustomLangTextService,
    private offersService: OffersService,
    public offerCardService: OfferCardService
  ) {}

  ngOnInit(): void {
    this.bank = BankUtils.getBankByName(this.offer.bankInfo.bank);
    if (this.bank !== null) {
      this.bank.icon = BankUtils.getBankPngIcon(
        this.bank.name,
        '../../../../../assets/img/banks-logo/'
      );
    }

    if (this.offer.bankInfo.score === null) this.offer.bankInfo.score = 3;

    this.bankSpecialPromoText = this.getBankSpecialPromoText();
  }

  public detailOpenClicked(): void {
    this.expandStatus = true;
  }

  public getBankSpecialPromoText(): string | null {
    if (this.offer.bankInfo.bank === 'BULDER') {
      return 'Gir kundeutbytte';
    }
    return null;
  }
}
