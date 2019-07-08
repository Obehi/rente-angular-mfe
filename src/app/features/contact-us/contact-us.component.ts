import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';

@Component({
  selector: 'rente-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  public contactUsForm: FormGroup;

  constructor( private fb: FormBuilder) { }

  ngOnInit() {
    this.contactUsForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required]],
      phone: [''],
      message: ['', Validators.required]
    });
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  public startLogin(formData) {
    this.contactUsForm.markAllAsTouched();
    this.contactUsForm.updateValueAndValidity();
    console.log(formData);
  }
}
