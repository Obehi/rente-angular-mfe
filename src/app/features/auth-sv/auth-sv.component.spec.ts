import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthSvComponent } from './auth-sv.component';

describe('AuthSvComponent', () => {
  let component: AuthSvComponent;
  let fixture: ComponentFixture<AuthSvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuthSvComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthSvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
