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
  @Output() selectedItemsEmitter = new EventEmitter<string[] | undefined>();
  @Output() hasChangedEmitter = new EventEmitter<any>();

  public selectedMemberships: string[] | undefined = [];
  _selectedMemberships: string[];
  selectionDistincter = new Subject();
  _selectionDistincter: Observable<any>;

  constructor() {}

  ngOnInit(): void {
    this.selectedMemberships = this.selectedOptions;
  }

  ngOnDestroy() {}

  get membershipNames(): string[] {
    return this.options
      ?.map((membership) => {
        return membership.label;
      })
      .sort((a, b) => {
        const textA = a.toUpperCase();
        const textB = b.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
  }

  get isMobile(): boolean {
    return window.innerWidth < 600;
  }

  chooseMembership(membership: string): void {
    if (!this.selectedMemberships?.includes(membership)) {
      this.selectedMemberships?.push(membership);
      this.selectedItemsEmitter.emit(this.selectedMemberships);
    }
  }

  removeMembership(membership: string): void {
    if (this.selectedMemberships?.includes(membership)) {
      this.selectedMemberships = this.selectedMemberships?.filter(
        (option) => option !== membership
      );
      this.selectedItemsEmitter.emit(this.selectedMemberships);
    }
  }

  chosenMemberships(membership: string): boolean {
    if (this.selectedMemberships?.includes(membership)) {
      return true;
    } else {
      return false;
    }
  }
}
