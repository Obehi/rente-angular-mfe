import { Component, OnInit } from '@angular/core';
import { BankVo, BankList, MissingBankList } from '../../shared/models/bank';
import { Router } from '@angular/router';
import { ROUTES_MAP } from '@config/routes-config';

@Component({
  selector: 'rente-bank-select',
  templateUrl: './bank-select.component.html',
  styleUrls: ['./bank-select.component.scss']
})
export class BankSelectComponent implements OnInit {
  searchStr: string;
  banks: BankVo[];
  allBanks: BankVo[];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.allBanks = [...BankList, ...MissingBankList].sort((a, b) =>
      a.label > b.label ? 1 : b.label > a.label ? -1 : 0
    );
    this.filterBank(this.searchStr);
  }

  onFilterChanged(): void {
    this.filterBank(this.searchStr);
  }

  clear(): void {
    this.searchStr = '';
    this.filterBank(this.searchStr);
  }

  filterBank(filter: string): void {
    let filteredBanks = [];
    if (filter === null || filter.length === 0) {
      filteredBanks = this.allBanks.concat();
    } else {
      const f = filter.toLocaleLowerCase();
      filteredBanks = this.allBanks.filter(
        (bank) =>
          bank.label.toLocaleLowerCase().indexOf(f) > -1 &&
          bank.name !== 'HANDELSBANKEN'
      );
    }
    this.banks = filteredBanks;
  }

  selectBank(bank: BankVo): void {
    if (bank.isMissing) {
      this.router.navigate([ROUTES_MAP.getNotified], { state: { bank: bank } });
    } else {
      this.router.navigate([
        ROUTES_MAP.auth + '/' + bank.name.toLocaleLowerCase()
      ]);
    }
  }
}
