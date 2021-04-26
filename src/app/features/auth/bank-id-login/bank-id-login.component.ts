import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '@services/local-storage.service';
import { AuthService } from '@services/remote-api/auth.service';

@Component({
  selector: 'rente-bank-id-login',
  templateUrl: './bank-id-login.component.html',
  styleUrls: ['./bank-id-login.component.scss']
})
export class BankIdLoginComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const status = params['status'];
      const sessionId = params['sessionId'];

      const bank = this.localStorageService.getItem('bankIdLoginBank');
      console.log('bank');
      console.log(bank);
      this.authService
        .loginBankIdStep2('d7adeb5108884f4cbfe8ad1500d7f155', bank)
        .subscribe((response) => {
          console.log(response);
        });
    });
  }
}
