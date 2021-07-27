import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import {
  LoansService,
  MembershipTypeDto
} from '../services/remote-api/loans.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {
  selectedMemberships: MembershipTypeDto[] = [];
  private messageHandler: Subject<any>;
  private selectedMembershipsHandler: Subject<any>;

  constructor(private loansService: LoansService) {
    this.messageHandler = new Subject<any>();
    this.selectedMembershipsHandler = new Subject<any>();
  }

  getSelectedMemberships(): Subject<any> {
    return this.selectedMembershipsHandler;
  }

  setSelectedMemberships(memberships): any {
    this.selectedMembershipsHandler.next(memberships);
  }

  pushMessage(): void {
    this.messageHandler.next('');
  }

  messages(): Subject<any> {
    return this.messageHandler;
  }

  public getMemberships(): any {
    return this.loansService.getConfirmationData().pipe(
      map((dto) => {
        dto.availableMemberships;
      })
    );
  }
}
