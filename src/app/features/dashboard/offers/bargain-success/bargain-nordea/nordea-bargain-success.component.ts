import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReferralComponent } from '../referral/referral.component';
import { MatDialog } from '@angular/material/dialog';
import { ROUTES_MAP } from '@config/routes-config';
import { EnvService } from '@services/env.service';
import { TabsService } from '@services/tabs.service';
@Component({
  selector: 'rente-nordea-bargain-success',
  templateUrl: './nordea-bargain-success.component.html',
  styleUrls: ['./nordea-bargain-success.component.scss']
})
export class NordeaBargainSuccessComponent implements OnInit {
  public isErrorState = false;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    public envService: EnvService,
    private tabsService: TabsService
  ) {}

  ngOnInit(): void {
    this.dialog.open(ReferralComponent);
  }

  public continue(): void {
    this.router.navigate(['/dashboard/' + ROUTES_MAP.offers]);
    this.tabsService.setActiveLinkIndex(0);
  }
}
