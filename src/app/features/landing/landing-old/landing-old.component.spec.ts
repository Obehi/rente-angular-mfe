/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LandingOldComponent } from './landing-old.component';

describe('LandingOldComponent', () => {
  let component: LandingOldComponent;
  let fixture: ComponentFixture<LandingOldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingOldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingOldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
