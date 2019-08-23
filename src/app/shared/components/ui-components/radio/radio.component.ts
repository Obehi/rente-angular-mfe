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
  selector: 'rente-radio',
  templateUrl: './radio.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioComponent),
      multi: true
    }
  ]
})

export class RadioComponent {
  @Input() label: string;
  @Input() type: string;
  @Input() buttons: string;

  currValue: any;

  propagateChange: any = () => {};

  writeValue(value) {
    if (value) {
      this.currValue = value;
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  valueChange(event: any): void {
    this.currValue = event;
    this.propagateChange(this.currValue);
  }
}
