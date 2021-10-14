import { Component, HostListener, OnInit } from '@angular/core';
import {
  BankVo,
  BankList,
  MissingBankList,
  TinkBanks,
  LegacyBanks
} from '../../shared/models/bank';
import { Router } from '@angular/router';
import { ROUTES_MAP, ROUTES_MAP_NO } from '@config/routes-config';
import { EnvService } from '@services/env.service';
import { LocalStorageService } from '@services/local-storage.service';

@Component({
  selector: 'rente-bank-select-variation',
  templateUrl: './bank-select.component.html',
  styleUrls: ['./bank-select.component.scss']
})
export class BankSelectNoComponent implements OnInit {
  searchStr: string;
  banks: BankVo[];
  allBanks: BankVo[];
  sparebankIsClicked = false;

  constructor(private router: Router, private envService: EnvService) {}

  ngOnInit(): void {
    this.sortBanks();
    this.filterBank(this.searchStr);
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
    const sbanken = 'SBANKEN';
    const specialCaseBanks = {};

    sortedBanksAlphabetic.forEach((bank, index) => {
      if (
        bank.name === dnb ||
        bank.name === sparebank ||
        bank.name === nordea ||
        bank.name === sbanken
      ) {
        specialCaseBanks[bank.name] = bank;
        sortedBanksAlphabetic.splice(index, 1);
      }
    });

    const nonMembershipBanks = sortedBanksAlphabetic.filter((bank) => {
      return bank.name === 'TOBB' ||
        bank.name === 'USBL' ||
        bank.name === 'BATE' ||
        bank.name === 'SYKEPLEIERFORBUND_DNB' ||
        bank.name === 'YS_NORDEA_DIRECT' ||
        bank.name === 'NAL_NORDEA_DIRECT' ||
        bank.name === 'UNIO_NORDEA_DIRECT' ||
        bank.name === 'AKADEMIKERNE_DANSKE'
        ? false
        : true;
    });

    this.allBanks = [
      specialCaseBanks[dnb],
      specialCaseBanks[nordea],
      specialCaseBanks[sparebank],
      specialCaseBanks[sbanken],
      ...TinkBanks,
      ...nonMembershipBanks
    ];
  }

  removeSparebank(): void {
    const sparebank = 'SPAREBANK_1';

    this.allBanks = this.allBanks.filter(function (bank) {
      return bank.name !== sparebank;
    });
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

  clear(): void {
    this.searchStr = '';
    this.filterBank(this.searchStr);
  }

  filterBank(filter: string): void {
    let filteredBanks: BankVo[] = [];
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
    if (bank.name === 'SPAREBANK_1') {
      this.searchStr = 'Sparebank 1';

      this.removeSparebank();
      this.sparebankIsClicked = true;
      this.filterBank(this.searchStr);
      return;
    }

    if (bank.name === 'SPAREBANK_1_NORDMORE') {
      bank.name = 'SPAREBANK_1_NORDVEST';
    }

    if (bank.hasSubMembership && bank.name !== 'DNB') {
      this.goToSubBankMenbership(bank);
      return;
    }

    // Remove DNB subbank functionality for now
    /*    if (
      bank.name === 'DNB' &&
      bank.hasSubMembership &&
      this.envService.environment.dnbSignicatIsOn === true
    ) {
      this.goToSubBankMenbership(bank);
      return;
    } */

    if (bank.isSigniCat && bank.isMissing === false) {
      this.router.navigate(['/autentisering/' + ROUTES_MAP_NO.bankIdLogin], {
        state: { data: { bank: bank } }
      });
      return;
    }

    if (
      bank.name === 'DNB' &&
      this.envService.environment.dnbSignicatIsOn === true
    ) {
      this.router.navigate(['/autentisering/' + ROUTES_MAP_NO.bankIdLogin], {
        state: { data: { bank: bank, userHasNoBankIDForPhone: false } }
      });
      return;
    }

    if (
      bank.isDSSBank === true &&
      this.envService.environment.dssBanksSignicatIsOn === true
    ) {
      this.router.navigate(['/autentisering/' + ROUTES_MAP_NO.bankIdLogin], {
        state: { data: { bank: bank } }
      });
      return;
    }

    if (this.envService.environment.sb1DisabledBanks?.includes(bank.name)) {
      this.router.navigate([ROUTES_MAP_NO.sparebank1Error], {
        state: { bank: bank }
      });
      return;
    }

    if (bank.isMissing || this.envService.isMissing(bank)) {
      this.router.navigate([ROUTES_MAP.getNotified], { state: { bank: bank } });
      return;
    }

    this.router.navigate([
      ROUTES_MAP.auth + '/' + bank.name.toLocaleLowerCase()
    ]);
  }

  goToSubBankMenbership(bank: BankVo): void {
    this.router.navigate(
      ['/autentisering/' + bank.name.toLocaleLowerCase() + '/' + 'medlemskap/'],
      {
        state: { data: { bank: bank } }
      }
    );
    return;
  }
}
