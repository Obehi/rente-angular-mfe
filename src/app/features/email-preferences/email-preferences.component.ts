import { Component, OnInit } from '@angular/core';
import { PreferancesService } from '@shared/services/remote-api/preferances.service';
import { EmailDto } from '@services/remote-api/loans.service';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import { ProfileDialogInfoComponent } from '../dashboard/profile/dialog-info/dialog-info.component';
import { MatDialog } from '@angular/material/dialog';
import {
  FormGroup,
  FormBuilder
} from '@angular/forms';
import { Subject } from 'rxjs';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from '@angular/animations';
import { CustomLangTextService } from '@services/custom-lang-text.service'

@Component({
  selector: 'rente-email-preferences',
  templateUrl: './email-preferences.component.html',
  styleUrls: ['./email-preferences.component.scss'],
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
export class EmailPreferencesComponent implements OnInit {
  private guid: string | null;
  public emailForm: FormGroup;
  private checkRateReminderType: string
  private receiveNewsEmails: boolean
  public canNavigateBooolean$: Subject<boolean> = new Subject<boolean>();
  public isLoading = false;
  public errorAnimationTrigger:boolean;
  public updateAnimationTrigger: boolean;
  public showErrorMessage = false;
  public errorMessage: string;
 
  constructor(
    private fb: FormBuilder,
    private preferancesService: PreferancesService, 
    private activatedRoute: ActivatedRoute,
    public location: Location,
    private dialog: MatDialog,
    public langService: CustomLangTextService) { }

  ngOnInit() {
    let currentUrl = this.location.path();
    this.guid = this.getGuIdFromUrl(currentUrl);
   
    if (this.guid) {
      this.preferancesService.getPreferancesWithGUID(this.guid).subscribe(preferances => { 
        this.checkRateReminderType = preferances.checkRateReminderType;
        this.receiveNewsEmails = preferances.receiveNewsEmails;
      
        this.emailForm = this.fb.group({
          receiveNewsEmails: [this.receiveNewsEmails],
          checkRateReminderType: [this.checkRateReminderType],
        });
      }, err => {
        this.showErrorMessage = true;
        }
      )
    } else {
      this.showErrorMessage = true;
    }
    
  }

  public openInfoDialog(): void {
    this.dialog.open(ProfileDialogInfoComponent, {
      data: this.langService.getMarkedObservationText()
    });
  }

  sendForm(){
    this.isLoading = true;

    let dto = new EmailDto()
    dto.checkRateReminderType = this.emailForm.get('checkRateReminderType').value;
    dto.receiveNewsEmails = this.emailForm.get('receiveNewsEmails').value;

    this.preferancesService.postPreferancesWithGUID(this.guid, dto).subscribe(response => {
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
