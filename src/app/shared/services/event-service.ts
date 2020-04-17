import { Injectable } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { map, filter, throttleTime, debounceTime } from "rxjs/operators";

//https://stackoverflow.com/questions/56290722/how-pass-a-event-from-deep-nested-child-to-parent-in-angular-2
export enum Events {
  INPUT_CHANGE = "input change",
  // other events here
}

export class EmitEvent {
  name;
  value;
  constructor(name: string, value: any) {
    this.name = name;
    this.value = value;
  }
}

@Injectable()
export class EventService {
  private subject$ = new Subject();

  emit(event: EmitEvent) {
    this.subject$.next(event);
  }

  on(event: string, action: any): Subscription {
    return this.subject$
      .pipe(
        debounceTime(2000),
        filter((e: EmitEvent) => e.name == event),
        map((e: EmitEvent) => e.value)
      )
      .subscribe(action);
  }
}
