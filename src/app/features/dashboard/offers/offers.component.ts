import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rente-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {
  public offersInfo: any;
  constructor() { }

  ngOnInit() {
    this.offersInfo =  JSON.parse(localStorage.getItem('loans'));
    console.log(this.offersInfo);
  }

}
