import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  NgForm,
  FormControl
} from "@angular/forms";
import { ContactService } from "@services/remote-api/contact.service";
import { Router } from "@angular/router";
import { SnackBarService } from "@services/snackbar.service";
import { Mask } from '@shared/constants/mask'
import * as Stomp from "stompjs";
import * as SockJS from "sockjs-client";
import { environment } from "@environments/environment";
import { API_URL_MAP } from "@config/api-url-config";
import { Subscription, interval, Observable, timer, forkJoin } from "rxjs";
import {
  IDENTIFICATION_TIMEOUT_TIME,
  PING_TIME,
  RECONNECTION_TRIES,
  RECONNECTION_TIME,
  BANKID_STATUS,
  BANKID_TIMEOUT_TIME,
  MESSAGE_STATUS
} from "../auth/login-status/login-status.config";

@Component({
  selector: 'rente-auth-sv-mockup',
  templateUrl: './auth-sv-mockup.component.html',
  styleUrls: ['./auth-sv-mockup.component.scss']
})
export class AuthSvMockupComponent implements OnInit {

  public contactUsForm: FormGroup;
  public mask = Mask
  public isLoading: boolean;
  public loginIdError: boolean = false
  private stompClient: any;
  private intervalSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private router: Router,
    private snackBar: SnackBarService
  ) {
  }

  

  ngOnInit(): void {
    this.contactUsForm = this.fb.group({
      loginId: [
        ""
      ]
    });
  }

  public isErrorState(
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
      this.contactUsForm.get('loginId').hasError('pattern') && 
      this.contactUsForm.get('loginId').dirty
    );
  } 
  onBlurErrorCheck() {
    this.loginIdError = this.inValid()
   }

  public request() {
    var data = this.contactUsForm.value.loginId
    console.log("request requested")
    this.initializeWebSocketConnection(data)
   
  }

  private initializeWebSocketConnection(loginId: number) {
    this.connectAndReconnectSocket(this.successSocketCallback);

    console.log("environment.crawlerUrl")
    console.log(environment.crawlerUrl)
    const socket = new SockJS(API_URL_MAP.crawlerComunicationUrl);
    this.stompClient = Stomp.over(socket);

    if (environment.production) {
      this.stompClient.debug = null;
    }

    this.stompClient.connect({}, frame => {
      console.log("send data")
      this.sendUserData(loginId);

      //this.resendDataAfterReconnect();
        this.successSocketCallback();
        // Send ping to prevent socket closing
        this.intervalSubscription = interval(PING_TIME).subscribe(() => {
          this.stompClient.send(
            API_URL_MAP.crawlerComunicationUrl,
            {},
            JSON.stringify({ message: "ping" })
          );
        });
    }, () => {})
  }


  private successSocketCallback() {
    console.log("this is the shit")

  }

  private connectAndReconnectSocket(successCallback) {
  
  }

  sendUserData(loginId: number, resendData = false) {
    const dataObj = {
    };
    //this.setDefaultSteps();
    const data = JSON.stringify(dataObj);

    this.stompClient.send( 
      API_URL_MAP.tinkSendMessageUrl + loginId,
      {},
      data
    );
    if (!resendData) {
      //this.initTimer(IDENTIFICATION_TIMEOUT_TIME);
      //this.initConnectionTimer();
    }
  }


}
