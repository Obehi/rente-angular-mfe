import { Component, OnInit } from '@angular/core';
import {
  BankList,
  BankVo,
  MissingBankList,
  LegacyBanks
} from '@shared/models/bank';
import { ROUTES_MAP_NO } from '@config/routes-config';
import { Router } from '@angular/router';
import { SeoService } from '@services/seo.service';
import { BankGuideService } from './bank-guide.service';
@Component({
  selector: 'rente-banks-guide',
  templateUrl: './banks-guide.component.html',
  styleUrls: ['./banks-guide.component.scss']
})
export class BanksGuideComponent implements OnInit {
  constructor(
    private router: Router,
    private seoService: SeoService,
    public bankGuideService: BankGuideService
  ) {}

  get isMobile(): boolean {
    return window.innerWidth < 600;
  }

  ngOnInit(): void {
    this.seoService.createLinkForCanonicalURL();
  }
}
