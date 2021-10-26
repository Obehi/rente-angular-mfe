import { Component, Input, OnInit } from '@angular/core';
import { BankVo } from '@models/bank';

@Component({
  selector: 'rente-intro-redirect-dnb',
  templateUrl: './intro-redirect-dnb.component.html',
  styleUrls: ['../intro.scss']
})
export class IntroRedirectDnbComponent implements OnInit {
  @Input() bank: BankVo;
  @Input() generalText: BankVo;
  constructor() {}

  ngOnInit(): void {}
}
