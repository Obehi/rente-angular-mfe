import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoansService } from '@services/remote-api/loans.service';

@Component({
  selector: 'rente-signicat-users',
  templateUrl: './signicat-users.component.html',
  styleUrls: ['./signicat-users.component.scss']
})
export class SignicatUsersComponent implements OnInit {
  public allOffers: any[];
  public loansData: any;
  public loans: any[];
  public errorMessage: string;
  public isEditMode = false;
  /*
    The object interface is not updated so fix it when the new version is merged
  */
  public loanForm: FormGroup;

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
          outstandingDebt: [String(dto.outstandingDebt), Validators.required],
          remainingYears: [String(dto.income), Validators.required],
          nominalRate: [String(dto.nominalRate), Validators.required]
        });
        console.log(this.loanForm);
      },
      (err) => {
        this.errorMessage = err.title;
      }
    );
  }

  public activateEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }
}
