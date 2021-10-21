import { Component, Input, OnInit } from '@angular/core';
import { BankVo } from '@models/bank';

@Component({
  selector: 'rente-intro-default-signicat',
  templateUrl: './intro-default-signicat.component.html',
  styleUrls: ['../intro.scss']
})
export class IntroDefaultSignicatComponent implements OnInit {
  @Input() bank?: BankVo;
  @Input() generalText: string;

  constructor() {}

  ngOnInit(): void {}
}
