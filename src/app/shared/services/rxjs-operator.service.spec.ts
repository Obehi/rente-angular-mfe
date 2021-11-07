import { TestBed } from '@angular/core/testing';

import { RxjsOperatorService } from './rxjs-operator.service';

describe('RxjsOperatorService', () => {
  let service: RxjsOperatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RxjsOperatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
