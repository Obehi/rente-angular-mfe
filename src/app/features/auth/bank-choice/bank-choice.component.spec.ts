import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankChoiceComponent } from './bank-choice.component';

describe('BankChoiceComponent', () => {
  let component: BankChoiceComponent;
  let fixture: ComponentFixture<BankChoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankChoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
