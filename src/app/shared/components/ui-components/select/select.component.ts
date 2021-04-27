import { OnInit } from '@angular/core';
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
  NG_VALUE_ACCESSOR,
  FormGroup,
  FormBuilder
} from '@angular/forms';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'rente-select',
  templateUrl: './select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor, OnInit {
  @Input() rootClass: any;
  @Input() options: any = [];
  @Input() name: string;
  @Input() placeholder: string;

  @Output() public selected = new EventEmitter();

  selectForm: FormGroup;
  selectedItem: any;
  public selectControl = new FormControl();
  propagateChange: any = () => {};

  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
    console.log(this.options);
    this.selectControl.valueChanges.pipe(startWith(null)).subscribe((value) => {
      console.log('value');
      console.log(value);
      this.selected.emit(value);
    });
  }

  public onChange(event): void {
    // event will give you full breif of action
    const newVal = event.target.value;
    console.log('newVal');
    console.log(newVal);
  }

  writeValue(value) {
    if (value) {
      this.selectedItem = value;
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  valueChange(event: any): void {
    console.log(this.selectedItem);
    // this.selectedItem = event;
    console.log('event');
    console.log(event);

    this.selected.emit('test');
    this.propagateChange(this.selectedItem);

    const formTest = this.selectForm.get('selectControl')?.value;
    console.log('formTest');
    console.log(formTest);
  }
}
