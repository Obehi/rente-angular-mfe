import { Component, OnInit, Input } from '@angular/core';
import { OfferInfo, Offers } from './../../../../../shared/models/offers';
import { OptimizeService } from '@services/optimize.service';
import { EnvService } from '@services/env.service';
import { OffersService } from '../../offers.service';
import { BehaviorSubject, merge, Observable, of, Subject } from 'rxjs';
import { UserScorePreferences } from '@models/user';
import { UserService } from '@services/remote-api/user.service';
import { debounceTime, map, share, skip, switchMap, tap } from 'rxjs/operators';
import { LoansService } from '@services/remote-api/loans.service';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { LocalStorageService } from '@services/local-storage.service';
import { MessageBannerService } from '@services/message-banner.service';
import { getAnimationStyles } from '@shared/animations/animationEnums';
@Component({
  selector: 'rente-offers-list',
  templateUrl: './offers-list-no.component.html',
  styleUrls: ['./offers-list-no.component.scss'],
  // animations: [
  //   trigger('test', [
  //     state(
  //       'open',
  //       style({
  //         opacity: '0'
  //       })
  //     ),
  //     state(
  //       'close',
  //       style({
  //         opacity: '1'
  //       })
  //     ),
  //     transition('* => close', [animate('0.2s', style({ opacity: '1' }))]),
  //     transition('* => open', [animate('0.2s', style({ opacity: '0' }))])
  //   ])
  // ]
  animations: [
    trigger('test', [
      state(
        'open',
        style({
          position: 'absolute',
          left: '50%'
        })
      ),
      state(
        'close',
        style({
          position: 'absolute',
          left: '77%'
        })
      ),
      transition('* => close', [animate('0.2s', style({ left: '77%' }))]),
      transition('* => open', [animate('0.2s', style({ left: '50%' }))])
    ])
  ]
})
export class OffersListNoComponent implements OnInit {
  @Input() offersInfo: Offers;
  public currentOfferInfo: Offers;
  public currentOfferInfo$: Observable<OfferInfo[]>;
  public cachedCurrentOffers$ = new Subject<OfferInfo[]>();
  public showDemoTrigger$ = new BehaviorSubject<boolean>(false);
  public showDemoAction$ = this.showDemoTrigger$.pipe(share());
  public demoIsLive = false;
  public demoSlideValue = 2;
  public currentOffers: OfferInfo[];
  public showScorePreferences = false;
  public shouldUpdateOffers = false;
  public showHamburger: boolean;
  scoreListener$ = new BehaviorSubject<UserScorePreferences>({});
  initialScores$: Observable<UserScorePreferences>;

  animationType = getAnimationStyles();

  constructor(
    public optimizeService: OptimizeService,
    public offerService: OffersService,
    private userService: UserService,
    public loanService: LoansService,
    public localStorageService: LocalStorageService,
    public messageService: MessageBannerService
  ) {
    this.showHamburger = false;
  }

  // Save for later use
  /* public getVariation(): number {
    if ((window as any).google_optimize === undefined) {
      return 0;
    }
    let experimentId: string | null;
    if (this.envService.environment.production === true) {
      experimentId = 'CZzJbFYIQEa_tvn-UeQ2RQ';
    } else {
      experimentId = 'A6Fvld2GTAG3VE95NWV1Hw';
    }
    const variation = (window as any).google_optimize.get(experimentId);
    return variation || 0;
  } */

  get isMobile(): boolean {
    return window.innerWidth < 600;
  }
  public currentOfferType: string;

  ngOnInit(): void {
    this.initialScores$ = this.userService.getUserScorePreferences();
    this.initOfferType();

    this.showDemoAction$.pipe(skip(1)).subscribe((value) => {
      console.log(value + ' WOP WOP');
      this.messageService.setView(
        'Besvar spørsmålene under ved å flytte på slideren for å markere din preferanse, og så finner vi riktig bank for deg basert på dine valg.',
        4000,
        this.animationType.SLIDE_UP,
        'success',
        window
      );
    });

    this.currentOfferInfo$ = merge(
      this.offerService.updateOfferResponse$.pipe(
        map((offersInfo) =>
          this.showScorePreferences
            ? offersInfo.offers.topScoreOffer
            : offersInfo.offers.top5
        )
      ),
      this.cachedCurrentOffers$
    );

    this.currentOfferInfo$.subscribe((offers) => {
      console.log(offers);
      this.currentOffers = offers;
    });
    this.initScoreListener();

    this.currentOfferInfo = JSON.parse(JSON.stringify(this.offersInfo));

    const preselectedOffers = this.localStorageService
      .isUserDefinedOfferPreferences
      ? this.currentOfferInfo.offers.topScoreOffer
      : this.currentOfferInfo.offers.top5;
    this.cachedCurrentOffers$.next(preselectedOffers);
  }

  initOfferType(): void {
    const offerType = this.localStorageService.isUserDefinedOfferPreferences
      ? 'score'
      : 'rate';
    this.setOfferType(offerType);
  }

  public setOfferType(type: string): void {
    this.currentOfferType = type;

    if (type === 'rate') {
      this.showHamburger = false;
      // this.currentOffers = this.offersInfo.offers.top5;
      this.localStorageService.isUserDefinedOfferPreferences = false;
      this.showScorePreferences = false;
      this.cachedCurrentOffers$.next(this.offersInfo.offers.top5);
      return;
    }

    if (type === 'score') {
      // If user clicks score option for the first time, show score options dropdown
      if (this.localStorageService.isUserDefinedOfferPreferences === null) {
        this.preferencesButtonClicked();
      }

      this.cachedCurrentOffers$.next(this.offersInfo.offers.topScoreOffer);
      // this.currentOffers = this.offersInfo.offers.topScoreOffer;
      this.localStorageService.isUserDefinedOfferPreferences = true;
      return;
    }
  }

  initScoreListener(): void {
    this.scoreListener$
      .pipe(
        skip(1),
        tap(() => this.offerService.isUpdatingOffers$.next(true)),

        debounceTime(100),
        switchMap((score) =>
          this.userService.updateUserScorePreferences(score)
        ),
        map(() => this.isOffersInViewport())
      )
      .subscribe((shouldUpdateNow) => {
        if (shouldUpdateNow) {
          this.offerService.updateOffers$.next();
        } else {
          this.offerService.shouldUpdateOffersLater = true;
        }
      });
  }

  isOffersInViewport(): boolean {
    return (
      window.innerHeight -
        document
          .getElementsByClassName('offers-container')[0]
          .getBoundingClientRect().top -
        60 >
      0
    );
  }

  preferencesButtonClicked(): void {
    this.showScorePreferences = !this.showScorePreferences;
    if (this.offerService.shouldUpdateOffersLater === true) {
      this.offerService.updateOffers$.next();
      this.offerService.shouldUpdateOffersLater = false;
    }
  }

  setShowHamburger(): boolean {
    this.showHamburger = true;
    return this.showHamburger;
  }
}
