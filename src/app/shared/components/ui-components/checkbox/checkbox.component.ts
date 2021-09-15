import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'rente-checkbox',
  styleUrls: ['./checkbox.component.scss'],
  templateUrl: './checkbox.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ]
})
export class CheckboxComponent {
  @Input() name: string;

  @Output() public checkedValue = new EventEmitter();

  checked: boolean;

  propagateChange: any = () => {};

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  writeValue(value): void {
    if (value) {
      this.checked = value;
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  registerOnTouched(): void {}

  valueChange(): void {
    this.propagateChange(this.checked);
  }
}
