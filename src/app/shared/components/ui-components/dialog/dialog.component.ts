import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'rente-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  @Input() title = 'Title';
  @Input() message = 'Message text';
  @Output() action: EventEmitter<boolean> = new EventEmitter();

  ngOnInit(): void {}

  onClick(answer: boolean): void {
    this.action.emit(answer);
  }

  get dialogWidth(): number {
    return window.innerWidth >= 1024 ? 600 : window.innerWidth;
  }
}
