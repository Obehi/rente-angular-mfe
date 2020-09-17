import { LoansService, AddressDto } from "@services/remote-api/loans.service";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { SnackBarService } from "../../../shared/services/snackbar.service";
import { Observable, Subject } from 'rxjs';
import { DeactivationGuarded } from '@shared/guards/route.guard';
import { OptimizeService } from '@services/optimize.service'
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
  selector: "rente-house",
  templateUrl: "./house.component.html",
  styleUrls: ["./house.component.scss"],
  animations: [
    trigger('loading', [
      // ...
      state('false', style({
        
      })),
      transition(':enter', []),
      transition('* => *', [
        animate('1s', keyframes([
          style({ opacity: 1, offset: 0.1}),
          style({ opacity: 1, offset: 0.8}),
          style({ opacity: 0, offset: 1}),
        ]
        ))
      ]),
    ]),
  ],
  encapsulation: ViewEncapsulation.None
})

export class HouseComponent implements OnInit, DeactivationGuarded {
  isLoading: boolean;
  addresses: AddressDto[];
  showAddresses: boolean;
  changesMade = false;
  public canNavigateBooolean$: Subject<boolean> = new Subject<boolean>();
  public canLeavePage = true;
  public updateAnimationTrigger :boolean;
  public errorAnimationTrigger :boolean;
  public optimize: OptimizeService
  
  constructor(
    private loansService: LoansService,
    private snackBar: SnackBarService,
    eventService: EventService,
    optimizeService: OptimizeService
  ) {
    this.optimize = optimizeService
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
          this.canNavigateBooolean$.next(true);
          this.addresses = r.addresses;
        },
        err => {
          this.isLoading = false;
          this.changesMade = false;
          this.errorAnimationTrigger  = !this.errorAnimationTrigger 
          this.canLeavePage = true
        },
        () => {
          this.changesMade = false;
          this.isLoading = false;
          this.updateAnimationTrigger  = !this.updateAnimationTrigger 
          this.canLeavePage = true
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

  public getVariation = (): number | null => {
    //console.log("variation: " + (window as any).google_optimize == undefined);
    return 0;
    if((window as any).google_optimize == undefined) {
      return null;
    }
    if((window as any).google_optimize == null) {
      return null;
    }

    console.log("variation " + (window as any).google_optimize.get('-FGlj4ayQK66hF9kV4Wiow'));
    return (window as any).google_optimize.get('-FGlj4ayQK66hF9kV4Wiow');
  }
}
