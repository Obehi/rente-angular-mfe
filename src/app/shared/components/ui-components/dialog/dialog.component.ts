import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'rente-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {

  @Input() title:string = 'Title';
  @Input() message:string = 'Message text';
  @Output() action:EventEmitter<boolean> = new EventEmitter();

  ngOnInit(): void {
  }

  onClick(answer:boolean) {
    this.action.emit(answer);
  }

  get dialogWidth():number {
    return window.innerWidth >= 1024 ? 600 : window.innerWidth;
  }

}
