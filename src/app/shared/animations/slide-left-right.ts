import {
  trigger,
  state,
  transition,
  style,
  animate
} from '@angular/animations';

export const slideLeftRight = trigger('slideLeftRight', [
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
]); // Trigger end
