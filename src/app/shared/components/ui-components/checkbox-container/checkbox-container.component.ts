import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'rente-checkbox-container',
  templateUrl: './checkbox-container.component.html',
  styleUrls: ['./checkbox-container.component.scss'],
  animations: [
    trigger('enabledStateChange', [
      state(
        'default',
        style({
          width: '60px'
        })
      ),
      state(
        'disabled',
        style({
          width: '45px'
        })
      ),
      transition('* => *', animate('150ms ease-out'))
    ])
  ]
})
export class CheckboxContainerComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() controlName: string;
  @Input() defaultValue: any;
  @Input() icon: string;
  @Input() iconPath: string;
  @Input() checkBoxItems: CheckBoxItem[];
  @Output() selectedValue = new EventEmitter<string | null>();
  _selectedItem: CheckBoxItem | null = null;
  constructor() {}

  ngOnInit(): void {
    this.checkBoxItems.forEach((item) => {
      item.isSelected = false;
    });

    if (
      this.defaultValue !== undefined &&
      this.defaultValue !== null &&
      this.defaultValue !== ''
    ) {
      const defaultItem = this.checkBoxItems.filter((item) => {
        return item.value === this.defaultValue;
      })[0];
      defaultItem.isSelected = true;
      this._selectedItem = defaultItem;
    }
  }

  getIcon(item: CheckBoxItem): string {
    const currentItemValue = this.formGroup
      ? this.formGroup.get(this.controlName).value
      : this._selectedItem?.value;

    const iconName =
      currentItemValue === item.value ? item.iconActive : item.iconDeactivated;
    const path = 'assets/icons/' + iconName;
    return path;
  }

  getBoxState(index: number): string {
    return this.checkBoxItems[index].isSelected ? 'default' : 'disabled';
  }
  boxClicked(index: string): void {
    this.checkBoxItems
      .filter((item) => {
        return item.value !== this.checkBoxItems[index].value;
      })
      .forEach((item) => {
        item.isSelected = false;
      });

    this.checkBoxItems[index].isSelected = true;
    this._selectedItem = this.checkBoxItems[index];
    this.selectedValue.emit(this._selectedItem.value);
  }
}

export class CheckBoxItem {
  name: string;
  value: any;
  iconpath: string;
  iconDeactivated: string;
  iconActive: string;
  isSelected = false;
}
