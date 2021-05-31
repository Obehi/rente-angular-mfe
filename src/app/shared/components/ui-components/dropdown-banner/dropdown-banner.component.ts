import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { from, of } from 'rxjs';
import { timeout } from 'rxjs/operators';
import {
  trigger,
  state,
  transition,
  style,
  animate,
  keyframes
} from '@angular/animations';

@Component({
  selector: 'rente-dropdown-banner',
  templateUrl: './dropdown-banner.component.html',
  styleUrls: ['./dropdown-banner.component.scss'],
  animations: [
    trigger('banner', [
      // V1
      // state('hidden', style({ opacity: 0 })),
      // state('visible', style({ opacity: 1 })),
      // transition('hidden => visible', [animate('3s ease-in-out')]),
      // transition('visible => hidden', [animate('5s ease-in-out')])
      // V2
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('500ms ease-in', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0%)' }),
        animate('500ms ease-in', style({ transform: 'translateY(-100%)' }))
      ])
      // V3
      // transition(':enter', [
      //   style({ height: 0, opacity: 0 }),
      //   animate('300ms ease-in', style({ height: 60, opacity: 1 }))
      // ]),
      // transition(':leave', [
      //   // style({ height: '100', opacity: 1 }),
      //   animate('0.123s ease-in', style({ height: 0, opacity: 0 }))
      // ])
      // V4
      // state('in', style({ transform: 'translateY(0)' })),
      // transition('void => *', [
      //   style({ transform: 'translateY(-100%)' }),
      //   animate(100)
      // ]),
      // transition('* => void', [
      //   animate(100, style({ transform: 'translateY(100%)' }))
      // ])
    ]) // Trigger end
  ]
})
@HostBinding('@banner')
export class DropdownBannerComponent implements OnInit, OnDestroy {
  public animationState: boolean;
  // public animationTrigger: boolean;
  // variable = 'Test her';
  // public updateAnimationTrigger: boolean;

  constructor() {
    // of('text')
    //   .pipe(timeout())
    //   .subscribe((response) => {
    //     this.variable = response;
    //   });
  }

  public setTrigger(v: boolean): void {
    this.animationState = v;
    console.log('Function trigger is called');
    console.log('Animation state: ' + this.animationState);
  }

  ngOnInit(): void {
    // this.updateAnimationTrigger = false;
  }

  ngOnDestroy(): void {
    // this.setTrigger('hidden');
  }
}
