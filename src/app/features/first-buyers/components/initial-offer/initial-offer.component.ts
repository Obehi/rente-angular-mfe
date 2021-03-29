import { Component, Input, OnInit } from '@angular/core';
import { BankUtils } from '@shared/models/bank';
import { BankVo } from '../../../../shared/models/bank';

@Component({
  selector: 'rente-initial-offer',
  templateUrl: './initial-offer.component.html',
  styleUrls: ['./initial-offer.component.scss']
})
export class InitialOfferComponent implements OnInit {
  @Input() offer;
  bank: BankVo;
  expandStatus: boolean;

  ngOnInit(): void {
    this.bank = BankUtils.getBankByName(this.offer.bankInfo.bank);
    this.bank.icon = BankUtils.getBankPngIcon(
      this.bank.name,
      '../../../../../assets/img/banks-logo/'
    );

    if (this.offer.bankInfo.score === null) this.offer.bankInfo.score = 3;
  }

  public detailOpenClicked(): void {
    this.expandStatus = true;
  }
}
