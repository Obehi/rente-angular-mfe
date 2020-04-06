import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'rente-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({height:0, opacity:0}),
        animate('0.5s ease-out', style({height:300, opacity:1}))
      ]),
      transition(':leave', [
        style({height:300, opacity:1}),
        animate('0.5s ease-in', style({height:0, opacity:0}))
      ])
    ])
  ]
})
export class LandingComponent implements OnInit {
  time = 0;
  get isMobile(): boolean { return window.innerWidth < 1024; }

  ngOnInit(): void {
    const subscription = timer(1000, 1000).subscribe(t => {
      this.time = t;
      if (t === 3) {
        subscription.unsubscribe();
      }
    });
  }

}
