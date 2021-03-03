import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'rente-change-bank-location',
  templateUrl: './change-bank-location.component.html',
  styleUrls: ['./change-bank-location.component.scss']
})
export class ChangeBankLocationComponent implements OnInit {
  @Input() locations: any = {};
  constructor() {}

  ngOnInit(): void {
    console.log('locations');
    console.log(this.locations);
  }
}
