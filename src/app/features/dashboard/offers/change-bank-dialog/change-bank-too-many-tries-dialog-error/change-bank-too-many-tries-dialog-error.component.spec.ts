import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOfferDialogErrorComponent } from './new-offer-dialog-error.component';

describe('NewOfferDialogErrorComponent', () => {
  let component: NewOfferDialogErrorComponent;
  let fixture: ComponentFixture<NewOfferDialogErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewOfferDialogErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewOfferDialogErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
