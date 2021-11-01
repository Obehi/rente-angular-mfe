import { Component, Input, OnInit } from '@angular/core';
import {
  OfferMessage,
  OffersService
} from '@features/dashboard/offers/offers.service';
import { OfferInfo, Offers } from '@models/offers';
import { LoggingService } from '@services/logging.service';
import { BankUtils, BankVo } from '@models/bank';
@Component({
  selector: 'nordea-buttons',
  templateUrl: './nordea-buttons.component.html',
  styleUrls: ['./nordea-buttons.component.scss']
})
export class NordeaButtonsComponent implements OnInit {
  @Input() offer: OfferInfo;
  @Input() offersInfo: Offers;

  buttonColor: string;

  private currentBank: BankVo | null;
  public isNordea = false;
  public isDanskeBank = false;
  constructor(
    private loggingService: LoggingService,
    private offersService: OffersService
  ) {}

  ngOnInit(): void {
    if (!this.offersInfo) {
      return;
    }
    this.currentBank = BankUtils.getBankByName(this.offersInfo.bank);

    this.isNordea = this.currentBank?.name === 'NORDEA';
    this.isDanskeBank = this.currentBank?.name === 'DANSKE_BANK';

    this.buttonColor =
      this.offersInfo.bank === 'NORDEA'
        ? 'secondary-semi-wide'
        : 'danskebank-semi-wide';
  }

  get bankName(): string {
    if (!this.offersInfo) {
      return 'banken din';
    }
    const bankVo = BankUtils.getBankByName(this.offersInfo.bank);
    return bankVo?.label ?? 'banken din';
  }

  get isMobile(): boolean {
    return window.innerWidth < 600;
  }

  public clickAntiChurn(): void {
    this.loggingService.googleAnalyticsLog({
      category: `Antichurn ${this.currentBank?.label ?? 'Ukjent bank'}`,
      action: 'Antichurn - offercard',
      label: `top offer: ${this.offersInfo.offers.top5[0].bankInfo.name}`
    });

    this.offersService.pushMessage(OfferMessage.antiChurn);
  }
}
