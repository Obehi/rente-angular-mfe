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
  NgForm
} from '@angular/forms';
import { ViewEncapsulation } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { BehaviorSubject } from 'rxjs';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  constructor(public state: boolean) {}

  isErrorState(): boolean {
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
  @Input() inputMode: any;
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

  get value(): any {
    return this.inputValue;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  set value(val: any) {
    this.inputValue = val;
    this.onChange(val);
    this.onTouch();
  }

  onChangeEmit(): void {
    this.change?.emit();
  }

  ngAfterViewInit(): void {
    this.setFocusedListener();
  }

  ngOnChanges(changes: SimpleChanges): void {
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

  onFocus(): void {
    this.focus.emit();
  }

  onBlur(): void {
    this.blur.emit();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  writeValue(value: any): void {
    if (value) {
      this.value = value;
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  public setFocusedListener(): void {
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
