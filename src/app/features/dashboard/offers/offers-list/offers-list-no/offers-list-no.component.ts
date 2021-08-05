import { Component, OnInit, Input } from '@angular/core';
import { OfferInfo, Offers } from './../../../../../shared/models/offers';
import { OptimizeService } from '@services/optimize.service';
import { EnvService } from '@services/env.service';
import { OffersService } from '../../offers.service';
import { BehaviorSubject, fromEvent, Observable, of } from 'rxjs';
import { UserScorePreferences } from '@models/user';
import { UserService } from '@services/remote-api/user.service';
import {
  debounce,
  debounceTime,
  map,
  skip,
  switchMap,
  tap
} from 'rxjs/operators';
import { LoansService } from '@services/remote-api/loans.service';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { LocalStorageService } from '@services/local-storage.service';
@Component({
  selector: 'rente-offers-list',
  templateUrl: './offers-list-no.component.html',
  styleUrls: ['./offers-list-no.component.scss'],
  animations: [
    trigger('inOutOffers', [
      /* transition(':enter', [
        animate(
          '0.2s ease-out',
          style({ opacity: 0, transform: 'translateY(10px)' })
        )
      ]),
      transition(':leave', [
        // style({ height: '100', opacity: 1 }),
        animate('500ms', style({ opacity: 0, transform: 'translateY(10px)' }))
      ]), */
      state(
        'visible',
        style({
          opacity: 1,
          transform: 'translateY(10px)'
        })
      ),
      state(
        'hidden',
        style({
          opacity: 0.1
        })
      )
    ])
  ]
})
export class OffersListNoComponent implements OnInit {
  @Input() offersInfo: Offers;
  public currentOfferInfo: Offers;
  public currentOffers: OfferInfo[];
  public showScorePreferences = false;
  public shouldUpdateOffers = false;
  scoreListener$ = new BehaviorSubject<UserScorePreferences>({});
  initialScores$: Observable<UserScorePreferences>;

  shouldShowDemo$ = new BehaviorSubject<boolean>(false);

  constructor(
    public optimizeService: OptimizeService,
    public offerService: OffersService,
    private userService: UserService,
    public loanService: LoansService,
    public localStorageService: LocalStorageService
  ) {}

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
    this.shouldShowDemo$.next(true);
    this.initialScores$ = this.userService.getUserScorePreferences();
    this.initScoreListener();

    this.currentOfferInfo = JSON.parse(JSON.stringify(this.offersInfo));

    this.initOfferType();
  }

  initOfferType(): void {
    const offerType = this.localStorageService.isUserDefinedOfferPreferences
      ? 'score'
      : 'rate';
    console.log('offerType');
    console.log(offerType);
    this.setOfferType(offerType);
  }

  public setOfferType(type: string): void {
    this.currentOfferType = type;

    if (type === 'rate') {
      this.currentOffers = this.offersInfo.offers.top5;
      this.localStorageService.isUserDefinedOfferPreferences = false;
      this.showScorePreferences = false;
      return;
    }

    if (type === 'score') {
      // If user clicks score option for the first time, show score options dropdown
      if (this.localStorageService.isUserDefinedOfferPreferences === null) {
        this.preferencesButtonClicked();
      }
      this.currentOffers = this.offersInfo.offers.topScoreOffer;
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
}
