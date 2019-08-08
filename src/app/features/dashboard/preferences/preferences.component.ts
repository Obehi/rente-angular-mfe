import { MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserService } from '@services/remote-api/user.service';

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
    private useService: UserService,
    private snackBar: MatSnackBar
    ) { }

  ngOnInit() {
    this.useService.getUserPreferences().subscribe(preferances => {
      this.preferencesForm = this.fb.group({
        checkRateReminderType: [preferances.checkRateReminderType],
        fetchCreditlinesOnly: [preferances.fetchCreditlinesOnly],
        noAdditionalProductsRequired: [preferances.noAdditionalProductsRequired],
        interestedInEnvironmentMortgages: [preferances.interestedInEnvironmentMortgages]
      });
    });
  }

  public updatePreferances() {
    this.useService.updateUserPreferences(this.preferencesForm.value).subscribe(res => {
      this.isLoading = true;
      this.snackBar.open('Your data was updated', 'Close', {
        duration: 10 * 1000,
        panelClass: ['bg-primary'],
        horizontalPosition: 'right'
      });
    }, err => {
      this.isLoading = false;
      this.snackBar.open(err.detail, 'Close', {
        duration: 10 * 1000,
        panelClass: ['bg-error'],
        horizontalPosition: 'right'
    });
  });
  }

}
