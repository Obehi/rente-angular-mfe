import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FilterPipe } from '@shared/pipes/filter.pipe';

@Component({
  selector: 'property-select',
  templateUrl: './property-select.component.html',
  styleUrls: ['./property-select.component.scss']
})
export class PropertySelectComponent implements OnInit, OnDestroy {
  @Input() options: any;
  @Input() searchText;
  @Input() closeState: string;

  @Input() placeholder: string;
  @Input() label;

  @Output() selectedItemsEmitter = new EventEmitter<any>();

  public selectedMemberships: string = [];

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy() {
    // this.untilDestroyed.next();
  }

  get membershipNames(): string {
    return this.options?.map((membership) => {
      return membership.label;
    });
  }

  chooseMembership(membership: string): void {
    if (!this.selectedMemberships.includes(membership)) {
      this.selectedMemberships.push(membership);
      console.log(this.selectedMemberships);
    } else {
      console.log(membership + ' Already exists in the list');
    }
  }

  removeMembership(membership: string): void {
    this.selectedMemberships = this.selectedMemberships.filter(
      (option) => option !== membership
    );
    console.log(this.selectedMemberships);
  }

  test() {
    this.selectedItemsEmitter.emit(this.selectedMemberships);
  }
}
