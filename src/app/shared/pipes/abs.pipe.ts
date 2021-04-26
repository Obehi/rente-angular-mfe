import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abs'
})
export class AbsPipe implements PipeTransform {
  transform(value: number | null): any {
    if (value === null) {
      return '';
    }
    if (!value && !Number.isInteger(value)) {
      return '';
    }

    return Math.abs(value);
  }
}
