import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MetaService } from '@services/meta.service';
import { LoansService } from '@services/remote-api/loans.service';
import { TitleService } from '@services/title.service';
import { BankList, BankUtils, MissingBankList } from '@shared/models/bank';
import { BankGuideInfo, BankLocationAddress } from '@shared/models/offers';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SeoService } from '@services/seo.service';
import { BankGuideService } from '../bank-guide.service';
import { ROUTES_MAP } from '@config/routes-config';
@Component({
  selector: 'rente-bank-guide-page',
  templateUrl: './bank-guide-page.component.html',
  styleUrls: ['./bank-guide-page.component.scss']
})
export class BankGuidePageComponent implements OnInit {
  @ViewChild('inShort') inShort: ElementRef;
  banksData = [...BankList, ...MissingBankList];

  routesMap = ROUTES_MAP;
  bank;
  icon: string;
  bankGuideLoading: boolean;
  bankGuideInfo: BankGuideInfo;
  banksLocations: string[];
  addressesArray: BankLocationAddress[] = [];
  memberships: any;
  membershipOffers: any;
  depositsGeneral: { name: string; rate: string }[] = [];
  depositsBsu: { name: string; rate: string }[] = [];

  public bankUtils = BankUtils;
  private _onDestroy$ = new Subject<void>();

  constructor(
    private loansService: LoansService,
    private route: ActivatedRoute,
    private metaService: MetaService,
    private titleService: TitleService,
    private seoService: SeoService,
    public bankGuideService: BankGuideService
  ) {}

  get bankHasInShort() {
    return !!(
      this.bankGuideInfo &&
      (this.bankGuideInfo.text1 ||
        this.bankGuideInfo.text2 ||
        this.bankGuideInfo.text3 ||
        this.bankGuideInfo.text4)
    );
  }

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.seoService.createLinkForCanonicalURL();
      this.bankGuideLoading = true;
      const bankName = param.id.toUpperCase();
      this.bank = BankUtils.getBankByName(bankName);

      this.depositsBsu = [];
      this.depositsGeneral = [];
      this.loansService
        .getBankGuide(this.route.snapshot.params.id.toUpperCase())
        .pipe(takeUntil(this._onDestroy$))
        .subscribe(
          (bankInfo) => {
            this.bankGuideInfo = bankInfo;

            this.banksLocations = Object.keys(
              this.bankGuideInfo.addresses
            ).sort();

            // this.memberships = [];
            this.addressesArray = [];

            this.memberships = Object.keys(
              this.bankGuideInfo.membershipOffers
            ).sort();

            this.bankGuideInfo.depositOffers
              .sort(this.alphaSort)
              .forEach((offer) => {
                offer.name.toLowerCase().includes('bsu')
                  ? this.depositsBsu.push(offer)
                  : this.depositsGeneral.push(offer);
              });

            this.addressesArray = [];
            for (const address in this.bankGuideInfo.addresses) {
              this.addressesArray.push(
                ...this.bankGuideInfo.addresses[address]
              );
            }

            this.banksLocations[
              this.banksLocations.findIndex((location) => location === 'other')
            ] = 'Annet';
            if (!!this.bank)
              this.titleService.setTitle(
                `${this.bank.label} | Bankguiden | Renteradar.no`
              );
            if (this.bankGuideInfo.text1) {
              this.metaService.updateMetaTags(
                'description',
                `Sjekk hva ${this.bank.label} tilbyr på boliglån og andre banktjenester. Renteradar.no sammenlikner ${this.bank.label} med andre banker. Oversikt på kontakt, filialer og åpningstider.`
              );
            }
            this.bankGuideLoading = false;
          },
          (err) => {
            this.bankGuideLoading = false;
          }
        );
    });
  }

  alphaSort = (a: any, b: any): number => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  };

  scrollTo(ref) {
    ref.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'start'
    });
  }
}
