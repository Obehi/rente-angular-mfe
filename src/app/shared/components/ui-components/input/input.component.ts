import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  HostBinding
} from '@angular/core';
import {
  FormControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'rente-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None,
})

export class InputComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() name: string;
  @Input() type: string;
  @Input() placeholder: string;
  // tslint:disable-next-line:no-input-rename
  @Input('value')
  inputValue: any = '';

  @HostBinding('class.input-component') true;

  propagateChange: any = () => {};

  onChange: any = () => {};
  onTouch: any = () => {};

  get value() {
    return this.inputValue;
  }

  set value(val) {
    this.inputValue = val;
    this.onChange(val);
    this.onTouch();
  }


  writeValue(value) {
    if (value) {
      this.value = value;
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

}
