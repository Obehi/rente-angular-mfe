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
  // Updates the green button to be available to click on
  @Output() dataSent: EventEmitter<any> = new EventEmitter();
  @Output() optionsEmitter = new EventEmitter<any[]>();
  public closeState: string;
  public memberships: any;

  public allMemberships = [];
  public previousState = [];
  selectedMemberships: string[];
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
  }

  public onClose(): void {
    this.dialogRef.close();
  }

  saveMemberships(memberships) {
    this.memberships = memberships;
    console.log(memberships);
  }

  save(): void {
    console.log('save');
    console.log(this.memberships);
    this.firstBuyersService.setSelectedMemberships(this.memberships);
    this.onClose();
  }

  cancel(): void {
    console.log('cancel');
    console.log(this.memberships);
    this.onClose();
  }
}
