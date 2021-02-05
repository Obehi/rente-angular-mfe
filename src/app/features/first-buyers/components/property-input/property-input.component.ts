import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FirstBuyersService } from '@features/first-buyers/first-buyers.service';
import { MembershipTypeDto } from '@services/remote-api/loans.service';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'rente-property-input',
  templateUrl: './property-input.component.html',
  styleUrls: ['./property-input.component.scss']
})
export class PropertyInputComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() controlName: string;
  @Input() label: string;
  @Input() icon: string;
  @Input() inputType: 'tel' | 'dropdown' | 'autocomplete' = 'tel';
  @Input() options: { name?: string; value?: string; label: string }[];
  @Input() memberships: { name?: string; value?: string; label: string }[];
  @Output() selectedMemberships = new EventEmitter<MembershipTypeDto[]>();

  labelPosition: 'before' | 'after' = 'after';
  after = 'after';
  before = 'before';
  _selectedMemberships: string[];
  selectionDistincter = new Subject();
  _selectionDistincter: Observable<any>;

  constructor(private firstBuyersService: FirstBuyersService) {
    this._selectionDistincter = this.selectionDistincter.asObservable();
  }

  ngOnInit(): void {
    this._selectedMemberships = this.firstBuyersService.selectedMemberships.map(
      (membership) => membership.name
    );

    this._selectionDistincter
      .pipe(distinctUntilChanged((x, y) => x.length === y.length))
      .subscribe((val) => {
        this.selectedMemberships.emit(val);
      });
  }

  getSelectedMemberships(selected: string[]) {
    const _selectedMemberships = [];
    selected.forEach((val) => {
      _selectedMemberships.push(
        this.memberships.find((option) => val === option.name)
      );
    });
    this.firstBuyersService.selectedMemberships = _selectedMemberships;
    this.selectionDistincter.next(_selectedMemberships);
  }

  parseFloat(val: string) {
    val += '';
    return parseInt(val.trim(), 10);
  }
}
