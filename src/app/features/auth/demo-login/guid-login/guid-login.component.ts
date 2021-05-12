import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

import { SnackBarService } from '@services/snackbar.service';
import { AuthService } from '@services/remote-api/auth.service';
import { ROUTES_MAP } from '@config/routes-config';
import { CustomLangTextService } from '@services/custom-lang-text.service';

@Component({
  selector: 'guid-login',
  templateUrl: './guid-login.component.html',
  styleUrls: ['./guid-login.component.scss']
})
export class GuidLoginComponent implements OnInit {
  public contactUsForm: FormGroup;
  public isLoading: boolean;
  public loginIdError = false;
  p;

  constructor(
    private fb: FormBuilder,
    private snackBar: SnackBarService,
    private router: Router,
    private authService: AuthService,
    public customLangTextService: CustomLangTextService
  ) {}

  ngOnInit(): void {
    this.contactUsForm = this.fb.group({
      loginId: ['']
    });
  }

  public isErrorState(control: AbstractControl | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  inValid(): boolean {
    return (
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.contactUsForm.get('loginId')!.hasError('pattern') &&
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.contactUsForm.get('loginId')!.dirty
    );
  }
  onBlurErrorCheck(): void {
    this.loginIdError = this.inValid();
  }

  public request(): void {
    const guid = this.contactUsForm.controls['loginId'].value;
    this.isLoading = true;
    this.authService.loginForDemo(guid).subscribe(
      () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard/' + ROUTES_MAP.offers]);
      },
      () => {
        this.isLoading = false;
        this.snackBar.openFailSnackBar(
          this.customLangTextService.getSnackBarErrorMessage(),
          2
        );
      }
    );
  }
}
