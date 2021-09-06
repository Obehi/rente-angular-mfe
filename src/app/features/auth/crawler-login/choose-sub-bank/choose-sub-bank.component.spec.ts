import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseSubBankComponent } from './choose-sub-bank.component';

describe('ChooseSubBankComponent', () => {
  let component: ChooseSubBankComponent;
  let fixture: ComponentFixture<ChooseSubBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseSubBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseSubBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
