/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BarometerComponent } from './barometer.component';

describe('BarometerComponent', () => {
  let component: BarometerComponent;
  let fixture: ComponentFixture<BarometerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarometerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarometerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
