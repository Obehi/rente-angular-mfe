import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FirstBuyersService } from '@features/first-buyers/first-buyers.service';
import { AuthService } from '@services/remote-api/auth.service';
import { flatMap } from 'rxjs/operators';

@Component({
  selector: 'rente-first-buyers',
  templateUrl: './first-buyers.component.html',
  styleUrls: ['./first-buyers.component.scss']
})
export class FirstBuyersComponent {
  formGroup: FormGroup = new FormGroup({
    outstandingDebt: new FormControl(),
    income: new FormControl()
  });
  isLoading = false;
  isLowIncome = false;

  constructor(
    private router: Router,
    private firstBuyersService: FirstBuyersService,
    private authService: AuthService
  ) {}

  showOffers() {
    if (
      Number(this.formGroup.get('income').value) < 200000 &&
      !this.formGroup.get('outstandingDebt').value
    ) {
      this.isLowIncome = true;
      return;
    }

    this.isLoading = true;

    if (this.formGroup.get('income').value) {
      this.firstBuyersService.offerValue = {
        outstandingDebt: null,
        income: +this.formGroup.get('income').value
      };
      if (!this.formGroup.get('outstandingDebt').value) {
        this.formGroup.patchValue({
          outstandingDebt: +(this.formGroup.get('income').value * 5)
        });
      }
    }
    if (this.formGroup.get('outstandingDebt').value) {
      this.firstBuyersService.offerValue = {
        outstandingDebt: +this.formGroup.get('outstandingDebt').value,
        income: +this.formGroup.get('income').value
      };
    }
    this.firstBuyersService
      .getAuthToken({
        outstandingDebt: this.firstBuyersService.offerValue.outstandingDebt,
        income: this.firstBuyersService.offerValue.income,
        country: 'NOR'
      })
      .pipe(
        flatMap((res) => {
          return this.authService.loginWithToken(res.token);
        })
      )
      .subscribe((res) => {
        this.router.navigate(['/boliglanskalkulator/tilbud']);
        this.isLoading = false;
      });
  }
}
