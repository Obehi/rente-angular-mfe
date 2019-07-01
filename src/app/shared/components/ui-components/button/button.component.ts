import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'rente-button',
  templateUrl: './button.component.html'
})

export class ButtonComponent {
  @Input() color: string;
  @Input() type: string;
  @Input() size: string;
  @Input() disabled: boolean;
  @Input() noHover: boolean;
  @Input() routerLink: string;
  @Input() href: string;

  @Output() public action = new EventEmitter();

  constructor(
    private router: Router
  ) {}

  clickEvent(): void {
    if (this.routerLink) {
      this.router.navigate([this.routerLink]);
    } else if (this.href) {
      location.href = this.href;
    } else {
      this.action.emit();
    }
  }
}
