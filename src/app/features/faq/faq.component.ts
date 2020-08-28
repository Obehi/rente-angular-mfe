import { Component, OnInit, Input } from '@angular/core';
import { ROUTES_MAP } from '@config/routes-config';

@Component({
  selector: 'rente-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  @Input() isFrontPage: boolean;
  public routes = ROUTES_MAP

  constructor() { }
  
  ngOnInit() {
  }

}
