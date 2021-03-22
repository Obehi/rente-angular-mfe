import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'thousands' })
export class ThousandsSeprator implements PipeTransform {
  transform(value: number | string): string {
    if (value != null) {
      const num = parseInt(String(value));
      const regExp = /(\d+)(\d{3})/;
      return String(num).replace(/^\d+/, (w) => {
        let res = w;
        while (regExp.test(res)) {
          res = res.replace(regExp, '$1 $2');
        }
        return res;
      });
    } else {
      return '';
    }
  }
}
