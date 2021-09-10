import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES_MAP_NO } from '@config/routes-config';
import { BankVo } from '@models/bank';
import { LocalStorageService } from '@services/local-storage.service';

import { MembershipTypeDto } from '@services/remote-api/loans.service';
interface subBankMembership {
  text: string;
  label: string;
  name: string;
  membership: string | null;
}
@Component({
  selector: 'rente-choose-sub-bank',
  templateUrl: './choose-sub-bank.component.html',
  styleUrls: ['./choose-sub-bank.component.scss']
})
export class ChooseSubBankComponent implements OnInit {
  memberships = {
    DNB: [
      {
        text: 'DNB uten medlemskapsfordeler:',
        label: 'DNB',
        name: 'DNB',
        membership: null
      },
      {
        text: 'For Bate-medlemmer:',
        label: 'Bate Boligbyggelag (DNB)',
        name: 'BATE',
        membership: 'BATE'
      },
      {
        text: 'For TOBB-medlemmer:',
        label: 'TOBB (DNB)',
        name: 'TOBB',
        membership: 'TOBB'
      },
      {
        text: ' For USBL-medlemmer:',
        label: 'USBL (DNB)',
        name: 'USBL',
        membership: 'USBL'
      },
      {
        text: 'For medlemmer av Norsk Sykepleierforbund:',
        label: 'Norsk Sykepleierforbund (DNB)',
        name: 'SYKEPLEIERFORBUND_DNB',
        membership: 'UNIO_NORSK_SYKEPLEIERFORBUND'
      }
    ],
    NORDEA_DIRECT: [
      {
        text: 'Nordea Direct uten medlemskapsfordeler:',
        label: 'Nordea Direct',
        name: 'NORDEA_DIRECT',
        membership: null
      },
      {
        text: 'For YS-medlemmer:',
        label: 'YS (Nordea Direct)',
        name: 'YS_NORDEA_DIRECT',
        membership: 'YS'
      },
      {
        text: 'For UNIO-medlemmer:',
        label: 'UNIO (Nordea Direct)',
        name: 'UNIO_NORDEA_DIRECT',
        membership: 'UNIO'
      },
      {
        text: 'For NAL-medlemmer (Norske Arkitekters Landsforening):',
        label: 'NAL (Nordea Direct)',
        name: 'NAL_NORDEA_DIRECT',
        memberships: 'NORSKE_ARKITEKTERS_LANDSFORBUND'
      }
    ],
    DANSKE_BANK: [
      {
        text: 'Danske Bank uten medlemskapsfordeler:',
        label: 'Dankse Bank',
        name: 'DANSKE_BANK',
        membership: null
      },
      {
        text: 'For medlemmer av Akademikerne:',
        label: 'Akademikerne (Danske Bank)',
        name: 'AKADEMIKERNE_DANSKE',
        membership: 'AKADEMIKERNE'
      }
    ]
  };

  bankVO: BankVo;

  currentMemberships: subBankMembership[];

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    const bankName = this.router.getCurrentNavigation()?.extras?.state?.data
      .bank.name;

    if (bankName !== undefined) {
      this.bankVO = this.router.getCurrentNavigation()?.extras?.state?.data.bank;
      console.log(this.memberships['DNB'][0].text);
      this.currentMemberships = this.memberships[bankName];
    } else {
      this.router.navigate(['/velgbank']);
    }
  }
  ngOnInit(): void {}

  continueBankLogin(item: subBankMembership): void {
    const foo: { [index: string]: { message: string } } = {};
    this.bankVO.name = item.name;

    if (item.membership !== null) {
      // convert subBankMembership to MembershipDto used in other components
      const membershipDto: MembershipTypeDto = {
        name: item.membership,
        label: item.label
      };
      this.localStorageService.setObject('subBank', membershipDto);
    }
    console.log(this.bankVO);
    this.router.navigate(['/autentisering/' + ROUTES_MAP_NO.bankIdLogin], {
      state: { data: { bank: this.bankVO } }
    });
  }
}
