import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'rente-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  @Input() isFrontPage: boolean;
  constructor() { }

  ngOnInit() {
  }

}
