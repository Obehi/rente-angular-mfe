import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit
} from '@angular/core';
import { AddressDto } from '@services/remote-api/loans.service';
import { MatTabChangeEvent } from '@angular/material';
import { EnvService } from '@services/env.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { combineLatest, fromEvent, of, Subject, Subscription } from 'rxjs';
import { tap, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

export enum AddressFormMode {
  Editing,
  Statistics
}

@Component({
  selector: 'rente-house-form',
  templateUrl: './house-form-no.component.html',
  styleUrls: ['./house-form-no.component.scss'],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('0.3s ease-in', style({ opacity: '1' }))
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
export class HouseFormNoComponent implements OnInit {
  @Input() index: number;
  @Input() address: AddressDto;

  public virdiErrorMessage = new Subject<boolean>();

  @Output() deleteAddress: EventEmitter<AddressDto> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() onSave: EventEmitter<any> = new EventEmitter();

  mode = AddressFormMode.Editing;
  changesMade = false;
  didSave: boolean;

  get ableTosave(): boolean {
    return this.isAddressValid && this.changesMade;
  }

  constructor(public envService: EnvService) {}

  ngOnInit(): void {
    this.didSave = false;
    this.changesMade = false;
    this.address.estimatedPropertyValue =
      this.address.estimatedPropertyValue || null;
    this.address.manualPropertyValue = this.address.manualPropertyValue || null;

    setTimeout(() => {
      this.setHouseInputListener();
      this.setVirdiErrorMessageState();
    }, 0);
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
    if (this.ableTosave) {
      this.onSave.emit();
      this.changesMade = false;
    } else {
      return;
    }
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

  setVirdiErrorMessageState(): void {
    const shouldShowVirdiErrorMessage =
      this.address.estimatedPropertyValue === null;
    this.virdiErrorMessage.next(shouldShowVirdiErrorMessage);
  }

  setHouseInputListener(): void {
    combineLatest([
      fromEvent(document.getElementsByClassName('house-input'), 'click')
    ])
      .pipe(debounceTime(20), tap())
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
