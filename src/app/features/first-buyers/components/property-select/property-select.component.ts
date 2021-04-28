import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EmbeddedViewRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewContainerRef,
  NgZone
} from '@angular/core';
import Popper from 'popper.js';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { fromEvent, Subject } from 'rxjs';
import { MembershipTypeDto } from '@services/remote-api/loans.service';
import { InitialOffersComponent } from '../initial-offers/initial-offers.component';

@Component({
  selector: 'property-select',
  templateUrl: './property-select.component.html',
  styleUrls: ['./property-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertySelectComponent implements OnInit, OnDestroy {
  @Input() model;
  @Input() labelKey = 'label';
  @Input() idKey = 'id';
  @Input() options: any[];
  @Input() optionTpl: TemplateRef<any>;
  @Output() selectChange = new EventEmitter();
  @Output() closed = new EventEmitter();
  @Input() memberships: MembershipTypeDto[];
  @Output() selectedMemberships = new EventEmitter<MembershipTypeDto[]>();

  visibleOptions = 4;
  searchControl = new FormControl();

  private view: EmbeddedViewRef<any> | null;
  private popperRef: Popper | null;
  private originalOptions: string[];
  private untilDestroyed = new Subject<void>();

  constructor(
    private vcr: ViewContainerRef,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    public iOffers: InitialOffersComponent
  ) {}

  get isOpen() {
    return !!this.popperRef;
  }

  ngOnInit(): void {
    // this.options = [
    //   { id: '1', label: 'a' },
    //   { id: '2', label: 'b' },
    //   { id: '3', label: 'c' },
    //   { id: '4', label: 'd' }
    // ];
    console.log(this.options);

    this.originalOptions = [...this.options];
    if (this.model !== undefined) {
      this.model = this.options.find(
        (currentOption) => currentOption[this.idKey] === this.model
      );
    }

    this.searchControl.valueChanges
      .pipe(debounceTime(300), takeUntil(this.untilDestroyed))
      .subscribe((term) => this.search(term));
  }

  ngOnDestroy() {
    // this.untilDestroyed.next();
  }

  get label() {
    return this.model ? this.model[this.labelKey] : 'Select...';
  }

  open(dropdownTpl: TemplateRef<any>, origin: HTMLElement): void {
    this.view = this.vcr.createEmbeddedView(dropdownTpl);
    const dropdown = this.view.rootNodes[0];

    document.body.appendChild(dropdown);
    dropdown.style.width = `${origin.offsetWidth}px`;

    this.zone.runOutsideAngular(() => {
      this.popperRef = new Popper(origin, dropdown, {
        removeOnDestroy: true
      });
    });

    this.handleClickOutside();
  }

  close(): void {
    this.closed.emit();
    this.popperRef?.destroy();
    this.view?.destroy();
    this.searchControl.patchValue('');
    this.view = null;
    this.popperRef = null;
  }

  select(option): void {
    this.model = option;
    this.selectChange.emit(option[this.idKey]);
    // the handleClickOutside function will close the dropdown
  }

  isActive(option): boolean {
    if (!this.model) {
      return false;
    }
    return option[this.idKey] === this.model[this.idKey];
  }

  search(value: string): void {
    this.options = this.originalOptions.filter((option) =>
      option[this.labelKey].includes(value)
    );
    requestAnimationFrame(
      () => (this.visibleOptions = this.options.length || 1)
    );
  }

  private handleClickOutside() {
    fromEvent(document, 'click')
      .pipe(
        filter(({ target }) => {
          const origin = this.popperRef?.reference as HTMLElement;
          return origin.contains(target as HTMLElement) === false;
        }),
        takeUntil(this.closed)
      )
      .subscribe(() => {
        this.close();
        this.cdr.detectChanges();
      });
  }
}
