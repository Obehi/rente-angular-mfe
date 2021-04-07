import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OfferInfo } from '@shared/models/offers';
import { VALIDATION_PATTERN } from '@config/validation-patterns.config';
import { Mask } from '@shared/constants/mask';

import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl
} from '@angular/forms';

@Component({
  selector: 'manual-input-dialog',
  templateUrl: './manual-input-dialog.component.html',
  styleUrls: ['./manual-input-dialog.component.scss']
})
export class ManualInputDialogComponent implements OnInit {
  public valueForm: FormGroup;
  public isLoading = false;
  public closeState?: manualHouseValueState;
  public mask = Mask;

  constructor(
    public dialogRef: MatDialogRef<ManualInputDialogComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.valueForm = this.fb.group({
      value: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.pattern(VALIDATION_PATTERN.thousandsAsString)
        ])
      ]
    });
  }

  public onClick(): void {
    const valueFromForm = this.valueForm.get('value').value;

    const value =
      typeof valueFromForm === 'string'
        ? valueFromForm.replace(/\s/g, '')
        : valueFromForm;
    const state: manualHouseValueState = {
      state: 'resend-request',
      value: value
    };
    this.closeState = state;
    this.dialogRef.close();
  }

  public onCancel(): void {
    this.closeState = {
      state: 'canceled',
      value: null
    };
    this.dialogRef.close();
  }

  isErrorState(control: AbstractControl | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}

export interface manualHouseValueState {
  state: string;
  value?: number;
}
