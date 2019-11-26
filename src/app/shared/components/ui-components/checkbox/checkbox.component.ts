import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef
} from "@angular/core";
import {
  FormControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from "@angular/forms";

@Component({
  selector: "rente-checkbox",
  styleUrls: ["./checkbox.component.scss"],
  templateUrl: "./checkbox.component.html",
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

  writeValue(value) {
    if (value) {
      this.checked = value;
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  valueChange(): void {
    this.propagateChange(this.checked);
  }
}
