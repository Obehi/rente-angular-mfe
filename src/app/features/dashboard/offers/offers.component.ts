import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogInfoComponent } from './dialog-info/dialog-info.component';

@Component({
  selector: 'rente-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {
  public offersInfo: any;
  constructor(public dialog: MatDialog) { }

  public ngOnInit(): void {
    this.offersInfo =  JSON.parse(localStorage.getItem('loans'));
    console.log(this.offersInfo);
  }

  public openDialog(): void {
    this.dialog.open(DialogInfoComponent, {
      width: '600px',
      data: {
        animal: 'test'
      }
    });
  }

}
