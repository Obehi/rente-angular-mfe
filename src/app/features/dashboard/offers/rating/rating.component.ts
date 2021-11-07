import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'rente-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {
  // Rating should be an integer from 1 to 5
  @Input() rating: number;
  // TODO: Move to configs
  public ratingNumbers = [0, 1, 2, 3, 4];
  constructor() {}

  ngOnInit(): void {}
}
