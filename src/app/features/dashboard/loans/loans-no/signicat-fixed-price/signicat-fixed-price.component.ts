import { Component, Input, OnInit } from '@angular/core';
import { bankOfferDto, Loans } from '@models/loans';
import { MyLoansService } from '../../myloans.service';

@Component({
  selector: 'rente-signicat-fixed-price',
  templateUrl: './signicat-fixed-price.component.html',
  styleUrls: ['./signicat-fixed-price.component.scss']
})
export class SignicatFixedPriceComponent implements OnInit {
  @Input() loanData: Loans;
  @Input() allOffers: bankOfferDto[];

  constructor(private myLoansService: MyLoansService) {}

  ngOnInit(): void {}
}
