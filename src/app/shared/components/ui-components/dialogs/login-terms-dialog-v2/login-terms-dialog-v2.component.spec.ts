import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginTermsDialogV2Component } from './login-terms-dialog-v2.component';

describe('LoginTermsDialogV2Component', () => {
  let component: LoginTermsDialogV2Component;
  let fixture: ComponentFixture<LoginTermsDialogV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginTermsDialogV2Component]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginTermsDialogV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
