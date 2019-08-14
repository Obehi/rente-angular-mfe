import { LoansService } from '@services/remote-api/loans.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { VALIDATION_PATTERN } from '@config/validation-patterns.config';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

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
  public propertyValue: number;
  public threeDigitsMask = { mask: [/\d/, /\d/, /\d/], guide: false };
  public fourDigitsMask = { mask: [/\d/, /\d/, /\d/, /\d/], guide: false };
  public thousandSeparatorMask = {
    mask: createNumberMask({
      prefix: '',
      suffix: '',
      thousandsSeparatorSymbol: ' '
    }),
    guide: false
  };

  constructor(
    private fb: FormBuilder,
    private loansService: LoansService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getPropertyValue();
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
          Validators.required
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
    } else {
      this.manualPropertyForm.value.manualPropertyValue = this.manualPropertyForm.value.manualPropertyValue.replace(/\s/g, '');
      addressData = Object.assign(this.autoPropertyForm.value, this.manualPropertyForm.value);
    }
    this.loansService.updateAddress(addressData).subscribe(res => {
      this.isLoading = false;
      this.getPropertyValue();
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

  private getPropertyValue() {
    this.loansService.getPropertValue().subscribe(res => {
      this.propertyValue = res.propertyValue;
      console.log(res);
    });
  }

}
