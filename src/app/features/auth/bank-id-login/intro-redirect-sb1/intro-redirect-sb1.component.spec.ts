import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroRedirectSb1Component } from './intro-redirect-sb1.component';

describe('IntroRedirectSb1Component', () => {
  let component: IntroRedirectSb1Component;
  let fixture: ComponentFixture<IntroRedirectSb1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntroRedirectSb1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntroRedirectSb1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
