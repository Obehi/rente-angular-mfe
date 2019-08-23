import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserService } from '@services/remote-api/user.service';
import { SnackBarService } from '@services/snackbar.service';
import { LoansService } from '../../../shared/services/remote-api/loans.service';

@Component({
  selector: 'rente-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {
  public preferencesForm: FormGroup;
  public isLoading: boolean;
  constructor(
    private fb: FormBuilder,
    private loansService: LoansService,
    private snackBar: SnackBarService
  ) { }

  ngOnInit() {
    this.loansService.getLoanPreferences().subscribe(preferances => {
      this.preferencesForm = this.fb.group({
        checkRateReminderType: [preferances.checkRateReminderType],
        fetchCreditLinesOnly: [preferances.fetchCreditLinesOnly],
        noAdditionalProductsRequired: [preferances.noAdditionalProductsRequired],
        interestedInEnvironmentMortgages: [preferances.interestedInEnvironmentMortgages]
      });
    });
  }

  public updatePreferances() {
    this.isLoading = true;
    this.loansService.updateLoanPreferences(this.preferencesForm.value).subscribe(res => {
      this.isLoading = false;
      this.snackBar.openSuccessSnackBar('Endringene dine er lagret');
    }, err => {
      this.isLoading = false;
      this.snackBar.openFailSnackBar('Oops, noe gikk galt');
    });
  }

}
