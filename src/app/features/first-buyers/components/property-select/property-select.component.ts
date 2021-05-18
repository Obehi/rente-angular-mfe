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
  @Input() options: any;
  @Input() optionTpl: TemplateRef<any>;
  @Output() selectChange = new EventEmitter();
  @Output() closed = new EventEmitter();
  @Input() memberships: MembershipTypeDto[];
  @Input() membershipNames: MembershipTypeDto[];

  @Output() selectedMemberships = new EventEmitter<MembershipTypeDto[]>();

  visibleOptions = 4;
  searchControl = new FormControl();

  private view: EmbeddedViewRef<any> | null;
  private popperRef: Popper | null;
  private originalOptions: string[];
  private untilDestroyed = new Subject<void>();

  constructor(private vcr: ViewContainerRef, private zone: NgZone) {}

  get isOpen(): boolean {
    return !!this.popperRef;
  }

  ngOnInit(): void {
    this.originalOptions = [
      ...(this.memberships as MembershipTypeDto[]).map((item) => {
        return item.name;
      })
    ];

    this.options = this.originalOptions;
    console.log('oninit options');
    console.log(this.options);
    if (this.model !== undefined) {
      this.model = this.options.find(
        (currentOption) => currentOption[this.idKey] === this.model
      );
    }

    this.searchControl.valueChanges
      .pipe(debounceTime(300), takeUntil(this.untilDestroyed))
      .subscribe((term) => this.search(term));
  }

  ngOnDestroy(): void {}

  get label(): any {
    return this.model ? this.model[this.labelKey] : 'Select...';
  }

  open(dropdownTpl: TemplateRef<any>, origin: HTMLElement): void {
    console.log('open');
    console.log(this.membershipNames);
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

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  select(option): void {
    this.model = option;
    this.selectChange.emit(option[this.idKey]);
    // the handleClickOutside function will close the dropdown
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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
      });
  }
}
