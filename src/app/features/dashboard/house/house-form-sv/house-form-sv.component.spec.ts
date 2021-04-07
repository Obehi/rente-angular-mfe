import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlueAddressComponent } from './blue-address.component';

describe('BlueAddressComponent', () => {
  let component: BlueAddressComponent;
  let fixture: ComponentFixture<BlueAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlueAddressComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlueAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
