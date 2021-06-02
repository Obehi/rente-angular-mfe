import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  transition,
  style,
  animate
} from '@angular/animations';

@Component({
  selector: 'rente-top-animation-banner',
  templateUrl: './top-animation-banner.component.html',
  styleUrls: ['./top-animation-banner.component.scss'],
  animations: [
    trigger('slideLeftRight', [
      state('hidden', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('200ms ease-in-out')
      ]),
      transition('visible => hidden', [
        style({ opacity: 1 }),
        animate(
          '400ms ease-out',
          style({ opacity: 0, transform: 'translateX(100%)' }) // Define the style when it goes to state hidden
        )
      ])
    ]) // Trigger end
  ]
})
export class TopAnimationBannerComponent implements OnInit {
  public animationState: boolean;
  public displayText = 'Fortnite';
  time: number;

  constructor() {}

  public changeTimer(_time: number): void {
    setTimeout(() => {
      this.animationState = false;
    }, _time);
  }

  ngOnInit(): void {
    this.animationState = true;
  }
}
