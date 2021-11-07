import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'rente-intro-crawler-is-off-dnb',
  templateUrl: './intro-crawler-is-off-dnb.component.html',
  styleUrls: ['../intro.scss']
})
export class IntroCrawlerIsOffDnbComponent implements OnInit {
  @Input() generalText: string;

  constructor() {}

  ngOnInit(): void {}
}
