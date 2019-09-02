import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeBankDialogComponent } from './change-bank-dialog.component';

describe('ChangeBankDialogComponent', () => {
  let component: ChangeBankDialogComponent;
  let fixture: ComponentFixture<ChangeBankDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeBankDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeBankDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
