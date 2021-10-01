import { Component } from '@angular/core';

@Component({
  selector: 'rente-epsi-score',
  templateUrl: './epsi-score.component.html',
  styleUrls: ['./epsi-score.component.scss']
})
export class EPSIScoreComponent {
  private hasScrolledToTop = false;

  constructor() {}

  ngAfterViewChecked(): void {
    if (this.hasScrolledToTop === false) {
      this.hasScrolledToTop = true;
      window.scrollTo(0, 0);
    }
  }
}
