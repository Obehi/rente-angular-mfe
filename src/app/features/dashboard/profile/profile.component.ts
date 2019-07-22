import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, NgForm } from '@angular/forms';

@Component({
  selector: 'rente-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public profileForm: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.profileForm = this.fb.group({
      membership: '',
      income: '',
      email: ''
    });
  }

  public isErrorState(control: AbstractControl | null, form: FormGroup | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

}
