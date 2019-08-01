import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyMissingComponent } from './property-missing.component';

describe('PropertyMissingComponent', () => {
  let component: PropertyMissingComponent;
  let fixture: ComponentFixture<PropertyMissingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyMissingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyMissingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
