import { Subscription } from "rxjs";
import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  AbstractControl,
  NgForm
} from "@angular/forms";
import { VALIDATION_PATTERN } from "@config/validation-patterns.config";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { BANK_MAP } from "../login-status/login-status.config";
import { MatDialog } from "@angular/material";
import { DialogInfoServiceComponent } from "./dialog-info-service/dialog-info-service.component";
import { MetaService } from "@services/meta.service";
import { TitleService } from "@services/title.service";
import { customMeta } from "../../../config/routes-config";

@Component({
  selector: "rente-bank-id-login",
  templateUrl: "./bank-id-login.component.html",
  styleUrls: ["./bank-id-login.component.scss"]
})
export class BankIdLoginComponent implements OnInit, OnDestroy {
  public bankIdForm: FormGroup;
  public isSsnBankLogin: boolean;
  public isConfirmed: boolean;
  public isLoginStarted = false;
  public userData: any = {};
  public userBank: any;
  public bankLogo: string;
  public ssnMask = {
    mask: [
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      " ",
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/
    ],
    guide: false
  };
  public phoneMask = {
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
    guide: false
  };
  public birthdateMask = {
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
    guide: false
  };
  private routeParamsSub: Subscription;
  public metaTitle: string;
  public metaDescription: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private metaService: MetaService,
    private titleService: TitleService
  ) {}

  ngOnInit() {
    this.routeParamsSub = this.route.params.subscribe((params: any) => {
      if (params && params.bankName) {
        for (const iterator in customMeta) {
          if (customMeta[iterator].title) {
            if (params.bankName === customMeta[iterator].bankName) {
              this.metaTitle = customMeta[iterator].title;
              this.metaDescription = customMeta[iterator].description;
              this.changeTitles();
            }
          }
        }

        this.userBank = BANK_MAP[params.bankName];
        console.log(this.userBank);
        this.bankLogo = this.userBank.bankIcon;
        this.isSsnBankLogin = BANK_MAP[params.bankName].isSSN;
        this.setBankIdForm();
      }
    });
  }

  ngOnDestroy() {
    this.routeParamsSub.unsubscribe();
  }

  public startLogin(formData) {
    this.userData = formData;
    for (const key in this.userData) {
      // remove everything except numbers
      if (typeof this.userData[key] === "string") {
        this.userData[key] = this.userData[key].replace(/\s/g, "");
      }
    }
    this.isLoginStarted = true;
  }

  private initForm() {
    // 13018939554
    // 93253768
    // VALIDATION_PATTERN.ssn
    return this.fb.group({
      ssn: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(VALIDATION_PATTERN.ssnMasked)
        ])
      ],
      phone: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(VALIDATION_PATTERN.phoneShort)
        ])
      ],
      confirmation: ["", Validators.required]
    });
  }

  public openServiceDialog(): void {
    this.dialog.open(DialogInfoServiceComponent, {
      width: "800px",
      maxHeight: "85vh"
    });
  }

  private changeTitles(): void {
    if (this.metaTitle && this.metaDescription) {
      this.titleService.setTitle(this.metaTitle);
      this.metaService.updateMetaTags("description", this.metaDescription);
    }
  }

  private setBankIdForm() {
    this.bankIdForm = this.initForm();
    if (!this.isSsnBankLogin) {
      this.bankIdForm.addControl(
        "birthdate",
        new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.pattern(VALIDATION_PATTERN.dob)
          ])
        )
      );
      this.bankIdForm.removeControl("ssn");
    }
  }

  isErrorState(
    control: AbstractControl | null,
    form: FormGroup | NgForm | null
  ): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
