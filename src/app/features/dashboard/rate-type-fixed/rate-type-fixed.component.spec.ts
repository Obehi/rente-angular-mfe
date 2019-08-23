import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateTypeFixedComponent } from './rate-type-fixed.component';

describe('RateTypeFixedComponent', () => {
  let component: RateTypeFixedComponent;
  let fixture: ComponentFixture<RateTypeFixedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateTypeFixedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateTypeFixedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
