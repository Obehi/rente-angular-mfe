import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'rente-button',
  styleUrls: ['./button.component.scss'],
  templateUrl: './button.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ButtonComponent {
  @Input() color: string;
  @Input() type = 'raised';
  @Input() size: string;
  @Input() disabled: boolean;
  @Input() noHover: boolean;
  @Input() routerLink: string;
  @Input() href: string;
  @Input() isLoading: boolean;
  // Used for google analytics to target inner span of matieral button element
  @Input() nestedClass = '';

  @Output() public action = new EventEmitter();

  constructor(private router: Router) {}

  clickEvent(): void {
    if (this.routerLink) {
      const url = this.routerLink;

      this.router.navigate([url]);
    } else if (this.href) {
      window.open(this.href);
      // location.href = this.href;
      // } else if (this.btnBlankHref) {
      //   window.open(this.btnBlankHref);
    } else {
      this.action.emit();
    }
  }
}
