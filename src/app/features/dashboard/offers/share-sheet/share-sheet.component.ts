import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';

@Component({
  selector: 'rente-share-sheet',
  templateUrl: './share-sheet.component.html',
  styleUrls: ['./share-sheet.component.scss']
})
export class ShareSheetComponent implements OnInit {
  constructor(private bottomSheetRef: MatBottomSheetRef<ShareSheetComponent>) {}

  ngOnInit() {}
}
