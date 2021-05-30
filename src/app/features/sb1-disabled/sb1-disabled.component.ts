import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES_MAP } from '@config/routes-config';
import { EnvService } from '@services/env.service';
import { BankVo } from '../../shared/models/bank';

@Component({
  selector: 'rente-sb1-disabled',
  templateUrl: './sb1-disabled.component.html',
  styleUrls: ['./sb1-disabled.component.scss']
})
export class Sb1DisabledComponent implements OnInit {
  public missingBank: BankVo;

  constructor(private router: Router, public envService: EnvService) {
    if (window.history.state.bank) {
      this.missingBank = window.history.state.bank;
    } else {
      this.router.navigate([ROUTES_MAP.bankSelect]);
    }
  }

  ngOnInit(): void {}
}
