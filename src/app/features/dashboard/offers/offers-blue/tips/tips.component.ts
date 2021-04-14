import { Component, Input, OnInit } from '@angular/core';
import { AGGREGATED_LOAN_TYPE, AGGREGATED_RATE_TYPE } from '@config/loan-state';
import { ROUTES_MAP } from '@config/routes-config';
import { CustomLangTextService } from '@services/custom-lang-text.service';
import { Offers } from '@shared/models/offers';

@Component({
  selector: 'tips-component',
  templateUrl: './tips.component.html',
  styleUrls: ['./tips.component.scss']
})
export class TipsComponent implements OnInit {
  @Input() offersInfo: Offers;
  @Input() aggregatedLoanType = AGGREGATED_LOAN_TYPE;
  @Input() aggregatedRateType = AGGREGATED_RATE_TYPE;
  @Input() incompleteInfoLoanPresent: Offers;
  public tips: any[];
  public isShowTips: boolean;
  public customLangTextSerice: CustomLangTextService;

  constructor() {
    this.isShowTips = false;
    this.tips = [];
  }

  ngOnInit(): void {
    this.getTips();
  }

  get isMobile(): boolean {
    return window.innerWidth < 600;
  }

  get hasStatensPensjonskasseMembership(): boolean {
    return (
      this.offersInfo &&
      this.offersInfo.memberships &&
      this.offersInfo.memberships.indexOf(
        'STATENS_PENSJONSKASSE_STATLIG_ANSATT'
      ) > -1
    );
  }

  public getTips(): void {
    if (this.offersInfo.incompleteInfoLoanPresent !== true) {
      this.tips.push({
        header: 'Obs',
        text: this.customLangTextSerice.getLimitedLoanInfoWarning(),
        icon: 'warning',
        obs: true
      });
    }

    if (
      this.offersInfo.aggregatedLoanType ===
        this.aggregatedLoanType.CREDIT_LINE ||
      this.offersInfo.aggregatedLoanType === this.aggregatedLoanType.MIX_D_C
    ) {
      this.tips.push({
        header: 'Belåningsgrad',
        text: this.customLangTextSerice.getHouseValue(),
        buttonLink: '/dashboard/' + ROUTES_MAP.property,
        icon: this.isMobile ? 'house' : 'house-blue'
      });
    }

    if (!this.offersInfo.memberships.length) {
      this.tips.push({
        header: 'Medlemskap',
        text: this.customLangTextSerice.getMembershipWarning(),
        buttonLink: '/dashboard/' + ROUTES_MAP.profile,
        icon: this.isMobile ? 'profile-icon-white' : 'profile-icon-blue'
      });
    }
    if (
      this.offersInfo.aggregatedRateType ===
      this.aggregatedRateType.MIX_FIXED_FLOATING
    ) {
      this.tips.push({
        header: 'Fastrentelån',
        text:
          'Vi ser du har ett eller flere fastrentelån. Renteradar viser besparelsespotensialet kun for lånet/lånene med flytende rente. Beste rente viser også kun beste rente for lånet/lånene med flytende rente.',
        buttonLink: './',
        icon: 'rate'
      });
    }
    if (
      this.offersInfo.aggregatedLoanType ===
        this.aggregatedLoanType.CREDIT_LINE ||
      this.offersInfo.aggregatedLoanType === this.aggregatedLoanType.MIX_D_C
    ) {
      this.tips.push({
        header: 'Rammelån/boligkreditt',
        text:
          'Du har rammelån/boligkreditt. Ønsker du å se tilbud kun for denne typen lån?',
        buttonLink: '/dashboard/' + ROUTES_MAP.profile,
        icon: this.isMobile ? 'profile-icon-white' : 'profile-icon-blue'
      });
    }

    if (this.hasStatensPensjonskasseMembership) {
      this.tips.push({
        header: 'Statens pensjonskasse',
        text:
          'Medlemmer i Statens Pensjonskasse kan finansiere opptil 2 millioner hos Statens Pensjonskasse. Klikk her for mer info om tilbudet.',
        buttonLink: 'https://www.finansportalen.no/bank/boliglan/',
        external: true,
        icon: this.isMobile ? 'profile-icon-white' : 'profile-icon-blue'
      });
    }
  }
}
