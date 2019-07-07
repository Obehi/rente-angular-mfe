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
  selector: 'rente-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextAreaComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None,
})

export class TextAreaComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() name: string;
  @Input() type: string;
  @Input() placeholder: string;

  @Output() public value = new EventEmitter();

  @HostBinding('class.text-area-component') true;

  textAreaValue: any = '';

  propagateChange: any = () => {};

  writeValue(value) {
    if (value) {
      this.textAreaValue = value;
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  valueInput(event: any): void {
    this.textAreaValue = event.target.value;
    this.propagateChange(this.textAreaValue);
  }

}
