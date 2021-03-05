import {
  Component,
  OnInit,
  AfterViewInit,
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
export class ChangeBankLocationComponent implements OnInit, AfterViewInit {
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
  currentIndex = 0;
  stepperHeaderArray = [];

  ngAfterViewInit() {
    this.stepperHeaderArray = this.stepper.steps.map((item, index) => {
      const node: HeaderNode = {
        state: index === 0 ? 'active' : 'waiting',
        index: index,
        value: null
      };
      return node;
    });
  }

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
    this.currentIndex = 1;
    this.resetNodesAfterIndex(0);
    this.stepperHeaderArray[0].value = region;
    this.stepperHeaderArray[0].state = 'done';
    this.stepperHeaderArray[1].state = 'active';

    this.stepper.next();
  }

  resetNodesAfterIndex(index) {
    this.stepperHeaderArray
      .filter((node) => {
        return node.index > index;
      })
      .forEach((node) => {
        node.value = null;
        node.state = 'waiting';
        console.log(node);
      });
  }

  cityStepClick(city: any) {
    this.choosenCity = city;
    this.step = this.stepStatus.office;
    this.currentIndex = 2;
    this.resetNodesAfterIndex(1);
    this.stepperHeaderArray[1].value = city;
    this.stepperHeaderArray[1].state = 'done';
    this.stepperHeaderArray[2].state = 'active';
    this.stepper.next();
  }

  clickBackButton() {
    console.log(this.stepper.selectedIndex);
    console.log(this.stepper.selectedIndex);
    this.stepperHeaderArray[this.stepper.selectedIndex - 1].state = 'waiting';
    this.stepperHeaderArray[this.stepper.selectedIndex - 1].value = null;
    this.resetNodesAfterIndex(this.stepper.selectedIndex - 1);

    this.stepper.previous();
    this.stepperHeaderArray[this.stepper.selectedIndex].state = 'active';
    console.log(this.stepper.selectedIndex);
    console.log(this.stepper.selectedIndex);
  }

  cityPreviousClick() {
    this.step = this.stepStatus.region;
    this.resetNodesAfterIndex(0);
    this.stepperHeaderArray[1].value = null;
    this.stepperHeaderArray[1].state = 'waiting';
    this.stepperHeaderArray[0].state = 'active';
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
          this.step = this.stepStatus.done;
          this.currentIndex = 3;
          this.stepperHeaderArray[3].value = '_';
          this.stepperHeaderArray[2].value = office;
          this.stepperHeaderArray[2].state = 'done';
          this.stepperHeaderArray[3].state = 'active';
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
    this.currentIndex = 1;
    this.stepperHeaderArray[2].value = null;
    this.stepperHeaderArray[2].state = 'waiting';
    this.stepperHeaderArray[1].state = 'active';
    this.stepper.previous();
  }

  donePreviousClick() {
    this.step = this.stepStatus.office;
    this.currentIndex = 2;
    this.stepperHeaderArray[3].value = null;
    this.stepperHeaderArray[3].state = 'waiting';
    this.stepperHeaderArray[2].state = 'active';
    this.stepper.previous();
  }

  clickHeaderNode(index) {
    this.currentIndex = index;
    let highestIndexWithValue = 0;
    this.stepperHeaderArray.forEach((node) => {
      if (node.value !== null) {
        highestIndexWithValue = node.index + 1;
      }
    });

    if (index > highestIndexWithValue) {
      return;
    }

    this.stepperHeaderArray.forEach((node) => {
      console.log(node.state + ': ' + node.value);
    });

    this.stepperHeaderArray
      .filter((node) => {
        return node.state === 'active' || node.state === 'active-touched';
      })
      .forEach((activeNode) => {
        console.log('found active node');
        activeNode.state = activeNode.value === null ? 'waiting' : 'done';
      });
    this.stepperHeaderArray.forEach((node) => {
      console.log(node.state + ': ' + node.value);
    });

    this.stepperHeaderArray[index].state = 'active-touched';

    this.stepper.selectedIndex = index;
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

    this.stepperHeaderArray.forEach((node) => {
      node.state = 'waiting';
      node.value = null;
    });
    this.stepperHeaderArray[0].state = 'active';
  }

  closeDialog(): void {
    this.closeState = 'canceled';
    this.dialogRef.close();
  }
}

interface HeaderNode {
  index: number;
  state: string;
  value: any;
}
