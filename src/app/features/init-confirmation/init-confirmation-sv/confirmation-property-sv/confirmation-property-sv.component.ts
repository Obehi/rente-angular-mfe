import { LoansService } from '@services/remote-api/loans.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Mask } from '@shared/constants/mask';
import { ROUTES_MAP } from '@config/routes-config';

@Component({
  selector: 'confirmation-property-sv.component',
  templateUrl: './confirmation-property-sv.component.html',
  styleUrls: ['./confirmation-property-sv.component.scss']
})
export class ConfirmationProperty implements OnInit {
  public isLoading: boolean;
  public mask = Mask;
  public estimatedPropertyValue?: number | null;
  public propertyIconPath: string | null;

  constructor(private loansService: LoansService, private router: Router) {}

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
      this.estimatedPropertyValue = res.addresses[0].estimatedPropertyValue;
    });
  }

  clickChangeButton(): void {
    this.router.navigate(['/dashboard/' + ROUTES_MAP.property], {
      state: { data: { fromConfirmProperty: true } }
    });
  }

  clickConfirmButton(): void {
    this.router.navigate(['/dashboard/' + ROUTES_MAP.offers]);
  }
}
