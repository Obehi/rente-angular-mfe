import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AddressDto } from '@services/remote-api/loans.service';
import { LoansService } from '@services/remote-api/loans.service';
import { MatTabChangeEvent } from '@angular/material';
import { CheckBoxItem } from '@shared/components/ui-components/checkbox-container/checkbox-container.component';
import { EnvService } from '@services/env.service';

export enum AddressFormMode {
  Editing,
  Statistics
}

@Component({
  selector: 'rente-blue-address',
  templateUrl: './house-form-sv.component.html',
  styleUrls: ['./house-form-sv.component.scss']
})
export class HouseFormSvComponent implements OnInit {
  @Input() index: number;
  @Input() address: AddressDto;

  @Output() deleteAddress: EventEmitter<AddressDto> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() onSave: EventEmitter<any> = new EventEmitter();

  addresses: AddressDto[];
  public checkBoxItems: CheckBoxItem[];
  mode = AddressFormMode.Editing;
  changesMade = false;
  ableTosave = false;
  tabAutomatic = 'Automatisk estimat';
  constructor(
    private loansService: LoansService,
    public envService: EnvService
  ) {}

  ngOnInit(): void {
    // Do checks to make sure the checkbox component doesnt invalid values
    this.address.estimatedPropertyValue =
      this.address.estimatedPropertyValue || null;
    this.address.manualPropertyValue = this.address.manualPropertyValue || null;

    this.initCheckboxes();

    this.loansService.getAddresses().subscribe((r) => {
      this.addresses = r.addresses;
    });
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
    return (
      this.address !== null &&
      this.address.id > 0 &&
      this.address.zip &&
      this.address.zip.length === 4 &&
      this.address.street.length > 0 &&
      this.address.propertyType !== null
    );
  }

  onPropertyTypeChange($event): void {
    this.address.propertyType = $event;
    this.countChange('');
  }

  onRbChange(event: MatTabChangeEvent): void {
    this.ableTosave = true;
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
    this.ableTosave = false;
  }
  countChange($event): void {
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
