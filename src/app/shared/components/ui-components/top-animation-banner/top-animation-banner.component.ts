import { Component, OnInit } from '@angular/core';
import {
  AnimationStylesEnum,
  getAnimationStyles
} from '@shared/animations/animationEnums';
import { SlideLeftRight } from '@shared/animations/slide-left-right';
import { DropDownUp } from '@shared/animations/drop-down-up';

@Component({
  selector: 'rente-top-animation-banner',
  templateUrl: './top-animation-banner.component.html',
  styleUrls: ['./top-animation-banner.component.scss'],
  animations: [SlideLeftRight, DropDownUp]
})
export class TopAnimationBannerComponent implements OnInit {
  public animationState: boolean;
  public displayText = 'Hello!';
  public animationType: AnimationStylesEnum;
  public checkAnimationStyle = getAnimationStyles();
  time: number;

  constructor() {}

  ngOnInit(): void {
    this.animationState = true;
  }

  public changeTimer(_time: number): void {
    setTimeout(() => {
      this.animationState = false;
    }, _time);
  }
}
