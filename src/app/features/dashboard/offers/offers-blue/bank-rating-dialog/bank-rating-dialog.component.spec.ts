import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankRatingDialogComponent } from './bank-rating-dialog.component';

describe('BankRatingDialogComponent', () => {
  let component: BankRatingDialogComponent;
  let fixture: ComponentFixture<BankRatingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankRatingDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankRatingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
