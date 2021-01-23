import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'rente-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  @Input() isFrontPage: boolean;
  constructor() {}

  ngOnInit() {}
}
