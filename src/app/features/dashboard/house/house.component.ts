import { LoansService, AddressDto } from '@services/remote-api/loans.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm, AbstractControl } from '@angular/forms';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { forkJoin, interval, of, zip, combineLatest, Observable, empty } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackBarService } from '@services/snackbar.service';
import { trigger, transition, animate, keyframes, style } from '@angular/animations';
import { combineAll, catchError } from 'rxjs/operators';

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
  public totalPropertyValue:number;
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
      console.log('Addresses dto:', r);
      this.isLoading = false;
      this.addresses = r.addresses;
      this.totalPropertyValue = r.totalPropertyValue;
      this.showAddresses = true;
    });

    /*forkJoin([
      this.loansService.getPropertyValue().pipe(catchError(err => of(null))),
      this.loansService.getEstimatedPropertValue().pipe(catchError(err => of(null))),
      this.loansService.getAddresses().pipe(catchError(err => of(null)))
    ]).subscribe(([savedPropertyValueResult, estimatedPropertyValueResult, addressResult]) => {
      this.isLoading = false;
      this.setAddressFromResult(addressResult);
      this.setCurrentPropertyValue(savedPropertyValueResult);
      this.setPropertyEsimationValue(estimatedPropertyValueResult);
      if (savedPropertyValueResult == null || estimatedPropertyValueResult == null) {
        this.onPropertyEstimationFailed();
      } else {
        this.isAutoMode = this.addressData && this.addressData.manualPropertyValue ? false : true;
        this.setPropertyMode();
      }
      this.processStatistikRoute();
    });*/
  }

  addAddress() {
    if (this.addresses.length < 4) {
      const addr:AddressDto = new AddressDto();
      addr.order = this.addresses.length + 1;
      this.addresses.push(addr);
    }
  }

  get ableToAddAddress():boolean {
    return this.addresses.length < 4;
  }

  saveAddresses() {
    this.isLoading = true;
    this.loansService.updateAddress(this.addresses).subscribe(r => {
      console.log('Updated addresses dto:', r);
      this.isLoading = false;
    });
  }

  setAddressFromResult(addressResult:any) {
    if (addressResult && addressResult.addresses && addressResult.addresses[0]) {
      this.addressData = addressResult.addresses[0];
      this.autoPropertyForm = this.fb.group({
        street: [this.addressData.street, Validators.required],
        zip: [this.addressData.zip, Validators.compose([
          Validators.required
        ])],
        apartmentSize: [this.addressData.apartmentSize, Validators.compose([
          Validators.required
        ])],
        manualPropertyValue: [this.addressData.manualPropertyValue]
      });
      this.manualPropertyForm = this.fb.group({
        manualPropertyValue: [this.addressData.manualPropertyValue, Validators.compose([Validators.required])]
      });
    }
  }

  setCurrentPropertyValue(savedPropValueResult:any) {
    if (savedPropValueResult) {
      this.propertyValue = savedPropValueResult.propertyValue;
    }
  }

  setPropertyEsimationValue(estimatedPropValueResult:any) {
    if (estimatedPropValueResult) {
      this.estimatedPropertyValue = estimatedPropValueResult.propertyValue;
    }
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
