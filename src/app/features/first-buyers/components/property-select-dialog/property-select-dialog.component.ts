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
  public closeState: string;

  selectedMemberships: string[];
  constructor(
    public dialogRef: MatDialogRef<PropertySelectDialogComponent>,
    public dialog: MatDialog,
    public firstBuyersAPIService: FirstBuyersAPIService,
    public firstBuyersService: FirstBuyersService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  public onClose(): void {
    this.dialogRef.close();
    this.test();
  }

  // public addMembership(memberships): void  {
  //   this.selectedMemberships = memberships
  // }

  public sendMemberships(event: string[]): void {
    // this.isDirty = true
    this.firstBuyersAPIService.updateMembership(event).subscribe((res) => {
      console.log(res);
      // this.data.onClose(memberships);
      this.onClose();
      this.dataSent.emit();
    });
    this.firstBuyersService.pushMessage();
  }

  public test() {
    console.log(this.selectedMemberships);
  }
}
