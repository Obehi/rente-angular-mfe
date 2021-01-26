import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BargainSuccessComponent } from './bargain-success.component';

describe('BargainSuccessComponent', () => {
  let component: BargainSuccessComponent;
  let fixture: ComponentFixture<BargainSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BargainSuccessComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BargainSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
