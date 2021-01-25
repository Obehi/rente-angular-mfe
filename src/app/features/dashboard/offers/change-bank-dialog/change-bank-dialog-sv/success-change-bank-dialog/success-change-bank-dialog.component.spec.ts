import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessChangeBankDialogComponent } from './success-change-bank-dialog.component';

describe('SuccessChangeBankDialogComponent', () => {
  let component: SuccessChangeBankDialogComponent;
  let fixture: ComponentFixture<SuccessChangeBankDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SuccessChangeBankDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessChangeBankDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
