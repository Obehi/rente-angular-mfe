import { TestBed } from '@angular/core/testing';

import { ChangeBankServiceService } from './change-bank-service.service';

describe('ChangeBankServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChangeBankServiceService = TestBed.get(
      ChangeBankServiceService
    );
    expect(service).toBeTruthy();
  });
});
