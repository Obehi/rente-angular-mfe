import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

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

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  writeValue(value): void {
    if (value) {
      this.currValue = value;
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  registerOnTouched(): void {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  valueChange(event: any): void {
    this.currValue = event;
    this.propagateChange(this.currValue);
  }
}
