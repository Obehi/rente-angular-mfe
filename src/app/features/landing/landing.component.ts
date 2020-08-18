import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { ROUTES_MAP } from '@config/routes-config';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  NgForm,
  FormControl
} from "@angular/forms";

import { VALIDATION_PATTERN } from "@config/validation-patterns.config";
import { ContactService } from "@services/remote-api/contact.service";
import { Router } from "@angular/router";
import { SnackBarService } from "@services/snackbar.service";
import { Mask } from '@shared/constants/mask'

@Component({
  selector: 'rente-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({height:0, opacity:0}),
        animate('0.5s ease-out', style({height:300, opacity:1}))
      ]),
      transition(':leave', [
        style({height:300, opacity:1}),
        animate('0.5s ease-in', style({height:0, opacity:0}))
      ])
    ])
  ]
})
export class LandingComponent implements OnInit {
  time = 0;
  get isMobile(): boolean { return window.innerWidth < 600; }

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
    const subscription = timer(1000, 1000).subscribe(t => {
      this.time = t;
      if (t === 3) {
        subscription.unsubscribe();
      }
    });

    this.contactUsForm = this.fb.group({
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(VALIDATION_PATTERN.email)
        ])
      ]
    });
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
}

