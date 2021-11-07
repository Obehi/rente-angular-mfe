import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'rente-intro-redirect',
  templateUrl: './intro-redirect.component.html',
  styleUrls: ['../intro.scss']
})
export class IntroRedirectComponent implements OnInit {
  @Input() generalText: string;
  constructor() {}

  ngOnInit(): void {}
}
