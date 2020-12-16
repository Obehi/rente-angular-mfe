import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MetaService } from '@services/meta.service';
import { LoansService } from '@services/remote-api/loans.service';
import { TitleService } from '@services/title.service';
import { BankList, BankUtils, MissingBankList } from '@shared/models/bank';
import { BankGuideInfo, BankLocationAddress } from '@shared/models/offers';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'rente-bank-guide-page',
  templateUrl: './bank-guide-page.component.html',
  styleUrls: ['./bank-guide-page.component.scss']
})
export class BankGuidePageComponent implements OnInit {
  @ViewChild('inShort') inShort: ElementRef;
  banksData = [
    ...BankList,
    ...MissingBankList
  ];
  bank;
  bankGuideLoading: boolean;
  bankGuideInfo: BankGuideInfo;
  banksLocations: string[];
  addressesArray: BankLocationAddress[] = [];
  private _onDestroy$ = new Subject<void>();

  constructor(
    private loansService: LoansService,
    private route: ActivatedRoute,
    private metaService: MetaService,
    private titleService: TitleService
  ) {
  }

  get bankHasInShort() {
    return !!(this.bankGuideInfo && (this.bankGuideInfo.text1 || this.bankGuideInfo.text2 || this.bankGuideInfo.text3 || this.bankGuideInfo.text4));
  }

  ngOnInit(): void {
    this.bankGuideLoading = true;
    const bankName = this.route.snapshot.params.id.toUpperCase();
    this.bank = BankUtils.getBankByName(bankName);
    this.bank.icon = BankUtils.getBankPngIcon(bankName);
    this.loansService.getBankGuide(this.route.snapshot.params.id.toUpperCase())
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(bankInfo => {
        this.bankGuideInfo = bankInfo;
     
        this.banksLocations = Object.keys(this.bankGuideInfo.addresses)
          .sort();
  
        for(let address in this.bankGuideInfo.addresses) {
          this.addressesArray.push(...this.bankGuideInfo.addresses[address])
        }

        this.banksLocations[this.banksLocations.findIndex(location => location === 'other')] = 'Annet';
        this.titleService.setTitle(`${this.bank.label} | Bankguiden | Renteradar.no`);
        if (this.bankGuideInfo.text1) {
          this.metaService.updateMetaTags('description', this.bankGuideInfo.text1);
        }
        this.bankGuideLoading = false;
      }, err => {
        this.bankGuideLoading = false;
      });

  }

  scrollTo(ref) {
    ref.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'start',
    });
  }

}
