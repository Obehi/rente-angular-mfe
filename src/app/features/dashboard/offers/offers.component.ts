import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogInfoComponent } from './dialog-info/dialog-info.component';
import { LoansService } from '@services/remote-api/loans.service';

@Component({
  selector: 'rente-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {
  public offersInfo: any;
  constructor(public dialog: MatDialog, private loansService: LoansService) { }

  public ngOnInit(): void {
    this.offersInfo =  JSON.parse(localStorage.getItem('loans'));
    console.log(this.offersInfo);

    this.loansService.getLoans().subscribe(res => {
      console.log('loans', res);
    });
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
