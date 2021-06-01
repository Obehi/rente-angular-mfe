import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  transition,
  style,
  animate,
  query,
  animateChild
} from '@angular/animations';

@Component({
  selector: 'rente-dropdown-banner',
  templateUrl: './dropdown-banner.component.html',
  styleUrls: ['./dropdown-banner.component.scss'],
  animations: [
    trigger('textDelay', [
      // V1
      state('hidden', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('100ms ease-in-out', style({ transform: 'translateX(0%)' }))
      ]),
      transition('visible => hidden', [
        animate('650ms ease-in-out', style({ transform: 'translateX(100%)' }))
      ])
    ]), // Trigger 1 end

    trigger('slideLeftRight', [
      // V2
      state('hidden', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('400ms ease-in-out', style({ transform: 'translateX(0%)' })),
        query('@*', animateChild(), { optional: true })
      ]),
      transition('visible => hidden', [
        animate('450ms ease-in-out', style({ transform: 'translateX(100%)' }))
      ])
    ]) // Trigger 2 end
  ]
})
export class DropdownBannerComponent implements OnInit {
  public animationState: boolean;
  public textDelay: boolean;

  constructor() {}

  close(): void {}

  public setTrigger(v: boolean): void {
    this.animationState = v;
    console.log('Function trigger is called');
    console.log('Animation state: ' + this.animationState);
  }

  ngOnInit(): void {
    this.setTrigger(true);
    this.textDelay = true;

    setTimeout(() => {
      this.setTrigger(false);
      this.textDelay = false;
    }, 5000);
  }
}
