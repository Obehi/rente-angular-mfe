import { Injectable } from '@angular/core';
import { Timber } from "@timberio/node";
import { time } from 'console';
import { LocalStorageService } from '@services/local-storage.service'
import { UserService } from '@services/remote-api/user.service'
import { LoansLangGenericComponent } from 'app/local-components/components-output';
import { environment } from "@environments/environment";

import * as uuid from 'uuid';

const myId = uuid.v4();
@Injectable({
  providedIn: 'root'
})

export class TimberService {

  timberApiKey =  environment["timberApiKey"] || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2FwaS50aW1iZXIuaW8vIiwiZXhwIjpudWxsLCJpYXQiOjE2MDczNDc1NzAsImlzcyI6Imh0dHBzOi8vYXBpLnRpbWJlci5pby9hcGlfa2V5cyIsInByb3ZpZGVyX2NsYWltcyI6eyJhcGlfa2V5X2lkIjoxMTQzMiwidXNlcl9pZCI6ImFwaV9rZXl8MTE0MzIifSwic3ViIjoiYXBpX2tleXwxMTQzMiJ9.pkc7WXGSzZqZkTL6W6YcLVJPjKtN2Vjdu930wvO1QSw"
  timberSourceId =  environment["timberSourceId"] || "45088"

  timber = new Timber(this.timberApiKey, this.timberSourceId);
  sessionId: string;

  constructor( storage: LocalStorageService) {
    this.sessionId = storage.getItem("timberSessionId") ;
    if(this.sessionId == null) {
      this.sessionId = uuid.v4();
      storage.setItem("timberSessionId", this.sessionId)
    }
   }

  logGotTinkCode(tinkCode: number) {
    this.timber.info("Got tink code", {
      session_id: this.sessionId, 
      action:'Got tink code',
      data: {
        tink_code: tinkCode
      },
    })
  }
 
  logSendtMessage(message: string) {
    this.timber.info("Sendt tink code through socket", {
      session_id: this.sessionId, 
      action: 'Sendt tink code through socket',
      data: {
        message: message
      },
    })
  }

  logConnectedToSocket() {
    this.timber.info("Connection to socket established", {
      session_id: this.sessionId, 
      action: 'Connection to socket established',
    })
  }

  logTinkLoignSuccessful() {
    this.timber.info("Tink login was successful", {
      session_id: this.sessionId, 
      action: 'Tink login was successful',
    })
  }

  logGotResponseFromSocket(eventType: string) {
    this.timber.info("Got response from socket", {
      session_id: this.sessionId, 
      action: 'Got response from socket',
      data: {
        event_type: eventType
      },
    })
  }

  logLoansPersisted() {
    this.timber.info("Loans persisted event was found", {
      session_id: this.sessionId, 
      action: 'Loans persisted event was found',
    })
  }

  loggedInWithToken(token: string) {
    this.timber.info("Logged in to backend with oneTime token", {
      session_id: this.sessionId, 
      action: 'Logged in to backend with oneTime token',
      data: {
        oneTimeToken: token
      }
    })
  }


  logLoansPresent() {
    this.timber.info("User has loan", {
      session_id: this.sessionId, 
      action: 'User has loan',
    })
  }

  logisAggregatedRateTypeFixed() {
    this.timber.info("Aggregated loan rate is fixed", {
      session_id: this.sessionId, 
      action: 'Aggregated loan rate is fixed',
    })
  }

  logNewUserRedirect() {
    this.timber.info("Login was with new user", {
      session_id: this.sessionId, 
      action: 'Login was with new user',
    })
  }

  logRegisteredUserRedirect() {
    this.timber.info("Login was with Registered user", {
      session_id: this.sessionId, 
      action: 'Login was with Registered user',
    })
  }

  logNoLoansPresent() {
    this.timber.info("User had no loans", {
      session_id: this.sessionId, 
      action: 'User had no loans',
    })
  }


  
  

}
