import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferCardV2Component } from './offer-card-v2.component';

describe('OfferCardV2Component', () => {
  let component: OfferCardV2Component;
  let fixture: ComponentFixture<OfferCardV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferCardV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferCardV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
