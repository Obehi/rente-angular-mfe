import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Options, LabelType } from '@angular-slider/ngx-slider';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { UserScorePreferences } from '@models/user';
import { debounce, debounceTime, scan, tap } from 'rxjs/operators';

@Component({
  selector: 'rente-user-score-preferences',
  templateUrl: './user-score-preferences.component.html',
  styleUrls: ['./user-score-preferences.component.scss']
})
export class UserScorePreferencesComponent implements OnInit {
  @Input() scoreListener: BehaviorSubject<UserScorePreferences>;
  @Input() initialScores: Observable<UserScorePreferences>;

  scoreObserveTrigger$ = new Observable();
  collectScore$ = new Subject();

  minValue = 0;
  maxValue = 5;

  value = 5;
  options: Options = {
    floor: 0,
    ceil: 5,
    step: 1,
    showTicks: true
  };

  constructor() {}

  ngOnInit(): void {
    this.scoreObserveTrigger$ = this.collectScore$.pipe(
      debounceTime(200),
      scan((acc, mergeFilter) => {
        return {
          ...acc,
          ...(mergeFilter as any)
        };
      }, {}),
      tap((scores) => {
        // emit new value only if scores is not empty

        if (Object.keys(scores).length) this.scoreListener?.next(scores);
      })
    );

    // Subscribing just to trigger the observer. Bad workaround
    this.scoreObserveTrigger$.subscribe(() => {});
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
