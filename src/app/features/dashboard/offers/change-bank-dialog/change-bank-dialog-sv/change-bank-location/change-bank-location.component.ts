import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  EventEmitter,
  Inject
} from '@angular/core';
import { MatStepper } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import {
  ChangeBankServiceService,
  offerOfficeDto
} from '@services/remote-api/change-bank-service.service';

@Component({
  selector: 'rente-change-bank-location',
  templateUrl: './change-bank-location.component.html',
  styleUrls: ['./change-bank-location.component.scss']
})
export class ChangeBankLocationComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper;

  constructor(
    private changeBankServiceService: ChangeBankServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ChangeBankLocationComponent>,
    public dialog: MatDialog
  ) {}

  isLoading = false;

  public closeState: string;

  preview: any;
  locations: any;
  offerId: number;
  isEditable = false;
  regionsArray = [];
  locationsArray = [];
  officeArray = [];

  choosenRegion: string;
  choosenCity: string;
  choosenOffice: string;

  stepStatus = {
    region: 'region',
    city: 'city',
    office: 'office',
    done: 'done'
  };

  step: string = this.stepStatus.region;

  ngOnInit() {
    this.locations = this.data.locations;
    this.preview = this.data.preview;
    this.offerId = this.data.offerId;

    this.step = this.stepStatus.region;

    this.regionsArray = Object.keys(this.locations).sort();
    this.locationsArray = [];
  }

  get cities(): any {
    return this.choosenRegion
      ? Object.keys(this.locations[this.choosenRegion])
      : null;
  }

  get offices(): any {
    return this.choosenCity
      ? this.locations[this.choosenRegion][this.choosenCity]
      : null;
  }

  regionStepClick(region: any) {
    this.choosenRegion = region;
    this.step = this.stepStatus.city;
    this.stepper.next();
  }

  cityStepClick(city: any) {
    this.choosenCity = city;
    this.step = this.stepStatus.office;
    this.stepper.next();
  }

  cityPreviousClick() {
    this.step = this.stepStatus.region;
    this.stepper.previous();
  }

  officeStepClick(office: string) {
    this.choosenOffice = office;

    if (
      this.choosenRegion === null ||
      this.choosenCity === null ||
      this.choosenOffice === null ||
      this.offerId === null
    ) {
      this.resetState();
      return;
    }

    const data: offerOfficeDto = {
      region: this.choosenRegion,
      city: this.choosenCity,
      officeAddress: this.choosenOffice
    };
    this.isLoading = true;
    this.changeBankServiceService
      .getBankOfferPreviewWithOffice(this.offerId, data)
      .subscribe(
        (result) => {
          console.log('result');
          console.log(result);
          this.step = this.stepStatus.done;
          this.isLoading = false;
          this.stepper.next();
        },
        (error) => {
          this.isLoading = false;
          this.resetState();
        }
      );
  }

  officePreviousClick() {
    this.step = this.stepStatus.city;
    this.stepper.previous();
  }

  donePreviousClick() {
    this.step = this.stepStatus.office;
    this.stepper.previous();
  }

  sendEmail() {
    if (
      this.choosenRegion === null ||
      this.choosenCity === null ||
      this.choosenOffice === null ||
      this.offerId === null
    ) {
      this.resetState();
      return;
    }
    const data: offerOfficeDto = {
      region: this.choosenRegion,
      city: this.choosenCity,
      officeAddress: this.choosenOffice
    };

    this.isLoading = true;
    this.changeBankServiceService
      .sendBankOfferRequestWithOffice(this.offerId, data)
      .subscribe(
        (result) => {
          this.isLoading = false;
          this.closeState = 'procced';
          this.dialogRef.close();
        },
        (error) => {
          this.isLoading = false;
          this.resetState();
        }
      );
  }

  resetState() {
    this.stepper.reset();
    this.choosenRegion = null;
    this.choosenCity = null;
    this.choosenOffice = null;
    this.step = this.stepStatus.region;
  }

  closeDialog(): void {
    this.closeState = 'canceled';
    this.dialogRef.close();
  }
}
