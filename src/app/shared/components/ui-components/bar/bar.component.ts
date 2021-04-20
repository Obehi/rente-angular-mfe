import { Component, OnInit, Input } from '@angular/core';
import { Interface } from 'readline';

@Component({
  selector: 'rente-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})
export class BarComponent implements OnInit {
  @Input() highestValue: number;
  @Input() currentValue: number;

  constructor() {}
  ngOnInit(): void {}

  get percentage(): number {
    return this.currentValue / this.highestValue;
  }

  get widthPercentage(): string {
    return `${String(this.percentage * 100)}%`;
  }

  get colorClass(): string {
    let color = '';

    if (this.percentage > 0.8) {
      color = 'green';
    } else if (this.percentage > 0.6) {
      color = 'green-light';
    } else if (this.percentage > 0.4) {
      color = 'yellow';
    } else if (this.percentage > 0.2) {
      color = 'orange';
    } else {
      color = 'red';
    }
    return color;
  }

  get shapeClass(): string {
    return this.percentage > 0.99 ? 'round' : 'mixed';
  }
}
