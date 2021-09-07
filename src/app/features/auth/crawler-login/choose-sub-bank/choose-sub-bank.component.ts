import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES_MAP_NO } from '@config/routes-config';
import { BankVo } from '@models/bank';
import { LocalStorageService } from '@services/local-storage.service';

interface subBankMembership {
  label: string;
  buttonText: string;
  bank: string;
}
@Component({
  selector: 'rente-choose-sub-bank',
  templateUrl: './choose-sub-bank.component.html',
  styleUrls: ['./choose-sub-bank.component.scss']
})
export class ChooseSubBankComponent implements OnInit {
  membershipss = {
    DNB: [
      {
        label: 'text'
      }
    ]
  };

  memberships = {
    DNB: [
      {
        label: 'DNB uten medlemskapsfordeler:',
        buttonText: 'DNB',
        bank: 'DNB'
      },
      {
        label: 'For medlemmer av Bate(Boligbyggelag):',
        buttonText: 'Bate',
        bank: 'BATE'
      },
      {
        label: 'For medlemmer av TOBB(Boligbyggelag):',
        buttonText: 'TOBB',
        bank: 'TOBB'
      },
      {
        label: 'For medlemmer av USBL(Boligbyggelag):',
        buttonText: 'USBL',
        bank: 'USBL'
      },
      {
        label: 'For medlemmer av Norsk Sykepleierforbund:',
        buttonText: 'Norsk Sykepleierforbund',
        bank: 'SYKEPLEIERFORBUND_DNB'
      }
    ],
    NORDEA_DIRECT: [
      {
        label: 'Nordea Direct uten medlemskapsfordeler:',
        buttonText: 'Nordea Direct',
        bank: 'NORDEA_DIRECT'
      },
      {
        label: 'For medlemmer av YS:',
        buttonText: 'YS (Nordea Direct)',
        bank: 'YS_NORDEA_DIRECT'
      },
      {
        label: 'For medlemmer av UNIO:',
        buttonText: 'UNIO (Nordea Direct)',
        bank: 'UNIO_NORDEA_DIRECT'
      },
      {
        label: 'For medlemmer av NAL:',
        buttonText: 'NAL (Nordea Direct)',
        bank: 'NAL_NORDEA_DIRECT'
      }
    ],
    DANSKE_BANK: [
      {
        label: 'Danske Bank uten medlemskapsfordeler:',
        buttonText: 'Dankse Bank',
        bank: 'DANSKE_BANK'
      },
      {
        label: 'For medlemmer av Dankse Akademikerne:',
        buttonText: 'Danske Akademikerne',
        bank: 'AKADEMIKERNE_DANSKE'
      }
    ]
  };

  bankVO: BankVo;

  currentMemberships: subBankMembership[];

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    console.log(this.router);
    const bankName = this.router.getCurrentNavigation()?.extras?.state?.data
      .bank.name;
    console.log(
      this.router.getCurrentNavigation()?.extras?.state?.data.bank.name
    );
    if (bankName !== undefined) {
      this.bankVO = this.router.getCurrentNavigation()?.extras?.state?.data.bank;
      console.log(this.memberships['DNB'][0].label);
      this.currentMemberships = this.memberships[bankName];
    } else {
      this.router.navigate(['/velgbank']);
    }
  }
  ngOnInit(): void {
    console.log('japp');
  }

  continueBankLogin(bank: string): void {
    this.bankVO.name = bank;
    this.localStorageService.setItem('subBank', bank);
    this.router.navigate(['/autentisering/' + ROUTES_MAP_NO.bankIdLogin], {
      state: { data: { bank: this.bankVO } }
    });
  }
}
