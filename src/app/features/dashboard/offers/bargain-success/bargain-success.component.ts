import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReferralComponent } from './referral/referral.component';
import { MatDialog } from '@angular/material/dialog';
import { ROUTES_MAP } from '@config/routes-config';

@Component({
  selector: 'rente-bargain-success',
  templateUrl: './bargain-success.component.html',
  styleUrls: ['./bargain-success.component.scss']
})
export class BargainSuccessComponent implements OnInit {
  public isErrorState = false;
  private hasScrolledToTop = false;

  constructor(private router: Router, public dialog: MatDialog) {}

  ngOnInit() {
    this.dialog.open(ReferralComponent);
  }

  public continue() {
    this.router.navigate(['/dashboard/' + ROUTES_MAP.offers]);
  }
}
