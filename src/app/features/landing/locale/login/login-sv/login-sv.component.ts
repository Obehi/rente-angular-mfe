import { Component, OnInit } from '@angular/core';

import { VALIDATION_PATTERN } from "@config/validation-patterns.config";
import { ContactService } from "@services/remote-api/contact.service";
import { Router } from "@angular/router";
import { SnackBarService } from "@services/snackbar.service";
import { Mask } from '@shared/constants/mask'

import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  NgForm,
  FormControl
} from "@angular/forms";

@Component({
  selector: 'rente-login',
  templateUrl: './login-sv.component.html',
  styleUrls: ['./login-sv.component.scss']
})
export class LoginSVComponent implements OnInit {

  public contactUsForm: FormGroup;
  public mask = Mask
  public isLoading: boolean;
  public emailError: boolean = false

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private router: Router,
    private snackBar: SnackBarService
  ) {}

  ngOnInit(): void {
    this.contactUsForm = this.fb.group({
      email: [
        ""
      ]
    });
  }

  inValid() {
    return (
      this.contactUsForm.get('email').hasError('pattern') && 
      this.contactUsForm.get('email').dirty
    );
  } 

  onBlurErrorCheck() {
    this.emailError = this.inValid()
   }

  public request() {
    this.isLoading = true;

    const missingBankData = {
      email: this.contactUsForm.value.email,
      bank: "SWEDEN"
    };
    
    this.contactService.sendMissingBank(missingBankData).subscribe(
      _ => {
        this.isLoading = false;
        this.router.navigate(["/"]);
        this.snackBar.openSuccessSnackBar(
          "Du får beskjed når din bank er tilgjengelig",
          1.2
        );
      },
      err => {
        this.isLoading = false;
      }
    );
  }

  isErrorState(
    control: AbstractControl | null,
    form: FormGroup | NgForm | null
  ): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public sendContactUsForm(formData) {
    this.isLoading = true;
    this.contactUsForm.markAllAsTouched();
    this.contactUsForm.updateValueAndValidity();
    this.contactService.sendContactForm(formData).subscribe(
      _ => {
        this.isLoading = false;
        this.router.navigate(["/"]);
        this.snackBar.openSuccessSnackBar("Din melding er sendt", 2);
      },
      err => {
        this.isLoading = false;
      }
    );
  }
}
