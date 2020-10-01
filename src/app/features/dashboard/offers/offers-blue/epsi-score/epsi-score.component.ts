import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rente-epsi-score',
  templateUrl: './epsi-score.component.html',
  styleUrls: ['./epsi-score.component.scss']
})
export class EPSIScoreComponent  {

  private hasScrolledToTop = false;

  constructor() { }


  ngAfterViewChecked() {
    //window.scrollTo(0, 0);
    console.log("hasScrolledToTop: " + this.hasScrolledToTop)
     if(this.hasScrolledToTop == false) {
      console.log("should scroll now")
      this.hasScrolledToTop = true;
      window.scrollTo(0, 0);
    } 
    console.log("should not scroll now")
  }


}
