import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef
} from '@angular/core';
import {
  FormControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Component({
  selector: 'rente-select',
  templateUrl: './select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor {
  @Input() rootClass: any;
  @Input() options: any = [];
  @Input() name: string;
  @Input() placeholder: string;

  @Output() public selected = new EventEmitter();

  selectedItem: any;

  propagateChange: any = () => {};

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  writeValue(value): void {
    if (value) {
      this.selectedItem = value;
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  registerOnTouched(): void {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  valueChange(event: any): void {
    this.selectedItem = event;
    this.selected.emit(event);
    this.propagateChange(this.selectedItem);
  }
}
