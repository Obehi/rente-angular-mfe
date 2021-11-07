// round.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

/**
 *
 */
@Pipe({ name: 'round' })
export class RoundPipe implements PipeTransform {
  transform(value: number): any {
    if (!value && !Number.isInteger(value)) {
      return '';
    }
    return Math.round(value);
  }
}
