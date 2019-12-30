import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AddressDto } from '@services/remote-api/loans.service';
import { MatRadioChange } from '@angular/material';

export enum AddressFormMode {
  Editing,
  Statistics
}

@Component({
  selector: 'rente-address-form',
  templateUrl: './address.form.component.html',
  styleUrls: ['./address.form.component.scss']
})
export class AddressFormComponent implements OnInit {

  @Input() index:number;
  @Input() address:AddressDto;

  @Output() deleteAddress:EventEmitter<AddressDto> = new EventEmitter();

  mode = AddressFormMode.Editing;

  ngOnInit():void { }

  get isAbleToDelete():boolean { return this.index > 0; }
  get isEditMode() { return this.mode === AddressFormMode.Editing; }
  get isStatMode() { return this.mode === AddressFormMode.Statistics; }
  get isAddressValid():boolean { return this.address != null && this.address.id > 0 && this.address.zip.length == 4 && this.address.street.length > 0; }

  onRbChange(event:MatRadioChange) {
    this.address.useManualPropertyValue = event.value;
  }

  onDeleteAddressClick() {
    this.deleteAddress.emit(this.address);
  }

  manualPropertyValueChanged($event) {
    if ($event && $event.target) {
      const newValue = parseInt(String($event.target.value).replace(/\D/g, ''));
      this.address.manualPropertyValue = newValue >= 0 ? newValue : 0;
    }
  }

  toggleMode() {
    this.mode = this.mode === AddressFormMode.Editing ? AddressFormMode.Statistics : AddressFormMode.Editing;
  }

}
