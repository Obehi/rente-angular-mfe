import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bigNumber'
})
export class BigNumberPipe implements PipeTransform {

  transform(value: number): any {
    if (!value) {
      return '';
    }

    return null;
  }

}
