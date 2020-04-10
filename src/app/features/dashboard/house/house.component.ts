import { LoansService, AddressDto } from "@services/remote-api/loans.service";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { SnackBarService } from "../../../shared/services/snackbar.service";
import {
  EventService,
  EmitEvent,
  Events,
} from "@services/event-service";
@Component({
  selector: "rente-house",
  templateUrl: "./house.component.html",
  styleUrls: ["./house.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class HouseComponent implements OnInit {
  isLoading: boolean;
  addresses: AddressDto[];
  showAddresses: boolean;
  changesMade = false;

  constructor(
    private loansService: LoansService,
    private snackBar: SnackBarService,
    eventService: EventService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.loansService.getAddresses().subscribe(r => {
      this.isLoading = false;
      this.addresses = r.addresses;
      this.showAddresses = true;

      this.eventService.on("input change", button => {
        console.log("test button object in houuse");
        console.log(button);
  
        this.saveAddresses(button);
      });
    });
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
      this.loansService.updateAddress(this.addresses).subscribe(
        r => {
          this.addresses = r.addresses;
        },
        err => {
          this.isLoading = false;
          this.snackBar.openFailSnackBar("Oops, noe gikk galt", 1.2);
        },
        () => {
          this.isLoading = false;
          this.changesMade = false;
          this.snackBar.openSuccessSnackBar("Endringene dine er lagret", 1.2);
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
