import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rente-epsi-score',
  templateUrl: './epsi-score.component.html',
  styleUrls: ['./epsi-score.component.scss']
})
export class EPSIScoreComponent  {

  constructor() { }


  ngAfterViewChecked() {
    window.scrollTo(0, 0);
  }

}
