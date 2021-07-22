import {
  trigger,
  transition,
  style,
  state,
  query,
  animate
} from '@angular/animations';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { MembershipService } from '@services/membership.service';
import { MembershipTypeDto } from '@services/remote-api/loans.service';

import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'property-select',
  templateUrl: './property-select.component.html',
  styleUrls: ['./property-select.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('0.2s ease-out', style({ height: 245, opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.1s ease-in', style({ height: 0, opacity: 0 }))
      ])
    ]),
    trigger('outInAnimation', [
      transition(':leave', [
        animate('0.1s ease-out', style({ height: 0, opacity: 0 }))
      ])
    ])
  ]
})
export class PropertySelectComponent implements OnInit, OnDestroy {
  @Input() options: any;
  @Input() searchText;
  @Input() closeState: string;
  @Input() placeholder: string;
  @Input() label;

  icon = '../../../../assets/icons/reject-icon.svg';
  searchIconLight = '../../../../assets/icons/search-grey-light.svg';
  searchIconDark = '../../../../assets/icons/search-grey-dark.svg';

  @Input() selectedOptions;
  @Output() selectedItemsEmitter = new EventEmitter<
    MembershipTypeDto[] | undefined
  >();
  @Output() hasChangedEmitter = new EventEmitter<any>();

  public selectedMemberships: MembershipTypeDto[];
  _selectedMemberships: string[];
  selectionDistincter = new Subject();
  _selectionDistincter: Observable<any>;

  constructor(private membershipService: MembershipService) {}

  ngOnInit(): void {
    this.selectedMemberships = this.selectedOptions;
  }

  ngOnDestroy() {}

  get membershipNames(): any[] {
    return this.options?.map((membership) => {
      return membership;
    });
  }

  get isMobile(): boolean {
    return window.innerWidth < 600;
  }

  chooseMembership(membership: MembershipTypeDto): void {
    if (
      !this.selectedMemberships
        .map((selectedMembership) => {
          return selectedMembership.name;
        })
        .includes(membership.name)
    ) {
      this.selectedMemberships?.push(membership);
      this.selectedItemsEmitter.emit(this.selectedMemberships);
    }
  }

  removeMembership(membership: MembershipTypeDto): void {
    if (
      this.selectedMemberships
        .map((selectedMembership) => {
          return selectedMembership.name;
        })
        .includes(membership.name)
    ) {
      this.selectedMemberships = this.selectedMemberships?.filter(
        (option) => option !== membership
      );
      this.selectedItemsEmitter.emit(this.selectedMemberships);
    }
  }

  chosenMemberships(membership: MembershipTypeDto): boolean {
    if (
      this.selectedMemberships
        ?.map((membership) => {
          return membership.name;
        })
        .includes(membership.name)
    ) {
      return true;
    } else {
      return false;
    }
  }
}
