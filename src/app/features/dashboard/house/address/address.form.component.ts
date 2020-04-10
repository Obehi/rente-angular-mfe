import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { AddressDto } from "@services/remote-api/loans.service";
import { LoansService } from "@services/remote-api/loans.service";
import { MatTabChangeEvent } from "@angular/material";

export enum AddressFormMode {
  Editing,
  Statistics
}

@Component({
  selector: "rente-address-form",
  templateUrl: "./address.form.component.html",
  styleUrls: ["./address.form.component.scss"]
})
export class AddressFormComponent implements OnInit {
  @Input() index: number;
  @Input() address: AddressDto;

  @Output() deleteAddress: EventEmitter<AddressDto> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();

  addresses: AddressDto[];

  mode = AddressFormMode.Editing;
  changesMade = false;
  ableTosave = false

  constructor(private loansService: LoansService) {}

  ngOnInit() {
    this.loansService.getAddresses().subscribe(r => {
      this.addresses = r.addresses;
    });
  }

  get isAbleToDelete(): boolean {
    return this.index > 0;
  }
  get isEditMode() {
    return this.mode === AddressFormMode.Editing;
  }
  get isStatMode() {
    return this.mode === AddressFormMode.Statistics;
  }
  get isAddressValid(): boolean {
    return (
      this.address != null &&
      this.address.id > 0 &&
      this.address.zip &&
      this.address.zip.length === 4 &&
      this.address.street.length > 0
    );
  }

  onRbChange(event: MatTabChangeEvent) {
    this.change.emit();
    if (event.index === 1) {
      this.address.useManualPropertyValue = true;
    } else {
      this.address.useManualPropertyValue = false;
    }
  }

  countChange($event) {
    console.log("adresss componente countchange")
    this.changesMade = true;    
  }

 

  onDeleteAddressClick() {
    this.deleteAddress.emit(this.address);
  }

  manualPropertyValueChanged($event) {
    if ($event && $event.target) {
      const newValue = parseInt(String($event.target.value).replace(/\D/g, ""));
      this.address.manualPropertyValue = newValue >= 0 ? newValue : 0;
    }
  }

  toggleMode() {
    this.mode =
      this.mode === AddressFormMode.Editing
        ? AddressFormMode.Statistics
        : AddressFormMode.Editing;
  }
}
