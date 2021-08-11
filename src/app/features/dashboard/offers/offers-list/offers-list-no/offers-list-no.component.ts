import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { OfferInfo, Offers } from './../../../../../shared/models/offers';
import { OptimizeService } from '@services/optimize.service';
import { EnvService } from '@services/env.service';
import { OffersService } from '../../offers.service';
import {
  BehaviorSubject,
  fromEvent,
  merge,
  Observable,
  of,
  Subject
} from 'rxjs';
import { UserScorePreferences } from '@models/user';
import { UserService } from '@services/remote-api/user.service';
import {
  catchError,
  debounceTime,
  timeout,
  map,
  retry,
  share,
  skip,
  switchMap,
  tap,
  filter,
  delay
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
import { MessageBannerService } from '@services/message-banner.service';
import { getAnimationStyles } from '@shared/animations/animationEnums';
@Component({
  selector: 'rente-offers-list',
  templateUrl: './offers-list-no.component.html',
  styleUrls: ['./offers-list-no.component.scss'],

  animations: [
    trigger('mobileAnimate', [
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
          left: '78%'
        })
      ),
      transition('* => close', [animate('0.2s', style({ left: '78%' }))]),
      transition('* => open', [animate('0.2s', style({ left: '50%' }))])
    ]),
    trigger('desktopAnimate', [
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
          left: '78%'
        })
      ),
      transition('* => close', [animate('0.2s', style({ left: '78%' }))]),
      transition('* => open', [animate('0.2s', style({ left: '50%' }))])
    ]),
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.2s ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [animate('0.1s ease-out', style({ opacity: 0 }))])
    ])
  ]
})
export class OffersListNoComponent implements OnInit {
  @Input() offersInfo: Offers;
  @ViewChild('sliders') sliderContainer: ElementRef;

  public currentOfferInfo: Offers;
  public currentOfferInfo$: Observable<OfferInfo[]>;
  public cachedCurrentOffers$ = new Subject<OfferInfo[]>();
  public showDemoTrigger$ = new BehaviorSubject<boolean>(false);
  public showDemoAction$ = this.showDemoTrigger$.pipe(share());
  public stopDemoAction$ = this.showDemoTrigger$.pipe(
    filter((value) => value === false),
    share()
  );
  public showPopupTrigger$ = new BehaviorSubject<boolean>(false);

  public demoIsLive = false;
  public demoSlideValue = 2;
  public currentOffers: OfferInfo[];
  public showScorePreferences = false;
  public shouldUpdateOffers = false;
  public showHamburger: boolean;
  scoreListener$ = new BehaviorSubject<UserScorePreferences>({});
  initialScores$: Observable<UserScorePreferences>;

  animationType = getAnimationStyles();
  public shouldFadeIn: boolean;

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

  get isMobile(): boolean {
    return window.innerWidth < 600;
  }
  public currentOfferType: string;

  ngOnInit(): void {
    this.initialScores$ = this.userService.getUserScorePreferences();
    this.initOfferType();
    this.initDemoListener();
    this.initCurrentOfferListener();
    this.initScoreListener();

    this.currentOfferInfo = JSON.parse(JSON.stringify(this.offersInfo));

    const preselectedOffers = this.localStorageService
      .isUserDefinedOfferPreferences
      ? this.currentOfferInfo.offers.topScoreOffer
      : this.currentOfferInfo.offers.top5;
    this.cachedCurrentOffers$.next(preselectedOffers);
  }

  initDemoListener(): void {
    this.stopDemoAction$.subscribe(() => {
      console.log('stopDemoAction');
      this.messageService.detachView();
    });
    this.showDemoAction$.pipe(skip(1)).subscribe((demoIsTriggered) => {
      console.log('demoIsTriggered');
      console.log(demoIsTriggered);
      demoIsTriggered &&
        this.messageService.setView(
          'Besvar spørsmålene under ved å flytte på slideren for å markere din preferanse, og så finner vi riktig bank for deg basert på dine valg.',
          1000,
          this.animationType.SLIDE_UP,
          'success',
          window,
          true,
          false,
          () => {
            this.showDemoTrigger$.next(false);
          }
        );

      demoIsTriggered && this.showPopupTrigger$.next(true);
    });

    fromEvent(window, 'click')
      .pipe(
        filter(() => this.showPopupTrigger$.value),
        switchMap(() => this.showPopupTrigger$),
        filter((popupIsLive) => popupIsLive)
      )
      .subscribe(() => {
        console.log('click');
        this.messageService.detachView();
      });
  }

  initCurrentOfferListener(): void {
    /* Current offers can be set either automatically by adjusting the score(updateOfferResponse$), or by 
      the user changing the offerType(cachedCurrentOffers$). Both cases are merged into one stream
      */
    this.currentOfferInfo$ = merge(
      this.offerService.updateOfferResponse$.pipe(
        map((offersInfo) =>
          this.showScorePreferences
            ? offersInfo.offers.topScoreOffer
            : offersInfo.offers.top5
        )
      ),
      this.cachedCurrentOffers$.pipe(
        // Create "fake" loading time to make sure the user knows the offertype settings are being updated
        tap((value) => {
          this.offerService.isUpdatingOffers$.next(true);
        }),
        delay(100),
        tap((value) => {
          this.offerService.isUpdatingOffers$.next(false);
        })
      )
    );

    this.currentOfferInfo$.subscribe((offers) => {
      this.currentOffers = offers;
    });
  }

  initOfferType(): void {
    if (this.localStorageService.isUserDefinedOfferPreferences !== null) {
      const offerType = this.localStorageService.isUserDefinedOfferPreferences
        ? 'score'
        : 'rate';
      this.setOfferType(offerType);
    }
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
      // If user clicks score option for the first time, show score options dropdown and demo
      if (this.localStorageService.isUserDefinedOfferPreferences === null) {
        this.preferencesButtonClicked();

        setTimeout(() => {
          this.scrollTo(this.sliderContainer);
        }, 700);

        setTimeout(() => {
          this.showDemoTrigger$.next(true);
        }, 1200);
      }

      this.cachedCurrentOffers$.next(this.offersInfo.offers.topScoreOffer);
      this.localStorageService.isUserDefinedOfferPreferences = true;
      return;
    }
  }

  initScoreListener(): void {
    this.scoreListener$
      .pipe(
        skip(1),
        tap(() => this.offerService.isUpdatingOffers$.next(true)),
        // Avoid rapidfire emits
        debounceTime(100),
        switchMap((score) =>
          this.userService.updateUserScorePreferences(score).pipe(
            retry(1),
            timeout(4000),
            catchError((error) => {
              return of(null);
            })
          )
        ),
        catchError((error) => {
          return of(null);
        }),
        map(() => this.isOffersInViewport())
      )
      .subscribe((shouldUpdateNow) => {
        if (shouldUpdateNow === true) {
          this.offerService.updateOffers$.next();
        } else if (shouldUpdateNow === false) {
          this.offerService.shouldUpdateOffersLater = true;
        }

        // shouldUpdateNow can be null if http request error or if stream returns null
        if (shouldUpdateNow === null) {
          this.offerService.isUpdatingOffers$.next(false);
          this.messageService.setView(
            'Noe gikk feil, prøv å sette sett innstillinger på nytt',
            4000,
            this.animationType.DROP_DOWN_UP,
            'error',
            window
          );
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

  scrollTo(ref: any): void {
    ref.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'start'
    });
  }
}
