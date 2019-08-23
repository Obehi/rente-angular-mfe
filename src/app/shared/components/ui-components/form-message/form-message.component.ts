import { Component, Input } from '@angular/core';

@Component({
  selector: 'rente-form-message',
  templateUrl: './form-message.component.html',
  styleUrls: ['./form-message.component.scss']
})
export class FormMessageComponent {
  // info, warning, error
  @Input() type: string;
}
