import { Component, OnInit } from '@angular/core';
import {
  AnimationStylesEnum,
  getAnimationStyles
} from '@shared/animations/animationEnums';
import { SlideLeftRight } from '@shared/animations/slide-left-right';
import { DropDownUp } from '@shared/animations/drop-down-up';
import { SlideUp } from '@shared/animations/slide-up';
import { Subject } from 'rxjs';

@Component({
  selector: 'rente-top-animation-banner',
  templateUrl: './top-animation-banner.component.html',
  styleUrls: ['./top-animation-banner.component.scss'],
  animations: [SlideLeftRight, DropDownUp, SlideUp]
})
export class TopAnimationBannerComponent implements OnInit {
  public animationState: boolean;
  public displayText = '';
  public animationType: AnimationStylesEnum;
  public checkAnimationStyle = getAnimationStyles();
  public isDashboard: boolean;
  public status: string;
  public clickSubject$ = new Subject<any>();
  public scrollArrow: boolean;
  public scrollArrowImg = '../../../../../assets/icons/arrow-down.svg';

  constructor() {}

  ngOnInit(): void {
    this.animationState = true;
  }

  public changeTimer(_time: number): void {
    setTimeout(() => {
      this.animationState = false;
    }, _time);
  }

  public onClickBanner(): void {
    this.clickSubject$.next();
  }

  public shouldShowArrow(args: boolean): void {
    this.scrollArrow = args;
  }
}
