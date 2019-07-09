import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormGroupDirective, FormControl, NgForm, AbstractControl } from '@angular/forms';

@Component({
  selector: 'rente-house',
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.scss']
})
export class HouseComponent implements OnInit {

 public contactUsForm: FormGroup;
 public contactUsForm2: FormGroup;

  constructor( private fb: FormBuilder) { }

  ngOnInit() {
    this.contactUsForm = this.fb.group({
      adress: ['', Validators.required],
      postnummer: ['', [Validators.required]],
      kvm: ['']
    });

    this.contactUsForm2 = this.fb.group({
      adress: ['', Validators.required]
    });
  }

  isErrorState(control: AbstractControl | null, form: FormGroup | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public startLogin(formData) {
    this.contactUsForm.markAllAsTouched();
    this.contactUsForm.updateValueAndValidity();
    console.log(formData);
  }

}
