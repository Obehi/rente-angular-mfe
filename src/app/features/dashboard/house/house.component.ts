import { LoansService } from '@services/remote-api/loans.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { VALIDATION_PATTERN } from '@config/validation-patterns.config';

@Component({
  selector: 'rente-house',
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HouseComponent implements OnInit {

 public autoPropertyForm: FormGroup;
 public manualPropertyForm: FormGroup;
 public isAutoMode = true;
 public addressData: any;
 public isLoading: boolean;

  constructor(
    private fb: FormBuilder,
    private loansService: LoansService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loansService.getAddresses().subscribe(res => {
      this.addressData = res.addresses[0];
      this.autoPropertyForm = this.fb.group({
        street: [this.addressData.street, Validators.required],
        zip: [this.addressData.zip, Validators.compose([
          Validators.required,
          Validators.pattern(VALIDATION_PATTERN.zip)
        ])],
        apartmentSize: [this.addressData.apartmentSize, Validators.compose([
          Validators.required,
          Validators.pattern(VALIDATION_PATTERN.number)
        ])],
        manualPropertyValue: [this.addressData.manualPropertyValue]
      });

      this.manualPropertyForm = this.fb.group({
        manualPropertyValue: [this.addressData.manualPropertyValue, Validators.compose([
          Validators.required,
          Validators.pattern(VALIDATION_PATTERN.number)
        ])]
      });

      this.isAutoMode = !Boolean(this.addressData.manualPropertyValue);
      this.setPropertyMode();
    });

  }

  public isErrorState(control: AbstractControl | null, form: FormGroup | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public setPropertyMode() {
    if (this.isAutoMode) {
      console.log('iSAuto');
      this.autoPropertyForm.enable();
      this.manualPropertyForm.disable();
    } else {
      console.log('iSManual');
      this.manualPropertyForm.enable();
      this.autoPropertyForm.disable();
    }
  }

  public updatePropertyMode() {
    this.isLoading = true;
    let addressData: any;
    if (this.isAutoMode) {
      addressData = this.autoPropertyForm.value;
      addressData.manualPropertyValue = null;
      // form.reset() doesn't work - see https://github.com/angular/angular/issues/15741
      this.manualPropertyForm.patchValue({
        manualPropertyValue: null
      });
    } else {
      addressData = this.manualPropertyForm.value;
      this.autoPropertyForm.patchValue({
        street: null,
        zip: null,
        apartmentSize: null
      });
    }
    this.loansService.updateAddress(addressData).subscribe(res => {
      this.isLoading = false;
      this.snackBar.open('Your data was updated', 'Close', {
        duration: 10 * 1000,
        panelClass: ['bg-primary'],
        horizontalPosition: 'right'
      });
    }, err => {
      this.isLoading = false;
      this.snackBar.open(err.detail, 'Close', {
        duration: 10 * 1000,
        panelClass: ['bg-error'],
        horizontalPosition: 'right'
      });
    });
  }

}
