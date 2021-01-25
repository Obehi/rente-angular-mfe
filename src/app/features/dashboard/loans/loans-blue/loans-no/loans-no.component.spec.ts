import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoansNoComponent } from './loans-no.component';

describe('LoansNoComponent', () => {
  let component: LoansNoComponent;
  let fixture: ComponentFixture<LoansNoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoansNoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoansNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
