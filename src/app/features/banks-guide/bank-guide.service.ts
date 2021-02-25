import { Injectable } from '@angular/core';
import { ROUTES_MAP_NO } from '@config/routes-config';
import { Router } from '@angular/router';
import {
  BankList,
  BankVo,
  MissingBankList,
  LegacyBanks
} from '@shared/models/bank';

@Injectable({
  providedIn: 'root'
})
export class BankGuideService {
  banks: BankVo[];
  allBanks: BankVo[];
  banksData = [...BankList, ...MissingBankList, ...LegacyBanks];
  searchStr = '';
  sparebankIsClicked = false;
  options: any[];
  public shouldDisplayBankList = false;

  constructor(private router: Router) {
    this.sortBanks();
    this.filterBank(this.searchStr);
  }

  filterBank(filter: string) {
    let filteredBanks = [];
    if (filter === null || filter?.length === 0) {
      filteredBanks = this.allBanks.concat();
    } else {
      const f = filter?.toLocaleLowerCase();
      filteredBanks = this.allBanks.filter(
        (bank) => bank.label?.toLocaleLowerCase().indexOf(f) > -1
      );
    }
    this.banks = filteredBanks;
  }

  onFilterChanged() {
    if (this.searchStr.toLocaleLowerCase() === 'sparebank 1') {
      this.removeSparebank();
    }
    if (this.sparebankIsClicked === true) {
      this.sparebankIsClicked = false;
      this.sortBanks();
    }
    this.filterBank(this.searchStr);
  }

  selectBank(bank: BankVo) {
    if (bank.name === 'SPAREBANK_1') {
      this.searchStr = 'Sparebank 1';

      this.removeSparebank();
      this.sparebankIsClicked = true;
      this.filterBank(this.searchStr);
      return;
    }

    this.shouldDisplayBankList = false;
    this.router.navigate([ROUTES_MAP_NO.banksGuide, bank.name.toLowerCase()]);
  }

  sortBanks() {
    const sortedBanksAlphabetic = [
      ...BankList,
      ...MissingBankList,
      ...LegacyBanks
    ].sort((a, b) => (a.label > b.label ? 1 : b.label > a.label ? -1 : 0));
    const dnb = 'DNB';
    const sparebank = 'SPAREBANK_1';
    const nordea = 'NORDEA';

    const sortedBanksSpareBankFirst = sortedBanksAlphabetic.sort((x, y) => {
      return x.name === sparebank ? -1 : y.name === sparebank ? 1 : 0;
    });
    const sortedBanksNoredaFirst = sortedBanksSpareBankFirst.sort((x, y) => {
      return x.name === nordea ? -1 : y.name === nordea ? 1 : 0;
    });

    const sortedBanksDNBFirst = sortedBanksNoredaFirst.sort((x, y) => {
      return x.name === dnb ? -1 : y.name === dnb ? 1 : 0;
    });

    this.allBanks = sortedBanksDNBFirst;
  }

  clear() {
    this.searchStr = '';
    this.filterBank(this.searchStr);
  }

  removeSparebank() {
    const sparebank = 'SPAREBANK_1';

    this.allBanks = this.allBanks.filter((bank) => {
      return bank.name !== sparebank;
    });
  }
}
