import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSVComponent } from './login-sv.component';

describe('LoginSVComponent', () => {
  let component: LoginSVComponent;
  let fixture: ComponentFixture<LoginSVComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginSVComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginSVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
