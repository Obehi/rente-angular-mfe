import { Component, Input } from '@angular/core';

@Component({
  selector: 'rente-tab',
  styleUrls: ['./tab.component.scss'],
  template: `
    <div [hidden]="!active" class="tab-panel">
      <ng-content></ng-content>
    </div>
  `
})
export class TabComponent {
  @Input() tabTitle: string;
  @Input() active = false;
}
