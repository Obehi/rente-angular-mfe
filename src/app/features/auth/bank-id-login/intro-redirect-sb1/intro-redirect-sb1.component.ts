import { Component, Input, OnInit } from '@angular/core';
import { BankVo } from '@models/bank';

@Component({
  selector: 'rente-intro-redirect-sb1',
  templateUrl: './intro-redirect-sb1.component.html',
  styleUrls: ['../intro.scss']
})
export class IntroRedirectSb1Component implements OnInit {
  @Input() bank: BankVo;

  constructor() {}

  ngOnInit(): void {}
}
