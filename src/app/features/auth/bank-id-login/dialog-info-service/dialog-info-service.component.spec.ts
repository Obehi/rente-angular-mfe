import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogInfoServiceComponent } from './dialog-info-service.component';

describe('DialogInfoServiceComponent', () => {
  let component: DialogInfoServiceComponent;
  let fixture: ComponentFixture<DialogInfoServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogInfoServiceComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogInfoServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
