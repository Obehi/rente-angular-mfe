import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoLoansComponent } from './no-loans.component';

describe('NoLoansComponent', () => {
  let component: NoLoansComponent;
  let fixture: ComponentFixture<NoLoansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoLoansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
