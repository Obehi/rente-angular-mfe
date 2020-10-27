import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingTopSvComponent } from './landing-top-sv.component';

describe('LandingTopSvComponent', () => {
  let component: LandingTopSvComponent;
  let fixture: ComponentFixture<LandingTopSvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingTopSvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingTopSvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
