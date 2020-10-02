import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthSvMockupComponent } from './auth-sv-mockup.component';

describe('AuthSvMockupComponent', () => {
  let component: AuthSvMockupComponent;
  let fixture: ComponentFixture<AuthSvMockupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthSvMockupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthSvMockupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
