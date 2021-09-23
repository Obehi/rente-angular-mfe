import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAutocomplete } from '@angular/material';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  FormControl
} from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Router } from '@angular/router';

import { debounce } from 'rxjs/operators';
import { Observable, timer, EMPTY } from 'rxjs';

import { ROUTES_MAP } from '@config/routes-config';
import { VALIDATION_PATTERN } from '@config/validation-patterns.config';
import { GetNotifiedDialogComponent } from '../getNotifiedDialogComponent/getNotifiedDialogComponent.component';
import { BankVo } from '../../../shared/models/bank';
import { ContactService } from '../../../shared/services/remote-api/contact.service';

@Component({
  selector: 'rente-get-notified',
  templateUrl: './get-notified-no.component.html',
  styleUrls: ['./get-notified-no.component.scss']
})
export class GetNotifiedNoComponent implements OnInit {
  public missingBankForm: FormGroup;
  public visible = true;
  public selectable = true;
  public removable = true;
  public addOnBlur = true;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public filteredBanks: Observable<string[]>;
  public banks: any = [];
  public allBanks: any[];
  public isLoading: boolean;
  public missingBank: BankVo;
  public emailError = false;

  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private router: Router,
    private dialog: MatDialog
  ) {
    // state.bank is potentially sent through routing
    if (window.history.state.bank) {
      this.missingBank = window.history.state.bank;
    } else {
      this.router.navigate([ROUTES_MAP.bankSelect]);
    }
  }

  ngOnInit(): void {
    this.missingBankForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(VALIDATION_PATTERN.email)
        ])
      ]
    });
    this.missingBankForm
      .get('email')
      ?.valueChanges.pipe(
        debounce(() => {
          this.emailError = false;
          return this.inValid() ? timer(2000) : EMPTY;
        })
      )
      .subscribe(() => (this.emailError = this.inValid()));
  }

  inValid(): boolean {
    return !!(
      this.missingBankForm.get('email')?.hasError('pattern') &&
      this.missingBankForm.get('email')?.dirty
    );
  }

  onBlurErrorCheck(): void {
    this.emailError = this.inValid();
  }

  // TODO: Move to service
  public isErrorState(control: AbstractControl | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public request(): void {
    this.isLoading = true;

    const missingBankData = {
      email: this.missingBankForm.value.email,
      bank: this.missingBank.name
    };

    if (!missingBankData.bank) {
      missingBankData.bank = this.missingBankForm.value.bank;
    }

    this.contactService.sendMissingBank(missingBankData).subscribe(
      (_) => {
        this.isLoading = false;
        this.openPopupDialog();
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  public noWhitespaceValidator(control: FormControl): null | any {
    if (control === null) return null;

    const isWhitespace =
      (control.value.name || control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public displayFn(bank: any): string | undefined {
    return bank ? bank.name : undefined;
  }

  public openPopupDialog(): void {
    this.dialog.open(GetNotifiedDialogComponent);
  }
}
