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

  @Input() idx:number;
  @Input() address:AddressDto;
  @Output() deleteAddress:EventEmitter<AddressDto> = new EventEmitter();

  constructor(private fb:FormBuilder) { }

  ngOnInit():void {
  }

  get ableToDelete():boolean {
    return this.idx > 0;
  }

  onRbChange(event:MatRadioChange) {
    this.address.useManualPropertyValue = event.value;
  }

  onDeleteAddressClick() {
    this.deleteAddress.emit(this.address);
  }

}
