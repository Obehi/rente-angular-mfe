import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] | undefined {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    if (typeof items[0] === 'string') {
      return items.filter((item) => {
        return item.toLocaleLowerCase().includes(searchText);
      });
    }

    // Works only for MembershipTypeDto OR any other Object with the label parameter
    if (typeof items[0] === 'object') {
      return items.filter((item) => {
        return item.label.toLocaleLowerCase().includes(searchText);
      });
    }
  }
}
