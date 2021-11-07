import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'rente-intro-no-bank-id-nordea',
  templateUrl: './intro-no-bank-id-nordea.component.html',
  styleUrls: ['../intro.scss']
})
export class IntroNoBankIdNordeaComponent implements OnInit {
  @Input() generalText: string;

  constructor() {}

  ngOnInit(): void {}
}
