import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroNoBankIdDnbComponent } from './intro-no-bank-id-dnb.component';

describe('IntroNoBankIdDnbComponent', () => {
  let component: IntroNoBankIdDnbComponent;
  let fixture: ComponentFixture<IntroNoBankIdDnbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntroNoBankIdDnbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntroNoBankIdDnbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
