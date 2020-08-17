import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginNoComponent } from './login-no.component';

describe('LoginNoComponent', () => {
  let component: LoginNoComponent;
  let fixture: ComponentFixture<LoginNoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginNoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
