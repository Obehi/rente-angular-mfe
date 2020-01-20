import { LoansService, AddressDto } from "@services/remote-api/loans.service";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
  trigger,
  transition,
  animate,
  keyframes,
  style
} from "@angular/animations";

@Component({
  selector: "rente-house",
  templateUrl: "./house.component.html",
  styleUrls: ["./house.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger("shakeAnimation", [
      transition(
        ":enter",
        animate(
          "200ms ease-in",
          keyframes([
            style({ transform: "translate3d(-15px, 0, 0)" }),
            style({ transform: "translate3d(0, 0, 0)" }),
            style({ transform: "translate3d(7px, 0, 0)" }),
            style({ transform: "translate3d(0, 0, 0)" })
          ])
        )
      )
    ])
  ]
})
export class HouseComponent implements OnInit {
  isLoading: boolean;
  addresses: AddressDto[];
  showAddresses: boolean;

  constructor(private loansService: LoansService) {}

  ngOnInit() {
    this.isLoading = true;
    this.loansService.getAddresses().subscribe(r => {
      this.isLoading = false;
      this.addresses = r.addresses;
      this.showAddresses = true;
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

  saveAddresses() {
    if (this.ableToSave) {
      this.isLoading = true;
      this.loansService.updateAddress(this.addresses).subscribe(r => {
        this.isLoading = false;
        this.addresses = r.addresses;
      });
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
