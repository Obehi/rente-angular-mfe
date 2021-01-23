import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingTopNoComponent } from './landing-top-no.component';

describe('LandingTopNoComponent', () => {
  let component: LandingTopNoComponent;
  let fixture: ComponentFixture<LandingTopNoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LandingTopNoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingTopNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
