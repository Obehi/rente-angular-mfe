import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroDefaultSignicatComponent } from './intro-default-signicat.component';

describe('IntroDefaultSignicatComponent', () => {
  let component: IntroDefaultSignicatComponent;
  let fixture: ComponentFixture<IntroDefaultSignicatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntroDefaultSignicatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntroDefaultSignicatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
