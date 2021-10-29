import {
  trigger,
  state,
  transition,
  style,
  animate
} from '@angular/animations';

export const ButtonFadeInOut = trigger('buttonFadeInOut', [
  state('hidden', style({ opacity: 0 })),
  state('visible', style({ opacity: 1 })),
  transition(':enter', [style({ opacity: 0 }), animate('250ms 0.3s ease-out')]),
  transition('visible => hidden', [
    style({ opacity: 1 }),
    animate('300ms ease-out')
  ])
]); // Trigger end
