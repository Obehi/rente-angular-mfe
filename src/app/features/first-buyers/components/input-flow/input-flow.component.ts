import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'rente-input-flow',
  templateUrl: './input-flow.component.html',
  styleUrls: ['./input-flow.component.scss']
})
export class InputFlowComponent implements OnInit {
  @Input() icon: string;
  @Input() formGroup: FormGroup;
  @Input() title: string;
  @Input() description: string;
  @Input() controlName: string;
  @Input() chips: number[] = [
    100000,
    200000,
    300000,
    400000,
    500000,
    600000,
    700000,
    800000,
    900000,
    1000000
  ];
  @Output() nextStep: EventEmitter<void> = new EventEmitter<void>();
  @Output() exitEditMode: EventEmitter<void> = new EventEmitter<void>();
  selectedChip: number;

  constructor() {
  }

  ngOnInit(): void {
    this.formGroup.get(this.controlName)
      .valueChanges
      .subscribe(val => {
        if (this.chips.indexOf(val) === -1) {
          this.selectedChip = null;
        }
      });
  }

  selectChip(chip) {
    this.selectedChip = chip;
    this.formGroup.patchValue({
      [this.controlName]: chip
    });
  }

}
