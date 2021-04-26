import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferCardV1Component } from './offer-card-v1.component';

describe('OfferCardV1Component', () => {
  let component: OfferCardV1Component;
  let fixture: ComponentFixture<OfferCardV1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferCardV1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferCardV1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
