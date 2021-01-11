import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFlowComponent } from './input-flow.component';

describe('InputFlowComponent', () => {
  let component: InputFlowComponent;
  let fixture: ComponentFixture<InputFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
