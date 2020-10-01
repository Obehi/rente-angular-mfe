import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoansBlueComponent } from './loans-blue.component';

describe('LoansBlueComponent', () => {
  let component: LoansBlueComponent;
  let fixture: ComponentFixture<LoansBlueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoansBlueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoansBlueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
