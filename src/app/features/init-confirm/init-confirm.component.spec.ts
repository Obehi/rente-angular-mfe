import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitConfirmComponent } from './init-confirm.component';

describe('InitConfirmComponent', () => {
  let component: InitConfirmComponent;
  let fixture: ComponentFixture<InitConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
