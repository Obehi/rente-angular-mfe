import { Component, OnInit } from '@angular/core';
import { BankVo, BankList, MissingBankList } from '../../shared/models/bank';
import { Router } from '@angular/router';
import { ROUTES_MAP } from '@config/routes-config';

@Component({
  selector: 'rente-bank-select-variation',
  templateUrl: './bank-select.component.html',
  styleUrls: ['./bank-select.component.scss']
})
export class BankSelectComponentVariation implements OnInit {

  searchStr:string;
  banks:BankVo[];
  allBanks:BankVo[];

  constructor(
    private router: Router) { }

  ngOnInit() {
    let sortedBanksAlphabetic = [...BankList, ...MissingBankList].sort((a,b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0));


    let dnb = 'DNB';
    let sparebank = 'SPAREBANK_1';
    let nordea = 'NORDEA';

    let sortedBanksSpareBankFirst = sortedBanksAlphabetic.sort(function(x,y){ return x.name == sparebank ? -1 : y.name == sparebank ? 1 : 0; });
    let sortedBanksNoredaFirst = sortedBanksSpareBankFirst.sort(function(x,y){ return x.name == nordea ? -1 : y.name == nordea ? 1 : 0; });
    let sortedBanksDNBFirst = sortedBanksNoredaFirst.sort(function(x,y){ return x.name == dnb ? -1 : y.name == dnb ? 1 : 0; });
   

    this.allBanks = sortedBanksDNBFirst;
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
    if (filter == null || filter.length === 0) {
      filteredBanks = this.allBanks.concat();
    } else {
      const f = filter.toLocaleLowerCase();
      filteredBanks = this.allBanks.filter(bank => bank.label.toLocaleLowerCase().indexOf(f) > -1);
    }
    
    this.banks = filteredBanks;
  }

  selectBank(bank:BankVo) {

    if(bank.name == 'SPAREBANK_1') {
      this.searchStr = "Sparebank 1";
      this.filterBank(this.searchStr);
      return
    }

    if (bank.isMissing) {
      this.router.navigate([ROUTES_MAP.getNotified],{ state: { bank: bank } });
    }
    else {
      this.router.navigate([ROUTES_MAP.auth + '/' +  bank.name.toLocaleLowerCase()]);
    }
  }

}
