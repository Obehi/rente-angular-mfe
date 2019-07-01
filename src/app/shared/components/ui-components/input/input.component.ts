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

  @Output() public value = new EventEmitter();

  @HostBinding('class.input-component') true;

  inputValue: any = '';

  propagateChange: any = () => {};

  writeValue(value) {
    if (value) {
      this.inputValue = value;
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  valueInput(event: any): void {
    this.inputValue = event.target.value;
    this.propagateChange(this.inputValue);
  }

}
