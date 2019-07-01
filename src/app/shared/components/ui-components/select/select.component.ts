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

  writeValue(value) {
    if (value) {
      this.selectedItem = value;
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  valueChange(event: any): void {
    this.selectedItem = event;
    this.propagateChange(this.selectedItem);
  }
}
