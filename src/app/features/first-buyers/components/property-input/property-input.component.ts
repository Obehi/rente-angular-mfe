import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FirstBuyersService } from '@features/first-buyers/first-buyers.service';
import { MembershipTypeDto } from '@services/remote-api/loans.service';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';

interface Membership {
  name?: string;
  value?: string;
  label: string;
}
@Component({
  selector: 'rente-property-input',
  templateUrl: './property-input.component.html',
  styleUrls: ['./property-input.component.scss']
})
export class PropertyInputComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() isAboveLoanToValueRatioTreshold: boolean;
  @Input() loantoRatioMinimumAmount: number;
  @Input() controlName: string;
  @Input() placeholder: string;
  @Input() label: string;
  @Input() icon: string;
  @Input() iconPath: string;
  @Input() inputType: 'tel' | 'dropdown' | 'autocomplete' = 'tel';
  @Input() options: { name?: string; value?: string; label: string }[];
  @Input() memberships: MembershipTypeDto[];
  @Output() selectedMemberships = new EventEmitter<MembershipTypeDto[]>();
  @ViewChild(SelectAutocompleteComponent)
  multiSelect: SelectAutocompleteComponent;

  isFirstFocus = true;
  labelPosition: 'before' | 'after' = 'after';
  after = 'after';
  before = 'before';
  _selectedMemberships: string[];
  selectionDistincter = new Subject();
  _selectionDistincter: Observable<any>;

  exitHandler: any;
  constructor(
    private firstBuyersService: FirstBuyersService,
    private closeInputElement: ElementRef
  ) {
    this._selectionDistincter = this.selectionDistincter.asObservable();
  }

  ngOnInit(): void {
    if (this.inputType === 'autocomplete') {
      this.exitHandler = () => {
        this.multiSelect.toggleDropdown();
      };
    }
    this._selectedMemberships = this.firstBuyersService.selectedMemberships.map(
      (membership) => membership.name
    );

    this._selectionDistincter
      .pipe(distinctUntilChanged((x, y) => x.length === y.length))
      .subscribe((val) => {
        this.selectedMemberships.emit(val);
      });
  }

  getSelectedMemberships(selected: string[]): void {
    const exitButton = document.querySelectorAll('.box-search-icon')[0];
    if (exitButton !== undefined && this.inputType === 'autocomplete') {
      exitButton.addEventListener('click', this.exitHandler);
    }
    const _selectedMemberships: MembershipTypeDto[] | undefined = [];
    selected.forEach((val) => {
      const membership: MembershipTypeDto | undefined = this.memberships.find(
        (option) => val === option.name
      );
      if (membership !== undefined) {
        _selectedMemberships.push(membership);
      }
    });
    this.firstBuyersService.selectedMemberships = _selectedMemberships;
    this.selectionDistincter.next(_selectedMemberships);
  }

  parseFloat(val: string): number {
    val += '';
    return parseInt(val.trim(), 10);
  }

  focusOutFunction(): void {
    this.isFirstFocus = false;
  }
}
