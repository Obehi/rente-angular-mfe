import { Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import {ActivatedRoute} from '@angular/router';
import { BankVo } from '../../shared/models/bank';
import { ROUTES_MAP } from '@config/routes-config';


import {
  MatAutocomplete,
} from "@angular/material";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  NgForm,
  FormControl
} from "@angular/forms";
import { VALIDATION_PATTERN } from "@config/validation-patterns.config";
import { Observable, timer, EMPTY } from "rxjs";
import { ENTER, COMMA } from "@angular/cdk/keycodes";
import {  debounce } from "rxjs/operators";
import { ContactService } from "../../shared/services/remote-api/contact.service";
import { Router } from "@angular/router";
import { SnackBarService } from "@services/snackbar.service";

@Component({  
  selector: "rente-get-notified",
  templateUrl: "./get-notified.component.html",
  styleUrls: ["./get-notified.component.scss"]
})
export class GetNotifiedComponent implements OnInit {
  public missingBankForm: FormGroup;
  public visible = true;
  public selectable = true;
  public removable = true;
  public addOnBlur = true;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  // public bankCtrl = new FormControl();
  public filteredBanks: Observable<string[]>;
  public banks: any = [];
  public allBanks: any[];
  public isLoading: boolean;
  public missingBank: BankVo | null;
  public emailError: boolean = false

  @ViewChild("auto", { static: false }) matAutocomplete: MatAutocomplete;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private router: Router,
    private snackBar: SnackBarService,
    private route: ActivatedRoute
  ) {

    // state.bank is potentially sent through routing
    if(window.history.state.bank) {
      this.missingBank = window.history.state.bank;
    } else {
      this.router.navigate([ROUTES_MAP.bankSelect]);
    }
    
  }

  ngOnInit() {

    this.missingBankForm = this.fb.group({
      
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(VALIDATION_PATTERN.email)
        ])
      ]
    });
    this.missingBankForm.get("email").valueChanges.pipe(debounce(data => {
      this.emailError = false;
      return this.inValid() ? timer(2000) : EMPTY
    })).subscribe(data => 
      this.emailError = this.inValid()
      );
  }

  inValid() {
    return (
      this.missingBankForm.get('email').hasError('pattern') && 
      this.missingBankForm.get('email').dirty
    );
  } 

  onBlurErrorCheck() {
   this.emailError = this.inValid()
  }
  
  // TODO: Move to service
  public isErrorState(
    control: AbstractControl | null,
    form: FormGroup | NgForm | null
  ): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public request() {
    this.isLoading = true;

    const missingBankData = {
      email: this.missingBankForm.value.email,
      bank: this.missingBank.name
    };

    if (!missingBankData.bank) {
      missingBankData.bank = this.missingBankForm.value.bank;
    }
    
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

  public noWhitespaceValidator(control: FormControl) {

    if(control == null) return null;

    const isWhitespace =
      (control.value.name || control.value || "").trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  public displayFn(bank: any): string | undefined {
    return bank ? bank.name : undefined;
  }

  private filter(value: any): any[] {
    const filterValue = value.name
      ? value.name.toLowerCase()
      : value.toLowerCase();
    return this.allBanks.filter(bank =>
      bank.name.toLowerCase().includes(filterValue)
    );
  }
}
