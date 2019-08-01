import { Component, OnInit } from '@angular/core';
import { Validators, AbstractControl, FormGroup, NgForm, FormBuilder } from '@angular/forms';

@Component({
  selector: 'rente-property-missing',
  templateUrl: './property-missing.component.html',
  styleUrls: ['./property-missing.component.scss']
})
export class PropertyMissingComponent implements OnInit {

  public propertyForm: FormGroup;

  constructor( private fb: FormBuilder) { }

  ngOnInit() {
    this.propertyForm = this.fb.group({
      apartmentSize: ['', Validators.required],
      income: ['', [Validators.required]]
    });
  }

  isErrorState(control: AbstractControl | null, form: FormGroup | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public updateProperty(formData) {
    this.propertyForm.markAllAsTouched();
    this.propertyForm.updateValueAndValidity();
    console.log(formData);
  }

}
