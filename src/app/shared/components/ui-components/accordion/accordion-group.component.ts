import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';

@Component({
  selector: 'group',
  templateUrl: 'accordion.component.html',
  styleUrls: ['accordion.component.scss'],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          transform: 'rotate(0deg)'
        })
      ),
      state(
        'close',
        style({
          transform: 'rotate(0deg)'
        })
      ),
      transition('* => close', [
        animate('0.1s', style({ transform: 'rotate(180deg)' }))
      ]),
      transition('* => open', [
        animate('0.1s', style({ transform: 'rotate(-180deg)' }))
      ])
    ]),
    trigger('smoothCollapse', [
      state(
        'initial',
        style({
          height: '0',
          overflow: 'hidden',
          visibility: 'hidden',
          padding: '0 15px'
        })
      ),
      state(
        'final',
        style({
          overflow: 'hidden',
          padding: '15px'
        })
      ),
      transition('initial<=>final', [animate('0.15s ease-in')])
      // transition('* => final', [animate('0.3s')])
    ]),
    trigger('rotatedState', [
      state('default', style({ transform: 'rotate(0)' })),
      state('rotated', style({ transform: 'rotate(180deg)' })),
      transition('default <=> rotated', animate('250ms'))
    ])
  ]
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionGroupComponent implements OnInit, OnDestroy {
  ngOnInit(): void {}

  ngOnDestroy(): void {}
  /**
   * If the panel is opened or closed
   */
  @Input() opened = false;

  /**
   * Text to display in the group title bar
   */
  @Input() title: string;

  /**
   * Emitted when user clicks on group titlebar
   * @type {EventEmitter<any>}
   */
  @Output() toggle: EventEmitter<any> = new EventEmitter<any>();
}
