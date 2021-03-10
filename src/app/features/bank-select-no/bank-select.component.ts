import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  BankVo,
  BankList,
  MissingBankList,
  TinkBanks,
  LegacyBanks
} from '../../shared/models/bank';
import { Router } from '@angular/router';
import { ROUTES_MAP } from '@config/routes-config';
import { Injectable } from '@angular/core';
import { EnvService } from '@services/env.service';
@Component({
  selector: 'rente-bank-select-variation',
  templateUrl: './bank-select.component.html',
  styleUrls: ['./bank-select.component.scss']
})
export class BankSelectNoComponent implements OnInit {
  @ViewChild('searchElement') searchElement;
  searchStr: string;
  banks: BankVo[];
  allBanks: BankVo[];

  sparebankIsClicked = false;

  constructor(private router: Router, private envService: EnvService) {}

  ngOnInit() {
    this.sortBanks();
    this.filterBank(this.searchStr);
  }

  ngAfterViewInit() {
    this.searchElement.nativeElement.focus();
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
    const specialCaseBanks = {};

    sortedBanksAlphabetic.forEach((bank, index) => {
      if (
        bank.name === dnb ||
        bank.name === sparebank ||
        bank.name === nordea
      ) {
        specialCaseBanks[bank.name] = bank;
        sortedBanksAlphabetic.splice(index, 1);
      }
    });

    this.allBanks = [
      specialCaseBanks[dnb],
      specialCaseBanks[nordea],
      specialCaseBanks[sparebank],
      ...TinkBanks,
      ...sortedBanksAlphabetic
    ];
  }

  removeSparebank(): void {
    const sparebank = 'SPAREBANK_1';

    this.allBanks = this.allBanks.filter(function (bank) {
      return bank.name !== sparebank;
    });
  }

  onFilterChanged(): void {
    if (this.searchStr.toLocaleLowerCase() == 'sparebank 1') {
      this.removeSparebank();
    }
    if (this.sparebankIsClicked == true) {
      this.sparebankIsClicked = false;
      this.sortBanks();
    }
    this.filterBank(this.searchStr);
  }

  clear() {
    this.searchStr = '';
    this.filterBank(this.searchStr);
  }

  filterBank(filter: string): void {
    let filteredBanks = [];
    if (filter == null || filter.length === 0) {
      filteredBanks = this.allBanks.concat();
    } else {
      const f = filter.toLocaleLowerCase();
      filteredBanks = this.allBanks.filter(
        (bank) => bank.label.toLocaleLowerCase().indexOf(f) > -1
      );
    }

    this.banks = filteredBanks;
  }

  selectBank(bank: BankVo): void {
    if (bank.name == 'SPAREBANK_1') {
      this.searchStr = 'Sparebank 1';

      this.removeSparebank();
      this.sparebankIsClicked = true;
      this.filterBank(this.searchStr);
      return;
    }

    if (bank.isMissing || this.envService.isMissing(bank)) {
      this.router.navigate([ROUTES_MAP.getNotified], { state: { bank: bank } });
    } else {
      this.router.navigate([
        ROUTES_MAP.auth + '/' + bank.name.toLocaleLowerCase()
      ]);
    }
  }
}
