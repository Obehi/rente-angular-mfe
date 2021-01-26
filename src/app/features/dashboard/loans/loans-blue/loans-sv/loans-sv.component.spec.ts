import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoansSvComponent } from './loans-sv.component';

describe('LoansSvComponent', () => {
  let component: LoansSvComponent;
  let fixture: ComponentFixture<LoansSvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoansSvComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoansSvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
