import { LoansService, AddressDto } from '@services/remote-api/loans.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm, AbstractControl } from '@angular/forms';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackBarService } from '@services/snackbar.service';
import { trigger, transition, animate, keyframes, style } from '@angular/animations';

@Component({
  selector: 'rente-house',
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger(
      'shakeAnimation',
      [
        transition(':enter', animate('200ms ease-in', keyframes([
          style({ transform: 'translate3d(-15px, 0, 0)' }),
          style({ transform: 'translate3d(0, 0, 0)' }),
          style({ transform: 'translate3d(7px, 0, 0)' }),
          style({ transform: 'translate3d(0, 0, 0)' })
        ]))),
      ]
    )
  ]
})
export class HouseComponent implements OnInit {

  public autoPropertyForm: FormGroup;
  public manualPropertyForm: FormGroup;
  public isAutoMode = true;
  public addressData: any;
  public isLoading: boolean;
  public propertyValue: number;
  public estimatedPropertyValue: number;
  public statisticsView: boolean;
  public statisticTooltip: string = 'Bolig statistikk';
  public hideStatisticsButton: boolean;
  public disableStatisticsButton: boolean;
  public threeDigitsMask = { mask: [/\d/, /\d/, /\d/], guide: false };
  public fourDigitsMask = { mask: [/\d/, /\d/, /\d/, /\d/], guide: false };
  public thousandSeparatorMask = {
    mask: createNumberMask({
      prefix: '',
      suffix: '',
      thousandsSeparatorSymbol: ' '
    }),
    guide: false
  };
  public addresses:AddressDto[];
  public showAddresses:boolean;

  constructor(
    private fb: FormBuilder,
    private loansService: LoansService,
    private snackBar: SnackBarService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

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
      this.addresses.push(new AddressDto());
    }
  }

  deleteAddress(address:AddressDto) {
    let i:number = this.addresses.indexOf(address);
    if (i > -1) {
      this.addresses.splice(i, 1);
    }
  }

  get ableToAddAddress():boolean {
    return this.addresses.length < 4;
  }

  get totalPropertyValue():number {
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

  get ableToSave():boolean {
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

  isCorrectAddress(a:AddressDto) {
    if (a.useManualPropertyValue) {
      return a.manualPropertyValue > 0;
    } else {
      return this.notEmpty(a.street) && this.notEmpty(a.zip) && a.apartmentSize > 0;
    }
  }

  notEmpty(s:string) {
    return s != null && String(s).length > 0;
  }

  processStatistikRoute() {
    this.route.queryParams.subscribe(param => {
      if (param.statistikk) this.toggleStatisticsViewState();
    });
  }

  public toggleStatisticsViewState() {
    this.statisticsView = !this.statisticsView;
    if (this.statisticsView) {
      this.hideStatisticsButton = true;
      this.statisticTooltip = 'Tilbake til bolig';
    } else {
      this.hideStatisticsButton = false;
      this.statisticTooltip = 'Bolig statistikk';
    }
  }

  public isErrorState(control: AbstractControl | null, form: FormGroup | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public statisticsError() {
    this.toggleStatisticsViewState();
    this.disableStatisticsButton = true;
    this.statisticTooltip = 'Boligstatistikk utilgjengelig for øyeblikket';
  }

  public setPropertyMode() {
    if (this.isAutoMode) {
      this.autoPropertyForm.enable();
      this.manualPropertyForm.disable();
    } else {
      this.autoPropertyForm.disable();
      this.manualPropertyForm.enable();
    }
  }

  public updatePropertyMode() {
    if (this.isLoading || (this.isAutoMode && this.autoPropertyForm.invalid) || (!this.isAutoMode && this.manualPropertyForm.invalid)) {
      return;
    }
    this.isLoading = true;
    let addressData: any;
    if (this.isAutoMode) {
      addressData = this.autoPropertyForm.value;
      addressData.manualPropertyValue = null;
    } else {
      if (this.manualPropertyForm.value.manualPropertyValue) {
        if (this.manualPropertyForm.value && this.manualPropertyForm.value.manualPropertyValue) {
          this.manualPropertyForm.value.manualPropertyValue = String(this.manualPropertyForm.value.manualPropertyValue).replace(/\s/g, '');
        }
        addressData = Object.assign(this.autoPropertyForm.value, this.manualPropertyForm.value);
      } else {
        this.isLoading = false;
        return;
      }
    }
    this.loansService.updateAddress(addressData).subscribe(res => {
      this.isLoading = false;
      this.router.navigate(['/dashboard/tilbud/']);
      this.snackBar.openSuccessSnackBar('Endringene dine er lagret');
    }, err => {
      this.isLoading = false;
      if (this.isErrorStatus(err.status)) {
        this.onPropertyEstimationFailed();
      }
    });
  }

  onPropertyEstimationFailed() {
    this.isAutoMode = false;
    this.setPropertyMode();
    this.notifPropertyEstimationFailed();
  }

  notifPropertyEstimationFailed() {
    this.snackBar.openFailSnackBar('Vi klarte dessverre ikke estimere din boligverdi. Vi ber derfor om at du legger inn denne manuelt.', 10);
  }

  isErrorStatus(status:number) {
    return status < 200 || status >= 300;
  }

}
