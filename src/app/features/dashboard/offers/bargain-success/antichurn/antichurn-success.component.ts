import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReferralComponent } from '../referral/referral.component';
import { MatDialog } from '@angular/material/dialog';
import { ROUTES_MAP } from '@config/routes-config';
import { EnvService } from '@services/env.service';
@Component({
  selector: 'rente-nordea-bargain-success',
  templateUrl: './antichurn-success.component.html',
  styleUrls: ['./antichurn-success.component.scss']
})
export class AntiChurnSuccessComponent implements OnInit {
  public isErrorState = false;
  public bankName: string;
  constructor(
    private router: Router,
    public dialog: MatDialog,
    public envService: EnvService
  ) {
    const data = this.router?.getCurrentNavigation()?.extras?.state;
    this.bankName = data?.bankName ?? 'banken';
  }

  ngOnInit(): void {
    this.dialog.open(ReferralComponent);
  }

  public continue(): void {
    this.router.navigate(['/dashboard/' + ROUTES_MAP.offers]);
  }
}
