import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroNoBankIDComponent } from './intro-no-bank-id.component';

describe('IntroNoBankIDComponent', () => {
  let component: IntroNoBankIDComponent;
  let fixture: ComponentFixture<IntroNoBankIDComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntroNoBankIDComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntroNoBankIDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
