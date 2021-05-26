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
import { FirstBuyersService } from '@features/first-buyers/first-buyers.service';
import { FirstBuyersAPIService } from '@services/remote-api/first-buyers.service';
import { PropertySelectComponent } from '../property-select/property-select.component';

@Component({
  selector: 'app-property-select-dialog',
  templateUrl: './property-select-dialog.component.html',
  styleUrls: ['./property-select-dialog.component.scss']
})
export class PropertySelectDialogComponent implements OnInit {
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
    public firstBuyersService: FirstBuyersService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.allMemberships = this.data.allMemberships;
    this.previousState = this.data.previousState;
    console.log(this.memberships);
  }

  public onClose(): void {
    this.dialogRef.close();
  }

  saveMemberships(memberships): void {
    this.memberships = memberships;
    this.hasChanged = true;
  }

  save(): void {
    if (this.hasChanged === true) {
      this.firstBuyersService.setSelectedMemberships(this.memberships);
      this.onClose();
    }
  }

  cancel(): void {
    this.onClose();
  }
}
