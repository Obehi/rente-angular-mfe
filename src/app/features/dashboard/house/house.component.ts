import { LoansService } from '@services/remote-api/loans.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm, AbstractControl } from '@angular/forms';
import { VALIDATION_PATTERN } from '@config/validation-patterns.config';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { SnackBarService } from '@services/snackbar.service';
import { trigger, transition, animate, keyframes, style } from '@angular/animations';

@Component({
  selector: 'rente-house',
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger(
      'shakeAnimation',
      [
        transition(':enter', animate('200ms ease-in', keyframes([
          style({ transform: 'translate3d(-15px, 0, 0)' }),
          style({ transform: 'translate3d(0, 0, 0)' }),
          style({ transform: 'translate3d(7px, 0, 0)' }),
          style({ transform: 'translate3d(0, 0, 0)' })
        ]))),
      ]
    )
  ]
})
export class HouseComponent implements OnInit {

  public autoPropertyForm: FormGroup;
  public manualPropertyForm: FormGroup;
  public isAutoMode = true;
  public addressData: any;
  public isLoading: boolean;
  public propertyValue: number;
  public estimatedPropertyValue: number;

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
    private snackBar: SnackBarService,
    private router: Router,
  ) { }

  ngOnInit() {
    forkJoin([this.loansService.getPropertValue(), this.loansService.getEstimatedPropertValue(), this.loansService.getAddresses()])
      .subscribe(([propValue, estimatedPropValue, res]) => {
        this.propertyValue = propValue.propertyValue;
        this.estimatedPropertyValue = estimatedPropValue.propertyValue;
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
      this.autoPropertyForm.enable();
      this.manualPropertyForm.disable();
    } else {
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
      this.router.navigate(['/dashboard/tilbud/']);
      this.snackBar.openSuccessSnackBar('Endringene dine er lagret');
    }, err => {
      this.isLoading = false;
      this.snackBar.openFailSnackBar('Oops, noe gikk galt');
    });
  }

}