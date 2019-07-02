import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankIdLoginComponent } from './bank-id-login.component';

describe('BankIdLoginComponent', () => {
  let component: BankIdLoginComponent;
  let fixture: ComponentFixture<BankIdLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankIdLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankIdLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
