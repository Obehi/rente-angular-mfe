import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormGroupDirective,
  NgForm,
  AbstractControl
} from "@angular/forms";
import { VALIDATION_PATTERN } from "@config/validation-patterns.config";
import { ContactService } from "@services/remote-api/contact.service";
import { Router } from "@angular/router";
import { SnackBarService } from "@services/snackbar.service";
import { Mask } from '@shared/constants/mask'
import { locale } from '../../../environments/locale';

@Component({
  selector: "rente-contact-us",
  templateUrl: "./contact-us.component.html",
  styleUrls: ["./contact-us.component.scss"]
})
export class ContactUsComponent implements OnInit {
  public contactUsForm: FormGroup;
  public mask = Mask
  public isLoading: boolean;
  private locale = locale
  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private router: Router,
    private snackBar: SnackBarService
  ) {}

  ngOnInit() {
 
    this.contactUsForm = this.fb.group({
      name: ["", Validators.required],
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(VALIDATION_PATTERN.email)
        ])
      ],
      phone: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(VALIDATION_PATTERN.phoneShort)
        ])
      ],
      message: ["", Validators.required]
    });
  }

  isErrorState(
    control: AbstractControl | null,
    form: FormGroup | NgForm | null
  ): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public sendContactUsForm(formData) {

    var formLocale
    if(this.locale === "nb") {
      formLocale = "NOR";
    } else if(this.locale === "sv") {
      formLocale = "SWE";
    }
    formData["country"] = formLocale;

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
