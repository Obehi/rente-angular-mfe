import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'rente-intro-no-bank-id',
  templateUrl: './intro-no-bank-id.component.html',
  styleUrls: ['../intro.scss']
})
export class IntroNoBankIDComponent implements OnInit {
  @Input() generalText: string;

  constructor() {}

  ngOnInit(): void {}
}
