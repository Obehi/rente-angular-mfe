import { NumberFormatStyle } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyLoansService } from '@features/dashboard/loans/myloans.service';
import IMask from 'imask';
import { Subscription } from 'rxjs';

@Component({
  selector: 'rente-general-input',
  templateUrl: './general-input.component.html',
  styleUrls: ['./general-input.component.scss']
})
export class GeneralInputComponent implements OnInit, OnDestroy {
  @Input() maskType: any;
  @Input() value: any;
  @Input() suffix: string;
  @Input() maxLength: string;
  @Input() isDisabled: boolean;
  @Input() placeholder: string;

  // CSS class variables
  @Input() isEditMode: boolean;
  @Input() inEditMode?: boolean;
  @Input() isInputFocused: boolean;
  @Input() isInputError: boolean;

  @Output() changesMadeEmitter = new EventEmitter<boolean>();
  @Output() inputValueString = new EventEmitter<string>();

  public inputForm: FormGroup;
  public changeSubscription: Subscription | undefined;
  public editModeSubscription: Subscription;
  public getFormValName: any;

  constructor(
    private myLoansService: MyLoansService,
    private fb: FormBuilder
  ) {}

  ngOnDestroy(): void {
    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
    }

    if (this.editModeSubscription) {
      this.editModeSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.inputForm = this.fb.group({
      inputValue: [{ value: this.value, disabled: true }, Validators.required]
    });

    this.getFormValName = this.inputForm.get('inputValue');

    this.myLoansService.getInputEditModeAsObservable().subscribe((edit) => {
      if (edit) {
        this.getFormValName?.enable();
      } else {
        this.getFormValName?.disable();
      }
    });

    this.myLoansService.getFormAsPristine().subscribe((val) => {
      if (val) {
        this.inputForm.markAsPristine();
        this.myLoansService.setChangesMadeState(false);
        this.myLoansService.setButtonDisabledState(true);
      }
    });

    this.changeSubscription = this.getFormValName?.valueChanges.subscribe(
      () => {
        if (this.getFormValName.value.trim() !== '') this.isInputError = false;

        if (this.isEditMode && this.getFormValName.dirty) {
          this.myLoansService.setChangesMadeState(true);
          this.myLoansService.setButtonDisabledState(false);
        } else {
          this.myLoansService.setChangesMadeState(false);
          this.myLoansService.setButtonDisabledState(true);
        }

        // Error if value is empty
        if (
          (this.getFormValName.dirty &&
            this.getFormValName.value.trim() === '') ||
          this.checkIfZero
        ) {
          this.isInputError = true;
          this.myLoansService.setAbleToSave(false);
        }

        // Emit if the form value is valid
        if (this.isLoanFormValid) {
          this.myLoansService.setAbleToSave(true);
          console.log('Form is valid');
          console.log(this.isLoanFormValid);
        } else {
          this.myLoansService.setAbleToSave(false);
          console.log('Form is NOT valid');
        }

        // Constantly emit the value to parent if its not null or empty
        if (!!this.getFormValName.value && this.getFormValName.value !== '0') {
          this.inputValueEmit(this.getFormValName.value);
          console.log(this.getFormValName.value);
        }
      }
    );
  } // ngOnInit

  public inputValueEmit(val: string): void {
    this.inputValueString.emit(val);
  }

  get isLoanFormValid(): boolean {
    return (
      !!this.inputForm.get('inputValue')?.value && this.getFormValName.dirty
    );
  }

  get checkIfZero(): boolean {
    return this.inputForm.get('inputValue')?.value == 0;
  }
}
