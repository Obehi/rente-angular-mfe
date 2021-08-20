import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  HostBinding,
  ElementRef,
  ViewChild
} from '@angular/core';
import { Options, LabelType } from '@angular-slider/ngx-slider';
import { BehaviorSubject, forkJoin, Observable, of, Subject } from 'rxjs';
import { UserScorePreferences } from '@models/user';
import {
  debounce,
  debounceTime,
  delay,
  filter,
  map,
  scan,
  skip,
  startWith,
  switchMap,
  tap
} from 'rxjs/operators';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  animateChild,
  query,
  group
} from '@angular/animations';
import { UserScoreDemo } from '../../../animations/user-score-demo';

@Component({
  selector: 'rente-user-score-preferences',
  templateUrl: './user-score-preferences.component.html',
  styleUrls: ['./user-score-preferences.component.scss'],
  animations: [
    trigger('demoBorder', [
      state(
        'hide',
        style({
          borderWidth: '0'
        })
      ),
      state(
        'show',
        style({
          borderWidth: '2px'
        })
      ),
      transition('* => show', [animate('0.2s', style({ borderWidth: '2px' }))]),
      transition('* => hide', [animate('0.2s', style({ borderWidth: '0' }))])
    ])
  ]
})
export class UserScorePreferencesComponent implements OnInit {
  @ViewChild('targetElement') targetElement: ElementRef;
  @Input() scoreListener: BehaviorSubject<UserScorePreferences>;
  @Input() initialScores: Observable<UserScorePreferences>;
  @Input() sliderBox = true;
  @Input() shouldShowDemoListener: BehaviorSubject<boolean>;

  triggerDemo: Observable<boolean>;
  demoIsLive = false;
  demoValue = 2;
  @HostBinding('style.--size')
  size: string;
  public borderTest: boolean;

  initialScoresStorage: UserScorePreferences;
  combinedScores$: Observable<UserScorePreferences>;
  scoreObserveTrigger$ = new Observable();
  collectScore$ = new Subject<UserScorePreferences>();

  testType = 0;
  options: Options = {
    floor: 0,
    ceil: 4,
    step: 1,
    showTicks: false,
    translate: (value: number, label: LabelType): string => {
      switch (value) {
        case 0:
          return '<b>Ikke viktig</b>';
        case 1:
          return '<b>Lite viktig</b>';
        case 2:
          return '<b>Viktig</b>';
        case 3:
          return '<b>Ganske viktig</b>';
        case 4:
          return '<b>Svært viktig</b>';
        default:
          return '<b>Viktig</b>';
      }
    }
  };

  optionsWithTicks: Options = {
    floor: 0,
    ceil: 4,
    step: 1,
    showTicks: true,
    translate: (value: number, label: LabelType): string => {
      switch (value) {
        case 0:
          return '<b>Ikke viktig</b>';
        case 1:
          return '<b>Lite viktig</b>';
        case 2:
          return '<b>Nøytral</b>';
        case 3:
          return '<b>Ganske viktig</b>';
        case 4:
          return '<b>Svært viktig</b>';
        default:
          return '<b>Nøytral</b>';
      }
    }
  };

  constructor(private userDemoAnimation: UserScoreDemo) {}

  ngOnInit(): void {
    this.setInitialScoresListeners();
    this.setUpdateScoresListener();
    this.setDemoAnimationListener();
  }

  /* Sets scores to ad-hoc scores solution where  combinedStockEnsuranceProductsScore 
    is a combination of insucrance, stock and  saving score.
    Triggered by async in template file
    */
  setInitialScoresListeners(): void {
    this.combinedScores$ = this.initialScores.pipe(
      map((scores) => this.convertScoresToCombinedScores(scores)),
      tap((scores) => {
        this.initialScoresStorage = scores;
      })
    );

    this.combinedScores$ = this.initialScores.pipe(
      map((scores) => this.convertScoresToCombinedScores(scores)),
      tap((scores) => {
        this.initialScoresStorage = scores;
      })
    );
  }

  setUpdateScoresListener(): void {
    this.scoreObserveTrigger$ = this.collectScore$.pipe(
      debounceTime(200),
      // accumilates all scores that has been changed since last page load
      scan((acc, mergeFilter) => {
        return {
          ...acc,
          ...(mergeFilter as any)
        };
      }, {}),
      map((scores) => this.convertCombinedScoresToNormalScores(scores) as any),
      // Emitt score values to parent component via scoreListener
      tap((scores) => {
        // emit new value only if scores is not empty
        if (Object.keys(scores).length) this.scoreListener?.next(scores);
      })
    );

    // Subscribing just to trigger the observer. Bad workaround
    this.scoreObserveTrigger$.subscribe(() => {});
  }

  convertScoresToCombinedScores(
    scores: UserScorePreferences
  ): UserScorePreferences {
    return {
      advisorScore: scores.advisorScore,
      changeProcessScore: scores.changeProcessScore,
      complicatedEconomyScore: scores.complicatedEconomyScore,
      insuranceScore: scores.insuranceScore,
      localPresenceScore: scores.localPresenceScore,
      priceSensitivity: scores.priceSensitivity,
      savingScore: scores.savingScore,
      stockScore: scores.stockScore,
      combinedStockEnsuranceProductsScore: scores.insuranceScore
    };
  }

  convertCombinedScoresToNormalScores(
    scores: UserScorePreferences
  ): UserScorePreferences {
    const mutated = {
      advisorScore:
        scores.advisorScore ?? this.initialScoresStorage.advisorScore,
      changeProcessScore:
        scores.changeProcessScore ??
        this.initialScoresStorage.changeProcessScore,
      complicatedEconomyScore:
        scores.complicatedEconomyScore ??
        this.initialScoresStorage.complicatedEconomyScore,
      insuranceScore:
        scores.insuranceScore ??
        this.initialScoresStorage.combinedStockEnsuranceProductsScore,
      localPresenceScore:
        scores.localPresenceScore ??
        this.initialScoresStorage.localPresenceScore,
      priceSensitivity:
        scores.priceSensitivity ?? this.initialScoresStorage.priceSensitivity,
      savingScore:
        scores.savingScore ??
        this.initialScoresStorage.combinedStockEnsuranceProductsScore,
      stockScore:
        scores.stockScore ??
        this.initialScoresStorage.combinedStockEnsuranceProductsScore
    };
    return mutated;
  }

  CombinedScoreChanged(event: any): any {
    this.collectScore$.next({
      stockScore: event.value,
      insuranceScore: event.value,
      savingScore: event.value
    });
  }
  advisorScoreChanged(event: any): any {
    this.collectScore$.next({ advisorScore: event.value });
  }

  changeProcessScoreChanged(event: any): any {
    this.collectScore$.next({ changeProcessScore: event.value });
  }

  complicatedEconomyScoreChanged(event: any): any {
    this.collectScore$.next({ complicatedEconomyScore: event.value });
  }

  insuranceScoreChanged(event: any): any {
    this.collectScore$.next({ insuranceScore: event.value });
  }

  stockScoreChanged(event: any): any {
    this.collectScore$.next({ stockScore: event.value });
  }

  savingScoreChanged(event: any): any {
    this.collectScore$.next({ savingScore: event.value });
  }

  priceSensitivityChanged(event: any): any {
    this.collectScore$.next({ priceSensitivity: event.value });
  }

  localPresenceScoreChanged(event: any): any {
    this.collectScore$.next({ localPresenceScore: event.value });
  }

  setDemoAnimationListener(): void {
    this.shouldShowDemoListener &&
      this.shouldShowDemoListener
        .pipe(
          filter((shouldStart) => shouldStart === true),

          tap(() => {
            console.log('1 step!!');
            this.demoIsLive && this.userDemoAnimation.getUserScoreAnimation();
            this.demoIsLive = true;

            this.borderTest = true;
          }),
          delay(1000),
          filter(() => this.demoIsLive === true),
          tap(() => {
            console.log('2 step!!');
            this.demoIsLive && this.userDemoAnimation.getUserScoreAnimation();
            this.demoIsLive = true;
            this.demoValue = 1;
          }),
          delay(1000),
          filter(() => this.demoIsLive === true),
          tap(() => {
            console.log('3 step!!');
            this.demoIsLive && this.userDemoAnimation.getUserScoreAnimation();
            this.demoValue = 3;
          }),
          delay(1000),
          filter(() => this.demoIsLive === true),
          tap(() => {
            this.demoValue = 2;
            this.demoIsLive && this.userDemoAnimation.getUserScoreAnimation();
          }),
          delay(2000),
          tap(() => {
            this.demoIsLive = false;
            this.borderTest = false;
          })
        )
        .subscribe(() => {});

    this.shouldShowDemoListener &&
      this.shouldShowDemoListener
        .pipe(
          filter((shouldStart) => shouldStart === false),
          tap(() => {
            this.demoIsLive = false;
            this.borderTest = false;
          })
        )
        .subscribe(() => {});

    /*   this.triggerDemo = this.shouldShowDemoListener.pipe(
      delay(1000),
      tap(() => {
        this.demoValue = 1;
      }),
      delay(1000),
      tap(() => {
        this.demoValue = 3;
      }),
      delay(1000),
      tap(() => {
        this.demoValue = 2;
      })
    ); */
  }

  getAnimation(): any {
    return [
      {
        width: '32px',
        height: '32px',
        top: '-14px',
        border: '2px solid white',
        offset: 0.1
      },
      {
        width: '40px',
        height: '40px',
        top: '-10px',
        borderRadius: '50px',
        border: '2px solid white',
        offset: 0.2
      },
      {
        width: '32px',
        height: '32px',
        top: '-14px',
        border: '2px solid white',
        offset: 0.9
      }
    ];
  }

  getAnimationTiming(): any {
    return {
      duration: 1000,
      iterations: 4
    };
  }
}
