import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AddressDto } from '@services/remote-api/loans.service';
import { FormGroup, FormBuilder, Validators, AbstractControl, NgForm } from '@angular/forms';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { MatRadioChange } from '@angular/material';

@Component({
  selector: 'rente-address-form',
  templateUrl: './address.form.component.html',
  styleUrls: ['./address.form.component.scss']
})
export class AddressFormComponent implements OnInit {

  @Input() address:AddressDto;
  @Output() deleteAddress:EventEmitter<AddressDto> = new EventEmitter();

  propertyForm:FormGroup;
  housandSeparatorMask = {
    mask: createNumberMask({
      prefix: '',
      suffix: '',
      thousandsSeparatorSymbol: ' '
    }),
    guide: false
  };

  constructor(private fb:FormBuilder) { }

  ngOnInit():void {
    this.address.useManualPropertyValue = this.address.useManualPropertyValue === true;
    this.propertyForm = this.fb.group({
      street: [this.address.street, Validators.required],
      zip: [this.address.zip, Validators.compose([Validators.required])],
      apartmentSize: [this.address.apartmentSize, Validators.compose([Validators.required])],
      manualPropertyValue: this.address.manualPropertyValue,
      estimatedPropertyValue: this.address.estimatedPropertyValue,
      useManualPropertyValue: this.address.useManualPropertyValue
    });
  }

  isErrorState(control: AbstractControl | null, form: FormGroup | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get ableToDelete():boolean {
    return this.address.order > 1;
  }

  onChange(event:MatRadioChange) {
    this.address.useManualPropertyValue = event.value;
  }

}
