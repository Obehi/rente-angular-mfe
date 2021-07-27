import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Options, LabelType } from '@angular-slider/ngx-slider';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { UserScorePreferences } from '@models/user';
import {
  multicast,
  refCount,
  scan,
  share,
  switchMap,
  tap
} from 'rxjs/operators';

@Component({
  selector: 'rente-user-score-preferences',
  templateUrl: './user-score-preferences.component.html',
  styleUrls: ['./user-score-preferences.component.scss']
})
export class UserScorePreferencesComponent implements OnInit {
  @Input() scoreListener: Subject<UserScorePreferences>;
  @Input() scoreObservable: Observable<any>;

  @Output()
  scoreEmitter: EventEmitter<UserScorePreferences> = new EventEmitter();

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

  defaultFilter = {};
  inputSubject$ = new Subject();

  filterChanges$ = new Subject();

  advisorScoreChanged(event: any): any {
    this.filterChanges$.next({ advisorScore: event.value });
  }

  changeProcessScoreChanged(event: any): any {
    this.filterChanges$.next({ changeProcessScore: event.value });
  }

  complicatedEconomyScoreChanged(event: any): any {
    this.filterChanges$.next({ complicatedEconomyScore: event.value });
  }

  insuranceScoreChanged(event: any): any {
    this.filterChanges$.next({ insuranceScore: event.value });
  }

  stockScoreChanged(event: any): any {
    this.filterChanges$.next({ stockScore: event.value });
  }

  savingScoreChanged(event: any): any {
    this.filterChanges$.next({ savingScore: event.value });
  }

  priceSensitivityChanged(event: any): any {
    this.filterChanges$.next({ priceSensitivity: event.value });
  }

  localPresenceScoreChanged(event: any): any {
    this.filterChanges$.next({ localPresenceScore: event.value });
  }

  constructor() {
    /* this.inputSubject.subscribe((value) => {
      console.log('value');
      console.log(value);
    }); */
    /*  this.scoreListener = this.filterChanges$.pipe(
      scan((acc, mergeFilter) => {
        return {
          ...acc,
          ...(mergeFilter as any)
        };
      }, this.defaultFilter),
      tap((scores) => {
        this.scoreListener.next(scores);
      }),
      share()
    ); */
  }

  ngOnInit(): void {
    this.scoreObservable = this.filterChanges$.pipe(
      scan((acc, mergeFilter) => {
        return {
          ...acc,
          ...(mergeFilter as any)
        };
      }, this.defaultFilter),
      tap((scores) => {
        //  this.scoreListener.next(scores);
        this.scoreListener?.next(scores);
      }),
      share()
    );
    this.scoreObservable.subscribe(() => {
      console.log('print');
    });
  }
}
