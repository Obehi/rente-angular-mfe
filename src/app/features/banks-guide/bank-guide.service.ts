import { Injectable } from '@angular/core';
import { ROUTES_MAP_NO } from '@config/routes-config';
import { Router } from '@angular/router';
import {
  BankList,
  BankVo,
  MissingBankList,
  TinkBanks,
  LegacyBanks
} from '@shared/models/bank';

@Injectable({
  providedIn: 'root'
})
export class BankGuideService {
  banks: BankVo[];
  allBanks: BankVo[];
  banksData = [...BankList, ...MissingBankList, ...LegacyBanks, ...TinkBanks];
  searchStr = '';
  sparebankIsClicked = false;
  options: any[];
  public shouldDisplayBankList = false;

  constructor(private router: Router) {
    this.sortBanks();
    this.filterBank(this.searchStr);
  }

  filterBank(filter: string) {
    let filteredBanks: BankVo[] = [];
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
    this.shouldDisplayBankList = false;
    if (bank.name === 'SPAREBANK_1') {
      this.searchStr = 'Sparebank 1';

      this.removeSparebank();
      this.sparebankIsClicked = true;
      this.filterBank(this.searchStr);
      return;
    }
    // this.router.navigate([ROUTES_MAP_NO.banksGuide, bank.name.toLowerCase()]);
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
    const danskeAkademikerene = 'AKADEMIKERNE_DANSKE';
    const sparebankOne = 'SPAREBANK_1';
    const specialCaseBanks = {};

    sortedBanksAlphabetic.forEach((bank, index) => {
      if (
        bank.name === dnb ||
        bank.name === sparebank ||
        bank.name === nordea ||
        bank.name === danskeAkademikerene
      ) {
        specialCaseBanks[bank.name] = bank;
        sortedBanksAlphabetic.splice(index, 1);
      }
    });

    this.allBanks = [
      specialCaseBanks[dnb],
      specialCaseBanks[nordea],
      ...TinkBanks,
      ...sortedBanksAlphabetic
    ];
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
