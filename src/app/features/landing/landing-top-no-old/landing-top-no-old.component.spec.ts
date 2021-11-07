/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LandingTopNoOldComponent } from './landing-top-no-old.component';

describe('LandingTopNoOldComponent', () => {
  let component: LandingTopNoOldComponent;
  let fixture: ComponentFixture<LandingTopNoOldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingTopNoOldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingTopNoOldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
