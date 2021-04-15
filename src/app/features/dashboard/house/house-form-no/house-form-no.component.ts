import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AddressDto } from '@services/remote-api/loans.service';
import { LoansService } from '@services/remote-api/loans.service';
import { MatTabChangeEvent } from '@angular/material';
import { EnvService } from '@services/env.service';

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

  mode = AddressFormMode.Editing;
  changesMade = false;

  get ableTosave(): boolean {
    return this.isAddressValid && this.changesMade;
  }

  constructor(public envService: EnvService) {}

  ngOnInit(): void {
    this.address.estimatedPropertyValue =
      this.address.estimatedPropertyValue || null;
    this.address.manualPropertyValue = this.address.manualPropertyValue || null;
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
      this.address.zip?.length === 4 &&
      !!this.address.apartmentSize &&
      this.address.apartmentSize > 5 &&
      this.address.street.length > 0 &&
      this.propertyValueIsValid(this.address)
    );
  }

  onRbChange(event: MatTabChangeEvent): void {
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

  propertyValueIsValid(address: AddressDto): boolean {
    if (
      address.useManualPropertyValue &&
      address.manualPropertyValue !== null &&
      address.manualPropertyValue !== undefined
    ) {
      return address.manualPropertyValue > 0;
    } else if (address.useManualPropertyValue === false) {
      return (
        this.notEmpty(address.street) &&
        this.notEmpty(address.zip) &&
        address.apartmentSize > 0
      );
    }
    return false;
  }

  notEmpty(text: string | null): boolean {
    return text !== null && String(text).length > 0;
  }
}
