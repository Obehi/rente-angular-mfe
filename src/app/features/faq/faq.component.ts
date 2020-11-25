import { Component, OnInit, Input } from '@angular/core';
import { ROUTES_MAP } from '@config/routes-config';
import { locale } from '../../config/locale/locale';

@Component({
  selector: 'rente-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  @Input() isFrontPage: boolean;
  public routes = ROUTES_MAP
  public isSweden = false;

  constructor() { }
  
  ngOnInit() {
    if(locale.includes("sv")) {
      this.isSweden = true
    } else{
      this.isSweden = false
    }
  }

}
