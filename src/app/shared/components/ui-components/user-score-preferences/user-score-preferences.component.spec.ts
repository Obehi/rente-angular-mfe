import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserScorePreferencesComponent } from './user-score-preferences.component';

describe('UserScorePreferencesComponent', () => {
  let component: UserScorePreferencesComponent;
  let fixture: ComponentFixture<UserScorePreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserScorePreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserScorePreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
