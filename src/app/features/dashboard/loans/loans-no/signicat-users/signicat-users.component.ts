import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoansService } from '@services/remote-api/loans.service';
import { ButtonFadeInOut } from '@shared/animations/button-fade-in-out';
import { FadeOut } from '@shared/animations/fade-out';

@Component({
  selector: 'rente-signicat-users',
  templateUrl: './signicat-users.component.html',
  styleUrls: ['./signicat-users.component.scss'],
  animations: [FadeOut, ButtonFadeInOut]
})
export class SignicatUsersComponent implements OnInit {
  public allOffers: any[];
  public loansData: any;
  public loans: any[];
  public errorMessage: string;
  public isEditMode = false;
  public loanForm: FormGroup;
  public showDisplayBox = true;
  public showButton = false;

  /*
    The object interface is not updated so fix it when the new version is merged
  */
  // public setDisabled = false;

  constructor(private loansService: LoansService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loansService.getLoanAndOffersBanks().subscribe(
      ([loans, offerBank]) => {
        this.loansData = loans;
        this.allOffers = offerBank.offers;
        this.loans = this.loansData.loans;
        console.log(this.loansData);

        const dto = this.loans[0];

        console.log(dto.outstandingDebt);

        this.loanForm = this.fb.group({
          outstandingDebt: [
            { value: String(dto.outstandingDebt), disabled: true },
            Validators.required
          ],
          // outstandingDebt: new FormControl(),
          remainingYears: [
            { value: String(dto.remainingYears), disabled: true },
            Validators.required
          ],
          nominalRate: [
            { value: String(dto.nominalRate), disabled: true },
            Validators.required
          ]
        });
        console.log(this.loanForm);
      },
      (err) => {
        this.errorMessage = err.title;
      }
    );
  }

  // public activateEditMode(): void {
  //   // this.isEditMode = !this.isEditMode;
  //   // this.setEnabled();
  //   this.setDisabled();
  // }

  public setDisabled(): void {
    this.showButton = false;
    setTimeout(() => {
      this.isEditMode = false;
      this.showDisplayBox = true;
    }, 325);
    this.loanForm.get('outstandingDebt')?.disable();
    this.loanForm.get('remainingYears')?.disable();
    this.loanForm.get('nominalRate')?.disable();
  }

  public setEnabled(): void {
    this.showDisplayBox = false;
    this.showButton = true;
    this.isEditMode = true;
    this.loanForm.get('outstandingDebt')?.enable();
    this.loanForm.get('remainingYears')?.enable();
    this.loanForm.get('nominalRate')?.enable();
  }
}
