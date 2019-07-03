import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'status-message',
  templateUrl: './status-message.component.html',
  styleUrls: ['./status-message.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StatusMessageComponent {

  @Input() status: string;
 
}
