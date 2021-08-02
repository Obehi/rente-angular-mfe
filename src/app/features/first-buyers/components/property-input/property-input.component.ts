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
import { distinctUntilChanged, take } from 'rxjs/operators';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';
import { PropertySelectDialogComponent } from '../property-select-dialog/property-select-dialog.component';
import { MatDialog } from '@angular/material';
import { MembershipService } from '@services/membership.service';
import { CustomLangTextService } from '@services/custom-lang-text.service';

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
  @Input() autocompleteOptions: any;
  @Input() memberships: MembershipTypeDto[];
  public previousStateMemberships: string[] = [];
  @Output() selectedMemberships = new EventEmitter<MembershipTypeDto[]>();
  @ViewChild(SelectAutocompleteComponent)
  multiSelect: SelectAutocompleteComponent;

  public changeBankLoading: any;

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
    private closeInputElement: ElementRef,
    public dialog: MatDialog,
    private membershipService: MembershipService,
    public textLangService: CustomLangTextService
  ) {
    this._selectionDistincter = this.selectionDistincter.asObservable();
  }

  ngOnInit(): void {
    this.membershipService.getSelectedMemberships().subscribe((args) => {
      this.previousStateMemberships = args;
    });
    if (this.inputType === 'autocomplete') {
      this.exitHandler = () => {
        this.multiSelect.toggleDropdown();
      };
    }
    this._selectedMemberships = this.membershipService.selectedMemberships.map(
      (membership) => membership.name
    );

    this._selectionDistincter
      .pipe(distinctUntilChanged((x, y) => x.length === y.length))
      .subscribe((val) => {
        this.selectedMemberships.emit(val);
      });
  }

  parseFloat(val: string): number {
    val += '';
    return parseInt(val.trim(), 10);
  }

  focusOutFunction(): void {
    this.isFirstFocus = false;
  }

  public openPropertySelectDialog(): void {
    const openDialog = this.dialog.open(PropertySelectDialogComponent, {
      autoFocus: false,
      data: {
        previousState: [...this.previousStateMemberships],
        allMemberships: this.autocompleteOptions
      }
    });
    openDialog.afterClosed().subscribe(() => {});
  }

  public propertySelectDialogClose(state: string): void {
    this.changeBankLoading = false;

    switch (state) {
      case 'canceled': {
        break;
      }
      case 'do-nothing': {
        break;
      }
      case 'error': {
        break;
      }
    }
  }

  getMembershipPlaceholder(): string | undefined {
    console.log(this.previousStateMemberships);
    if (this.previousStateMemberships?.length === 0) {
      return 'Velg';
    } else if (this.previousStateMemberships?.length === 1) {
      return `${this.previousStateMemberships.map((m) => {
        return m.label;
      })}`;
    } else if (this.previousStateMemberships?.length > 1) {
      return `${this.previousStateMemberships?.length} medlemskap valgt`;
    }
  }
}
