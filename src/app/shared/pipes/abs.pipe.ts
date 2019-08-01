import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abs'
})
export class AbsPipe implements PipeTransform {

  transform(value: number): any {
    if (!value && !Number.isInteger(value)) {
      return '';
    }

    return Math.abs(value);
  }

}
