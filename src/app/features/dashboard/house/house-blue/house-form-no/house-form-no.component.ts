import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AddressDto } from '@services/remote-api/loans.service';
import { LoansService } from '@services/remote-api/loans.service';
import { MatTabChangeEvent } from '@angular/material';
import { EventService, EmitEvent, Events } from '@services/event-service';

export enum AddressFormMode {
  Editing,
  Statistics
}

@Component({
  selector: 'rente-blue-address',
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

  mode = AddressFormMode.Editing;
  changesMade = false;
  ableTosave = false;

  constructor(
    private loansService: LoansService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.loansService.getAddresses().subscribe((r) => {
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
    this.ableTosave = true;
    if (event.index === 1) {
      this.address.useManualPropertyValue = true;
    } else {
      this.address.useManualPropertyValue = false;
    }
  }

  //remove spaces and convert to number type
  formatThousand(event): number {
    return Number(event.replace(/\s+/g, ''));
  }

  save() {
    this.onSave.emit();
    this.ableTosave = false;
  }
  countChange($event) {
    this.ableTosave = true;
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
    this.mode =
      this.mode === AddressFormMode.Editing
        ? AddressFormMode.Statistics
        : AddressFormMode.Editing;
  }
}
