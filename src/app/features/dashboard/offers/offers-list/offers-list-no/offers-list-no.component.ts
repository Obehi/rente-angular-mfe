import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewChild,
  ElementRef
} from '@angular/core';
import { OfferInfo, Offers } from './../../../../../shared/models/offers';
import { OffersService } from '../../offers.service';
import {
  BehaviorSubject,
  EMPTY,
  fromEvent,
  merge,
  Observable,
  of,
  Subject,
  Subscription
} from 'rxjs';
import { UserScorePreferences } from '@models/user';
import { UserService } from '@services/remote-api/user.service';
import { CustomLangTextService } from '@services/custom-lang-text.service';

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
import { NotificationService } from '../../../../../shared/services/notification.service';
@Component({
  selector: 'rente-offers-list',
  templateUrl: './offers-list-no.component.html',
  styleUrls: ['./offers-list-no.component.scss'],
  animations: [
    trigger('onScroll', [
      state(
        'true',
        style({
          opacity: 1,
          top: '68px',
          borderRadius: '9px'
        })
      ),
      state('false', style({ opacity: 0, marginTop: '-80px' })),
      transition('false <=> true', animate('200ms ease-out'))
    ]),
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
export class OffersListNoComponent implements OnInit, OnDestroy {
  @Input() offersInfo: Offers;
  @ViewChild('sliders') sliderContainer: ElementRef;

  public currentOfferInfo: Offers;
  public onScroll: boolean;
  public shouldOverRideLoadingState = false;
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
    public offerService: OffersService,
    private userService: UserService,
    public loanService: LoansService,
    public localStorageService: LocalStorageService,
    public messageBannerService: MessageBannerService,
    private customLangTextService: CustomLangTextService,
    private notificationService: NotificationService
  ) {
    this.showHamburger = false;
  }
  public scrollSubscription: Subscription;
  public demoClickSubscription: Subscription;

  // Save for later use
  /* public getVariation() {
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

  ngOnDestroy(): void {
    this.scrollSubscription.unsubscribe();
    this.demoClickSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.setEffectiveRatePullDownListener();
    this.initialScores$ = this.userService.getUserScorePreferences();
    this.initOfferType();
    this.initDemoListener();
    this.initCurrentOfferListener();
    this.initScoreListener();
    this.setNotificationScrollListener();

    this.currentOfferInfo = JSON.parse(JSON.stringify(this.offersInfo));

    const preselectedOffers = this.localStorageService
      .isUserDefinedOfferPreferences
      ? this.currentOfferInfo.offers.topScoreOffer
      : this.currentOfferInfo.offers.top5;
    this.cachedCurrentOffers$.next(preselectedOffers);
  }

  initDemoListener(): void {
    this.stopDemoAction$.pipe(skip(1)).subscribe(() => {
      this.messageBannerService.detachView();
    });
    this.showDemoAction$.pipe(skip(1)).subscribe((demoIsTriggered) => {
      demoIsTriggered &&
        this.messageBannerService.setView(
          'Besvar spørsmålene under ved å flytte på slideren for å markere din preferanse, og så finner vi riktig bank for deg basert på dine valg.',
          10000000,
          this.animationType.SLIDE_UP,
          'success',
          window,
          true,
          true,
          false,
          () => {
            this.showDemoTrigger$.next(false);
          }
        );

      demoIsTriggered && this.showPopupTrigger$.next(true);
    });

    this.demoClickSubscription = fromEvent(window, 'click')
      .pipe(
        filter(() => this.showPopupTrigger$.value),
        switchMap(() => this.showPopupTrigger$),
        filter((popupIsLive) => popupIsLive)
      )
      .subscribe(() => {
        this.messageBannerService.detachView();
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
          this.shouldOverRideLoadingState = true;
        }),
        delay(100),
        tap((value) => {
          this.offerService.isUpdatingOffers$.next(false);
          this.shouldOverRideLoadingState = false;
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
    } else {
      this.currentOfferType = 'rate';
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
          this.scrollToSliders();
        }, 700);

        setTimeout(() => {
          this.showDemoTrigger$.next(true);
        }, 1200);
      } else {
        this.showHamburger = true;
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
            timeout(4000),
            catchError((error) => {
              this.offerService.isUpdatingOffers$.next(false);
              this.messageBannerService.setView(
                this.customLangTextService.getSnackBarErrorMessage(),
                4000,
                this.animationType.DROP_DOWN_UP,
                'error',
                window
              );
              return EMPTY;
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
          this.messageBannerService.setView(
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

  scrollToSliders(): void {
    const element = document.getElementById('user-score-dropdown');
    if (element === null) return;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition - 60;

    window.scrollBy({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  public setEffectiveRatePullDownListener(): void {
    const effectiveRateContainer = document.getElementsByClassName(
      'offers-container'
    )[0];
    fromEvent(window, 'scroll').subscribe(() => {
      if (effectiveRateContainer?.getBoundingClientRect().top - 60 <= 0) {
        this.onScroll = true;
      } else {
        this.onScroll = false;
      }
    });
  }

  private setNotificationScrollListener(): void {
    const obj = document.getElementsByClassName('the-offers')[0];

    this.scrollSubscription = fromEvent(window, 'scroll')
      .pipe(
        filter(() => obj?.getBoundingClientRect().top <= 0),
        switchMap(() =>
          this.notificationService.getOfferNotificationAsObservable()
        ),
        filter((notificationNumber) => notificationNumber === 1)
      )
      .subscribe(() => {
        this.messageBannerService.detachView();
        this.notificationService.resetOfferNotification();
      });
  }
}
