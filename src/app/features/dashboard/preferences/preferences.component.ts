import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SnackBarService } from '@services/snackbar.service';
import { LoansService } from '../../../shared/services/remote-api/loans.service';
import {
  trigger,
  transition,
  animate,
  keyframes,
  style
} from '@angular/animations';

@Component({
  selector: 'rente-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss'],
  animations: [
    trigger('shakeAnimation', [
      transition(
        ':enter',
        animate(
          '200ms ease-in',
          keyframes([
            style({ transform: 'translate3d(-15px, 0, 0)' }),
            style({ transform: 'translate3d(0, 0, 0)' }),
            style({ transform: 'translate3d(7px, 0, 0)' }),
            style({ transform: 'translate3d(0, 0, 0)' })
          ])
        )
      )
    ])
  ]
})
export class PreferencesComponent implements OnInit {
  public preferencesForm: FormGroup;
  public isLoading: boolean;
  constructor(
    private fb: FormBuilder,
    private loansService: LoansService,
    private snackBar: SnackBarService
  ) {}

  ngOnInit() {
    this.loansService.getLoanPreferences().subscribe((preferances) => {
      this.preferencesForm = this.fb.group({
        checkRateReminderType: [preferances.checkRateReminderType],
        fetchCreditLinesOnly: [preferances.fetchCreditLinesOnly],
        noAdditionalProductsRequired: [
          preferances.noAdditionalProductsRequired
        ],
        interestedInEnvironmentMortgages: [
          preferances.interestedInEnvironmentMortgages
        ]
      });
    });
  }

  public updatePreferances() {
    this.isLoading = true;
    this.loansService
      .updateLoanPreferences(this.preferencesForm.value)
      .subscribe(
        (res) => {
          this.isLoading = false;
          this.snackBar.openSuccessSnackBar('Endringene dine er lagret', 1.2);
        },
        (err) => {
          this.isLoading = false;
          this.snackBar.openFailSnackBar('Oops, noe gikk galt', 1.2);
        }
      );
  }
}
