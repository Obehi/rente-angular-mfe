import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AddressDto } from '@shared/models/loans';
import { MatTabChangeEvent } from '@angular/material';
import { CheckBoxItem } from '@shared/components/ui-components/checkbox-container/checkbox-container.component';
import { EnvService } from '@services/env.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { combineLatest, fromEvent, Subject } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

export enum AddressFormMode {
  Editing,
  Statistics
}

@Component({
  selector: 'rente-house-form',
  templateUrl: './house-form-sv.component.html',
  styleUrls: ['./house-form-sv.component.scss'],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('0.3s ease-in', style({ opacity: '1' }))
      ])
    ]),
    trigger('statsFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('leaveFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [animate('0.35s ease-out', style({ opacity: 0 }))])
    ])
  ]
})
export class HouseFormSvComponent implements OnInit {
  @Input() index: number;
  @Input() address: AddressDto;
  public virdiErrorMessage = new Subject<boolean>();

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

    setTimeout(() => {
      this.getHouseInputListener();
      this.setVirdiErrorMessageState();
    }, 0);
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
    if (this.address === null || this.address.street === null) {
      return false;
    }
    return (
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

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  onPropertyTypeChange($event: any): void {
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
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  formatThousand(event: any): number {
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

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  manualPropertyValueChanged($event: any): void {
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

  setVirdiErrorMessageState(): void {
    const shouldShowVirdiErrorMessage =
      this.address.estimatedPropertyValue === null;
    console.log(this.isAddressValid);
    console.log(this.isAddressValid);

    this.virdiErrorMessage.next(shouldShowVirdiErrorMessage);
  }

  getHouseInputListener(): void {
    combineLatest([
      fromEvent(document.getElementsByClassName('house-input'), 'click')
    ])
      .pipe(debounceTime(20))
      .subscribe(() => {
        this.virdiErrorMessage.next(false);
      });
  }

  switchToggle(): void {
    this.address.useManualPropertyValue = !this.address.useManualPropertyValue;

    setTimeout(() => {
      this.setVirdiErrorMessageState();
    }, 0);
  }
}
