import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AddressDto } from '@services/remote-api/loans.service';
import { LoansService } from '@services/remote-api/loans.service';
import { MatTabChangeEvent } from '@angular/material';

export enum AddressFormMode {
  Editing,
  Statistics
}

@Component({
  selector: 'rente-house-form',
  templateUrl: './house-form-no.component.html',
  styleUrls: ['./house-form-no.component.scss']
})
export class HouseFormNoComponent implements OnInit {
  @Input() index: number;
  @Input() address: AddressDto;

  @Output() deleteAddress: EventEmitter<AddressDto> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() onSave: EventEmitter<any> = new EventEmitter();

  addresses: AddressDto[];

  test: string;

  mode = AddressFormMode.Editing;
  changesMade = false;

  get ableTosave(): boolean {
    return this.isAddressValid && this.changesMade;
  }

  constructor(private loansService: LoansService) {}

  ngOnInit(): void {
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
      this.address !== null &&
      this.address.id > 0 &&
      !!this.address.zip &&
      this.address.zip.length === 4 &&
      this.address.apartmentSize > 5 &&
      this.address.street.length > 0
    );
  }

  onRbChange(event: MatTabChangeEvent) {
    this.changesMade = true;
    if (event.index === 1) {
      this.address.useManualPropertyValue = true;
    } else {
      this.address.useManualPropertyValue = false;
    }
  }

  // remove spaces and convert to number type
  formatThousand(event): number {
    return Number(event.replace(/\s+/g, ''));
  }

  save(): void {
    this.onSave.emit();
    this.changesMade = false;
  }
  countChange(): void {
    this.changesMade = true;
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
