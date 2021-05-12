import {
  Component,
  Input,
  forwardRef,
  HostBinding,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import {
  FormControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormGroupDirective,
  NgForm
} from '@angular/forms';
import { ViewEncapsulation } from '@angular/core';
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
  encapsulation: ViewEncapsulation.None
})
export class TextAreaComponent implements ControlValueAccessor, OnChanges {
  @Input() placeholder: string;
  @Input() errorStateMatcher: boolean;
  // tslint:disable-next-line:no-input-rename
  @Input('value') inputValue: any = '';
  public matcher: MyErrorStateMatcher;
  @HostBinding('class.text-area-component') true;

  propagateChange: any = () => {};
  onChange: any = () => {};
  onTouch: any = () => {};

  get value(): any {
    return this.inputValue;
  }

  set value(val: any) {
    this.inputValue = val;
    this.onChange(val);
    this.onTouch();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.errorStateMatcher) {
      this.matcher = new MyErrorStateMatcher(this.errorStateMatcher);
    }
  }

  writeValue(value: any): void {
    if (value) {
      this.value = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
