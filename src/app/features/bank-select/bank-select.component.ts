import { Component, OnInit } from '@angular/core';
import { BankVo, BankList } from '../../shared/models/bank';
import { Router } from '@angular/router';
import { ROUTES_MAP } from '@config/routes-config';

@Component({
  selector: 'rente-bank-select',
  templateUrl: './bank-select.component.html',
  styleUrls: ['./bank-select.component.scss']
})
export class BankSelectComponent implements OnInit {

  searchStr:string;
  banks:BankVo[];
  otherBank:BankVo = new BankVo('ANNEN', 'Annen', null);

  constructor(
    private router: Router) { }

  ngOnInit() {
    this.filterBank(this.searchStr);
  }

  onFilterChanged() {
    this.filterBank(this.searchStr);
  }

  clear() {
    this.searchStr = '';
    this.filterBank(this.searchStr);
  }

  filterBank(filter:string) {
    let filteredBanks = [];
    if (filter == null || filter.length == 0) {
      filteredBanks = BankList;
    } else {
      let f = filter.toLocaleLowerCase();
      filteredBanks = BankList.filter(bank => bank.label.toLocaleLowerCase().indexOf(f) > -1);
    }
    filteredBanks.push(this.otherBank);
    this.banks = filteredBanks;
  }

  selectBank(bank:BankVo) {
    console.log('select bank', bank);
    if (bank.name == 'ANNEN') {
      this.router.navigate([ROUTES_MAP.getNotified]);
    } else {
      this.router.navigate(['/autentisering/' + bank.name.toLocaleLowerCase()]);
    }
  }

}
