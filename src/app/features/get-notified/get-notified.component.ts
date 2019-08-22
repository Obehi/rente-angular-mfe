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
  public bankCtrl = new FormControl();
  public filteredBanks: Observable<string[]>;
  public banks: any = [];
  public allBanks: any[];
  public isLoading: boolean;

  @ViewChild('bankInput', { static: false }) bankInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private router: Router,
    private snackBar: SnackBarService
  ) {
    this.filteredBanks = this.bankCtrl.valueChanges.pipe(
      startWith(null),
      map((bank: string | null) => bank ? this.filter(bank) : this.allBanks.slice()));
  }

  ngOnInit() {
    this.contactService.getMissingBanks().subscribe((allBanks: any) => {
      this.allBanks = allBanks;
      // TODO: Add validators and validation messages for form
      this.missingBankForm = this.fb.group({
        bank: [''],
        email: ['', Validators.compose([
          Validators.required,
          Validators.pattern(VALIDATION_PATTERN.email)
        ])]
      });
    });
  }
  // TODO: Move to service
  public isErrorState(control: AbstractControl | null, form: FormGroup | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public request() {
    this.isLoading = true;
    const selectedBank = this.allBanks.find(bank => {
      return bank.name === this.bankCtrl.value;
    })
    const missingBankData = {
      email: this.missingBankForm.value.email,
      bank: selectedBank.bank
    };

    this.contactService.sendMissingBank(missingBankData).subscribe(_ => {
      this.isLoading = false;
      this.router.navigate(['/']);
      this.snackBar.openSuccessSnackBar('Endringene dine er lagret');
    }, err => {
      this.isLoading = false;
    });

  }

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // if ((value || '').trim()) {
      //   this.banks.push({
      //     value: value.trim(),
      //     label: value.trim()
      //   });
      // }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.bankCtrl.setValue(null);
    }
  }

  remove(bank, index): void {
    this.allBanks.push(bank);
    this.allBanks.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    this.banks.splice(index, 1);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (this.banks.length < 1) {
      this.banks.push(event.option.value);
      this.bankInput.nativeElement.value = '';
      this.bankCtrl.setValue(null);
    }
  }

  private filter(value: any): any[] {
    const filterValue = value.name ? value.name.toLowerCase() : value.toLowerCase();
    this.allBanks = this.clearDuplicates(this.allBanks, this.banks);
    return this.allBanks.filter(bank => bank.name.toLowerCase().includes(filterValue));
  }

  private clearDuplicates(array: any[], toRemoveArray: any[]) {
    for (let i = array.length - 1; i >= 0; i--) {
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < toRemoveArray.length; j++) {
        if (array[i] && (array[i].bank === toRemoveArray[j].bank)) {
          array.splice(i, 1);
        }
      }
    }

    return array;
  }
}
