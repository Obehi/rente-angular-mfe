import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroRedirectComponent } from './intro-redirect.component';

describe('IntroRedirectComponent', () => {
  let component: IntroRedirectComponent;
  let fixture: ComponentFixture<IntroRedirectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntroRedirectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntroRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
