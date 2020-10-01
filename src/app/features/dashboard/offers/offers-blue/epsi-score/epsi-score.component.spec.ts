import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EPSIScoreComponent } from './epsi-score.component';

describe('EPSIScoreComponent', () => {
  let component: EPSIScoreComponent;
  let fixture: ComponentFixture<EPSIScoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EPSIScoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EPSIScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
