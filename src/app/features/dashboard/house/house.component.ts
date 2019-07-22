import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormGroupDirective, FormControl, NgForm, AbstractControl } from '@angular/forms';

@Component({
  selector: 'rente-house',
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HouseComponent implements OnInit {

 public autoPropertyForm: FormGroup;
 public manualPropertyForm: FormGroup;
 public isAutoMode = true;

  constructor( private fb: FormBuilder) { }

  ngOnInit() {
    this.autoPropertyForm = this.fb.group({
      adress: ['', Validators.required],
      postnummer: ['', [Validators.required]],
      kvm: ['']
    });

    this.manualPropertyForm = this.fb.group({
      adress: ['', Validators.required]
    });

    this.isAutoMode = true;

    this.setPropertyMode();
  }

  public isErrorState(control: AbstractControl | null, form: FormGroup | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public setPropertyMode() {
    if (this.isAutoMode) {
      console.log('iSAuto');
      this.autoPropertyForm.enable();
      this.manualPropertyForm.disable();
    } else {
      console.log('iSManual');
      this.manualPropertyForm.enable();
      this.autoPropertyForm.disable();
    }
  }

  public updatePropertyMode() {

  }

}
