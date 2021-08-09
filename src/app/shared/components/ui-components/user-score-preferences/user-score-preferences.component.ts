import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Options, LabelType } from '@angular-slider/ngx-slider';
import { BehaviorSubject, forkJoin, Observable, of, Subject } from 'rxjs';
import { UserScorePreferences } from '@models/user';
import {
  debounce,
  debounceTime,
  map,
  scan,
  startWith,
  switchMap,
  tap
} from 'rxjs/operators';
import { start } from 'repl';

@Component({
  selector: 'rente-user-score-preferences',
  templateUrl: './user-score-preferences.component.html',
  styleUrls: ['./user-score-preferences.component.scss']
})
export class UserScorePreferencesComponent implements OnInit {
  @Input() scoreListener: BehaviorSubject<UserScorePreferences>;
  @Input() initialScores: Observable<UserScorePreferences>;
  @Input() sliderBox = true;
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

  constructor() {}

  ngOnInit(): void {
    this.combinedScores$ = this.initialScores.pipe(
      map((scores) => this.getCombinedScores(scores))
    );

    this.combinedScores$.subscribe((scores) => {
      this.initialScoresStorage = scores;
    });

    this.scoreObserveTrigger$ = this.collectScore$.pipe(
      debounceTime(200),
      scan((acc, mergeFilter) => {
        return {
          ...acc,
          ...(mergeFilter as any)
        };
      }, {}),
      map((scores) => {
        return { ...this.initialScoresStorage, ...scores };
      }),
      tap((scores) => {
        // emit new value only if scores is not empty
        if (Object.keys(scores).length) this.scoreListener?.next(scores);
      })
    );

    forkJoin([this.scoreListener, of(2)])
      .pipe(tap((array) => console.log(array)))
      .subscribe((test) => {
        console.log(test);
      });

    // Subscribing just to trigger the observer. Bad workaround
    this.scoreObserveTrigger$.subscribe(() => {});
  }

  getCombinedScores(scores: UserScorePreferences): UserScorePreferences {
    return {
      advisorScore: scores.advisorScore,
      changeProcessScore: scores.changeProcessScore,
      complicatedEconomyScore: scores.complicatedEconomyScore,
      insuranceScore: scores.insuranceScore,
      localPresenceScore: scores.localPresenceScore,
      priceSensitivity: scores.priceSensitivity,
      savingScore: scores.savingScore,
      stockScore: scores.stockScore
    };
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
}
