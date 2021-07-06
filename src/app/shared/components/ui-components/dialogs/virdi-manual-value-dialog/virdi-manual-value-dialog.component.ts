import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ROUTES_MAP } from '@config/routes-config';
import { Mask } from '@shared/constants/mask';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'rente-virdi-manual-value-dialog',
  templateUrl: './virdi-manual-value-dialog.component.html',
  styleUrls: ['./virdi-manual-value-dialog.component.scss']
})
export class VirdiManualValueDialogComponent {
  public isManualValue: boolean;
  public manualPropertyValueForm: FormGroup;
  public mask = Mask;
  public showInfoBox: boolean;
  public firstStep: boolean;
  public secondStep: boolean;
  @ViewChild('aptValue') aptVal: ElementRef;
  public sendFocusVal$: BehaviorSubject<boolean>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dialogRef: MatDialogRef<VirdiManualValueDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.step === 1) {
      this.showInfoBox = true;
      this.isManualValue = false;
      this.firstStep = true;
      this.secondStep = false;
    } else if (data.step === 2) {
      this.showInfoBox = false;
      this.isManualValue = true;
      this.firstStep = false;
      this.secondStep = true;
    }
    this.initPropertyValueForm();
  }

  public onClose(): void {
    this.data.onClose && this.data.onClose();
    this.dialogRef.close();
  }

  public onConfirm(): void {
    this.sendFocusVal$ = new BehaviorSubject<boolean>(false);
    this.showInfoBox = !this.showInfoBox;
    this.isManualValue = true;
    this.firstStep = false;
    this.secondStep = true;
    this.sendFocusVal$.next(true);
  }

  public onSendForm(): void {
    if (this.manualPropertyValueForm.get('apartmentValue')?.value === null) {
      alert('Apartment value is null');
    } else {
      this.data.onSendForm &&
        this.data.onSendForm(
          this.manualPropertyValueForm.get('apartmentValue')?.value
        );
    }

    this.dialogRef.close();
    this.router.navigate(['/dashboard/' + ROUTES_MAP.offers]);
  }

  initPropertyValueForm(): void {
    this.manualPropertyValueForm = this.fb.group({
      apartmentValue: [0, Validators.required]
    });
  }

  isErrorState(control: AbstractControl | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
