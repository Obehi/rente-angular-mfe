import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatChipInputEvent } from '@angular/material';
import { FormGroup, FormBuilder, Validators, AbstractControl, NgForm, FormControl } from '@angular/forms';
import { VALIDATION_PATTERN } from '@config/validation-patterns.config';
import { Observable } from 'rxjs';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { startWith, map, mergeMap } from 'rxjs/operators';
import { LoansService } from '@services/remote-api/loans.service';
import { ContactService } from '../../shared/services/remote-api/contact.service';
import { Router } from '@angular/router';
import { SnackBarService } from '@services/snackbar.service';

@Component({
  selector: 'rente-get-notified',
  templateUrl: './get-notified.component.html'
})
export class GetNotifiedComponent implements OnInit {
  public missingBankForm: FormGroup;
  public visible = true;
  public selectable = true;
  public removable = true;
  public addOnBlur = true;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  // public bankCtrl = new FormControl();
  public filteredBanks: Observable<string[]>;
  public banks: any = [];
  public allBanks: any[];
  public isLoading: boolean;

  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private router: Router,
    private snackBar: SnackBarService
  ) { }

  ngOnInit() {
    this.contactService.getMissingBanks().subscribe((allBanks: any) => {
      this.allBanks = allBanks;
      this.missingBankForm = this.fb.group({
        bank: ['', Validators.compose([
          Validators.required,
          this.noWhitespaceValidator
        ])],
        email: ['', Validators.compose([
          Validators.required,
          Validators.pattern(VALIDATION_PATTERN.email)
        ])]
      });

      this.filteredBanks = this.missingBankForm.controls.bank.valueChanges.pipe(
        startWith(null),
        map((bank: string | null) => bank ? this.filter(bank) : this.allBanks.slice()));
    });
  }
  // TODO: Move to service
  public isErrorState(control: AbstractControl | null, form: FormGroup | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public request() {
    this.isLoading = true;

    const missingBankData = {
      email: this.missingBankForm.value.email,
      bank: this.missingBankForm.value.bank.name
    };
    if (!missingBankData.bank) {
      missingBankData.bank = this.missingBankForm.value.bank;
    }

    this.contactService.sendMissingBank(missingBankData).subscribe(_ => {
      this.isLoading = false;
      this.router.navigate(['/']);
      this.snackBar.openSuccessSnackBar('Du får beskjed når din bank er tilgjengelig', 5);
    }, err => {
      this.isLoading = false;
    });

  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value.name || control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  public displayFn(bank: any): string | undefined {
    return bank ? bank.name : undefined;
  }

  private filter(value: any): any[] {
    const filterValue = value.name ? value.name.toLowerCase() : value.toLowerCase();
    return this.allBanks.filter(bank => bank.name.toLowerCase().includes(filterValue));
  }

}
