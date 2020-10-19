import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitConfirmationComponent } from './init-confirmation.component';

describe('InitConfirmationComponent', () => {
  let component: InitConfirmationComponent;
  let fixture: ComponentFixture<InitConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
