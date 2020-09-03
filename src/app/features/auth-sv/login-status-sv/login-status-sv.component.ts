import { AuthService } from "@services/remote-api/auth.service";
import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Output,
  EventEmitter
} from "@angular/core";
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
} from "../../auth/login-status/login-status.config";

@Component({
  selector: 'rente-login-status-sv',
  templateUrl: './login-status-sv.component.html',
  styleUrls: ['./login-status-sv.component.scss']
})
export class LoginStatusSvComponent implements OnInit {
  
  ngOnInit() {
    console.log("OnInit LoginStatusSvComponent")
  }
}
