import { TestBed } from '@angular/core/testing';

import { PreferancesService } from './preferances.service';

describe('PreferancesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PreferancesService = TestBed.get(PreferancesService);
    expect(service).toBeTruthy();
  });
});
