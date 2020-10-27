import { LoansService, AddressDto } from "@services/remote-api/loans.service";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { SnackBarService } from "../../../../shared/services/snackbar.service";
import { Observable, Subject } from 'rxjs';
import { DeactivationGuarded } from '@shared/guards/route.guard';

import {
  EventService,
  EmitEvent,
  Events,
} from "@services/event-service";

import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
  // ...
} from '@angular/animations';

@Component({
  selector: "rente-house-blue",
  templateUrl: "./house-blue.component.html",
  styleUrls: ["./house-blue.component.scss"],
  animations: [
    trigger('loading', [
      // ...
      state('false', style({
        
      })),
      transition(':enter', []),
      transition('* => *', [
        animate('6s', keyframes([
          style({ opacity: 1, offset: 0.1}),
          style({ opacity: 1, offset: 0.8}),
          style({ opacity: 0, offset: 1}),
        ]
        ))
      ]),
    ])
  ],
  
  
})

export class HouseBlueComponent implements OnInit, DeactivationGuarded {
  isLoading: boolean;
  addresses: AddressDto[];
  showAddresses: boolean;
  changesMade = false;
  public canNavigateBooolean$: Subject<boolean> = new Subject<boolean>();
  public canLeavePage = true;
  public updateAnimationTrigger: boolean;
  public errorAnimationTrigger: boolean;
  public errorMessage: string; 
  public isError: boolean = false; 
  
  constructor(
    private loansService: LoansService,
    private snackBar: SnackBarService,
    eventService: EventService
  ) {
    eventService.on(Events.INPUT_CHANGE, _ => {
      this.saveAddresses();
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.loansService.getAddresses().subscribe(r => {
      this.isLoading = false;
      this.addresses = r.addresses;
      this.showAddresses = true;
    });
  }

  // DeactivationGuarded Interface method. 
  // Gets called every time user navigates rom this page.
  // Determines if you can leave this page or if you have to wait. 
  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
    if(this.canLeavePage)
    return true;
    
    // Wait for upload info before navigating to another page
    this.isLoading = true
    return this.canNavigateBooolean$
  }

  addAddress() {
    if (this.addresses.length < 4) {
      const addr = new AddressDto();
      addr.useManualPropertyValue = false;
      this.addresses.push(addr);
    }
  }

  deleteAddress(address: AddressDto) {
    this.changesMade = true;
    const i: number = this.addresses.indexOf(address);
    if (i > -1) {
      this.addresses.splice(i, 1);
      this.saveAddresses()
    }
  }

  get ableToAddAddress(): boolean {
    return this.addresses.length < 4;
  }

  get totalPropertyValue(): number {
    let res = 0;
    if (this.addresses) {
      this.addresses.forEach(a => {
        if (a.useManualPropertyValue && a.manualPropertyValue) {
          res += a.manualPropertyValue;
        } else if (a.estimatedPropertyValue) {
          res += a.estimatedPropertyValue;
        }
      });
    }
    return res;
  }
  countChange() {
    this.changesMade = true;
  }
  saveAddresses() {
    if (this.ableToSave) {
      this.isLoading = true;
      this.canLeavePage = false;
      this.loansService.updateAddress(this.addresses).subscribe(
        r => {

          console.log("begining")
          for(let address of r.addresses) {
            if(address.message != null) {
                console.log("in for loop")

                this.isLoading = false;
                this.changesMade = false;
                this.errorAnimationTrigger  = !this.errorAnimationTrigger 
                
                this.canLeavePage = true
                this.errorMessage = address.message;
                this.isError = true;
                return
              }
            }

          this.canNavigateBooolean$.next(true);
          this.addresses = r.addresses;
        },
        err => {
          
          this.errorMessage = "Oops, noe gikk galt";
          this.isLoading = false;
          this.changesMade = false;
          this.errorAnimationTrigger  = !this.errorAnimationTrigger;
          this.canLeavePage = true
        },
        () => {
          if(this.isError) {
            this.isError = false;
            this.errorMessage == null
            return
          }
          
          this.changesMade = false;
          this.isLoading = false;
          this.updateAnimationTrigger  = !this.updateAnimationTrigger;
          this.canLeavePage = true;
        }
      );
    }
  }

 

  get ableToSave(): boolean {
    let res = true;
    if (this.isLoading) {
      res = false;
    } else if (this.addresses != null) {
      let isCorrect = true;
      for (const a of this.addresses) {
        if (!this.isCorrectAddress(a)) {
          isCorrect = false;
          break;
        }
      }
      res = isCorrect;
    } else {
      res = false;
    }
    return res;
  }

  isCorrectAddress(a: AddressDto) {
    if (a.useManualPropertyValue) {
      return a.manualPropertyValue > 0;
    } else {
      return (
        this.notEmpty(a.street) && this.notEmpty(a.zip) && a.apartmentSize > 0
      );
    }
  }

  notEmpty(s: string) {
    return s != null && String(s).length > 0;
  }
}

