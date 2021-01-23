import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseBlueComponent } from './house-blue.component';

describe('HouseBlueComponent', () => {
  let component: HouseBlueComponent;
  let fixture: ComponentFixture<HouseBlueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HouseBlueComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseBlueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
