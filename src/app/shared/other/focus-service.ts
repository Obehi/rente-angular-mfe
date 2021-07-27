import { DOCUMENT } from '@angular/common';
import { ElementRef, Inject, Injectable } from '@angular/core';
import { fromEvent, merge, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Injectable()
export class FocusWithinService extends Observable<Element | null> {
  constructor(
    @Inject(DOCUMENT) documentRef: Document,
    { nativeElement }: ElementRef<HTMLElement>
  ) {
    const focusedElement$ = merge(
      fromEvent(documentRef, 'focusin'),
      fromEvent(documentRef, 'focusout'),
      of(null)
    ).pipe(
      debounceTime(0),
      map(() =>
        nativeElement.contains(documentRef.activeElement)
          ? documentRef.activeElement
          : null
      ),
      distinctUntilChanged()
    );

    super((subscriber) => focusedElement$.subscribe(subscriber));
  }
}
