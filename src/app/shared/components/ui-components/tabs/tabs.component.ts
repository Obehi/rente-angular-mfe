import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit
} from '@angular/core';
import { TabComponent } from './tab.component';

@Component({
  selector: 'rente-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  ngAfterContentInit(): void {
    // get all active tabs
    const activeTabs = this.tabs.filter((tab) => tab.active);

    // if there is no active tab set, activate the first
    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  selectTab(activeTab: TabComponent): void {
    // deactivate all tabs
    this.tabs.toArray().forEach((tabItem) => (tabItem.active = false));

    // activate the tab the user has clicked on.
    activeTab.active = true;
  }
}
