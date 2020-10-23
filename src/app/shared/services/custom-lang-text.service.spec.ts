import { TestBed } from '@angular/core/testing';

import { CustomLangTextService } from './custom-lang-text.service';

describe('CustomLangTextService', () => {
  let service: CustomLangTextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomLangTextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
