import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAutocomplete } from '@angular/material';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  FormControl
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

import { Observable, timer, EMPTY } from 'rxjs';
import { debounce } from 'rxjs/operators';

import { VALIDATION_PATTERN } from '@config/validation-patterns.config';
import { SnackBarService } from '@services/snackbar.service';
import { ContactService } from '../../../shared/services/remote-api/contact.service';
import { BankVo } from '../../../shared/models/bank';
import { MessageBannerService } from '@services/message-banner.service';
import { getAnimationStyles } from '@shared/animations/animationEnums';

@Component({
  selector: 'rente-get-notified',
  templateUrl: './get-notified-sv.component.html',
  styleUrls: ['./get-notified-sv.component.scss']
})
export class GetNotifiedSvComponent implements OnInit {
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
  public emailError = false;
  public animationType = getAnimationStyles();

  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private router: Router,
    private snackBar: SnackBarService,
    private messageService: MessageBannerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.missingBankForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(VALIDATION_PATTERN.email)
        ])
      ],
      bank: ['', Validators.compose([Validators.required])]
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
      bank: this.missingBankForm.value.bank
    };

    this.contactService.sendMissingBank(missingBankData).subscribe(
      () => {
        this.isLoading = false;
        this.router.navigate(['/']);

        this.messageService.setView(
          'Du får besked när din bank är tillgänglig',
          5000,
          this.animationType.DROP_DOWN_UP,
          'success',
          window
        );
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  public noWhitespaceValidator(control: FormControl): any {
    if (control === null) return null;

    const isWhitespace =
      (control.value.name || control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  public displayFn(bank: BankVo): string | undefined {
    return bank ? bank.name : undefined;
  }
}
