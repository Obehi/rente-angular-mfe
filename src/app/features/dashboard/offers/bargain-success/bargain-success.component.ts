import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReferralComponent } from './referral/referral.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'rente-bargain-success',
  templateUrl: './bargain-success.component.html',
  styleUrls: ['./bargain-success.component.scss']
})
export class BargainSuccessComponent implements OnInit {
  
  public isErrorState = false

  constructor(private router: Router, public dialog: MatDialog) {


    //REMOVE COMMENTS BEFORE PRODUCTION!!!!
    /*
     if(!window.history.state.fromChangeBankDialog) {
      this.router.navigate(['/dashboard/tilbud'])
    }
     if(!window.history.state.isError) {
      this.isErrorState = true
    }  
   */
   } 

  ngOnInit() {
    this.dialog.open(ReferralComponent);
  }

  public continue() {
    this.router.navigate(['/dashboard/tilbud'])
  }
}

