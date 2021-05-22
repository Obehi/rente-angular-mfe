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
import { FirstBuyersService } from '@features/first-buyers/first-buyers.service';
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

  @Input() selectedOptions;
  @Output() selectedItemsEmitter = new EventEmitter<string[] | undefined>();
  @Output() closeEmitter = new EventEmitter<any>();

  public selectedMemberships: string[] | undefined = [];
  _selectedMemberships: string[];
  selectionDistincter = new Subject();
  _selectionDistincter: Observable<any>;

  constructor(public firstBuyersService: FirstBuyersService) {}

  ngOnInit(): void {
    this.selectedMemberships = this.selectedOptions;
  }

  ngOnDestroy() {}

  get membershipNames(): string[] {
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

  chooseMembership(membership: string): void {
    if (!this.selectedMemberships?.includes(membership)) {
      this.selectedMemberships?.push(membership);
      this.memberships++;
      this.selectedItemsEmitter.emit(this.selectedMemberships);
    }

    // if (!this.selectedMemberships?.includes(membership)) {
    //   this.selectedMemberships?.push(membership);
    //   this.memberships++;
    // }
  }

  removeMembership(membership: string): void {
    if (this.selectedMemberships?.includes(membership)) {
      this.selectedMemberships = this.selectedMemberships?.filter(
        (option) => option !== membership
      );
      this.memberships--;
      console.log('removeMembership');
      console.log(this.selectedMemberships);
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

  // save(): void {
  //   if (this.saveEnabled) {
  //     this.selectedItemsEmitter.emit(this.selectedMemberships);
  //   }
  // }

  // cancel(): void {
  //   this.closeEmitter.emit();
  // }
}
