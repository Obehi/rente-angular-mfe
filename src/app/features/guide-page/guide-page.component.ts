import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'rente-guide-page',
  templateUrl: './guide-page.component.html',
  styleUrls: ['./guide-page.component.scss']
})
export class GuidePageComponent implements OnInit {
  @Input() isFrontPage: boolean;
  constructor() { }

  ngOnInit() {
  }

}
