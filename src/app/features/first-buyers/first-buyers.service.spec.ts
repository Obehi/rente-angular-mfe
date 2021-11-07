import { TestBed } from '@angular/core/testing';

import { FirstBuyersService } from './first-buyers.service';

describe('FirstBuyersService', () => {
  let service: FirstBuyersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirstBuyersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
