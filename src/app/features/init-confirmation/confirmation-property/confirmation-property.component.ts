import { LoansService } from '@services/remote-api/loans.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Mask } from '@shared/constants/mask';
import { ROUTES_MAP } from '@config/routes-config';
import { GlobalStateService } from '@services/global-state.service';
import { TabsService } from '@services/tabs.service';

@Component({
  selector: 'confirmation-property.component',
  templateUrl: './confirmation-property.component.html',
  styleUrls: ['./confirmation-property.component.scss']
})
export class ConfirmationProperty implements OnInit, OnDestroy {
  public isLoading: boolean;
  public mask = Mask;
  public estimatedPropertyValue?: number | null;
  public propertyIconPath: string | null;

  constructor(
    private loansService: LoansService,
    private router: Router,
    private globalStateService: GlobalStateService,
    private tabsService: TabsService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.loansService.getAddresses().subscribe((res) => {
      const propertyType = res.addresses[0].propertyType;
      this.propertyIconPath =
        propertyType === 'HOUSE'
          ? '../../../../assets/icons/round-house-primary-blue.svg'
          : propertyType === 'APARTMENT'
          ? '../../../../assets/icons/round-apartment-primary-blue.svg'
          : null;
      this.isLoading = false;
      const estimatedValue = res.addresses[0].estimatedPropertyValue;
      if (estimatedValue) {
        this.estimatedPropertyValue = estimatedValue;
      } else {
        this.estimatedPropertyValue = 0;
      }
    });

    // Set content background
    this.globalStateService.setContentClassName('content', 'content-blue');
  }

  clickChangeButton(): void {
    this.router.navigate(['/dashboard/' + ROUTES_MAP.property], {
      state: { data: { fromConfirmProperty: true } }
    });
  }

  clickConfirmButton(): void {
    this.router.navigate(['/dashboard/' + ROUTES_MAP.offers]);
  }

  ngOnDestroy(): void {
    this.globalStateService.setContentClassName('content-blue', 'content');
  }
}
