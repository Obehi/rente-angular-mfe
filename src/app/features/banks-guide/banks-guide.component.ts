import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BankList, MissingBankList } from '@shared/models/bank';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'rente-banks-guide',
  templateUrl: './banks-guide.component.html',
  styleUrls: ['./banks-guide.component.scss']
})
export class BanksGuideComponent implements OnInit {
  banks = new FormControl();
  filteredBanks$: Observable<any>;
  banksData = [
    ...BankList,
    ...MissingBankList
  ];

  options: any[];

  constructor() {
  }

  get isMobile(): boolean {
    return window.innerWidth < 600;
  }

  ngOnInit(): void {
    this.options = Object.values(this.banksData).map(bank => bank).filter(bank => bank.name !== 'SPAREBANK_1');
    this.filteredBanks$ = this.banks.valueChanges
      .pipe(startWith(''), map(value => this._filter(value)));

  }

  private _filter(value: string | { name: string }): string[] {
    let filterValue: string;
    if (typeof value === 'string') {
      filterValue = value.toLowerCase();
    } else {
      filterValue = value.name.toLowerCase();
    }
    return this.options.filter(option => option.label.toLowerCase().includes(filterValue)).slice(0, 10);
  }

}
