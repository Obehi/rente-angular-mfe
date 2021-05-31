import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Sb1DisabledComponent } from './sb1-disabled.component';

describe('Sb1DisabledComponent', () => {
  let component: Sb1DisabledComponent;
  let fixture: ComponentFixture<Sb1DisabledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Sb1DisabledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Sb1DisabledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
