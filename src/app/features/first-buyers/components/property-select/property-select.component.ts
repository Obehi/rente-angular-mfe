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
import { FilterPipe } from '@shared/pipes/filter.pipe';
import { group } from 'console';
import { PropertySelectDialogComponent } from '../property-select-dialog/property-select-dialog.component';
import { TruncatePipe } from '@shared/pipes/truncate.pipe';
import { PropertyInputComponent } from '../property-input/property-input.component';
import { MembershipTypeDto } from '@services/remote-api/loans.service';

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
        // style({
        //   position: 'relative',
        //   left: '35px',
        //   width: '80%',
        //   padding: '15px',
        //   opacity: 1,
        //   'z-index': 193913913
        // }),
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

  public memberships = 0;

  icon = '../../../../assets/icons/reject-icon.svg';
  searchIconLight = '../../../../assets/icons/search-grey-light.svg';
  searchIconDark = '../../../../assets/icons/search-grey-dark.svg';

  @Output() selectedItemsEmitter = new EventEmitter<MembershipTypeDto[]>();
  @Output() closeEmitter = new EventEmitter<any>();

  public selectedMemberships: string | undefined = [];

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy() {}

  get membershipNames(): string {
    return this.options?.map((membership) => {
      return membership.label;
    });
  }

  get isMobile(): boolean {
    return window.innerWidth < 600;
  }

  get saveEnabled(): boolean {
    if (this.memberships > 0) {
      return true;
    } else {
      return false;
    }
  }

  get allMemberships(): string[] {
    return;
  }

  chooseMembership(membership: string): void {
    if (!this.selectedMemberships?.includes(membership)) {
      this.selectedMemberships?.push(membership);
      this.memberships++;
    }
  }

  removeMembership(membership: string): void {
    this.selectedMemberships = this.selectedMemberships?.filter(
      (option) => option !== membership
    );
    this.memberships--;
  }

  chosenMemberships(membership: string): boolean {
    if (this.selectedMemberships?.includes(membership)) {
      return true;
    } else {
      return false;
    }
  }

  save(): void {
    if (this.saveEnabled) {
      this.selectedItemsEmitter.emit(this.selectedMemberships);
    }
  }

  cancel(): void {
    this.closeEmitter.emit();
  }
}
