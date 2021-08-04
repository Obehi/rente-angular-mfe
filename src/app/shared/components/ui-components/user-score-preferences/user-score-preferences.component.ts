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
  initialScoresStorage: UserScorePreferences;

  combinedScores$: Observable<UserScorePreferences>;
  scoreObserveTrigger$ = new Observable();
  collectScore$ = new Subject<UserScorePreferences>();

  testType = 0;
  options: Options = {
    floor: 1,
    ceil: 5,
    step: 1,
    showTicks: false,
    translate: (value: number, label: LabelType): string => {
      switch (value) {
        case 1:
          return '<b>Ikke viktig</b>';
        case 2:
          return '<b>Litt viktig</b>';
        case 3:
          return '<b>Viktig</b>';
        case 4:
          return '<b>Ganske viktig</b>';
        case 5:
          return '<b>Svært viktig</b>';
        default:
          return '<b>Viktig</b>';
      }
    }
  };

  optionsWithTicks: Options = {
    floor: 1,
    ceil: 5,
    step: 1,
    showTicks: true,
    translate: (value: number, label: LabelType): string => {
      switch (value) {
        case 1:
          return '<b>Ikke viktig</b>';
        case 2:
          return '<b>Litt viktig</b>';
        case 3:
          return '<b>Viktig</b>';
        case 4:
          return '<b>Ganske viktig</b>';
        case 5:
          return '<b>Svært viktig</b>';
        default:
          return '<b>Viktig</b>';
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

  getCombinedScores(scores: UserScorePreferences) {
    return {
      advisorScore: scores.advisorScore || 2.5,
      changeProcessScore: scores.changeProcessScore || 2.5,
      complicatedEconomyScore: scores.complicatedEconomyScore || 2.5,
      insuranceScore: scores.insuranceScore || 2.5,
      localPresenceScore: scores.localPresenceScore || 2.5,
      priceSensitivity: scores.priceSensitivity || 2.5,
      savingScore: scores.savingScore || 2.5,
      stockScore: scores.stockScore || 2.5,
      combinedStockEnsuranceProductsScore:
        ((scores.insuranceScore || 2.5) +
          (scores.stockScore || 2.5) +
          (scores.savingScore || 2.5)) /
        3
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
