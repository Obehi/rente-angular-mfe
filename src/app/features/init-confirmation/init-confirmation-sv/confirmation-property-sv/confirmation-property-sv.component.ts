import {
  LoansService,
  ConfirmationSetDto,
  ConfirmationGetDto,
  AddressCreationDto
} from '@services/remote-api/loans.service';
import { UserService } from '@services/remote-api/user.service';
import { Component, OnInit } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { VALIDATION_PATTERN } from '@config/validation-patterns.config';
import { SnackBarService } from '../../../../shared/services/snackbar.service';
import { OfferInfo } from '@shared/models/offers';
import { DialogInfoComponent } from '../../dialog-info/dialog-info.component';
import { CustomLangTextService } from '@services/custom-lang-text.service';

import { Mask } from '@shared/constants/mask';
import { ROUTES_MAP, ROUTES_MAP_SV } from '@config/routes-config';

@Component({
  selector: 'confirmation-property-sv.component',
  templateUrl: './confirmation-property-sv.component.html',
  styleUrls: ['./confirmation-property-sv.component.scss']
})
export class ConfirmationProperty implements OnInit {
  public isLoading: boolean;
  public visible = true;
  public selectable = true;
  public removable = true;
  public addOnBlur = true;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public userData: ConfirmationGetDto;
  public mask = Mask;
  public estimatedPropertyValue: number;

  constructor(private loansService: LoansService, private router: Router) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.loansService.getAddresses().subscribe((res) => {
      this.isLoading = false;
      this.estimatedPropertyValue = res.addresses[0].estimatedPropertyValue;
      this.estimatedPropertyValue = 4000000;
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
