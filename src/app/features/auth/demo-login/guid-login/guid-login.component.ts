import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  AbstractControl,
  NgForm,
  FormControl
} from '@angular/forms';
import { ContactService } from '@services/remote-api/contact.service';
import { Router } from '@angular/router';
import { SnackBarService } from '@services/snackbar.service';
import { Subscription } from 'rxjs';

import { AuthService } from '@services/remote-api/auth.service';
import { ROUTES_MAP } from '@config/routes-config';
import { CustomLangTextService } from '@services/custom-lang-text.service';
import { MessageBannerService } from '@services/message-banner.service';
import { getAnimationStyles } from '@shared/animations/animationEnums';

@Component({
  selector: 'guid-login',
  templateUrl: './guid-login.component.html',
  styleUrls: ['./guid-login.component.scss']
})
export class GuidLoginComponent implements OnInit {
  public contactUsForm: FormGroup;
  public isLoading: boolean;
  public loginIdError = false;
  public animationType = getAnimationStyles();
  p;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private snackBar: SnackBarService,
    private router: Router,
    private authService: AuthService,
    public customLangTextService: CustomLangTextService,
    private messageService: MessageBannerService
  ) {}

  ngOnInit(): void {
    this.contactUsForm = this.fb.group({
      loginId: ['']
    });
  }

  public isErrorState(
    control: AbstractControl | null,
    form: FormGroup | NgForm | null
  ): boolean {
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
        // this.snackBar.openFailSnackBar(
        //   this.customLangTextService.getSnackBarErrorMessage(),
        //   2
        // );
        this.messageService.setView(
          this.customLangTextService.getSnackBarErrorMessage(),
          5000,
          this.animationType.DROP_DOWN_UP,
          'error'
        );
      }
    );
  }
}
