import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ElementRef
} from '@angular/core';
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
  @Input() icon: string;
  @Input() iconPath: string;
  @Input() checkBoxItems: CheckBoxItem[];

  constructor() {}

  ngOnInit(): void {
    this.checkBoxItems.forEach((item) => {
      item.isSelected = false;
    });
  }

  getIcon(index: number): string {
    const controlValue = this.formGroup.get(this.controlName).value;
    const currentItem = this.checkBoxItems[index];
    const currentPath =
      currentItem.name === controlValue
        ? currentItem.iconActive
        : currentItem.iconDeactivated;
    const path = '../../../../assets/icons/' + currentPath;
    return path;
  }

  getBoxState(index: number): string {
    return this.checkBoxItems[index].isSelected ? 'default' : 'disabled';
  }
  boxClicked(index: string): void {
    this.checkBoxItems
      .filter((item) => {
        return item.name !== this.checkBoxItems[index];
      })
      .forEach((item) => {
        item.isSelected = false;
      });

    this.checkBoxItems[index].isSelected = true;
  }
}

export class CheckBoxItem {
  name: string;
  iconpath: string;
  iconDeactivated: string;
  iconActive: string;
  isSelected = false;
}
