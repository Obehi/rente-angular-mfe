import { Injectable } from '@angular/core';
import { iif, Observable, of, throwError } from 'rxjs';
import { concatMap, delay, retryWhen } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RxjsOperatorService {
  constructor() {}

  retry404ThreeTimes(obs: Observable<any>): Observable<any> {
    return obs.pipe(
      retryWhen((errors) =>
        errors.pipe(
          // Use concat map to keep the errors in order and make sure they
          // aren't executed in parallel,
          concatMap((e, i) =>
            // Executes a conditional Observable depending on the result
            // of the first argument
            iif(
              () => i < 2 && Number(e.status) !== 404,
              // Otherwise we pipe this back into our stream and delay the retry
              of(e).pipe(delay(1000)),
              // If the condition is true we throw the error (the last error)
              throwError(e)
            )
          )
        )
      )
    );
  }
}
