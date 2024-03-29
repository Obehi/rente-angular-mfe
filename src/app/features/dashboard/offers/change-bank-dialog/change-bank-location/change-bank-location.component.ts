import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Inject
} from '@angular/core';
import { MatStepper } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ChangeBankServiceService } from '@services/remote-api/change-bank-service.service';
import { offerOfficeDto } from '@shared/models/bank';

@Component({
  selector: 'rente-change-bank-location',
  templateUrl: './change-bank-location.component.html',
  styleUrls: ['./change-bank-location.component.scss']
})
export class ChangeBankLocationComponent implements OnInit, AfterViewInit {
  @ViewChild('stepper') stepper: MatStepper;
  public confirmForm: FormGroup;
  public isConfirmed: boolean;
  isLoading = false;

  constructor(
    private changeBankServiceService: ChangeBankServiceService,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ChangeBankLocationComponent>,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  public closeState: string;

  preview: any;
  locations: any;
  offerId: number;
  isEditable = false;
  regionsArray: string[] = [];
  stepperHeaderArray: HeaderNode[] = [];

  ngAfterViewInit(): void {
    this.stepperHeaderArray = this.stepper.steps.map((item, index) => {
      const node: HeaderNode = {
        state: index === 0 ? 'active' : 'waiting',
        index: index,
        value: null
      };
      return node;
    });
  }

  ngOnInit(): void {
    this.confirmForm = this.fb.group({
      confirmation: ['', Validators.required]
    });

    this.locations = this.data.locations;
    this.preview = this.data.preview;
    this.offerId = this.data.offerId;

    this.regionsArray = Object.keys(this.locations).sort();
  }

  get choosenRegion(): string {
    return this.stepperHeaderArray[0] ? this.stepperHeaderArray[0].value : null;
  }

  get choosenCity(): string {
    return this.stepperHeaderArray[1] ? this.stepperHeaderArray[1].value : null;
  }

  get choosenOffice(): string {
    return this.stepperHeaderArray[2] ? this.stepperHeaderArray[2].value : null;
  }

  get regions(): any {
    if (this.stepper === undefined) return [];
    return this.regionsArray.length ? this.regionsArray : [];
  }

  get cities(): any {
    if (this.stepper === undefined) return [];
    const regions = this.stepperHeaderArray[0].value;
    return regions
      ? Object.keys(this.locations[this.stepperHeaderArray[0].value]).sort()
      : [];
  }

  get offices(): any {
    if (this.stepper === undefined) return;
    const cities = this.stepperHeaderArray[1].value;
    return !!cities
      ? this.locations[this.stepperHeaderArray[0].value][
          this.stepperHeaderArray[1].value
        ]
      : [];
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  clickNext(region: any, index: number): void {
    this.resetNodesAfterIndex(index);
    this.stepperHeaderArray[index].value = region;
    this.stepperHeaderArray[index].state = 'done';
    this.stepperHeaderArray[index + 1].state = 'active';

    this.stepper.next();
  }

  resetNodesAfterIndex(index: number): void {
    this.stepperHeaderArray
      .filter((node) => {
        return node.index > index;
      })
      .forEach((node) => {
        node.value = null;
        node.state = 'waiting';
      });
  }

  clickBackButton(): void {
    this.stepperHeaderArray[this.stepper.selectedIndex - 1].state = 'waiting';
    this.stepperHeaderArray[this.stepper.selectedIndex - 1].value = null;
    this.resetNodesAfterIndex(this.stepper.selectedIndex - 1);

    this.stepper.previous();
    this.stepperHeaderArray[this.stepper.selectedIndex].state = 'active';
  }

  officeStepClick(office: string, index: number): void {
    this.stepperHeaderArray[index].value = office;
    if (
      this.stepperHeaderArray[0].value === null ||
      this.stepperHeaderArray[1].value === null ||
      this.stepperHeaderArray[2].value === null ||
      this.offerId === null
    ) {
      this.resetState();
      return;
    }

    const data: offerOfficeDto = {
      region: this.stepperHeaderArray[0].value,
      city: this.stepperHeaderArray[1].value,
      officeAddress: this.stepperHeaderArray[2].value
    };
    this.isLoading = true;
    this.changeBankServiceService
      .getBankOfferPreviewWithOffice(this.offerId, data)
      .subscribe(
        () => {
          this.stepperHeaderArray[3].value = '_';
          this.stepperHeaderArray[2].value = office;
          this.stepperHeaderArray[index].state = 'done';
          this.stepperHeaderArray[3].state = 'active';
          this.isLoading = false;
          this.stepper.next();
        },
        () => {
          this.isLoading = false;
          this.resetState();
        }
      );
  }

  clickHeaderNode(index: number): void {
    let highestIndexWithValue = 0;
    this.stepperHeaderArray.forEach((node) => {
      if (node.value !== null) {
        highestIndexWithValue = node.index + 1;
      }
    });

    if (index > highestIndexWithValue) {
      return;
    }

    this.stepperHeaderArray
      .filter((node) => {
        return node.state === 'active' || node.state === 'active-touched';
      })
      .forEach((activeNode) => {
        activeNode.state = activeNode.value === null ? 'waiting' : 'done';
      });

    this.stepperHeaderArray[index].state = 'active-touched';

    this.stepper.selectedIndex = index;
  }

  sendEmail(): void {
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
        () => {
          this.isLoading = false;
          this.closeState = 'procced';
          this.dialogRef.close();
        },
        () => {
          this.isLoading = false;
          this.resetState();
        }
      );
  }

  resetState(): void {
    this.stepper.reset();

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
