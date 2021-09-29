import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroRedirectDnbComponent } from './intro-redirect-dnb.component';

describe('IntroRedirectDnbComponent', () => {
  let component: IntroRedirectDnbComponent;
  let fixture: ComponentFixture<IntroRedirectDnbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntroRedirectDnbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntroRedirectDnbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
