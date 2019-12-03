import { Component } from "@angular/core";

import { Observable, Observer } from "rxjs";

@Component({
  selector: "rente-counter",
  templateUrl: "./counter.component.html",
  styleUrls: ["./counter.component.scss"]
})
export class CounterComponent {
  public loan: number = 4001753321;
  public save: number = 150311435;
  public observable: Observable<boolean>;
  private observer: Observer<boolean>;

  constructor() {
    this.observable = new Observable<boolean>(
      (observer: any) => (this.observer = observer)
    );

    setTimeout(() => {
      setInterval(() => {
        this.loan += 1000;
      }, 2000);
    }, 1000);

    setTimeout(() => {
      setInterval(() => {
        this.save += 30;
      }, 2000);
    }, 1000);

    // For auto mode
    /* setTimeout(() => (this.number += this.number), 5000); // Update on 5 seconds */
  }
}
