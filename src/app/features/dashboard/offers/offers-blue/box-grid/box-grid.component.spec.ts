/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BoxGridComponent } from './box-grid.component';

describe('BoxGridComponent', () => {
  let component: BoxGridComponent;
  let fixture: ComponentFixture<BoxGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
