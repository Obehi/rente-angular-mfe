import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailPerferencesComponent } from './email-perferences.component';

describe('EmailPerferencesComponent', () => {
  let component: EmailPerferencesComponent;
  let fixture: ComponentFixture<EmailPerferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailPerferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailPerferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
