import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import {OptimizeService} from '@services/optimize.service'

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
  get isMobile(): boolean { return window.innerWidth < 600; }
  optimize: OptimizeService
  constructor(optimize: OptimizeService) {
    this.optimize = optimize;
  }
  ngOnInit(): void {
    this.getVariation()
    console.log(this.optimize.getVariation() )



    const subscription = timer(1000, 1000).subscribe(t => {
      this.time = t;
      if (t === 3) {
        subscription.unsubscribe();
      }
    });
  }

  getVariation(): number | null {
    console.log("variation " + (window as any).google_optimize.get('-FGlj4ayQK66hF9kV4Wiow'));
    
    if((window as any).google_optimize == undefined) {
      return null;
    }
    if((window as any).google_optimize == null) {
      return null;
    }

    console.log("variation " + (window as any).google_optimize.get('-FGlj4ayQK66hF9kV4Wiow'));
    return (window as any).google_optimize.get('-FGlj4ayQK66hF9kV4Wiow');
  }
}
