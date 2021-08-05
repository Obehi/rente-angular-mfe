import {
  trigger,
  state,
  transition,
  style,
  animate
} from '@angular/animations';

export const SlideUp = trigger('slideUp', [
  state('hidden', style({ opacity: 0 })),
  state('visible', style({ opacity: 1 })),
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(200%)' }),
    animate('200ms ease-in-out')
  ]),
  transition('visible => hidden', [
    style({ opacity: 1 }),
    animate(
      '200ms ease-out',
      style({ opacity: 0, transform: 'translateY(200%)' }) // Define the style when it goes to state hidden
    )
  ])
]); // Trigger end
