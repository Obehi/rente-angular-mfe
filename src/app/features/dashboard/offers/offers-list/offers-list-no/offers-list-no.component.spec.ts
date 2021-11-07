import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersListNoComponent } from './offers-list-no.component';

describe('OffersListNoComponent', () => {
  let component: OffersListNoComponent;
  let fixture: ComponentFixture<OffersListNoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OffersListNoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffersListNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
