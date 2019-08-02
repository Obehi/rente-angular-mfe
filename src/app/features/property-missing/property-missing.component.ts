import { LoansService } from '@services/remote-api/loans.service';
import { UserService } from '@services/remote-api/user.service';
import { Component, OnInit } from '@angular/core';
import { Validators, AbstractControl, FormGroup, NgForm, FormBuilder } from '@angular/forms';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'rente-property-missing',
  templateUrl: './property-missing.component.html',
  styleUrls: ['./property-missing.component.scss']
})
export class PropertyMissingComponent implements OnInit {

  public propertyForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private loansService: LoansService
    ) { }

  ngOnInit() {

    forkJoin(this.userService.getUserInfo(), this.loansService.getAddresses()).subscribe(data => {
      console.log(data);
      const userData = data[0];
      const addressData = data[1].addresses[0];

      this.propertyForm = this.fb.group({
        apartmentSize: [addressData.apartmentSize, Validators.required],
        membership: [],
        income: [userData.income, Validators.required],
        email: [userData.email, Validators.required]
      });
      this.propertyForm.markAllAsTouched();
      this.propertyForm.updateValueAndValidity();
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
