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
  public estimatedPropertyValue: number;

  constructor(private loansService: LoansService, private router: Router) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.loansService.getAddresses().subscribe((res) => {
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
