import { TestBed } from '@angular/core/testing';

import { NavigationInterceptionService } from './navigation-interception.service';

describe('NavigationInterceptionService', () => {
  let service: NavigationInterceptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavigationInterceptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
