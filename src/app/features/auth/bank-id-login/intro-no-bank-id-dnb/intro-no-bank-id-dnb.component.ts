import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'rente-intro-no-bank-id-dnb',
  templateUrl: './intro-no-bank-id-dnb.component.html',
  styleUrls: ['../intro.scss']
})
export class IntroNoBankIdDnbComponent implements OnInit {
  @Input() generalText: string;

  constructor() {}

  ngOnInit(): void {}
}
