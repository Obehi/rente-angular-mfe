import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'rente-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
  // Input example: "23px"
  @HostBinding('style.--size')
  @Input()
  size: string;

  constructor() {}

  ngOnInit(): void {}
}
