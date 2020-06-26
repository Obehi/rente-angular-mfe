import { Component, OnInit } from '@angular/core';
import { PreferancesService } from '@shared/services/remote-api/preferances.service';
import { EmailDto } from '@services/remote-api/loans.service';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';

import {
  FormGroup,
  FormBuilder
} from '@angular/forms';
import { DeactivationGuarded } from '@shared/guards/route.guard';
import { Observable, Subject } from 'rxjs';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from '@angular/animations';


@Component({
  selector: 'rente-email-perferences',
  templateUrl: './email-perferences.component.html',
  styleUrls: ['./email-perferences.component.scss'],
  animations: [
    trigger('loading', [
      // ...
      state('false', style({
        
      })),
      transition(':enter', []),
      transition('* => *', [
        animate('3s', keyframes([
          style({ opacity: 1, offset: 0.1}),
          style({ opacity: 1, offset: 0.8}),
          style({ opacity: 0, offset: 1}),
        ]
        ))
      ]),
    ]),
  ]
})
export class EmailPerferencesComponent implements OnInit, DeactivationGuarded {
  private guid: string | null;
  private emailForm: FormGroup;
  private checkRateReminderType: string
  private receiveNewsEmails: boolean
  public canNavigateBooolean$: Subject<boolean> = new Subject<boolean>();
  private canLeavePage = true;
  public isLoading = false;
  private errorAnimationTrigger:boolean;
  private updateAnimationTrigger: boolean;
  private errorMessage: string


  constructor(
    private fb: FormBuilder,
    private preferancesService: PreferancesService, 
    private activatedRoute: ActivatedRoute,
    public location: Location) { }

  ngOnInit() {
   
    let currentUrl = this.location.path();
    this.guid = this.getGuIdFromUrl(currentUrl)
    console.log(this.guid)

    if (this.guid) {
      this.preferancesService.getPreferancesWithGUID(this.guid).subscribe(preferances => { 

        let dto: EmailDto = preferances;
        this.checkRateReminderType = preferances.checkRateReminderType;
        this.receiveNewsEmails = preferances.receiveNewsEmails;
      
        this.emailForm = this.fb.group({
          receiveNewsEmails: [this.receiveNewsEmails],
          checkRateReminderType: [this.checkRateReminderType],
        });
      }
      )
    }
  }

  // DeactivationGuarded Interface method. 
  // Gets called every time user navigates from this page.
  // Determines if you can leave this page or if you have to wait. 
  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
    if(this.canLeavePage)
    return true;
    
    // Wait for upload info before navigating to another page
    this.isLoading = true
    return this.canNavigateBooolean$
  }

  sendForm(){
    this.canLeavePage = false;
    this.isLoading = true;

    let dto = new EmailDto()
    dto.checkRateReminderType = this.emailForm.get('checkRateReminderType').value;
    dto.receiveNewsEmails = this.emailForm.get('receiveNewsEmails').value;

    this.preferancesService.postPreferancesWithGUID(this.guid, dto).subscribe(response => {
      this.canLeavePage = true;
      this.isLoading = false;
      this.updateAnimationTrigger  = !this.updateAnimationTrigger 
    }, err => {
      if(err.status == 404) {
        this.errorMessage = "Du har oppgitt feil url."
      }
      else if(err.status == 400) {
        this.errorMessage = "Oops, noe gikk galt"
      }

      this.errorAnimationTrigger = !this.errorAnimationTrigger 
      this.canLeavePage = true;
      this.isLoading = false;
    })
  }

  getGuIdFromUrl(url: string): string | null {
    let urlChunks =url.split('/');
    if(urlChunks.length != 4)
      return null;
    let guid = urlChunks[3]

    return  guid
  }
}
