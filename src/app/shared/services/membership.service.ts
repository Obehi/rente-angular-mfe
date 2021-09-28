import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { MembershipTypeDto } from '@shared/models/loans';
import { LoansService } from '../services/remote-api/loans.service';
import { Observable, Subject } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {
  selectedMemberships: MembershipTypeDto[] = [];
  private messageHandler: Subject<any>;
  private selectedMembershipsHandler: Subject<any>;

  constructor(
    private loansService: LoansService,
    private localStorageService: LocalStorageService
  ) {
    this.messageHandler = new Subject<any>();
    this.selectedMembershipsHandler = new Subject<any>();
  }

  getSelectedMemberships(): Observable<any> {
    return this.selectedMembershipsHandler.asObservable();
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

  // OLD membership funcitionality

  initMembershipList(memberships: MembershipTypeDto[]): MembershipTypeDto[] {
    const sortedMemberships = this.sortMembershipSpecialOrder(memberships);
    return sortedMemberships;
  }

  getPrefilledMemberships(): MembershipTypeDto[] {
    const subBank = this.localStorageService.getObject('subBank');
    const memberships: MembershipTypeDto[] = [];
    if (subBank !== null && subBank !== undefined) {
      memberships.push(subBank);
    }
    return memberships;
  }

  sortMembershipSpecialOrder(
    memberships: MembershipTypeDto[]
  ): MembershipTypeDto[] {
    const specialCaseMemberships = [];
    memberships.forEach((membership, index) => {
      if (
        membership.name === 'AKADEMIKERNE' ||
        membership.name === 'LO_LOFAVOR' ||
        membership.name === 'LO_LOFAVOR_UNG' ||
        membership.name === 'UNIO' ||
        membership.name === 'YS'
      ) {
        specialCaseMemberships[membership.name] = membership;
        memberships.splice(index, 1);
      }
    });

    const sortedMemberships = [
      specialCaseMemberships['AKADEMIKERNE'],
      specialCaseMemberships['LO_LOFAVOR'],
      specialCaseMemberships['UNIO'],
      specialCaseMemberships['YS'],
      ...memberships
    ];
    return sortedMemberships;
  }
}
