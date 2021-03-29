import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AddressDto } from '@services/remote-api/loans.service';
import { LoansService } from '@services/remote-api/loans.service';
import { MatTabChangeEvent } from '@angular/material';

export enum AddressFormMode {
  Editing,
  Statistics
}

@Component({
  selector: 'rente-blue-address',
  templateUrl: './blue-address.component.html',
  styleUrls: ['./blue-address.component.scss']
})
export class BlueAddressComponent implements OnInit {
  @Input() index: number;
  @Input() address: AddressDto;

  @Output() deleteAddress: EventEmitter<AddressDto> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() onSave: EventEmitter<any> = new EventEmitter();

  addresses: AddressDto[];

  mode = AddressFormMode.Editing;
  changesMade = false;
  ableTosave = false;

  constructor(private loansService: LoansService) {}

  ngOnInit() {
    this.loansService.getAddresses().subscribe((r) => {
      this.addresses = r.addresses;
    });
  }

  get isAbleToDelete(): boolean {
    return this.index > 0;
  }
  get isEditMode(): boolean {
    return this.mode === AddressFormMode.Editing;
  }
  get isStatMode(): boolean {
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

  onRbChange(event: MatTabChangeEvent): void {
    if (event.index === 1) {
      this.address.useManualPropertyValue = true;
    } else {
      this.address.useManualPropertyValue = false;
    }

    this.countChange();
  }

  // remove spaces and convert to number type
  formatThousand(event): number {
    return Number(event.replace(/\s+/g, ''));
  }

  save(): void {
    this.onSave.emit();
    this.ableTosave = false;
  }

  countChange(): void {
    if (this.address.street == '') {
      this.ableTosave = false;
      return;
    }

    if (this.address.zip == '') {
      this.ableTosave = false;
      return;
    }

    if (this.address.apartmentSize == 0 || this.address.apartmentSize == null) {
      this.ableTosave = false;
      return;
    }

    if (
      this.address.useManualPropertyValue &&
      (this.address.manualPropertyValue == 0 ||
        this.address.manualPropertyValue == null)
    ) {
      this.ableTosave = false;
      return;
    }

    this.ableTosave = true;
  }

  onDeleteAddressClick(): void {
    this.deleteAddress.emit(this.address);
  }

  manualPropertyValueChanged($event): void {
    if ($event && $event.target) {
      const newValue = parseInt(String($event.target.value).replace(/\D/g, ''));
      this.address.manualPropertyValue = newValue >= 0 ? newValue : 0;
    }
  }

  toggleMode(): void {
    this.mode =
      this.mode === AddressFormMode.Editing
        ? AddressFormMode.Statistics
        : AddressFormMode.Editing;
  }
}
