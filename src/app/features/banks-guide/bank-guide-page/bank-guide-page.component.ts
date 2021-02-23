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

@Component({
  selector: 'rente-bank-guide-page',
  templateUrl: './bank-guide-page.component.html',
  styleUrls: ['./bank-guide-page.component.scss']
})
export class BankGuidePageComponent implements OnInit {
  @ViewChild('inShort') inShort: ElementRef;
  banksData = [...BankList, ...MissingBankList];

  bank;
  icon: string;
  bankGuideLoading: boolean;
  bankGuideInfo: BankGuideInfo;
  banksLocations: string[];
  addressesArray: BankLocationAddress[] = [];
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

      // this.bank.icon = BankUtils.getBankPngIcon(bankName);
      console.log('params');
      console.log(this.bank.icon);

      this.loansService
        .getBankGuide(this.route.snapshot.params.id.toUpperCase())
        .pipe(takeUntil(this._onDestroy$))
        .subscribe(
          (bankInfo) => {
            this.bankGuideInfo = bankInfo;

            this.banksLocations = Object.keys(
              this.bankGuideInfo.addresses
            ).sort();

            for (const address in this.bankGuideInfo.addresses) {
              this.addressesArray.push(
                ...this.bankGuideInfo.addresses[address]
              );
            }

            this.banksLocations[
              this.banksLocations.findIndex((location) => location === 'other')
            ] = 'Annet';
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
    console.log('oninit');
    this.seoService.createLinkForCanonicalURL();
    this.bankGuideLoading = true;
    const bankName = this.route.snapshot.params.id.toUpperCase();
    // this.bank = BankUtils.getBankByName(bankName);
    // this.bank.icon = BankUtils.getBankPngIcon(bankName);
    console.log(this.bank.icon);

    this.loansService
      .getBankGuide(this.route.snapshot.params.id.toUpperCase())
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(
        (bankInfo) => {
          this.bankGuideInfo = bankInfo;

          this.banksLocations = Object.keys(
            this.bankGuideInfo.addresses
          ).sort();

          for (const address in this.bankGuideInfo.addresses) {
            this.addressesArray.push(...this.bankGuideInfo.addresses[address]);
          }

          this.banksLocations[
            this.banksLocations.findIndex((location) => location === 'other')
          ] = 'Annet';
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
  }

  scrollTo(ref) {
    ref.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'start'
    });
  }
}
