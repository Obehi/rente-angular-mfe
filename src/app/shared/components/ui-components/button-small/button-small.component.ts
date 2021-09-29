import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'rente-button-small',
  templateUrl: './button-small.component.html',
  styleUrls: ['./button-small.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ButtonSmallComponent {
  @Input() color: string;
  @Input() type = 'raised';
  @Input() size: string;
  @Input() disabled: boolean;
  @Input() noHover: boolean;
  @Input() routerLink: string;
  @Input() href: string;
  @Input() isLoading: boolean;

  @Output() public action = new EventEmitter();

  constructor(private router: Router) {}

  clickEvent(): void {
    if (this.routerLink) {
      const url = this.routerLink;

      this.router.navigate([url]);
    } else if (this.href) {
      window.open(this.href);
    } else {
      this.action.emit();
    }
  }
}
