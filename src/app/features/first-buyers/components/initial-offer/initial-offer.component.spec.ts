import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialOfferComponent } from './initial-offer.component';

describe('InitialOfferComponent', () => {
  let component: InitialOfferComponent;
  let fixture: ComponentFixture<InitialOfferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitialOfferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
