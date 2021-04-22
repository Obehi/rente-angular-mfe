import { Component, Input, OnInit } from '@angular/core';
import { AGGREGATED_LOAN_TYPE, AGGREGATED_RATE_TYPE } from '@config/loan-state';
import { ROUTES_MAP } from '@config/routes-config';
import { CustomLangTextService } from '@services/custom-lang-text.service';
import { Offers } from '@shared/models/offers';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  animateChild,
  query
} from '@angular/animations';

@Component({
  selector: 'tips-component',
  templateUrl: './tips.component.html',
  styleUrls: ['./tips.component.scss'],
  animations: [
    trigger('inOutAnimationDesktop', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('0.2s ease-out', style({ height: 245, opacity: 1 }))
      ]),
      transition(':leave', [
        // style({ height: '100', opacity: 1 }),
        animate('0.1s ease-in', style({ height: 0, opacity: 0 }))
      ])
    ]),
    trigger('inOutAnimationMobile', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('0.123s ease-out', style({ height: 245, opacity: 1 }))
      ]),
      transition(':leave', [
        // style({ height: '100', opacity: 1 }),
        animate('0.123s ease-in', style({ height: 0, opacity: 0 }))
      ])
    ]),
    trigger('stretchAccordionDesktop', [
      state(
        'close',
        style({
          width: '908px'
        })
      ),
      state(
        'open',
        style({
          width: '454px'
        })
      ),
      transition('* => close', [animate('0.2s')]),
      transition('* => open', [animate('0.1s')])
    ]),
    // TODO: add query for parent/child animations
    trigger('openClose', [
      state(
        'open',
        style({
          transform: 'rotate(0deg)'
        })
      ),
      state(
        'close',
        style({
          transform: 'rotate(0deg)'
        })
      ),
      transition('* => close', [
        animate('0.09s', style({ transform: 'rotate(180deg)' }))
      ]),
      transition('* => open', [
        animate('0.09s', style({ transform: 'rotate(180deg)' }))
      ])
    ])
  ]
})
export class TipsComponent implements OnInit {
  @Input() offersInfo: Offers;
  @Input() togglePosition;
  public incompleteInfoLoanPresent: Offers;
  public aggregatedLoanType = AGGREGATED_LOAN_TYPE;
  public aggregatedRateType = AGGREGATED_RATE_TYPE;
  public tips: any[];
  public isShowTips: boolean;

  constructor(
    public customLangTextSerice: CustomLangTextService,
    public breakpointObserver: BreakpointObserver
  ) {
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
