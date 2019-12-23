import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AddressDto } from '@services/remote-api/loans.service';
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

  ngOnInit():void { }

  get ableToDelete():boolean {
    return this.idx > 0;
  }

  onRbChange(event:MatRadioChange) {
    this.address.useManualPropertyValue = event.value;
  }

  onDeleteAddressClick() {
    this.deleteAddress.emit(this.address);
  }

  onManPropChange($event) {
    if ($event && $event.target) {
      const newValue = parseInt(String($event.target.value).replace(/\D/g, ''));
      this.address.manualPropertyValue = newValue >= 0 ? newValue : 0;
    }
  }

}
