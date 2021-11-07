import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankGuidePageComponent } from './bank-guide-page.component';

describe('BankGuidePageComponent', () => {
  let component: BankGuidePageComponent;
  let fixture: ComponentFixture<BankGuidePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BankGuidePageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankGuidePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
