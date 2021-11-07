import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit
} from '@angular/core';
import { AccordionGroupComponent } from './accordion-group.component';

@Component({
  selector: 'accordion',
  template: ` <ng-content></ng-content> `,
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements AfterContentInit {
  @ContentChildren(AccordionGroupComponent)
  groups: QueryList<AccordionGroupComponent>;

  ngAfterContentInit(): void {
    this.groups.toArray().forEach((t) => {
      t.toggle.subscribe(() => {
        this.openGroup(t);
      });
    });
  }

  openGroup(group?: AccordionGroupComponent): void {
    if (group !== undefined && !group.opened) {
      this.groups.toArray().forEach((t) => (t.opened = false));
      group.opened = true;
    } else if (group?.opened) {
      group.opened = false;
    }
  }
}
