import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetOfferFromBankDialogComponent } from './get-offer-from-bank-dialog.component';

describe('GetOfferFromBankDialogComponent', () => {
  let component: GetOfferFromBankDialogComponent;
  let fixture: ComponentFixture<GetOfferFromBankDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetOfferFromBankDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetOfferFromBankDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
