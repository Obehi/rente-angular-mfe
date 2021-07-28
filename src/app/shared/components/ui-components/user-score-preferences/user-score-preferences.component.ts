import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Options, LabelType } from '@angular-slider/ngx-slider';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { UserScorePreferences } from '@models/user';
import { scan, tap } from 'rxjs/operators';

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
    showTicks: true,
    showTicksValues: true,
    translate: (value: number): string => {
      return '$' + value;
    }
  };

  minValue2 = 0;
  maxValue2 = 4;

  options2: Options = {
    floor: 0,
    ceil: 4,
    showTicks: true,
    translate: (value: number): string => {
      switch (value) {
        case 0:
          return '<b>Min price:</b> $' + value;
        case 1:
          return '<b>Max price:</b> $' + value;
        case 2:
          return '<b>Max price:</b> $' + value;
        case 3:
          return '<b>Max price:</b> $' + value;
        case 4:
          return '<b>Max price:</b> $' + value;
        default:
          return '$' + value;
      }
    }
  };

  constructor() {}

  ngOnInit(): void {
    this.scoreObserveTrigger$ = this.collectScore$.pipe(
      scan((acc, mergeFilter) => {
        return {
          ...acc,
          ...(mergeFilter as any)
        };
      }, {}),
      tap((scores) => {
        this.scoreListener?.next(scores);
      })
    );
    this.scoreObserveTrigger$.subscribe(() => {
      console.log('print');
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
