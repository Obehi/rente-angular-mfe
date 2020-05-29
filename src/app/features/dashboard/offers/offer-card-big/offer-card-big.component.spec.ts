import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferCardBigComponent } from './offer-card-big.component';

describe('OfferCardBigComponent', () => {
  let component: OfferCardBigComponent;
  let fixture: ComponentFixture<OfferCardBigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferCardBigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferCardBigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
