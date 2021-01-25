import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstBuyersComponent } from './first-buyers.component';

describe('FirstBuyersComponent', () => {
  let component: FirstBuyersComponent;
  let fixture: ComponentFixture<FirstBuyersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FirstBuyersComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstBuyersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
