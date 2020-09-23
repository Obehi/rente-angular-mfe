import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rente-epsi-score',
  templateUrl: './epsi-score.component.html',
  styleUrls: ['./epsi-score.component.scss']
})
export class EPSIScoreComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.scrollTo(0,0);
  }

}
