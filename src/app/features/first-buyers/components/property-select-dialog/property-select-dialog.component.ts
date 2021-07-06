import { ElementRef, OnDestroy } from '@angular/core';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  TemplateRef
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FirstBuyersAPIService } from '@services/remote-api/first-buyers.service';
import { MembershipService } from '../../../../shared/services/membership.service';

@Component({
  selector: 'app-property-select-dialog',
  templateUrl: './property-select-dialog.component.html',
  styleUrls: ['./property-select-dialog.component.scss']
})
export class PropertySelectDialogComponent implements OnInit, OnDestroy {
  @Output() dataSent: EventEmitter<any> = new EventEmitter();
  @Output() optionsEmitter = new EventEmitter<any[]>();
  public closeState: string;
  public memberships: any;

  public allMemberships = [];
  public previousState = [];
  selectedMemberships: string[];
  public hasChanged = false;
  constructor(
    public dialogRef: MatDialogRef<PropertySelectDialogComponent>,
    public dialog: MatDialog,
    public firstBuyersAPIService: FirstBuyersAPIService,
    public membershipService: MembershipService,
    private elRef: ElementRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.allMemberships = this.data.allMemberships;
    this.previousState = this.data.previousState;
    console.log(this.previousState);
  }

  ngOnDestroy(): void {}

  public onClose(): void {
    this.dialogRef.close();
  }

  saveMemberships(memberships): void {
    this.memberships = memberships;
    this.hasChanged = true;
  }

  save(): void {
    if (this.hasChanged === true) {
      this.membershipService.setSelectedMemberships(this.memberships);
      this.closeState = 'saved';
      this.onClose();
    }
  }

  cancel(): void {
    this.closeState = 'cancelled';
    this.onClose();
  }
}