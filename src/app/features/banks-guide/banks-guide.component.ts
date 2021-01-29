import { Component, OnInit } from '@angular/core';
import { BankList, BankVo, MissingBankList } from '@shared/models/bank';
import { ROUTES_MAP_NO } from '@config/routes-config';
import { Router } from '@angular/router';

@Component({
  selector: 'rente-banks-guide',
  templateUrl: './banks-guide.component.html',
  styleUrls: ['./banks-guide.component.scss']
})
export class BanksGuideComponent implements OnInit {
  banks: BankVo[];
  allBanks: BankVo[];
  banksData = [...BankList, ...MissingBankList];
  searchStr = '';
  sparebankIsClicked = false;
  options: any[];
  shouldDisplayBankList = false;

  constructor(private router: Router) {}

  get isMobile(): boolean {
    return window.innerWidth < 600;
  }

  ngOnInit(): void {
    this.sortBanks();
    this.filterBank(this.searchStr);
    // this.options = Object.values(this.banksData).map(bank => bank).filter(bank => bank.name !=== 'SPAREBANK_1');
    // this.filteredBanks$ = this.banks.valueChanges
    //   .pipe(startWith(''), map(value => this._filter(value)));
  }

  // private _filter(value: string | { name: string }): string[] {
  //   const filterValue: string;
  //   if (typeof value ==== 'string') {
  //     filterValue = value.toLowerCase();
  //   } else {
  //     filterValue = value.name.toLowerCase();
  //   }
  //   return this.options.filter(option => option.label.toLowerCase().includes(filterValue)).slice(0, 10);
  // }

  sortBanks() {
    const sortedBanksAlphabetic = [
      ...BankList,
      ...MissingBankList
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

  removeSparebank() {
    const sparebank = 'SPAREBANK_1';

    this.allBanks = this.allBanks.filter((bank) => {
      return bank.name !== sparebank;
    });
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

  clear() {
    this.searchStr = '';
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

  selectBank(bank: BankVo) {
    if (bank.name === 'SPAREBANK_1') {
      this.searchStr = 'Sparebank 1';

      this.removeSparebank();
      this.sparebankIsClicked = true;
      this.filterBank(this.searchStr);
      return;
    }

    this.router.navigate([ROUTES_MAP_NO.banksGuide, bank.name.toLowerCase()]);
  }
}
