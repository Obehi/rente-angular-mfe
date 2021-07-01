import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  HostBinding,
  SimpleChanges,
  OnChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit
} from '@angular/core';
import {
  FormControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormGroupDirective,
  FormsModule,
  NgForm
} from '@angular/forms';
import { ViewEncapsulation } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { BehaviorSubject, Observable } from 'rxjs';

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
  encapsulation: ViewEncapsulation.None
})
export class InputComponent
  implements OnInit, ControlValueAccessor, OnChanges, AfterViewInit {
  @Input() label: string;
  @Input() name: string;
  @Input() type: string;
  @Output() change?: EventEmitter<any> = new EventEmitter();
  @Input() disabled: boolean;
  @Input() maxLength: number;
  @Input() matSuffix: string;
  @Input() placeholder: string;
  @Input() errorStateMatcher: boolean;
  @Input() modelOptions?: { updateOn: string };
  @Input() textControl: boolean;
  @Input() maskType: any;
  @Input() isFocused?: boolean;
  @ViewChild('inputRef') inputRef: ElementRef;
  @Input() focusListener?: BehaviorSubject<boolean>;

  // tslint:disable-next-line:no-input-rename
  @Input('value') inputValue: any = '';
  @Input() mask?: any[];
  public matcher: MyErrorStateMatcher;
  @HostBinding('class.input-component') true;
  @Output() focus: EventEmitter<any> = new EventEmitter();
  @Output() blur: EventEmitter<any> = new EventEmitter();

  propagateChange: any = () => {};
  onChange: any = () => {};
  onTouch: any = () => {};

  constructor() {}

  ngOnInit(): void {}

  get value() {
    return this.inputValue;
  }

  set value(val) {
    this.inputValue = val;
    this.onChange(val);
    this.onTouch();
  }

  onChangeEmit(): void {
    this.change?.emit();
  }

  ngAfterViewInit(): void {
    this.setFocused();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.errorStateMatcher) {
      this.matcher = new MyErrorStateMatcher(this.errorStateMatcher);
    }
  }

  // Hack to get iMask to play with strict mode
  getMask(): any {
    if (typeof this.maskType === 'string') {
      return { mask: this.maskType };
    }
    return this.maskType;
  }

  onFocus() {
    this.focus.emit();
  }

  onBlur() {
    this.blur.emit();
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

  public setFocused(): void {
    this.focusListener?.subscribe((state) => {
      if (state) {
        setTimeout(() => {
          this.inputRef.nativeElement.focus();
        }, 0);
      } else {
        this.inputRef.nativeElement.blur();
      }
    });
  }
}
