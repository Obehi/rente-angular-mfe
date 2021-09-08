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
        text: 'For medlemmer av Bate(Boligbyggelag):',
        label: 'Bate (Boligbyggelag)',
        name: 'BATE',
        membership: 'BATE'
      },
      {
        text: 'For medlemmer av TOBB(Boligbyggelag):',
        label: 'TOBB (Boligbyggelag)',
        name: 'TOBB',
        membership: 'TOBB'
      },
      {
        text: 'For medlemmer av USBL(Boligbyggelag):',
        label: 'USBL (Boligbyggelag)',
        name: 'USBL',
        membership: 'USBL'
      },
      {
        text: 'For medlemmer av Norsk Sykepleierforbund:',
        label: 'Norsk Sykepleierforbund',
        name: 'SYKEPLEIERFORBUND_DNB',
        membership: 'FINNE UT AV!!!'
      }
    ],
    NORDEA_DIRECT: [
      {
        text: 'Nordea Direct uten medlemskapsfordeler:',
        label: 'Nordea Direct',
        name: 'NORDE,A_DIRECT',
        membership: null
      },
      {
        text: 'For medlemmer av YS:',
        label: 'YS',
        name: 'YS_NORDEA_DIRECT',
        membership: 'YS'
      },
      {
        text: 'For medlemmer av UNIO:',
        label: 'UNIO (Nordea Direct)',
        name: 'UNIO_NORDEA_DIRECT',
        membership: 'UNIO'
      },
      {
        text: 'For medlemmer av NAL:',
        label: 'NAL (Nordea Direct)',
        name: 'NAL_NORDEA_DIRECT',
        memberships: 'NORSK_FLYGELEDERFORENING ELLER??? SPØRR FERDRIK!!!!'
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
        text: 'For medlemmer av Dankse Akademikerne:',
        label: 'Danske Akademikerne',
        name: 'AKADEMIKERNE_DANSKE',
        membership: 'SPØRR FREDRIKK!!!!'
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

    item.membership !== null &&
      this.router.navigate(['/autentisering/' + ROUTES_MAP_NO.bankIdLogin], {
        state: { data: { name: this.bankVO } }
      });
  }
}
