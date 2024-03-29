import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'rente-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnInit {
  totalOutstandingDebt: number;
  combinedSavingsPotential: number;
  interval: any;
  public totalOutstandingoptions = {
    startVal: 0,
    separator: ' '
  };

  public combinedSavingsPotentialOptions = {
    starVal: 0,
    separator: ' '
  };
  constructor() {}

  ngOnInit(): void {}
}
