import { Injectable } from '@angular/core';
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

  constructor() {
    this.sortBanks();
    this.removeNordeaDirectSubMembership();
    this.filterBank(this.searchStr);
  }

  filterBank(filter: string): void {
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

  onFilterChanged(): void {
    if (this.searchStr.toLocaleLowerCase() === 'sparebank 1') {
      this.removeSparebank();
    }

    if (this.sparebankIsClicked === true) {
      this.sparebankIsClicked = false;
      this.sortBanks();
    }
    this.filterBank(this.searchStr);
  }

  selectBank(bank: BankVo): void {
    this.shouldDisplayBankList = false;
    if (bank.name === 'SPAREBANK_1') {
      this.searchStr = 'Sparebank 1';

      this.removeSparebank();
      this.sparebankIsClicked = true;
      this.filterBank(this.searchStr);
      return;
    }
  }

  sortBanks(): void {
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

  clear(): void {
    this.searchStr = '';
    this.filterBank(this.searchStr);
  }

  removeSparebank(): void {
    const sparebank = 'SPAREBANK_1';

    this.allBanks = this.allBanks.filter((bank) => {
      return bank.name !== sparebank;
    });
  }

  removeNordeaDirectSubMembership(): void {
    const ys = 'YS (Nordea Direct)';
    const unio = 'UNIO (Nordea Direct)';
    const nal = 'NAL (Nordea Direct)';

    this.allBanks = this.allBanks.filter((bank) => {
      return bank.label !== ys && bank.label !== unio && bank.label !== nal;
    });
  }
}
