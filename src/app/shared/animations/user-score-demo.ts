import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserScoreDemo {
  constructor() {}

  getUserScoreAnimation(): void {
    document
      .getElementsByClassName('ngx-slider-pointer')[0]
      .animate(
        this.getUserScoreAnimations(),
        this.getUserScoreAnimationTiming()
      );
  }

  getUserScoreAnimations(): Keyframe[] | PropertyIndexedKeyframes {
    return [
      {
        width: '32px',
        height: '32px',
        top: '-14px',
        border: '2px solid #b74ddc',
        background: '#b74ddc'
      },
      {
        width: '36px',
        height: '36px',
        top: '-16px',
        borderRadius: '50px',
        border: '2px solid #b74ddc',
        background: '#b74ddc'
      },
      {
        width: '32px',
        height: '32px',
        top: '-14px',
        border: '2px solid #b74ddc',
        background: '#b74ddc'
      }
    ];
  }

  getUserScoreAnimationTiming(): {
    duration: number;
    iterations: number;
    delay: number;
  } {
    return {
      duration: 600,
      iterations: 1,
      delay: 300
    };
  }
}
