import { Component, OnInit } from '@angular/core';
import { SeoService } from '@services/seo.service';
import { BankGuideService } from './bank-guide.service';
@Component({
  selector: 'rente-banks-guide',
  templateUrl: './banks-guide.component.html',
  styleUrls: ['./banks-guide.component.scss']
})
export class BanksGuideComponent implements OnInit {
  constructor(
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
