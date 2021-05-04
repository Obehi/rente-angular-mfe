import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AddressDto } from '@services/remote-api/loans.service';
import { MatTabChangeEvent } from '@angular/material';
import { CheckBoxItem } from '@shared/components/ui-components/checkbox-container/checkbox-container.component';
import { EnvService } from '@services/env.service';

export enum AddressFormMode {
  Editing,
  Statistics
}

@Component({
  selector: 'rente-house-form',
  templateUrl: './house-form-sv.component.html',
  styleUrls: ['./house-form-sv.component.scss']
})
export class HouseFormSvComponent implements OnInit {
  @Input() index: number;
  @Input() address: AddressDto;

  @Output() deleteAddress: EventEmitter<AddressDto> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() onSave: EventEmitter<any> = new EventEmitter();

  public checkBoxItems: CheckBoxItem[];
  mode = AddressFormMode.Editing;
  changesMade = false;
  get ableTosave(): boolean {
    return this.isAddressValid && this.changesMade;
  }
  tabAutomatic = 'Automatisk estimat';
  constructor(public envService: EnvService) {}

  ngOnInit(): void {
    // Do checks to make sure the checkbox component doesnt invalid values
    this.address.estimatedPropertyValue =
      this.address.estimatedPropertyValue || null;
    this.address.manualPropertyValue = this.address.manualPropertyValue || null;

    if (this.address.useManualPropertyValue === undefined) {
      this.address.useManualPropertyValue = false;
    }

    this.initCheckboxes();
  }

  initCheckboxes(): void {
    const house = new CheckBoxItem();
    const apartment = new CheckBoxItem();
    const cabin = new CheckBoxItem();

    house.name = 'Villa';
    apartment.name = 'Bostadsrätter/</br>lägenhet';
    cabin.name = 'Fritidshus';

    house.value = 'HOUSE';
    apartment.value = 'APARTMENT';
    cabin.value = 'HOLIDAY_HOUSE';

    house.iconActive = 'round-house-green.svg';
    house.iconDeactivated = 'round-house-grey.svg';

    apartment.iconActive = 'round-apartment-green.svg';
    apartment.iconDeactivated = 'round-apartment-grey.svg';

    cabin.iconActive = 'round-cabin-green.svg';
    cabin.iconDeactivated = 'round-cabin-grey.svg';
    this.checkBoxItems = [house, apartment, cabin];
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
    if (this.address.street === null) {
      return false;
    }
    return (
      this.address !== null &&
      this.address.zip?.length === 5 &&
      !!this.address.apartmentSize &&
      this.address.apartmentSize > 5 &&
      this.address.street.length > 0 &&
      this.address.propertyType !== null &&
      this.propertyValueIsSet &&
      this.propertyValueIsValid(this.address)
    );
  }

  get propertyValueIsSet(): boolean {
    if (this.address.useManualPropertyValue) {
      return !!this.address.manualPropertyValue;
    } else {
      return true;
    }
  }

  onPropertyTypeChange($event): void {
    this.changesMade = true;
    this.address.propertyType = $event;
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
    if (this.ableTosave !== true) return;
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
      this.countChange();
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
