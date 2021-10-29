import {
  Component,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroupDirective,
  NgForm,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  constructor(public state: boolean) {}

  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return this.state;
  }
}
@Component({
  selector: 'rente-general-input',
  templateUrl: './general-input.component.html',
  styleUrls: ['./general-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GeneralInputComponent),
      multi: true
    }
  ]
})
export class GeneralInputComponent
  implements OnInit, OnDestroy, OnChanges, ControlValueAccessor {
  @Input() maskType?: any;
  @Input() suffix: string;
  @Input() errorStateMatcher: boolean;
  @Input() maxLength?: string;
  @Input() placeholder?: string;

  @Input('value') inputValue = '';
  public matcher: MyErrorStateMatcher;

  // CSS class variables
  @Input() isEditMode: boolean;
  @Input() inEditMode: boolean;
  @Input() isInputFocused: boolean;
  @Input() isInputError: boolean;

  onChange: any = () => {};
  onTouch: any = () => {};

  public disabled = true;

  constructor() {}

  isDisabled(): boolean {
    return this.disabled;
    // should get updated control state changed dynamically
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnDestroy(): void {}

  writeValue(value: string): void {
    if (value) {
      this.value = value;
    }
  }

  get value(): string {
    return this.inputValue;
  }

  set value(val: string) {
    this.inputValue = val;
    this.onChange(val);
    this.onTouch();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.errorStateMatcher) {
      this.matcher = new MyErrorStateMatcher(this.errorStateMatcher);
    }
  }
}
