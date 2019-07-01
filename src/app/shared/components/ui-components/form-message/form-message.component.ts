import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'rente-form-message',
  templateUrl: './form-message.component.html'
})
export class FormMessageComponent implements OnInit {
  @Input() show = false;

  // info, warning, error
  @Input() type: string;

  constructor() { }

  ngOnInit() {
  }

}
