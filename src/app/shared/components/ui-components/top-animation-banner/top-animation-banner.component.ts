import { Component, OnInit } from '@angular/core';
import { slideLeftRight } from '@shared/animations/slide-left-right';

@Component({
  selector: 'rente-top-animation-banner',
  templateUrl: './top-animation-banner.component.html',
  styleUrls: ['./top-animation-banner.component.scss'],
  animations: [slideLeftRight]
})
export class TopAnimationBannerComponent implements OnInit {
  public animationState: boolean;
  public displayText = 'Fortnite';
  time: number;

  constructor() {}

  public changeTimer(_time: number): void {
    setTimeout(() => {
      this.animationState = false;
    }, _time);
  }

  ngOnInit(): void {
    this.animationState = true;
  }
}
