import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MESSAGE_STATUS } from '../login-status/login-status.config';
@Component({
  selector: 'rente-status-message',
  templateUrl: './status-message.component.html',
  styleUrls: ['./status-message.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StatusMessageComponent {

  public MESSAGE_STATUS = MESSAGE_STATUS;

  @Input() status: string;
  @Input() step: number;

}
