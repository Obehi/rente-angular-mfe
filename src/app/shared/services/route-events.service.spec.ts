import { TestBed } from '@angular/core/testing';

import { RouteEventsService } from './route-events.service';

describe('RouteEventsService', () => {
  let service: RouteEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
